const { parseSpeechResult } = require('./parse-speech');

console.log('=== Parse Speech Module Test ===\n');

// Test cases
const testCases = [
  {
    input: "Bonjour, je m'appelle Jean Dupont. Ma plaque d'immatriculation est AB123CD. Je voudrais une réparation.",
    expected: { name: 'Jean Dupont', plate: 'AB123CD', service: 'Réparation' }
  },
  {
    input: "Mon nom est Marie Martin. Plaque HD456XY. J'aimerais faire un entretien.",
    expected: { name: 'Marie Martin', plate: 'HD456XY', service: 'Entretien' }
  },
  {
    input: "Je suis Pierre Lambert, plaque JK789LM. Je veux passer un contrôle technique.",
    expected: { name: 'Pierre Lambert', plate: 'JK789LM', service: 'Contrôle technique' }
  },
  {
    input: "Bonjour, je voudrais changer l'huile de ma voiture.",
    expected: { name: 'Unknown', plate: 'Unknown', service: 'Vidange' }
  },
  {
    input: "Je viens pour les freins.",
    expected: { name: 'Unknown', plate: 'Unknown', service: 'Freins' }
  }
];

let passedTests = 0;

testCases.forEach((testCase, index) => {
  const result = parseSpeechResult(testCase.input);
  console.log(`Test Case ${index + 1}:`);
  console.log(`Input: ${testCase.input}`);
  console.log(`Expected:`, testCase.expected);
  console.log(`Actual:`, result);
  
  // Check if result matches expected
  const nameMatch = result.name === testCase.expected.name;
  const plateMatch = result.plate === testCase.expected.plate;
  const serviceMatch = result.service === testCase.expected.service;
  
  if (nameMatch && plateMatch && serviceMatch) {
    console.log('✅ PASS\n');
    passedTests++;
  } else {
    console.log('❌ FAIL\n');
  }
});

console.log(`Results: ${passedTests}/${testCases.length} tests passed`);

if (passedTests === testCases.length) {
  console.log('🎉 All tests passed!');
} else {
  console.log('❌ Some tests failed');
  process.exit(1);
}