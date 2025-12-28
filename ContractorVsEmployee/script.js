document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('comparison-form');
  const resultsDiv = document.getElementById('results');
  const resultContent = document.getElementById('result-content');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateCosts();
  });

  function calculateCosts() {
    // Get form values
    const annualSalary = parseFloat(document.getElementById('annualSalary').value) || 0;
    const contractorRate = parseFloat(document.getElementById('contractorRate').value) || 0;
    const hoursPerWeek = parseFloat(document.getElementById('hoursPerWeek').value) || 40;
    const healthInsurance = parseFloat(document.getElementById('healthInsurance').value) || 0;
    const retirement401k = parseFloat(document.getElementById('retirement401k').value) || 0;
    const paidTimeOff = parseFloat(document.getElementById('paidTimeOff').value) || 0;
    const otherBenefits = parseFloat(document.getElementById('otherBenefits').value) || 0;
    const payrollTax = parseFloat(document.getElementById('payrollTax').value) || 7.65;
    const unemploymentTax = parseFloat(document.getElementById('unemploymentTax').value) || 3.5;
    const workersComp = parseFloat(document.getElementById('workersComp').value) || 1.5;
    const officeSpace = parseFloat(document.getElementById('officeSpace').value) || 0;
    const equipment = parseFloat(document.getElementById('equipment').value) || 0;
    const training = parseFloat(document.getElementById('training').value) || 0;
    const hrOverhead = parseFloat(document.getElementById('hrOverhead').value) || 0;

    // Calculate annual hours
    const annualHours = hoursPerWeek * 52;
    const workingDaysPerYear = 260; // Assuming 5 days/week * 52 weeks
    const ptoValue = (annualSalary / workingDaysPerYear) * paidTimeOff;

    // Employee Costs
    const employeeBenefitsCost = (healthInsurance * 12) + (annualSalary * retirement401k / 100) + ptoValue + (otherBenefits * 12);
    const employeeTaxesCost = annualSalary * (payrollTax + unemploymentTax + workersComp) / 100;
    const employeeOverheadCost = (officeSpace * 12) + (equipment * 12) + training + (hrOverhead * 12);
    const totalEmployeeCost = annualSalary + employeeBenefitsCost + employeeTaxesCost + employeeOverheadCost;

    // Contractor Costs
    const contractorAnnualCost = contractorRate * annualHours;
    const contractorOverheadCost = (equipment * 12 * 0.3); // Reduced equipment cost for contractors
    const totalContractorCost = contractorAnnualCost + contractorOverheadCost;

    // Cost difference
    const costDifference = totalEmployeeCost - totalContractorCost;
    const percentageDifference = ((Math.abs(costDifference) / Math.min(totalEmployeeCost, totalContractorCost)) * 100);

    // Hourly rates
    const employeeEffectiveHourlyRate = totalEmployeeCost / annualHours;
    const contractorEffectiveHourlyRate = totalContractorCost / annualHours;

    // Determine recommendation
    let recommendation = '';
    let recommendationColor = '';
    if (costDifference > 10000) {
      recommendation = 'Contractor is significantly more cost-effective';
      recommendationColor = 'text-green-400';
    } else if (costDifference > 5000) {
      recommendation = 'Contractor is more cost-effective';
      recommendationColor = 'text-green-300';
    } else if (costDifference > -5000) {
      recommendation = 'Costs are similar - consider other factors';
      recommendationColor = 'text-yellow-400';
    } else if (costDifference > -10000) {
      recommendation = 'Employee is more cost-effective';
      recommendationColor = 'text-orange-400';
    } else {
      recommendation = 'Employee is significantly more cost-effective';
      recommendationColor = 'text-red-400';
    }

    // Generate insights
    const insights = generateInsights(totalEmployeeCost, totalContractorCost, annualSalary, contractorRate, hoursPerWeek);

    // Display results
    resultContent.innerHTML = `
      <div class="bg-broder p-6 rounded-lg border border-accent">
        <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
          <span class="material-icons text-primary">assessment</span> 
          Cost Comparison Analysis
        </h3>
        
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div class="bg-dark p-4 rounded border border-accent">
            <h4 class="text-lg font-medium mb-3 text-text flex items-center gap-2">
              <span class="material-icons text-blue-400">person</span> Full-Time Employee
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-light">Base Salary:</span>
                <span class="text-text">$${annualSalary.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Benefits:</span>
                <span class="text-text">$${employeeBenefitsCost.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Taxes:</span>
                <span class="text-text">$${employeeTaxesCost.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Overhead:</span>
                <span class="text-text">$${employeeOverheadCost.toLocaleString()}</span>
              </div>
              <div class="flex justify-between border-t border-accent pt-2 font-medium">
                <span class="text-light">Total Annual Cost:</span>
                <span class="text-text">$${totalEmployeeCost.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Effective Hourly Rate:</span>
                <span class="text-text">$${employeeEffectiveHourlyRate.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-dark p-4 rounded border border-accent">
            <h4 class="text-lg font-medium mb-3 text-text flex items-center gap-2">
              <span class="material-icons text-green-400">business_center</span> Contractor
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-light">Hourly Rate:</span>
                <span class="text-text">$${contractorRate}/hour</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Annual Hours:</span>
                <span class="text-text">${annualHours.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Labor Cost:</span>
                <span class="text-text">$${contractorAnnualCost.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Overhead:</span>
                <span class="text-text">$${contractorOverheadCost.toLocaleString()}</span>
              </div>
              <div class="flex justify-between border-t border-accent pt-2 font-medium">
                <span class="text-light">Total Annual Cost:</span>
                <span class="text-text">$${totalContractorCost.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Effective Hourly Rate:</span>
                <span class="text-text">$${contractorEffectiveHourlyRate.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-dark p-4 rounded border border-accent mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Cost Difference Analysis</h4>
          <div class="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold ${costDifference >= 0 ? 'text-green-400' : 'text-red-400'}">
                ${costDifference >= 0 ? '+' : ''}$${Math.abs(costDifference).toLocaleString()}
              </div>
              <div class="text-xs text-light">Annual Difference</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-accent">
                ${percentageDifference.toFixed(1)}%
              </div>
              <div class="text-xs text-light">Cost Difference</div>
            </div>
            <div>
              <div class="text-sm font-medium ${recommendationColor}">
                ${recommendation}
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Cost Breakdown</h4>
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 class="font-medium text-text mb-2">Employee Costs</h5>
              <div class="space-y-1">
                <div class="flex justify-between">
                  <span class="text-light">Salary (${((annualSalary/totalEmployeeCost)*100).toFixed(1)}%):</span>
                  <span class="text-text">$${annualSalary.toLocaleString()}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-light">Benefits (${((employeeBenefitsCost/totalEmployeeCost)*100).toFixed(1)}%):</span>
                  <span class="text-text">$${employeeBenefitsCost.toLocaleString()}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-light">Taxes (${((employeeTaxesCost/totalEmployeeCost)*100).toFixed(1)}%):</span>
                  <span class="text-text">$${employeeTaxesCost.toLocaleString()}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-light">Overhead (${((employeeOverheadCost/totalEmployeeCost)*100).toFixed(1)}%):</span>
                  <span class="text-text">$${employeeOverheadCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 class="font-medium text-text mb-2">Contractor Costs</h5>
              <div class="space-y-1">
                <div class="flex justify-between">
                  <span class="text-light">Labor (${((contractorAnnualCost/totalContractorCost)*100).toFixed(1)}%):</span>
                  <span class="text-text">$${contractorAnnualCost.toLocaleString()}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-light">Overhead (${((contractorOverheadCost/totalContractorCost)*100).toFixed(1)}%):</span>
                  <span class="text-text">$${contractorOverheadCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-dark p-4 rounded border border-accent">
          <h4 class="text-lg font-medium mb-3 text-text flex items-center gap-2">
            <span class="material-icons text-accent">lightbulb</span>
            Key Insights & Recommendations
          </h4>
          <ul class="space-y-2 text-sm text-light">
            ${insights.map(insight => `<li class="flex items-start gap-2"><span class="material-icons text-xs text-accent mt-0.5">arrow_right</span>${insight}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }

  function generateInsights(employeeCost, contractorCost, salary, contractorRate, hoursPerWeek) {
    const insights = [];
    const costDiff = employeeCost - contractorCost;
    
    if (Math.abs(costDiff) < 5000) {
      insights.push('Costs are very similar - consider non-financial factors like control, commitment, and expertise');
    }
    
    if (contractorRate > (salary / 2080) * 1.5) {
      insights.push('Contractor rate is significantly higher than employee equivalent - consider if specialized skills justify the premium');
    }
    
    if (hoursPerWeek < 30) {
      insights.push('For part-time work, contractors often provide better flexibility and cost efficiency');
    } else if (hoursPerWeek >= 40) {
      insights.push('For full-time work, employees may provide better long-term value and commitment');
    }
    
    if (employeeCost > contractorCost) {
      insights.push('Consider contractor for short-term projects or specialized skills');
      insights.push('Employee benefits and taxes add significant overhead to base salary');
    } else {
      insights.push('Employee provides better long-term value when including all contractor overhead costs');
      insights.push('Consider employee for core business functions requiring ongoing commitment');
    }
    
    insights.push('Factor in management time, training needs, and intellectual property considerations');
    insights.push('Contractors offer flexibility but employees provide stability and cultural alignment');
    
    return insights;
  }
});