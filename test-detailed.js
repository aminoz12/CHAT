// Test the parseSpeechResult function directly
const { parseSpeechResult } = require('./parse-speech');

// Test data
const testData = {
  SpeechResult: 'Bonjour, je m\'appelle Jean Dupont. Ma plaque d\'immatriculation est AB123CD. Je voudrais faire une réparation.',
  From: '+1234567890'
};

console.log('Testing parseSpeechResult function directly...');
console.log('Input:', testData.SpeechResult);

const result = parseSpeechResult(testData.SpeechResult);
console.log('Parsed result:', result);

// Test the Google Sheets function directly
const { google } = require('googleapis');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
let jwtClient;

async function testGoogleSheetsDirectly() {
  try {
    console.log('\nTesting Google Sheets integration directly...');
    
    // Use the key.json file
    const keyFilePath = './key.json';
    jwtClient = new google.auth.JWT({
      keyFile: keyFilePath,
      scopes: SCOPES
    });
    
    // Test authentication
    console.log('Authenticating with Google Sheets...');
    await jwtClient.authorize();
    console.log('Authentication successful');
    
    // Test appending data
    console.log('Testing data append...');
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    
    const timestamp = new Date().toISOString();
    const testData = [timestamp, '+1234567890', 'Jean Dupont', 'AB123CD', 'Réparation', ''];
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [testData]
      }
    });
    
    console.log('Data appended successfully');
  } catch (error) {
    console.error('Error testing Google Sheets:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testGoogleSheetsDirectly();