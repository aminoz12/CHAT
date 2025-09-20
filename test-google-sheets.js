const { google } = require('googleapis');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function testGoogleSheets() {
  try {
    console.log('Testing Google Sheets integration...');
    
    // Use the key.json file
    const keyFilePath = './key.json';
    const jwtClient = new google.auth.JWT({
      keyFile: keyFilePath,
      scopes: SCOPES
    });
    
    // Test authentication
    console.log('Authenticating with Google Sheets...');
    const authResponse = await jwtClient.authorize();
    console.log('Authentication successful:', authResponse);
    
    // Test appending data
    console.log('Testing data append...');
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    
    const timestamp = new Date().toISOString();
    const testData = [timestamp, '+1234567890', 'Test Name', 'AB123CD', 'Test Service', ''];
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [testData]
      }
    });
    
    console.log('Data appended successfully:', response.data);
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error testing Google Sheets:', error.message);
    console.error('Full error:', error);
  }
}

testGoogleSheets();