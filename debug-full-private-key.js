const dotenv = require('dotenv');
dotenv.config();

console.log('=== Full Private Key Debug ===\n');

try {
  console.log('Parsing GOOGLE_SERVICE_ACCOUNT_KEY...');
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  
  console.log('\nFull private key:');
  console.log(credentials.private_key);
  
  console.log('\nPrivate key ends with:');
  console.log(credentials.private_key.slice(-50));
  
} catch (error) {
  console.log('Error:', error.message);
}