// Script to format the key.json file for Render deployment
const fs = require('fs');
const path = require('path');

function formatKeyForRender() {
  try {
    // Read the key.json file
    const keyFilePath = path.join(__dirname, 'key.json');
    
    if (!fs.existsSync(keyFilePath)) {
      console.error('Error: key.json file not found in the project directory');
      console.log('Please make sure the key.json file exists and contains your Google service account credentials');
      return;
    }
    
    const keyData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    
    // Fix the private key formatting
    if (keyData.private_key) {
      // Replace actual newlines with \n for environment variable
      keyData.private_key = keyData.private_key.replace(/\n/g, '\\n');
    }
    
    // Create a single-line JSON string
    const formattedKey = JSON.stringify(keyData);
    
    console.log('=== GOOGLE SERVICE ACCOUNT KEY FOR RENDER ===');
    console.log('Copy everything below this line to your Render environment variable:');
    console.log('---');
    console.log(formattedKey);
    console.log('---');
    console.log('');
    console.log('Instructions for Render:');
    console.log('1. Go to your Render dashboard');
    console.log('2. Navigate to your Web Service > Environment Variables');
    console.log('3. Add a new variable:');
    console.log('   - Key: GOOGLE_SERVICE_ACCOUNT_KEY');
    console.log('   - Value: Paste the entire string above (including the outer quotes)');
    console.log('');
    console.log('IMPORTANT: Keep this value secret and never commit it to version control!');
    
  } catch (error) {
    console.error('Error formatting key for Render:', error.message);
    if (error.message.includes('Unexpected token')) {
      console.log('The key.json file may be corrupted or improperly formatted.');
      console.log('Please verify the file contains valid JSON.');
    }
  }
}

formatKeyForRender();