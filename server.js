const express = require('express');
const twilio = require('twilio');
const dotenv = require('dotenv');
const { google } = require('googleapis');

// Function to parse speech result
const { parseSpeechResult } = require('./parse-speech');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enable logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
let jwtClient;

// Initialize Google Sheets client
async function initGoogleSheets() {
  try {
    // Check if we have a service account key in environment variables
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      // Parse the service account key from environment variable
      console.log('Using Google service account key from environment variable');
      const key = JSON.parse(serviceAccountKey);
      
      // Fix the private key formatting (replace \n with actual newlines)
      if (key.private_key) {
        key.private_key = key.private_key.replace(/\\n/g, '\n');
      }
      
      jwtClient = new google.auth.JWT({
        email: key.client_email,
        key: key.private_key,
        scopes: SCOPES
      });
    } else {
      // Use the key.json file
      console.log('Using Google service account key from key.json file');
      const keyFilePath = './key.json';
      jwtClient = new google.auth.JWT({
        keyFile: keyFilePath,
        scopes: SCOPES
      });
    }
    
    // Test authentication
    await jwtClient.authorize();
    console.log('Google Sheets authentication successful');
  } catch (error) {
    console.error('Error initializing Google Sheets:', error.message);
    console.error('Full error:', error);
  }
}

// Function to append data to Google Sheet
async function appendToSheet(data) {
  try {
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    
    console.log('Appending data to Google Sheet:', data);
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data]
      }
    });
    
    console.log('Data appended to Google Sheet successfully');
    return response;
  } catch (error) {
    console.error('Error appending to Google Sheet:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}

// Webhook for handling incoming calls
app.get('/voice', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Le système de gestion des appels est opérationnel. Cette URL est correctement configurée pour Twilio.');
  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/voice', (req, res) => {
  console.log('=== INCOMING CALL ===');
  console.log('Request body:', req.body);
  console.log('Caller ID:', req.body.From);
  
  const twiml = new twilio.twiml.VoiceResponse();
  
  try {
    // Wait 10 seconds before answering
    twiml.pause({ length: 10 });
    
    // Greeting in French (improved pronunciation)
    twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Bonjour! Merci d\'appeler Espace Auto 92');
    
    // Gather caller information using speech recognition
    const gather = twiml.gather({
      input: 'speech',
      action: '/gather',
      method: 'POST',
      language: 'fr-FR',
      timeout: 15, // Increased timeout to give caller more time
      speechModel: 'phone_call'
    });
    
    // Improved prompt with clearer instructions
    gather.say({ voice: 'alice', language: 'fr-FR' }, 'Veuillez dire votre nom, votre numéro de plaque d\'immatriculation, et le service souhaité. Par exemple: Je m\'appelle Pierre Dupont, plaque AB-123-CD, je viens pour une réparation.');
    
    // If no input, record the call
    twiml.record({
      action: '/record',
      method: 'POST',
      maxLength: 120, // Increased recording time
      finishOnKey: '#'
    });
    
    console.log('Generated TwiML:', twiml.toString());
    
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in /voice endpoint:', error);
    // Create a simple error response
    const errorTwiML = new twilio.twiml.VoiceResponse();
    errorTwiML.say({ voice: 'alice', language: 'fr-FR' }, 'Désolé, nous rencontrons un problème technique. Veuillez réessayer plus tard.');
    errorTwiML.hangup();
    res.type('text/xml');
    res.status(500).send(errorTwiML.toString());
  }
});

// Webhook for handling gathered speech input
app.post('/gather', async (req, res) => {
  console.log('=== SPEECH GATHERING RESULT ===');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Content type:', req.get('Content-Type'));
  
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Log all available properties in the request body
  console.log('All request body properties:', Object.keys(req.body));
  
  const speechResult = req.body.SpeechResult;
  const callerNumber = req.body.From;
  
  console.log('Speech result:', speechResult);
  console.log('Caller number:', callerNumber);
  console.log('Speech result type:', typeof speechResult);
  console.log('Speech result length:', speechResult ? speechResult.length : 0);
  
  if (!speechResult) {
    console.log('No speech result received');
    twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Désolé, nous n\'avons pas compris votre message. Veuillez réessayer.');
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
    return;
  }
  
  if (speechResult.trim() === '') {
    console.log('Speech result is empty');
    twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Désolé, nous n\'avons pas compris votre message. Veuillez réessayer.');
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
    return;
  }
  
  try {
    // Parse the speech result to extract name, plate, and service
    console.log('Parsing speech result...');
    const parsedData = parseSpeechResult(speechResult);
    console.log('Parsed data:', parsedData);
    
    // Validate parsed data
    if (!parsedData) {
      console.log('Parsed data is null or undefined');
      twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Désolé, nous n\'avons pas pu traiter votre demande. Veuillez réessayer.');
      twiml.hangup();
      res.type('text/xml');
      res.send(twiml.toString());
      return;
    }
    
    // Store data in Google Sheets
    console.log('Storing data in Google Sheets...');
    await storeCallData(callerNumber, parsedData.name, parsedData.plate, parsedData.service, null);
    console.log('Data stored successfully');
    
    // Thank the caller with confirmation of what was understood
    twiml.say({ voice: 'alice', language: 'fr-FR' }, 
      `Merci ${parsedData.name}. Nous avons bien noté votre plaque ${parsedData.plate} et votre demande pour ${parsedData.service}. Nous vous rappellerons bientôt.`);
    twiml.hangup();
  } catch (error) {
    console.error('Error storing call data:', error);
    console.error('Full error object:', error);
    // Handle error gracefully
    twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Désolé, nous rencontrons un problème technique. Veuillez réessayer plus tard.');
    twiml.hangup();
  }
  
  console.log('Generated TwiML:', twiml.toString());
  res.type('text/xml');
  res.send(twiml.toString());
});

