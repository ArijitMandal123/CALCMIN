document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('profitability-form');
  const resultsDiv = document.getElementById('results');
  const resultContent = document.getElementById('result-content');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateProfitability();
  });

  function calculateProfitability() {
    // Get form values
    const projectFee = parseFloat(document.getElementById('projectFee').value) || 0;
    const actualWorkHours = parseFloat(document.getElementById('actualWorkHours').value) || 0;
    const communicationHours = parseFloat(document.getElementById('communicationHours').value) || 0;
    const revisionHours = parseFloat(document.getElementById('revisionHours').value) || 0;
    const adminHours = parseFloat(document.getElementById('adminHours').value) || 0;
    const toolsCost = parseFloat(document.getElementById('toolsCost').value) || 0;
    const subcontractorCost = parseFloat(document.getElementById('subcontractorCost').value) || 0;
    const materialsCost = parseFloat(document.getElementById('materialsCost').value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const platformFee = parseFloat(document.getElementById('platformFee').value) || 0;
    const businessExpenses = parseFloat(document.getElementById('businessExpenses').value) || 0;
    const monthlyHours = parseFloat(document.getElementById('monthlyHours').value) || 120;

    // Calculate total hours
    const totalHours = actualWorkHours + communicationHours + revisionHours + adminHours;

    // Calculate costs
    const platformFeeCost = (projectFee * platformFee) / 100;
    const taxCost = (projectFee * taxRate) / 100;
    const overheadPerHour = businessExpenses / monthlyHours;
    const overheadCost = overheadPerHour * totalHours;
    const directCosts = toolsCost + subcontractorCost + materialsCost;
    const totalCosts = platformFeeCost + taxCost + overheadCost + directCosts;

    // Calculate profit metrics
    const grossProfit = projectFee - totalCosts;
    const netHourlyRate = grossProfit / totalHours;
    const profitMargin = (grossProfit / projectFee) * 100;
    const effectiveHourlyRate = projectFee / totalHours;

    // Determine profitability status
    let profitabilityStatus = '';
    let statusColor = '';
    if (profitMargin >= 40) {
      profitabilityStatus = 'Highly Profitable';
      statusColor = 'text-green-400';
    } else if (profitMargin >= 20) {
      profitabilityStatus = 'Profitable';
      statusColor = 'text-green-300';
    } else if (profitMargin >= 10) {
      profitabilityStatus = 'Marginally Profitable';
      statusColor = 'text-yellow-400';
    } else if (profitMargin > 0) {
      profitabilityStatus = 'Low Profit';
      statusColor = 'text-orange-400';
    } else {
      profitabilityStatus = 'Unprofitable';
      statusColor = 'text-red-400';
    }

    // Generate recommendations
    const recommendations = generateRecommendations(profitMargin, netHourlyRate, totalHours, actualWorkHours);

    // Display results
    resultContent.innerHTML = `
      <div class="bg-broder p-6 rounded-lg border border-accent">
        <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
          <span class="material-icons text-primary">assessment</span> 
          Profitability Analysis
        </h3>
        
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-light">Project Fee:</span>
              <span class="text-text font-medium">$${projectFee.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-light">Total Hours:</span>
              <span class="text-text font-medium">${totalHours.toFixed(1)}h</span>
            </div>
            <div class="flex justify-between">
              <span class="text-light">Total Costs:</span>
              <span class="text-text font-medium">$${totalCosts.toFixed(2)}</span>
            </div>
            <div class="flex justify-between border-t border-accent pt-2">
              <span class="text-light font-medium">Net Profit:</span>
              <span class="text-text font-bold ${grossProfit >= 0 ? 'text-green-400' : 'text-red-400'}">
                $${grossProfit.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-light">Effective Hourly Rate:</span>
              <span class="text-text font-medium">$${effectiveHourlyRate.toFixed(2)}/hr</span>
            </div>
            <div class="flex justify-between">
              <span class="text-light">Net Hourly Rate:</span>
              <span class="text-text font-medium ${netHourlyRate >= 0 ? 'text-green-400' : 'text-red-400'}">
                $${netHourlyRate.toFixed(2)}/hr
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-light">Profit Margin:</span>
              <span class="text-text font-medium ${profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}">
                ${profitMargin.toFixed(1)}%
              </span>
            </div>
            <div class="flex justify-between border-t border-accent pt-2">
              <span class="text-light font-medium">Status:</span>
              <span class="font-bold ${statusColor}">${profitabilityStatus}</span>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Cost Breakdown</h4>
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-light">Platform Fees:</span>
                <span class="text-text">$${platformFeeCost.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Taxes:</span>
                <span class="text-text">$${taxCost.toFixed(2)}</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-light">Overhead:</span>
                <span class="text-text">$${overheadCost.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Direct Costs:</span>
                <span class="text-text">$${directCosts.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Time Breakdown</h4>
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-light">Actual Work:</span>
                <span class="text-text">${actualWorkHours}h (${((actualWorkHours/totalHours)*100).toFixed(1)}%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Communication:</span>
                <span class="text-text">${communicationHours}h (${((communicationHours/totalHours)*100).toFixed(1)}%)</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-light">Revisions:</span>
                <span class="text-text">${revisionHours}h (${((revisionHours/totalHours)*100).toFixed(1)}%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Admin:</span>
                <span class="text-text">${adminHours}h (${((adminHours/totalHours)*100).toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-dark p-4 rounded border border-accent">
          <h4 class="text-lg font-medium mb-3 text-text flex items-center gap-2">
            <span class="material-icons text-accent">lightbulb</span>
            Recommendations
          </h4>
          <ul class="space-y-2 text-sm text-light">
            ${recommendations.map(rec => `<li class="flex items-start gap-2"><span class="material-icons text-xs text-accent mt-0.5">arrow_right</span>${rec}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }

  function generateRecommendations(profitMargin, netHourlyRate, totalHours, actualWorkHours) {
    const recommendations = [];
    
    if (profitMargin < 20) {
      recommendations.push('Consider increasing your project rates by 20-30% to improve profitability');
    }
    
    if (netHourlyRate < 50) {
      recommendations.push('Your net hourly rate is below industry standards. Focus on higher-value clients');
    }
    
    const nonWorkPercentage = ((totalHours - actualWorkHours) / totalHours) * 100;
    if (nonWorkPercentage > 40) {
      recommendations.push('Reduce communication and revision time by setting clearer project boundaries');
    }
    
    if (profitMargin > 40) {
      recommendations.push('Excellent profitability! Consider taking on similar projects or raising rates further');
    }
    
    recommendations.push('Track time more accurately to identify efficiency improvements');
    recommendations.push('Consider offering fixed-price packages to reduce scope creep');
    
    return recommendations;
  }
});