const http = require('http');
const { parse } = require('url');

// Test our endpoints
const tests = [
  {
    name: 'Health check endpoint (GET /)',
    method: 'GET',
    path: '/',
    expectedStatus: 200
  },
  {
    name: 'Voice endpoint (GET /voice)',
    method: 'GET',
    path: '/voice',
    expectedStatus: 200
  },
  {
    name: 'Webhook endpoint (GET /webhook)',
    method: 'GET',
    path: '/webhook',
    expectedStatus: 404
  },
  {
    name: 'Non-existent endpoint (GET /nonexistent)',
    method: 'GET',
    path: '/nonexistent',
    expectedStatus: 404
  }
];

async function runTest(test) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001, // Use a different port for testing
      path: test.path,
      method: test.method
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const passed = res.statusCode === test.expectedStatus;
        console.log(`${passed ? '✅' : '❌'} ${test.name}`);
        console.log(`   Status: ${res.statusCode} (expected: ${test.expectedStatus})`);
        console.log(`   Response: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`);
        console.log('');
        resolve(passed);
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
      console.log('');
      resolve(false);
    });

    req.end();
  });
}

// Simple test server
const server = require('./server.js');

// Start server on test port
const testServer = server.listen(3001, async () => {
  console.log('=== Endpoint Tests ===\n');
  
  let passedTests = 0;
  
  for (const test of tests) {
    const passed = await runTest(test);
    if (passed) passedTests++;
  }
  
  console.log(`Results: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All endpoint tests passed!');
  } else {
    console.log('❌ Some endpoint tests failed');
  }
  
  // Close the test server
  testServer.close();
});