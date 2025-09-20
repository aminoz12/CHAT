const express = require('express');
const axios = require('axios');

// Simple test to simulate Twilio webhook calls
async function testWebhook() {
  try {
    console.log('Testing /voice endpoint...');
    
    // Test the voice endpoint
    const voiceResponse = await axios.post('http://localhost:3000/voice', {
      From: '+1234567890'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Voice endpoint response status:', voiceResponse.status);
    console.log('Voice endpoint response data:', voiceResponse.data);
    
    // Test the gather endpoint with sample speech
    console.log('\nTesting /gather endpoint...');
    const gatherResponse = await axios.post('http://localhost:3000/gather', {
      SpeechResult: 'Bonjour, je m\'appelle Jean Dupont. Ma plaque d\'immatriculation est AB123CD. Je voudrais faire une réparation.',
      From: '+1234567890'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Gather endpoint response status:', gatherResponse.status);
    console.log('Gather endpoint response data:', gatherResponse.data);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing webhook:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testWebhook();