# Twilio Setup Guide

This guide will help you properly configure your Twilio phone number to use your Node.js application instead of a TwiML Bin.

## Current Issue

You're currently using a TwiML Bin with URL:
```
https://handler.twilio.com/twiml/EH3817aa27b8bd13b63024d586777412ed
```

This is a static TwiML response hosted by Twilio, not your application. To use your Node.js application, you need to point Twilio to your webhook URL.

## Step-by-Step Configuration

### 1. Start Your Application

Make sure your Node.js application is running:
```bash
npm start
```

You should see output like:
```
Server running on port 3000
Health check endpoint: http://localhost:3000/
Twilio webhook endpoint: http://localhost:3000/voice
```

### 2. Start ngrok

In a separate terminal, start ngrok to expose your local server:
```bash
ngrok http 3000
```

You should see output like:
```
ngrok by @inconshreveable

Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        United States (us)
Forwarding                    http://51c71d0fd253.ngrok-free.app -> http://localhost:3000
Forwarding                    https://51c71d0fd253.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

Note the HTTPS forwarding URL - this is what you'll use for your Twilio webhook.

### 3. Configure Your Twilio Phone Number

1. Log in to your [Twilio Console](https://console.twilio.com/)

2. Navigate to your phone number:
   - Go to "Develop" > "Phone Numbers" > "Manage" > "Active Numbers"
   - Click on the phone number you want to configure

3. Change from TwiML Bin to Webhook:
   - Scroll down to the "A Call Comes In" section
   - You'll see it's currently set to "TwiML" with your TwiML Bin URL
   - Change the first dropdown from "TwiML" to "Webhook"
   - In the URL field, enter your ngrok URL + `/voice`:
     ```
     https://51c71d0fd253.ngrok-free.app/voice
     ```
   - Make sure the HTTP method dropdown is set to "POST"
   - Click "Save"

### 4. Verify Configuration

1. Make a test call to your Twilio number
2. Check your Node.js application console for log messages:
   - "Incoming call from: [phone number]"
   - "Speech result: [what the caller said]"
   - "Call data stored successfully"

## Troubleshooting

### If You Can't Change the Configuration

If the "A Call Comes In" section doesn't allow you to change from TwiML to Webhook:

1. Try clicking the trash can icon next to the current configuration to remove it
2. Then add a new webhook configuration:
   - Click "Add new configuration" or similar
   - Select "Webhook"
   - Enter your ngrok URL + `/voice`
   - Set HTTP method to "POST"

### If You Don't See Your Phone Number

1. Make sure you're in the correct Twilio account
2. Check that the phone number is properly provisioned in your account
3. Look under "Develop" > "Phone Numbers" > "Manage" > "Active Numbers"

### If ngrok Isn't Working

1. Make sure ngrok is running in a separate terminal
2. Verify the port number matches your Node.js application port (3000)
3. Check that your firewall isn't blocking ngrok

## Testing Your Setup

You can test your endpoints directly:

1. Health check: Open `http://localhost:3000/` in your browser
2. Voice endpoint: Open `http://localhost:3000/voice` in your browser (will show configuration message)

For actual testing with Twilio, you need to make a phone call to your Twilio number.

## Common Mistakes

1. **Using the wrong URL**: Make sure to use your ngrok URL, not localhost
2. **Wrong HTTP method**: Must be POST, not GET
3. **Wrong endpoint**: Use `/voice`, not `/webhook` or other endpoints
4. **ngrok not running**: The tunnel must be active for Twilio to reach your local server
5. **Application not running**: Your Node.js server must be running

## Need More Help?

1. Check the Twilio Console for any error messages
2. Look at your Node.js application console for log messages
3. Verify your ngrok tunnel is active
4. Double-check all URLs and configuration settings