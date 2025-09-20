// Test the pronunciation improvements
const { parseSpeechResult } = require('./parse-speech');

// Test cases with various inputs
const testCases = [
  "Bonjour, je m'appelle Jean Dupont. Ma plaque d'immatriculation est AB123CD. Je voudrais faire une réparation.",
  "Je suis Marie Martin. Plaque BF456GH. Je viens pour un entretien.",
  "Mon nom est Pierre Lambert, plaque XY789ZT. Je veux faire une vidange.",
  "Je m'appelle Sophie Bernard. Plaque IJ123KL. Contrôle technique s'il vous plaît.",
  "Bonjour, je m'appelle Ahmed Smith. Plaque AB-123-CD. Je viens pour les freins."
];

console.log('Testing pronunciation and parsing improvements...\n');

testCases.forEach((test, index) => {
  console.log(`Test ${index + 1}:`);
  console.log(`Input: ${test}`);
  const result = parseSpeechResult(test);
  console.log(`Output:`, result);
  console.log('---');
});