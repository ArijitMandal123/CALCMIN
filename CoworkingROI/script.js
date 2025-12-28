document.getElementById('coworking-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const teamSize = parseInt(document.getElementById('teamSize').value);
  const workDays = parseInt(document.getElementById('workDays').value);
  const location = document.getElementById('location').value;
  const currentRent = parseFloat(document.getElementById('currentRent').value) || 0;
  const utilities = parseFloat(document.getElementById('utilities').value) || 0;
  const internet = parseFloat(document.getElementById('internet').value) || 0;
  const equipment = parseFloat(document.getElementById('equipment').value) || 0;
  const membershipType = document.getElementById('membershipType').value;
  const amenities = document.getElementById('amenities').value;

  // Current setup monthly cost
  const currentMonthlyCost = currentRent + utilities + internet + equipment;

  // Coworking base rates by location and type
  const baseRates = {
    tier1: {hotdesk: 300, dedicated: 500, private: 800, meeting: 200},
    tier2: {hotdesk: 200, dedicated: 350, private: 600, meeting: 150},
    tier3: {hotdesk: 150, dedicated: 250, private: 400, meeting: 100},
    suburban: {hotdesk: 100, dedicated: 200, private: 300, meeting: 80}
  };

  // Amenities multipliers
  const amenityMultipliers = {
    basic: 1.0, standard: 1.2, premium: 1.4, luxury: 1.8
  };

  let coworkingCostPerPerson = baseRates[location][membershipType] * amenityMultipliers[amenities];
  
  // Usage-based pricing adjustment
  const usageRatio = workDays / 22; // 22 average work days per month
  if (membershipType === 'hotdesk' && usageRatio < 0.5) {
    coworkingCostPerPerson *= 0.7; // Day pass discount
  }

  const totalCoworkingCost = coworkingCostPerPerson * teamSize;

  // Additional benefits calculation
  const networkingValue = amenities === 'premium' || amenities === 'luxury' ? 200 : 100;
  const productivityBoost = 150; // Estimated monthly value
  const flexibilityValue = 100;
  const totalBenefits = networkingValue + productivityBoost + flexibilityValue;

  // ROI calculation
  const monthlySavings = currentMonthlyCost - totalCoworkingCost + totalBenefits;
  const annualSavings = monthlySavings * 12;
  const roiPercentage = currentMonthlyCost > 0 ? (monthlySavings / currentMonthlyCost) * 100 : 0;

  displayResults(currentMonthlyCost, totalCoworkingCost, monthlySavings, annualSavings, roiPercentage, totalBenefits);
});

function displayResults(current, coworking, monthly, annual, roi, benefits) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');
  
  const recommendation = monthly > 0 ? 'Recommended' : 'Not Recommended';
  const recColor = monthly > 0 ? 'text-green-400' : 'text-red-400';

  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">trending_up</span> Coworking ROI Analysis
      </h2>
      
      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-text text-2xl font-bold">$${current.toFixed(2)}</div>
          <div class="text-light text-sm">Current Monthly Cost</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-accent text-2xl font-bold">$${coworking.toFixed(2)}</div>
          <div class="text-light text-sm">Coworking Monthly Cost</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="${recColor} text-2xl font-bold">${monthly >= 0 ? '+' : ''}$${monthly.toFixed(2)}</div>
          <div class="text-light text-sm">Monthly Difference</div>
        </div>
      </div>

      <div class="bg-dark p-4 rounded mb-4 text-center">
        <div class="text-primary text-3xl font-bold">${roi.toFixed(1)}%</div>
        <div class="text-light text-sm mb-2">ROI</div>
        <div class="${recColor} font-medium">${recommendation}</div>
      </div>
      
      <div class="bg-dark p-4 rounded mb-4">
        <h3 class="text-text font-medium mb-3">Annual Projection</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-light">Annual Savings:</span><span class="text-text font-medium">${annual >= 0 ? '+' : ''}$${annual.toFixed(2)}</span></div>
          <div class="flex justify-between"><span class="text-light">Added Benefits Value:</span><span class="text-text font-medium">$${(benefits * 12).toFixed(2)}</span></div>
        </div>
      </div>
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>💡 Coworking Benefits:</strong>
        <ul class="mt-2 space-y-1 text-light">
          <li>• Networking opportunities and community</li>
          <li>• Flexible workspace without long-term commitment</li>
          <li>• Professional environment boosts productivity</li>
          <li>• Access to meeting rooms and amenities</li>
          <li>• Reduced overhead and maintenance costs</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}