// Webhook for handling call recording
app.post('/record', async (req, res) => {
  console.log('=== CALL RECORDING ===');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Content type:', req.get('Content-Type'));
  
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Log all available properties in the request body
  console.log('All request body properties:', Object.keys(req.body));
  
  const recordingUrl = req.body.RecordingUrl;
  const callerNumber = req.body.From;
  const recordingDuration = req.body.RecordingDuration;
  
  console.log('Call recording received:', recordingUrl);
  console.log('Caller number:', callerNumber);
  console.log('Recording duration:', recordingDuration);
  console.log('Recording URL type:', typeof recordingUrl);
  console.log('Recording URL length:', recordingUrl ? recordingUrl.length : 0);
  
  // Even if we don't have a recording URL, we should still store the data
  try {
    // Store data in Google Sheets with recording URL (even if it's null/undefined)
    console.log('Storing recording data in Google Sheets...');
    await storeCallData(callerNumber, 'Unknown', 'Unknown', 'Unknown', recordingUrl || null);
    console.log('Recording data stored successfully');
    
    // Thank the caller
    if (recordingUrl) {
      twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Votre message a été enregistré. Nous vous rappellerons bientôt.');
    } else {
      twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Nous n\'avons pas pu enregistrer votre message, mais nous avons noté votre appel. Nous vous rappellerons bientôt.');
    }
    twiml.hangup();
  } catch (error) {
    console.error('Error storing recording data:', error);
    console.error('Full error object:', error);
    // Handle error gracefully
    twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Désolé, nous rencontrons un problème technique. Veuillez réessayer plus tard.');
    twiml.hangup();
  }
  
  console.log('Generated TwiML:', twiml.toString());
  res.type('text/xml');
  res.send(twiml.toString());
});

// Function to store call data
async function storeCallData(callerNumber, name, plate, service, recordingUrl) {
  try {
    console.log('=== STORING CALL DATA ===');
    console.log('Caller number:', callerNumber);
    console.log('Name:', name);
    console.log('Plate:', plate);
    console.log('Service:', service);
    console.log('Recording URL:', recordingUrl);
    
    // Validate and sanitize inputs
    const sanitizedCallerNumber = callerNumber && callerNumber.trim() !== '' ? callerNumber : 'Unknown';
    const sanitizedName = name && name.trim() !== '' ? name : 'Unknown';
    const sanitizedPlate = plate && plate.trim() !== '' ? plate : 'Unknown';
    const sanitizedService = service && service.trim() !== '' ? service : 'Unknown';
    const sanitizedRecordingUrl = recordingUrl && recordingUrl.trim() !== '' ? recordingUrl : '';
    
    const timestamp = new Date().toISOString();
    const data = [timestamp, sanitizedCallerNumber, sanitizedName, sanitizedPlate, sanitizedService, sanitizedRecordingUrl];
    
    console.log('Sanitized data to be stored:', data);
    
    // Append to Google Sheet
    const result = await appendToSheet(data);
    console.log('Call data stored successfully');
    return result;
  } catch (error) {
    console.error('Error storing call data:', error.message);
    console.error('Full error:', error);
    // Don't throw the error, just log it - we don't want to break the call flow
    return null;
  }
}

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Call handling system is running!');
});

// Render health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle common mistake of accessing /webhook instead of /voice
app.get('/webhook', (req, res) => {
  res.status(404).send('Incorrect endpoint. Please use /voice for Twilio webhooks. See documentation for setup instructions.');
});

app.post('/webhook', (req, res) => {
  res.status(404).send('Incorrect endpoint. Please use /voice for Twilio webhooks. See documentation for setup instructions.');
});

// Initialize Google Sheets on startup
initGoogleSheets();

// Export functions for testing
module.exports = app;

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check endpoint: http://localhost:${PORT}/`);
  console.log(`Twilio webhook endpoint: http://localhost:${PORT}/voice`);
});