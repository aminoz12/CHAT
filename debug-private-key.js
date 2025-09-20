const dotenv = require('dotenv');
dotenv.config();

console.log('=== Private Key Debug ===\n');

try {
  console.log('Parsing GOOGLE_SERVICE_ACCOUNT_KEY...');
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  
  console.log('\nPrivate key preview:');
  console.log(credentials.private_key.substring(0, 100) + '...');
  
  console.log('\nPrivate key length:', credentials.private_key.length);
  
  console.log('\nChecking if private key starts with -----BEGIN PRIVATE KEY-----:');
  console.log(credentials.private_key.startsWith('-----BEGIN PRIVATE KEY-----'));
  
  console.log('\nChecking if private key ends with -----END PRIVATE KEY-----:');
  console.log(credentials.private_key.endsWith('-----END PRIVATE KEY-----'));
  
  console.log('\nChecking for \\n characters:');
  console.log(credentials.private_key.includes('\\n'));
  
  console.log('\nChecking for actual newlines:');
  console.log(credentials.private_key.includes('\n'));
  
} catch (error) {
  console.log('Error:', error.message);
}