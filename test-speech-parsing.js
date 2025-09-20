const { parseSpeechResult } = require('./parse-speech');

// Test cases
const testCases = [
  "Bonjour, je m'appelle Jean Dupont. Ma plaque d'immatriculation est AB123CD. Je voudrais faire une réparation.",
  "Je suis Marie Martin. Plaque BF456GH. Je viens pour un entretien.",
  "Mon nom est Pierre Lambert, plaque XY789ZT. Je veux faire une vidange.",
  "Je m'appelle Sophie Bernard. Plaque IJ123KL. Contrôle technique s'il vous plaît."
];

console.log('Testing speech parsing...\n');

testCases.forEach((test, index) => {
  console.log(`Test ${index + 1}:`);
  console.log(`Input: ${test}`);
  const result = parseSpeechResult(test);
  console.log(`Output:`, result);
  console.log('---');
});