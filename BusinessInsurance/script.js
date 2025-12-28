document.getElementById('insurance-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const businessType = document.getElementById('businessType').value;
  const annualRevenue = parseFloat(document.getElementById('annualRevenue').value);
  const employeeCount = parseInt(document.getElementById('employeeCount').value);
  const businessAge = parseInt(document.getElementById('businessAge').value);
  const state = document.getElementById('state').value;
  const propertyValue = parseFloat(document.getElementById('propertyValue').value) || 0;
  const propertyType = document.getElementById('propertyType').value;
  const riskLevel = document.getElementById('riskLevel').value;
  const claimsHistory = document.getElementById('claimsHistory').value;
  const safetyMeasures = document.getElementById('safetyMeasures').value;

  // Base insurance costs by business type (annual)
  const baseCosts = {
    retail: 1200,
    restaurant: 2500,
    office: 800,
    construction: 3500,
    manufacturing: 2800,
    healthcare: 4000,
    technology: 900,
    consulting: 600
  };

  let generalLiability = baseCosts[businessType];
  
  // Revenue-based adjustments
  if (annualRevenue > 1000000) generalLiability *= 1.5;
  else if (annualRevenue > 500000) generalLiability *= 1.3;
  else if (annualRevenue > 100000) generalLiability *= 1.1;
  else if (annualRevenue < 50000) generalLiability *= 0.8;

  // Employee-based workers compensation
  let workersComp = 0;
  if (employeeCount > 0) {
    const wcRates = {
      retail: 150, restaurant: 300, office: 100, construction: 800,
      manufacturing: 400, healthcare: 250, technology: 80, consulting: 60
    };
    workersComp = wcRates[businessType] * employeeCount;
  }

  // Property insurance
  let propertyInsurance = 0;
  if (propertyValue > 0) {
    propertyInsurance = propertyValue * 0.003; // 0.3% of property value
  }

  // Professional liability
  let professionalLiability = 0;
  if (['office', 'healthcare', 'technology', 'consulting'].includes(businessType)) {
    professionalLiability = Math.max(800, annualRevenue * 0.002);
  }

  // Risk adjustments
  const riskMultipliers = {
    low: 0.8, medium: 1.0, high: 1.3, veryhigh: 1.6
  };
  
  const claimsMultipliers = {
    none: 0.9, minor: 1.0, moderate: 1.2, major: 1.5
  };
  
  const safetyMultipliers = {
    basic: 1.1, standard: 1.0, advanced: 0.9, comprehensive: 0.8
  };

  const riskMultiplier = riskMultipliers[riskLevel] * claimsMultipliers[claimsHistory] * safetyMultipliers[safetyMeasures];
  
  generalLiability *= riskMultiplier;
  workersComp *= riskMultiplier;
  professionalLiability *= riskMultiplier;

  // State multipliers
  const stateMultipliers = {
    california: 1.2, texas: 0.9, florida: 1.1, newyork: 1.3, illinois: 1.0, other: 1.0
  };
  
  const stateMultiplier = stateMultipliers[state];
  generalLiability *= stateMultiplier;
  workersComp *= stateMultiplier;
  propertyInsurance *= stateMultiplier;
  professionalLiability *= stateMultiplier;

  // Business age discount
  if (businessAge >= 5) {
    generalLiability *= 0.9;
    professionalLiability *= 0.9;
  }

  const totalAnnual = generalLiability + workersComp + propertyInsurance + professionalLiability;
  const totalMonthly = totalAnnual / 12;

  displayResults(generalLiability, workersComp, propertyInsurance, professionalLiability, totalAnnual, totalMonthly);
});

function displayResults(gl, wc, prop, prof, totalAnnual, totalMonthly) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');

  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">receipt_long</span> Insurance Cost Estimate
      </h2>
      
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-primary text-3xl font-bold">$${totalMonthly.toFixed(2)}</div>
          <div class="text-light text-sm">Monthly Premium</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-accent text-3xl font-bold">$${totalAnnual.toFixed(2)}</div>
          <div class="text-light text-sm">Annual Premium</div>
        </div>
      </div>
      
      <div class="bg-dark p-4 rounded mb-4">
        <h3 class="text-text font-medium mb-3">Coverage Breakdown (Annual)</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-light">General Liability:</span><span class="text-text font-medium">$${gl.toFixed(2)}</span></div>
          ${wc > 0 ? `<div class="flex justify-between"><span class="text-light">Workers' Compensation:</span><span class="text-text font-medium">$${wc.toFixed(2)}</span></div>` : ''}
          ${prop > 0 ? `<div class="flex justify-between"><span class="text-light">Property Insurance:</span><span class="text-text font-medium">$${prop.toFixed(2)}</span></div>` : ''}
          ${prof > 0 ? `<div class="flex justify-between"><span class="text-light">Professional Liability:</span><span class="text-text font-medium">$${prof.toFixed(2)}</span></div>` : ''}
          <div class="flex justify-between border-t border-accent pt-2 mt-2"><span class="text-light font-medium">Total:</span><span class="text-text font-bold">$${totalAnnual.toFixed(2)}</span></div>
        </div>
      </div>
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>📋 Important Notes:</strong>
        <ul class="mt-2 space-y-1 text-light">
          <li>• These are estimates - actual costs may vary</li>
          <li>• Consider additional coverage like cyber liability</li>
          <li>• Shop around with multiple insurance providers</li>
          <li>• Bundle policies for potential discounts</li>
          <li>• Review coverage annually as your business grows</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}