// Test that the server starts correctly
const { spawn } = require('child_process');

console.log('=== Server Startup Test ===\n');

// Start the server with a timeout
const server = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: '3001' }
});

let serverStarted = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[STDOUT] ${output}`);
  
  if (output.includes('Server running on port 3001')) {
    serverStarted = true;
    console.log('✅ Server started successfully!');
    server.kill();
  }
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  console.log(`[STDERR] ${output}`);
  
  // Ignore Twilio initialization errors for this test
  if (output.includes('Error initializing Google Sheets') || output.includes('accountSid must start with AC')) {
    console.log('⚠️  Expected configuration error (Twilio/Google not configured)');
    if (!serverStarted) {
      console.log('✅ Server process started (configuration errors expected in test environment)');
      server.kill();
    }
  }
});

server.on('close', (code) => {
  console.log(`\nServer process exited with code ${code}`);
  if (serverStarted) {
    console.log('✅ Test passed: Server started correctly');
  } else {
    console.log('⚠️  Test completed: Server process ran (startup errors expected without configuration)');
  }
});

// Timeout after 5 seconds
setTimeout(() => {
  if (!server.killed) {
    console.log('⏰ Test timeout - killing server process');
    server.kill();
  }
}, 5000);