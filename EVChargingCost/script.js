// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

document.getElementById('ev-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const evEfficiency = parseFloat(document.getElementById('evEfficiency').value);
  const gasMPG = parseFloat(document.getElementById('gasMPG').value);
  const monthlyMiles = parseFloat(document.getElementById('monthlyMiles').value);
  const homeElectricityRate = parseFloat(document.getElementById('homeElectricityRate').value);
  const publicChargingRate = parseFloat(document.getElementById('publicChargingRate').value) || homeElectricityRate * 2;
  const homeChargingPercent = parseFloat(document.getElementById('homeChargingPercent').value) / 100;
  const gasPrice = parseFloat(document.getElementById('gasPrice').value);

  // EV calculations
  const kWhNeeded = monthlyMiles / evEfficiency;
  const homeChargingCost = kWhNeeded * homeChargingPercent * homeElectricityRate;
  const publicChargingCost = kWhNeeded * (1 - homeChargingPercent) * publicChargingRate;
  const totalEVCost = homeChargingCost + publicChargingCost;

  // Gas car calculations
  const gallonsNeeded = monthlyMiles / gasMPG;
  const totalGasCost = gallonsNeeded * gasPrice;

  // Savings and comparisons
  const monthlySavings = totalGasCost - totalEVCost;
  const annualSavings = monthlySavings * 12;
  const costPerMile = {
    ev: totalEVCost / monthlyMiles,
    gas: totalGasCost / monthlyMiles
  };

  displayResults(totalEVCost, totalGasCost, monthlySavings, annualSavings, costPerMile, kWhNeeded, gallonsNeeded);
});

function displayResults(evCost, gasCost, monthly, annual, perMile, kwh, gallons) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');

  const winner = evCost < gasCost ? 'EV' : 'Gas';
  const winnerColor = evCost < gasCost ? 'text-green-400' : 'text-red-400';
  const savingsColor = monthly > 0 ? 'text-green-400' : 'text-red-400';

  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">compare_arrows</span> Cost Comparison Results
      </h2>
      
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-primary text-3xl font-bold">$${evCost.toFixed(2)}</div>
          <div class="text-light text-sm">EV Monthly Cost</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-accent text-3xl font-bold">$${gasCost.toFixed(2)}</div>
          <div class="text-light text-sm">Gas Monthly Cost</div>
        </div>
      </div>

      <div class="bg-dark p-4 rounded mb-4 text-center">
        <div class="${sanitizeText(winnerColor)} text-2xl font-bold">${sanitizeText(winner)} Wins!</div>
        <div class="text-light text-sm">More Cost Effective</div>
      </div>

      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="${sanitizeText(savingsColor)} text-2xl font-bold">${monthly >= 0 ? '+' : ''}$${monthly.toFixed(2)}</div>
          <div class="text-light text-sm">Monthly Savings (EV)</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="${sanitizeText(savingsColor)} text-2xl font-bold">${annual >= 0 ? '+' : ''}$${annual.toFixed(2)}</div>
          <div class="text-light text-sm">Annual Savings (EV)</div>
        </div>
      </div>
      
      <div class="bg-dark p-4 rounded mb-4">
        <h3 class="text-text font-medium mb-3">Cost Breakdown</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-light">EV Cost per Mile:</span><span class="text-text font-medium">$${perMile.ev.toFixed(3)}</span></div>
          <div class="flex justify-between"><span class="text-light">Gas Cost per Mile:</span><span class="text-text font-medium">$${perMile.gas.toFixed(3)}</span></div>
          <div class="flex justify-between"><span class="text-light">kWh Used (EV):</span><span class="text-text font-medium">${kwh.toFixed(1)} kWh</span></div>
          <div class="flex justify-between"><span class="text-light">Gallons Used (Gas):</span><span class="text-text font-medium">${gallons.toFixed(1)} gal</span></div>
        </div>
      </div>
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>💡 Additional EV Benefits:</strong>
        <ul class="mt-2 space-y-1 text-light">
          <li>• Lower maintenance costs (no oil changes)</li>
          <li>• Potential tax incentives and rebates</li>
          <li>• Reduced environmental impact</li>
          <li>• Quieter operation</li>
          <li>• Home charging convenience</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
