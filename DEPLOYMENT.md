# Deployment Guide

This guide explains how to deploy the Automated Call Handling System with Twilio and Google Sheets.

## Prerequisites

1. Node.js (version 14 or higher)
2. A Twilio account with a phone number
3. A Google Cloud Platform account
4. ngrok (for local testing only)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd botcalls
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Run the setup script:
```bash
npm run setup
```

Then edit the `.env` file with your configuration:

#### Twilio Configuration
1. Log in to your [Twilio Console](https://console.twilio.com/)
2. Find your Account SID and Auth Token
3. Add a phone number if you haven't already
4. Update the `.env` file:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
   ```

#### Google Sheets Configuration
1. Create a new Google Cloud Project or use an existing one
2. Enable the Google Sheets API in the [API Console](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
3. Create a Service Account:
   - Go to [IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
   - Click "Create Service Account"
   - Give it a name and click "Create"
   - Grant it the "Editor" role
   - Click "Done"
4. Create a key for the service account:
   - Click on the service account
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Select "JSON" and click "Create"
   - Save the JSON file securely
5. Create a Google Sheet:
   - Create a new Google Sheet
   - Share it with the service account email (from the JSON key) with edit permissions
   - Copy the Spreadsheet ID from the URL (the long string in the Google Sheets URL)
6. Update the `.env` file:
   ```
   SPREADSHEET_ID=your_spreadsheet_id_here
   GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}' # The entire JSON content as a single line
   ```

### 4. Test the Application

Run the server locally:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Local Testing with ngrok

1. Install ngrok: https://ngrok.com/download
2. Start ngrok on the same port as your server:
   ```bash
   ngrok http 3000
   ```
3. Copy the HTTPS URL from ngrok output
4. Update your Twilio phone number webhook:
   - Go to [Twilio Console > Phone Numbers](https://console.twilio.com/us1/develop/phone-numbers)
   - Click on your phone number
   - In the "A Call Comes In" section, set the webhook URL to:
     ```
     https://your-ngrok-url.ngrok.io/voice
     ```
   - Set the method to "HTTP POST"

## Production Deployment

### Deploying to Heroku

1. Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```
4. Set environment variables:
   ```bash
   heroku config:set TWILIO_ACCOUNT_SID=your_account_sid_here
   heroku config:set TWILIO_AUTH_TOKEN=your_auth_token_here
   heroku config:set TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
   heroku config:set SPREADSHEET_ID=your_spreadsheet_id_here
   heroku config:set GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   ```
5. Deploy the app:
   ```bash
   git push heroku main
   ```

### Deploying to Other Platforms

The application can be deployed to any platform that supports Node.js:
1. Set the environment variables as described above
2. Ensure the platform can expose port 3000 (or set PORT in environment variables)
3. Update your Twilio webhook URL to point to your deployed application

## Troubleshooting

### Common Issues

1. **"accountSid must start with AC" Error**
   - Ensure TWILIO_ACCOUNT_SID in .env starts with "AC"
   - Make sure there are no extra spaces or quotes

2. **Google Sheets Authentication Errors**
   - Verify the service account JSON is correctly formatted
   - Ensure the service account email has edit access to the spreadsheet
   - Check that the Spreadsheet ID is correct

3. **Twilio Webhook Not Working**
   - Verify the webhook URL is correct and accessible
   - Check Twilio's debugger for errors
   - Ensure your server is publicly accessible (required for Twilio webhooks)

### Logs and Monitoring

The application logs important information to the console:
- Incoming calls
- Speech recognition results
- Data storage operations
- Errors

For production deployments, consider using a logging service like:
- Papertrail for Heroku
- CloudWatch for AWS
- Stackdriver for Google Cloud

## Security Considerations

1. Never commit your `.env` file to version control
2. Use strong, unique passwords for all services
3. Regularly rotate your API keys
4. Restrict permissions of service accounts to minimum required
5. Use HTTPS for all webhooks in production

## Maintenance

1. Regularly check Twilio usage and billing
2. Monitor Google Sheets API quotas
3. Update dependencies periodically:
   ```bash
   npm outdated
   npm update
   ```
4. Backup your Google Sheets data regularly