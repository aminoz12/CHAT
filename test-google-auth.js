// Test Google authentication with environment variable
const { google } = require('googleapis');

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function testGoogleAuth() {
  try {
    console.log('Testing Google authentication...');
    
    // Check if we have a service account key in environment variables
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      console.log('GOOGLE_SERVICE_ACCOUNT_KEY environment variable not found');
      return;
    }
    
    console.log('Found GOOGLE_SERVICE_ACCOUNT_KEY environment variable');
    
    // Parse the service account key
    let key;
    try {
      key = JSON.parse(serviceAccountKey);
      console.log('Successfully parsed service account key');
    } catch (parseError) {
      console.error('Error parsing service account key:', parseError.message);
      return;
    }
    
    // Check private key
    if (key.private_key) {
      console.log('Private key found, length:', key.private_key.length);
      console.log('Private key starts with:', key.private_key.substring(0, 50));
      
      // Fix the private key formatting
      const fixedPrivateKey = key.private_key.replace(/\\n/g, '\n');
      console.log('Fixed private key starts with:', fixedPrivateKey.substring(0, 50));
      
      // Check if it looks like a proper private key
      if (fixedPrivateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
        console.log('Private key format looks correct');
      } else {
        console.log('WARNING: Private key format may be incorrect');
      }
    }
    
    // Create JWT client
    console.log('Creating JWT client...');
    const jwtClient = new google.auth.JWT({
      email: key.client_email,
      key: key.private_key.replace(/\\n/g, '\n'),
      scopes: SCOPES
    });
    
    // Test authentication
    console.log('Testing authentication...');
    const authResponse = await jwtClient.authorize();
    console.log('Authentication successful:', {
      token_type: authResponse.token_type,
      expiry_date: authResponse.expiry_date
    });
    
  } catch (error) {
    console.error('Error testing Google authentication:', error.message);
    console.error('Full error:', error);
  }
}

testGoogleAuth();