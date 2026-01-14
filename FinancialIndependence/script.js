// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('fi-form');
  const resultsDiv = document.getElementById('results');
  const resultContent = document.getElementById('result-content');
  const fiTypeSelect = document.getElementById('fiType');

  // Auto-adjust expense multiplier based on FI type
  fiTypeSelect.addEventListener('change', function() {
    const expenseMultiplier = document.getElementById('expenseMultiplier');
    const partTimeIncome = document.getElementById('partTimeIncome');
    
    switch(this.value) {
      case 'lean':
        expenseMultiplier.value = 70;
        partTimeIncome.value = 0;
        break;
      case 'regular':
        expenseMultiplier.value = 100;
        partTimeIncome.value = 0;
        break;
      case 'fat':
        expenseMultiplier.value = 150;
        partTimeIncome.value = 0;
        break;
      case 'coast':
        expenseMultiplier.value = 100;
        partTimeIncome.value = 0;
        break;
      case 'barista':
        expenseMultiplier.value = 100;
        partTimeIncome.value = 25000;
        break;
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateFI();
  });

  function calculateFI() {
    const formData = {
      currentAge: parseInt(document.getElementById('currentAge').value) || 30,
      currentNetWorth: parseFloat(document.getElementById('currentNetWorth').value) || 0,
      annualIncome: parseFloat(document.getElementById('annualIncome').value) || 0,
      annualExpenses: parseFloat(document.getElementById('annualExpenses').value) || 0,
      expectedReturn: parseFloat(document.getElementById('expectedReturn').value) || 7,
      inflationRate: parseFloat(document.getElementById('inflationRate').value) || 3,
      withdrawalRate: parseFloat(document.getElementById('withdrawalRate').value) || 4,
      fiType: document.getElementById('fiType').value,
      expenseMultiplier: parseFloat(document.getElementById('expenseMultiplier').value) || 100,
      partTimeIncome: parseFloat(document.getElementById('partTimeIncome').value) || 0,
      incomeGrowth: parseFloat(document.getElementById('incomeGrowth').value) || 3,
      socialSecurity: parseFloat(document.getElementById('socialSecurity').value) || 0,
      includeInflation: document.getElementById('includeInflation').value
    };

    const analysis = performFIAnalysis(formData);
    displayResults(analysis, formData);
  }

  function performFIAnalysis(data) {
    // Calculate real return rate
    const realReturn = data.includeInflation === 'yes' ? 
      ((1 + data.expectedReturn/100) / (1 + data.inflationRate/100) - 1) * 100 : 
      data.expectedReturn;

    // Calculate adjusted annual expenses for FI
    const fiAnnualExpenses = data.annualExpenses * (data.expenseMultiplier / 100);
    
    // Calculate required FI number
    const requiredFINumber = (fiAnnualExpenses - data.partTimeIncome) / (data.withdrawalRate / 100);
    
    // Calculate current savings rate
    const currentSavings = data.annualIncome - data.annualExpenses;
    const savingsRate = (currentSavings / data.annualIncome) * 100;

    // Calculate years to FI using compound growth formula
    let yearsToFI = 0;
    let currentValue = data.currentNetWorth;
    let currentIncome = data.annualIncome;
    let yearlyData = [];

    for (let year = 1; year <= 50; year++) {
      // Grow income
      currentIncome *= (1 + data.incomeGrowth / 100);
      
      // Calculate savings for this year
      const yearlyExpenses = data.includeInflation === 'yes' ? 
        data.annualExpenses * Math.pow(1 + data.inflationRate/100, year) : 
        data.annualExpenses;
      
      const yearlySavings = Math.max(0, currentIncome - yearlyExpenses);
      
      // Grow investments
      currentValue = currentValue * (1 + realReturn/100) + yearlySavings;
      
      yearlyData.push({
        year: year,
        age: data.currentAge + year,
        netWorth: currentValue,
        income: currentIncome,
        savings: yearlySavings,
        savingsRate: (yearlySavings / currentIncome) * 100
      });

      if (currentValue >= requiredFINumber && yearsToFI === 0) {
        yearsToFI = year;
      }
    }

    // Calculate different FI scenarios
    const scenarios = calculateFIScenarios(data, realReturn);

    // Calculate Coast FI
    const coastFIAge = 65;
    const yearsToCoastFI = coastFIAge - data.currentAge;
    const coastFINumber = requiredFINumber / Math.pow(1 + realReturn/100, yearsToCoastFI);

    return {
      requiredFINumber,
      yearsToFI: yearsToFI || 50,
      fiAge: data.currentAge + (yearsToFI || 50),
      currentSavings,
      savingsRate,
      fiAnnualExpenses,
      scenarios,
      coastFINumber,
      yearlyData: yearlyData.slice(0, Math.min(yearsToFI + 5, 30)),
      realReturn
    };
  }

  function calculateFIScenarios(data, realReturn) {
    const scenarios = [];
    const baseExpenses = data.annualExpenses;

    // Lean FIRE (70% expenses)
    const leanExpenses = baseExpenses * 0.7;
    const leanFI = leanExpenses / (data.withdrawalRate / 100);
    scenarios.push({
      name: 'Lean FIRE',
      expenses: leanExpenses,
      fiNumber: leanFI,
      yearsToFI: calculateYearsToTarget(data, leanFI, realReturn)
    });

    // Regular FIRE (100% expenses)
    const regularFI = baseExpenses / (data.withdrawalRate / 100);
    scenarios.push({
      name: 'Regular FIRE',
      expenses: baseExpenses,
      fiNumber: regularFI,
      yearsToFI: calculateYearsToTarget(data, regularFI, realReturn)
    });

    // Fat FIRE (150% expenses)
    const fatExpenses = baseExpenses * 1.5;
    const fatFI = fatExpenses / (data.withdrawalRate / 100);
    scenarios.push({
      name: 'Fat FIRE',
      expenses: fatExpenses,
      fiNumber: fatFI,
      yearsToFI: calculateYearsToTarget(data, fatFI, realReturn)
    });

    return scenarios;
  }

  function calculateYearsToTarget(data, target, realReturn) {
    let currentValue = data.currentNetWorth;
    let currentIncome = data.annualIncome;
    
    for (let year = 1; year <= 50; year++) {
      currentIncome *= (1 + data.incomeGrowth / 100);
      const yearlySavings = Math.max(0, currentIncome - data.annualExpenses);
      currentValue = currentValue * (1 + realReturn/100) + yearlySavings;
      
      if (currentValue >= target) {
        return year;
      }
    }
    return 50;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function displayResults(analysis, formData) {
    const fiDate = new Date();
    fiDate.setFullYear(fiDate.getFullYear() + analysis.yearsToFI);
    
    const savingsColor = analysis.savingsRate >= 50 ? 'text-green-400' : 
                         analysis.savingsRate >= 20 ? 'text-yellow-400' : 'text-red-400';

    resultContent.innerHTML = `
      <div class="bg-broder p-6 rounded-lg border border-accent">
        <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
          <span class="material-icons text-primary">trending_up</span> 
          Financial Independence Analysis
        </h3>
        
        <div class="grid md:grid-cols-3 gap-4 mb-6">
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold text-primary">${sanitizeText(analysis.yearsToFI)}</div>
            <div class="text-sm text-light">Years to FI</div>
          </div>
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold text-accent">${sanitizeText(analysis.fiAge)}</div>
            <div class="text-sm text-light">FI Age</div>
          </div>
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold ${sanitizeText(savingsColor)}">${analysis.savingsRate.toFixed(1)}%</div>
            <div class="text-sm text-light">Savings Rate</div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-lg font-medium mb-3 text-text">FI Target Details</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-light">FI Number Required:</span>
                <span class="text-text">$${analysis.requiredFINumber.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Annual FI Expenses:</span>
                <span class="text-text">$${analysis.fiAnnualExpenses.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Withdrawal Rate:</span>
                <span class="text-text">${sanitizeText(formData.withdrawalRate)}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Expected FI Date:</span>
                <span class="text-text">${fiDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-medium mb-3 text-text">Current Status</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-light">Current Net Worth:</span>
                <span class="text-text">$${formData.currentNetWorth.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Annual Savings:</span>
                <span class="text-text">$${analysis.currentSavings.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Progress to FI:</span>
                <span class="text-text">${((formData.currentNetWorth / analysis.requiredFINumber) * 100).toFixed(1)}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Coast FI Number:</span>
                <span class="text-text">$${analysis.coastFINumber.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">FI Scenario Comparison</h4>
          <div class="grid gap-3">
            ${analysis.scenarios.map(scenario => `
              <div class="p-3 bg-dark rounded border border-accent">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="font-medium text-text">${escapeHtml(scenario.name)}</div>
                    <div class="text-xs text-light">$${scenario.expenses.toLocaleString()}/year expenses</div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-primary">${sanitizeText(scenario.yearsToFI)} years</div>
                    <div class="text-xs text-light">$${(scenario.fiNumber/1000).toFixed(0)}K needed</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Projection Timeline</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-accent">
                  <th class="text-left py-2 text-light">Year</th>
                  <th class="text-left py-2 text-light">Age</th>
                  <th class="text-left py-2 text-light">Net Worth</th>
                  <th class="text-left py-2 text-light">Savings Rate</th>
                </tr>
              </thead>
              <tbody>
                ${analysis.yearlyData.slice(0, 10).map(data => `
                  <tr class="border-b border-accent/30">
                    <td class="py-1 text-text">${data.year}</td>
                    <td class="py-1 text-text">${sanitizeText(data.age)}</td>
                    <td class="py-1 text-text">$${(data.netWorth/1000).toFixed(0)}K</td>
                    <td class="py-1 text-text">${data.savingsRate.toFixed(1)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-dark p-4 rounded border border-accent">
          <h4 class="text-lg font-medium mb-3 text-text">Optimization Tips</h4>
          <ul class="space-y-2 text-sm text-light">
            ${generateOptimizationTips(analysis, formData).map(tip => `
              <li class="flex items-start gap-2">
                <span class="material-icons text-xs text-accent mt-0.5">lightbulb</span>
                ${escapeHtml(tip)}
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="mt-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded text-sm text-yellow-200">
          <strong>Disclaimer:</strong> This calculator provides estimates based on assumptions about future returns, 
          inflation, and expenses. Actual results may vary significantly due to market volatility, life changes, 
          and economic conditions. Consult with a financial advisor for personalized advice.
        </div>
      </div>
    `;

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }

  function generateOptimizationTips(analysis, formData) {
    const tips = [];
    
    if (analysis.savingsRate < 20) {
      tips.push('Increase your savings rate to 20%+ to accelerate FI timeline significantly');
    }
    
    if (analysis.yearsToFI > 20) {
      tips.push('Consider reducing expenses or increasing income to reach FI sooner');
    }
    
    if (formData.expectedReturn > 8) {
      tips.push('Your expected return may be optimistic - consider more conservative projections');
    }
    
    if (analysis.savingsRate >= 50) {
      tips.push('Excellent savings rate! You\'re on track for early financial independence');
    }
    
    tips.push('Consider tax-advantaged accounts (401k, IRA, HSA) to optimize your savings');
    tips.push('Regularly review and adjust your FI plan as circumstances change');
    tips.push('Build multiple income streams to reduce dependency on single source');
    
    return tips;
  }
});
