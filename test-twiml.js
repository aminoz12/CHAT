const twilio = require('twilio');

// Test the initial TwiML response
function testInitialTwiML() {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Greeting in French
  twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Bonjour! Merci d\'appeler notre magazine.');
  
  // Gather caller information using speech recognition
  const gather = twiml.gather({
    input: 'speech',
    action: '/gather',
    method: 'POST',
    language: 'fr-FR',
    timeout: 10,
    speechModel: 'phone_call'
  });
  
  gather.say({ voice: 'alice', language: 'fr-FR' }, 'Veuillez dire votre nom, votre numéro de plaque d\'immatriculation et le service souhaité.');
  
  // If no input, record the call
  twiml.record({
    action: '/record',
    method: 'POST',
    maxLength: 60,
    finishOnKey: '#'
  });
  
  console.log('Initial TwiML:');
  console.log(twiml.toString());
}

// Test the gather TwiML response
function testGatherTwiML() {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Thank the caller
  twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Merci pour votre appel. Nous vous rappellerons bientôt.');
  twiml.hangup();
  
  console.log('\nGather TwiML:');
  console.log(twiml.toString());
}

// Test the record TwiML response
function testRecordTwiML() {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Thank the caller
  twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Votre message a été enregistré. Nous vous rappellerons bientôt.');
  twiml.hangup();
  
  console.log('\nRecord TwiML:');
  console.log(twiml.toString());
}

// Test error TwiML response
function testErrorTwiML() {
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Handle error gracefully
  twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Désolé, nous rencontrons un problème technique. Veuillez réessayer plus tard.');
  twiml.hangup();
  
  console.log('\nError TwiML:');
  console.log(twiml.toString());
}

// Run tests
testInitialTwiML();
testGatherTwiML();
testRecordTwiML();
testErrorTwiML();