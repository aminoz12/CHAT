const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Test server is running!');
});

// Test webhook endpoint
app.all('/voice', (req, res) => {
  console.log(`Received ${req.method} request to /voice`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  if (req.method === 'GET') {
    res.send(`
      <h1>Test Server</h1>
      <p>This is a test endpoint for Twilio webhook configuration.</p>
      <p>Current configuration: ${req.method} ${req.url}</p>
      <p>To properly configure Twilio:</p>
      <ol>
        <li>Set your Twilio phone number webhook to this URL</li>
        <li>Make sure the HTTP method is set to <strong>POST</strong></li>
      </ol>
    `);
  } else {
    // Simulate a simple TwiML response for POST requests
    res.type('text/xml');
    res.send(`
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="alice" language="fr-FR">Bonjour! Ceci est un test.</Say>
        <Hangup/>
      </Response>
    `);
  }
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
  console.log(`Use ngrok to expose this server: ngrok http ${port}`);
});