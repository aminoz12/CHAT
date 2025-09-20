# Troubleshooting Guide

This guide will help you resolve common issues with the Automated Call Handling System.

## Issue: "Cannot GET /voice" or "Cannot GET /webhook"

### Problem
When accessing your ngrok URL in a browser, you see "Cannot GET /voice" or "Cannot GET /webhook".

### Solution
This is expected behavior. The system is designed to handle POST requests from Twilio, not GET requests from browsers.

1. **For /webhook error**: 
   - You're using the wrong endpoint
   - The correct endpoint is `/voice`, not `/webhook`
   - Update your Twilio configuration to use `/voice`

2. **For /voice error**:
   - When you access the URL in a browser, it makes a GET request
   - Our system only processes POST requests from Twilio
   - This is normal and expected

### Correct Twilio Configuration
1. In your Twilio Console, go to your phone number settings
2. Set the "A Call Comes In" webhook to:
   ```
   https://your-ngrok-url.ngrok.io/voice
   ```
3. Make sure the HTTP method is set to **POST**

## Issue: "accountSid must start with AC"

### Problem
You see an error about accountSid not starting with "AC".

### Solution
1. Check your `.env` file
2. Make sure `TWILIO_ACCOUNT_SID` starts with "AC"
3. Ensure there are no extra spaces or quotes

Example:
```
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token_here
```

## Issue: Google Sheets Authentication Error

### Problem
You see errors related to Google Sheets authentication.

### Solution
1. Make sure you have a valid `GOOGLE_SERVICE_ACCOUNT_KEY` in your `.env` file
2. Ensure the service account has access to your Google Sheet
3. Verify the `SPREADSHEET_ID` is correct

## Testing Your Setup

### 1. Start your server
```bash
npm start
```

### 2. Start ngrok
```bash
ngrok http 3000
```

### 3. Check your endpoints
- Health check: `http://localhost:3000/` (should show "Call handling system is running!")
- Voice endpoint: `http://localhost:3000/voice` (will show configuration message for GET requests)

### 4. Configure Twilio
1. Go to Twilio Console
2. Select your phone number
3. Set webhook to your ngrok URL + `/voice`
4. Set HTTP method to POST

## Debugging Tips

### Check server logs
Look at your server console for:
- "Incoming call from:" messages
- "Speech result:" messages
- "Call data stored successfully" messages

### Test with curl
You can test your endpoints with curl:

```bash
# Test the health check endpoint
curl http://localhost:3000/

# Test the voice endpoint (GET request)
curl http://localhost:3000/voice

# Test with a simulated Twilio POST request
curl -X POST http://localhost:3000/voice \
  -d "From=+1234567890" \
  -H "Content-Type: application/x-www-form-urlencoded"
```

### Check Twilio Debugger
1. Go to Twilio Console
2. Navigate to "Monitor" > "Logs" > "Debugger"
3. Look for any errors related to your webhook

## Common Configuration Mistakes

1. **Wrong HTTP Method**: Make sure Twilio is configured to use POST, not GET
2. **Wrong Endpoint**: Use `/voice`, not `/webhook`
3. **Missing Environment Variables**: Make sure all required variables are in `.env`
4. **Ngrok Not Running**: Ensure ngrok is running and tunneling to port 3000
5. **Server Not Running**: Make sure your Node.js server is running

## Need More Help?

1. Check the console output of your server for error messages
2. Verify all environment variables in `.env` are correctly set
3. Make sure your Google Service Account has proper permissions
4. Confirm your Twilio credentials are correct
5. Check that ngrok is properly forwarding requests to your local server