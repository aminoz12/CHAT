const dotenv = require('dotenv');
dotenv.config();

const { google } = require('googleapis');

console.log('=== Google Sheets Authentication Debug ===\n');

// Check if required environment variables are set
if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  console.log('❌ GOOGLE_SERVICE_ACCOUNT_KEY is not set');
  process.exit(1);
}

if (!process.env.SPREADSHEET_ID) {
  console.log('❌ SPREADSHEET_ID is not set');
  process.exit(1);
}

try {
  console.log('1. Parsing GOOGLE_SERVICE_ACCOUNT_KEY...');
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  console.log('✅ Parsed successfully');
  
  console.log('\n2. Checking required properties...');
  const requiredProps = ['client_email', 'private_key', 'project_id'];
  for (const prop of requiredProps) {
    if (credentials[prop]) {
      console.log(`✅ ${prop}: Present`);
    } else {
      console.log(`❌ ${prop}: Missing`);
    }
  }
  
  console.log('\n3. Creating JWT client...');
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  const jwtClient = new google.auth.JWT(
    credentials.client_email,
    null, // No key file
    credentials.private_key,
    SCOPES
  );
  console.log('✅ JWT client created');
  
  console.log('\n4. Attempting to authorize...');
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