// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

  const form = document.getElementById('emergency-form');
  const resultsDiv = document.getElementById('results');
  const resultContent = document.getElementById('result-content');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    analyzeEmergencyFund();
  });

  function analyzeEmergencyFund() {
    const formData = {
      monthlyExpenses: parseFloat(document.getElementById('monthlyExpenses').value) || 0,
      currentEmergencyFund: parseFloat(document.getElementById('currentEmergencyFund').value) || 0,
      monthlyIncome: parseFloat(document.getElementById('monthlyIncome').value) || 0,
      otherSavings: parseFloat(document.getElementById('otherSavings').value) || 0,
      industry: document.getElementById('industry').value,
      jobSecurity: document.getElementById('jobSecurity').value,
      incomeStability: document.getElementById('incomeStability').value,
      employmentType: document.getElementById('employmentType').value,
      dependents: document.getElementById('dependents').value,
      dualIncome: document.getElementById('dualIncome').value,
      healthStatus: document.getElementById('healthStatus').value,
      insurance: document.getElementById('insurance').value,
      location: document.getElementById('location').value,
      homeOwnership: document.getElementById('homeOwnership').value,
      riskTolerance: document.getElementById('riskTolerance').value
    };

    const analysis = performEmergencyFundAnalysis(formData);
    displayResults(analysis, formData);
  }

  function performEmergencyFundAnalysis(data) {
    let baseMonths = 3; // Start with 3 months baseline

    // Industry risk adjustments
    const industryRisk = {
      'tech': 0.5, 'healthcare': -0.5, 'finance': 0, 'education': -0.5, 'government': -1,
      'retail': 1, 'hospitality': 1.5, 'construction': 1, 'manufacturing': 0.5, 'freelance': 2, 'other': 0.5
    };
    baseMonths += industryRisk[data.industry] || 0.5;

    // Job security adjustments
    const securityAdjustments = {
      'very-high': -1, 'high': -0.5, 'medium': 0, 'low': 1, 'very-low': 2
    };
    baseMonths += securityAdjustments[data.jobSecurity] || 0;

    // Income stability adjustments
    const stabilityAdjustments = {
      'fixed': 0, 'variable': 1, 'seasonal': 1.5, 'project': 1.5
    };
    baseMonths += stabilityAdjustments[data.incomeStability] || 0;

    // Employment type adjustments
    const employmentAdjustments = {
      'full-time': 0, 'part-time': 0.5, 'contractor': 1, 'business-owner': 1.5, 'multiple': -0.5
    };
    baseMonths += employmentAdjustments[data.employmentType] || 0;

    // Dependents adjustments
    const dependentAdjustments = { '0': 0, '1': 0.5, '2': 1, '3': 1.5, '4+': 2 };
    baseMonths += dependentAdjustments[data.dependents] || 0;

    // Dual income adjustments
    const incomeAdjustments = {
      'single': 1, 'dual-equal': -0.5, 'dual-primary': 0, 'dual-secondary': -1
    };
    baseMonths += incomeAdjustments[data.dualIncome] || 0;

    // Health status adjustments
    const healthAdjustments = {
      'excellent': 0, 'good': 0.5, 'fair': 1, 'poor': 2
    };
    baseMonths += healthAdjustments[data.healthStatus] || 0;

    // Insurance adjustments
    const insuranceAdjustments = {
      'excellent': -0.5, 'good': 0, 'basic': 1, 'minimal': 2
    };
    baseMonths += insuranceAdjustments[data.insurance] || 0;

    // Location adjustments
    const locationAdjustments = {
      'high-cost': 1, 'medium-cost': 0, 'low-cost': -0.5, 'rural': -0.5
    };
    baseMonths += locationAdjustments[data.location] || 0;

    // Home ownership adjustments
    const housingAdjustments = {
      'own-mortgage': 0.5, 'own-free': -0.5, 'rent': 0, 'family': -1
    };
    baseMonths += housingAdjustments[data.homeOwnership] || 0;

    // Risk tolerance adjustments
    const riskAdjustments = {
      'conservative': 1, 'moderate': 0, 'aggressive': -0.5
    };
    baseMonths += riskAdjustments[data.riskTolerance] || 0;

    // Calculate recommended emergency fund
    const recommendedMonths = Math.max(2, Math.min(12, baseMonths));
    const recommendedAmount = recommendedMonths * data.monthlyExpenses;
    
    // Calculate current coverage
    const currentMonths = data.currentEmergencyFund / data.monthlyExpenses;
    const totalAccessible = data.currentEmergencyFund + data.otherSavings;
    const totalMonths = totalAccessible / data.monthlyExpenses;

    // Determine sufficiency status
    let status = '';
    let statusColor = '';
    let urgency = '';

    if (currentMonths >= recommendedMonths) {
      status = 'Adequate';
      statusColor = 'text-green-400';
      urgency = 'low';
    } else if (currentMonths >= recommendedMonths * 0.75) {
      status = 'Nearly Adequate';
      statusColor = 'text-yellow-400';
      urgency = 'medium';
    } else if (currentMonths >= recommendedMonths * 0.5) {
      status = 'Insufficient';
      statusColor = 'text-orange-400';
      urgency = 'high';
    } else {
      status = 'Critically Low';
      statusColor = 'text-red-400';
      urgency = 'critical';
    }

    // Calculate monthly savings needed
    const shortfall = Math.max(0, recommendedAmount - data.currentEmergencyFund);
    const monthlySavingsNeeded = shortfall > 0 ? shortfall / 12 : 0; // Assume 1 year to build

    return {
      recommendedMonths: recommendedMonths.toFixed(1),
      recommendedAmount,
      currentMonths: currentMonths.toFixed(1),
      totalMonths: totalMonths.toFixed(1),
      status,
      statusColor,
      urgency,
      shortfall,
      monthlySavingsNeeded,
      riskFactors: identifyRiskFactors(data),
      recommendations: generateRecommendations(data, currentMonths, recommendedMonths, urgency)
    };
  }

  function identifyRiskFactors(data) {
    const factors = [];
    
    if (['freelance', 'retail', 'hospitality'].includes(data.industry)) {
      factors.push('High-risk industry with potential volatility');
    }
    
    if (['low', 'very-low'].includes(data.jobSecurity)) {
      factors.push('Low job security increases unemployment risk');
    }
    
    if (['variable', 'seasonal', 'project'].includes(data.incomeStability)) {
      factors.push('Variable income requires larger emergency buffer');
    }
    
    if (data.dualIncome === 'single' && parseInt(data.dependents) > 0) {
      factors.push('Single income with dependents increases financial risk');
    }
    
    if (['fair', 'poor'].includes(data.healthStatus)) {
      factors.push('Health conditions may lead to unexpected medical expenses');
    }
    
    if (['basic', 'minimal'].includes(data.insurance)) {
      factors.push('Limited insurance coverage increases out-of-pocket risk');
    }
    
    if (data.homeOwnership === 'own-mortgage') {
      factors.push('Homeownership brings potential maintenance and repair costs');
    }
    
    return factors;
  }

  function generateRecommendations(data, currentMonths, recommendedMonths, urgency) {
    const recommendations = [];
    
    if (urgency === 'critical') {
      recommendations.push('URGENT: Build emergency fund immediately - consider reducing all non-essential spending');
      recommendations.push('Look for additional income sources or side gigs to accelerate savings');
    } else if (urgency === 'high') {
      recommendations.push('Prioritize building emergency fund over other financial goals temporarily');
      recommendations.push('Review and cut discretionary spending to increase savings rate');
    }
    
    if (currentMonths < recommendedMonths) {
      recommendations.push(`Save an additional $${(recommendedMonths * data.monthlyExpenses - data.currentEmergencyFund).toLocaleString()} to reach your target`);
    }
    
    if (['variable', 'seasonal'].includes(data.incomeStability)) {
      recommendations.push('Consider a larger emergency fund due to income variability');
    }
    
    if (data.industry === 'freelance') {
      recommendations.push('As a freelancer, consider 6-12 months of expenses for income gaps');
    }
    
    if (['basic', 'minimal'].includes(data.insurance)) {
      recommendations.push('Improve insurance coverage to reduce emergency fund pressure');
    }
    
    recommendations.push('Keep emergency fund in high-yield savings account for easy access');
    recommendations.push('Review and update emergency fund target annually as circumstances change');
    
    return recommendations;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function displayResults(analysis, formData) {
    resultContent.innerHTML = `
      <div class="bg-broder p-6 rounded-lg border border-accent">
        <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
          <span class="material-icons text-primary">security</span> 
          Emergency Fund Analysis
        </h3>
        
        <div class="grid md:grid-cols-3 gap-4 mb-6">
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold ${sanitizeText(analysis.statusColor)}">${sanitizeText(analysis.status)}</div>
            <div class="text-sm text-light">Fund Status</div>
          </div>
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold text-primary">${sanitizeText(analysis.recommendedMonths)}</div>
            <div class="text-sm text-light">Recommended Months</div>
          </div>
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold text-accent">${sanitizeText(analysis.currentMonths)}</div>
            <div class="text-sm text-light">Current Months</div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-lg font-medium mb-3 text-text">Current Status</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-light">Monthly Expenses:</span>
                <span class="text-text">$${formData.monthlyExpenses.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Current Emergency Fund:</span>
                <span class="text-text">$${formData.currentEmergencyFund.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Other Accessible Savings:</span>
                <span class="text-text">$${formData.otherSavings.toLocaleString()}</span>
              </div>
              <div class="flex justify-between border-t border-accent pt-2">
                <span class="text-light">Total Accessible:</span>
                <span class="text-text">$${(formData.currentEmergencyFund + formData.otherSavings).toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Total Coverage:</span>
                <span class="text-text">${sanitizeText(analysis.totalMonths)} months</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-medium mb-3 text-text">Recommended Target</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-light">Recommended Amount:</span>
                <span class="text-text">$${analysis.recommendedAmount.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Current Shortfall:</span>
                <span class="text-text ${analysis.shortfall > 0 ? 'text-red-400' : 'text-green-400'}">
                  ${analysis.shortfall > 0 ? '-' : '+'}$${Math.abs(analysis.shortfall).toLocaleString()}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Monthly Savings Needed:</span>
                <span class="text-text">$${analysis.monthlySavingsNeeded.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Time to Target:</span>
                <span class="text-text">${analysis.shortfall > 0 ? '12 months' : 'Target reached'}</span>
              </div>
            </div>
          </div>
        </div>

        ${analysis.riskFactors.length > 0 ? `
        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Identified Risk Factors</h4>
          <div class="space-y-2">
            ${analysis.riskFactors.map(factor => `
              <div class="p-3 bg-dark rounded border border-orange-600 text-sm">
                <div class="flex items-start gap-2">
                  <span class="material-icons text-xs text-orange-400 mt-0.5">warning</span>
                  <span class="text-light">${escapeHtml(factor)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="bg-dark p-4 rounded border border-accent">
          <h4 class="text-lg font-medium mb-3 text-text">Personalized Recommendations</h4>
          <ul class="space-y-2 text-sm text-light">
            ${analysis.recommendations.map(rec => `
              <li class="flex items-start gap-2">
                <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
                ${escapeHtml(rec)}
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="mt-4 p-3 bg-blue-900/20 border border-blue-600 rounded text-sm text-blue-200">
          <strong>Note:</strong> This analysis considers your unique circumstances beyond generic "3-6 months" advice. 
          Your recommended emergency fund is personalized based on job security, industry risk, family situation, 
          health status, and other factors that affect your financial stability.
        </div>
      </div>
    `;

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }
});
