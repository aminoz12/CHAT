// Script to prepare environment variables for Render deployment
const fs = require('fs');
const path = require('path');

// Read the key.json file
const keyFilePath = path.join(__dirname, 'key.json');

if (!fs.existsSync(keyFilePath)) {
  console.error('key.json file not found. Please make sure it exists in the project root.');
  process.exit(1);
}

try {
  const keyData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
  
  // Create a single-line JSON string with proper escaping
  const singleLineKey = JSON.stringify(keyData);
  
  console.log('=== GOOGLE SERVICE ACCOUNT KEY ===');
  console.log('Copy the following line to your Render environment variables:');
  console.log('---');
  console.log(`GOOGLE_SERVICE_ACCOUNT_KEY=${singleLineKey}`);
  console.log('---');
  console.log('');
  console.log('In Render dashboard:');
  console.log('1. Go to your Web Service settings');
  console.log('2. Navigate to Environment Variables');
  console.log('3. Add a new variable with:');
  console.log('   Key: GOOGLE_SERVICE_ACCOUNT_KEY');
  console.log('   Value: (paste the long string above)');
  console.log('');
  console.log('Make sure to keep this value secret and never commit it to version control!');
  
} catch (error) {
  console.error('Error reading or parsing key.json:', error.message);
  process.exit(1);
}