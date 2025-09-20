const axios = require('axios');

async function testFullFlow() {
  try {
    console.log('=== Testing Full Call Flow ===\n');
    
    // Test 1: Voice endpoint
    console.log('1. Testing /voice endpoint...');
    const voiceResponse = await axios.post('http://localhost:3000/voice', 
      new URLSearchParams({
        From: '+1234567890'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('Voice endpoint status:', voiceResponse.status);
    console.log('Voice endpoint response:', voiceResponse.data.substring(0, 200) + '...\n');
    
    // Test 2: Gather endpoint
    console.log('2. Testing /gather endpoint...');
    const gatherResponse = await axios.post('http://localhost:3000/gather',
      new URLSearchParams({
        SpeechResult: 'Bonjour, je m\'appelle Jean Dupont. Ma plaque d\'immatriculation est AB123CD. Je voudrais faire une réparation.',
        From: '+1234567890'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('Gather endpoint status:', gatherResponse.status);
    console.log('Gather endpoint response:', gatherResponse.data);
    
    // Test 3: Record endpoint
    console.log('\n3. Testing /record endpoint...');
    const recordResponse = await axios.post('http://localhost:3000/record',
      new URLSearchParams({
        RecordingUrl: 'https://example.com/recording.mp3',
        From: '+1234567890',
        RecordingDuration: '30'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('Record endpoint status:', recordResponse.status);
    console.log('Record endpoint response:', recordResponse.data);
    
    console.log('\n=== All tests completed ===');
  } catch (error) {
    console.error('Error during testing:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testFullFlow();