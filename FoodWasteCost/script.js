// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.getElementById('waste-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const monthlyGroceries = parseFloat(document.getElementById('monthlyGroceries').value);
  const householdSize = parseInt(document.getElementById('householdSize').value);
  const shoppingFrequency = document.getElementById('shoppingFrequency').value;
  const produceWaste = parseFloat(document.getElementById('produceWaste').value) / 100;
  const breadWaste = parseFloat(document.getElementById('breadWaste').value) / 100;
  const dairyWaste = parseFloat(document.getElementById('dairyWaste').value) / 100;
  const leftoversWaste = parseFloat(document.getElementById('leftoversWaste').value) / 100;
  const wasteReason = document.getElementById('wasteReason').value;
  const storageKnowledge = document.getElementById('storageKnowledge').value;

  // Typical food category spending percentages
  const produceSpending = monthlyGroceries * 0.25; // 25% on produce
  const breadSpending = monthlyGroceries * 0.15;   // 15% on bread/bakery
  const dairySpending = monthlyGroceries * 0.30;   // 30% on dairy/meat
  const leftoversSpending = monthlyGroceries * 0.20; // 20% becomes leftovers

  // Calculate waste costs by category
  const produceWasteCost = produceSpending * produceWaste;
  const breadWasteCost = breadSpending * breadWaste;
  const dairyWasteCost = dairySpending * dairyWaste;
  const leftoversWasteCost = leftoversSpending * leftoversWaste;

  const totalMonthlyWaste = produceWasteCost + breadWasteCost + dairyWasteCost + leftoversWasteCost;
  const annualWaste = totalMonthlyWaste * 12;
  const wastePerPerson = totalMonthlyWaste / householdSize;

  // Shopping frequency impact
  const frequencyMultipliers = {
    daily: 1.3,    // More impulse buying
    weekly: 1.0,   // Baseline
    biweekly: 0.9, // Better planning
    monthly: 0.8   // Bulk buying efficiency
  };
  
  const adjustedWaste = totalMonthlyWaste * frequencyMultipliers[shoppingFrequency];

  // Storage knowledge impact on potential savings
  const storageMultipliers = {
    poor: 1.4,   // Could reduce waste significantly
    basic: 1.2,  // Some improvement possible
    good: 1.1,   // Minor improvements
    expert: 1.0  // Already optimized
  };
  
  const potentialSavings = adjustedWaste * (storageMultipliers[storageKnowledge] - 1);

  displayResults(adjustedWaste, annualWaste * frequencyMultipliers[shoppingFrequency], wastePerPerson, potentialSavings, wasteReason);
});

function displayResults(monthly, annual, perPerson, savings, reason) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');

  const wasteLevel = monthly > 150 ? 'High' : monthly > 75 ? 'Moderate' : 'Low';
  const wasteColor = monthly > 150 ? 'text-red-400' : monthly > 75 ? 'text-yellow-400' : 'text-green-400';

  const tips = {
    expired: ['Check expiration dates when shopping', 'Use "first in, first out" rotation', 'Plan meals around perishables'],
    overbuying: ['Make shopping lists and stick to them', 'Shop more frequently for fresh items', 'Avoid bulk buying perishables'],
    forgetting: ['Organize fridge with visible storage', 'Use clear containers', 'Set phone reminders for leftovers'],
    picky: ['Try new recipes with disliked foods', 'Buy smaller quantities to test', 'Involve family in meal planning'],
    planning: ['Plan weekly meals in advance', 'Check what you have before shopping', 'Prep ingredients after shopping']
  };

  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">attach_money</span> Food Waste Cost Analysis
      </h2>
      
      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-primary text-3xl font-bold">$${monthly.toFixed(2)}</div>
          <div class="text-light text-sm">Monthly Waste</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-accent text-3xl font-bold">$${annual.toFixed(2)}</div>
          <div class="text-light text-sm">Annual Waste</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="${sanitizeText(wasteColor)} text-2xl font-bold">${sanitizeText(wasteLevel)}</div>
          <div class="text-light text-sm">Waste Level</div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-text text-2xl font-bold">$${perPerson.toFixed(2)}</div>
          <div class="text-light text-sm">Waste per Person</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-green-400 text-2xl font-bold">$${savings.toFixed(2)}</div>
          <div class="text-light text-sm">Potential Monthly Savings</div>
        </div>
      </div>
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>ðŸ’¡ Reduction Tips for Your Main Issue:</strong>
        <ul class="mt-2 space-y-1 text-light">
          ${tips[reason].map(tip => `<li>â€¢ ${tip}</li>`).join('')}
          <li>â€¢ Track waste for a week to identify patterns</li>
          <li>â€¢ Use apps to manage expiration dates</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
