const fs = require('fs');
const path = require('path');

console.log('=== Automated Call Handling System Setup ===\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file from .env.example...');
  
  const envExamplePath = path.join(__dirname, '.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('.env file created successfully!');
  } else {
    console.log('Error: .env.example file not found!');
    process.exit(1);
  }
} else {
  console.log('.env file already exists.');
}

console.log('\n=== Setup Instructions ===');
console.log('1. Open the .env file and fill in your Twilio credentials:');
console.log('   - TWILIO_ACCOUNT_SID: Your Twilio Account SID');
console.log('   - TWILIO_AUTH_TOKEN: Your Twilio Auth Token');
console.log('   - TWILIO_PHONE_NUMBER: Your Twilio phone number\n');

console.log('2. Set up Google Sheets integration:');
console.log('   - Create a Google Cloud Project');
console.log('   - Enable the Google Sheets API');
console.log('   - Create a Service Account and download the JSON key');
console.log('   - Create a Google Sheet and share it with the service account email');
console.log('   - Fill in SPREADSHEET_ID and GOOGLE_SERVICE_ACCOUNT_KEY in .env\n');

console.log('3. Install dependencies:');
console.log('   npm install\n');

console.log('4. Start the server:');
console.log('   npm start\n');

console.log('5. For local testing, use ngrok:');
console.log('   ngrok http 3000\n');

console.log('6. Configure your Twilio webhook:');
console.log('   In the Twilio Console, set your phone number webhook to:');
console.log('   https://your-ngrok-url.ngrok.io/voice\n');

console.log('Setup complete! Refer to README.md for detailed instructions.');