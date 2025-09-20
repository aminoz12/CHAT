// Function to parse speech result
function parseSpeechResult(speechResult) {
  // This is a basic implementation - you might want to improve this with better NLP
  const result = {
    name: 'Unknown',
    plate: 'Unknown',
    service: 'Unknown'
  };
  
  if (speechResult) {
    console.log('Parsing speech result:', speechResult);
    
    // Convert to lowercase for easier matching
    const lowerSpeech = speechResult.toLowerCase();
    
    // Try to extract information using simple pattern matching
    // This is a very basic implementation - in production, use a proper NLP library
    
    // Extract name - try multiple patterns
    const namePatterns = [
      /(?:je m'appelle|m'appelle|mon nom est|nom\s)([a-zA-Z\s]+)/i,
      /(?:mon nom est|je suis|je m'appelle)([a-zA-Z\s]+)/i,
      /(?:je suis\s)([a-zA-Z\s]+)/i,
      /(?:mon nom\s)([a-zA-Z\s]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const nameMatch = speechResult.match(pattern);
      if (nameMatch && nameMatch[1]) {
        // Clean up the name (remove extra spaces, etc.)
        let name = nameMatch[1].trim();
        // Remove trailing periods or other punctuation
        name = name.replace(/[.,;:]$/, '');
        result.name = name;
        console.log('Found name:', result.name);
        break;
      }
    }
    
    // Look for French plate number patterns (various formats)
    // 2 letters + 3 digits + 2 letters
    const plateMatch1 = speechResult.match(/[A-Z]{2}\s*\d{3}\s*[A-Z]{2}/i);
    // 1-2 letters + 2-3 digits + 1-2 letters
    const plateMatch2 = speechResult.match(/[A-Z]{1,2}\s*\d{2,3}\s*[A-Z]{1,2}/i);
    
    if (plateMatch1) {
      result.plate = plateMatch1[0].replace(/\s+/g, '').toUpperCase();
      console.log('Found plate (pattern 1):', result.plate);
    } else if (plateMatch2) {
      result.plate = plateMatch2[0].replace(/\s+/g, '').toUpperCase();
      console.log('Found plate (pattern 2):', result.plate);
    }
    
    // Extract service information - try multiple patterns
    const serviceKeywords = [
      { keywords: ['réparation', 'reparation'], service: 'Réparation' },
      { keywords: ['entretien'], service: 'Entretien' },
      { keywords: ['contrôle', 'controle', 'technique'], service: 'Contrôle technique' },
      { keywords: ['vidange', 'huile'], service: 'Vidange' },
      { keywords: ['frein', 'freins'], service: 'Freins' },
      { keywords: ['pneu', 'pneus'], service: 'Pneus' },
      { keywords: ['batterie'], service: 'Batterie' }
    ];
    
    for (const serviceItem of serviceKeywords) {
      if (serviceItem.keywords.some(keyword => lowerSpeech.includes(keyword))) {
        result.service = serviceItem.service;
        console.log('Found service:', result.service);
        break;
      }
    }
    
    // Special handling for common mispronunciations or variations
    if (result.service === 'Unknown') {
      if (lowerSpeech.includes('vidange') || lowerSpeech.includes('huile')) {
        result.service = 'Vidange';
      } else if (lowerSpeech.includes('frein')) {
        result.service = 'Freins';
      } else if (lowerSpeech.includes('pneu')) {
        result.service = 'Pneus';
      } else if (lowerSpeech.includes('batterie')) {
        result.service = 'Batterie';
      }
    }
  }
  
  console.log('Final parsed result:', result);
  return result;
}

module.exports = { parseSpeechResult };