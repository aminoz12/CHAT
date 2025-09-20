const { google } = require('googleapis');
const fs = require('fs');

console.log('=== Google Sheets Authentication Debug (File-based) ===\n');

try {
  console.log('1. Reading key.json file...');
  const keyFile = './key.json';
  
  if (!fs.existsSync(keyFile)) {
    console.log('❌ key.json file not found');
    process.exit(1);
  }
  
  console.log('✅ key.json file found');
  
  console.log('\n2. Creating JWT client with key file...');
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  const jwtClient = new google.auth.JWT({
    keyFile: keyFile,
    scopes: SCOPES
  });
  console.log('✅ JWT client created');
  
  console.log('\n3. Attempting to authorize...');
  jwtClient.authorize()
    .then(() => {
      console.log('✅ Authorization successful');
      console.log('\n🎉 Google Sheets authentication is working correctly!');
    })
    .catch((error) => {
      console.log('❌ Authorization failed:', error.message);
      console.log('Error details:', error);
    });
    
} catch (error) {
  console.log('❌ Error:', error.message);
  console.log('Error details:', error);
}