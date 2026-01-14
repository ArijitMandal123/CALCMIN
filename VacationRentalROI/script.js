// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('rental-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const downPaymentPct = parseFloat(document.getElementById('downPayment').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTerm = parseFloat(document.getElementById('loanTerm').value);
    const nightlyRate = parseFloat(document.getElementById('nightlyRate').value);
    const occupancyRate = parseFloat(document.getElementById('occupancyRate').value);
    const cleaningCost = parseFloat(document.getElementById('cleaningCost').value);
    const managementFee = parseFloat(document.getElementById('managementFee').value);
    const propertyTax = parseFloat(document.getElementById('propertyTax').value);
    const insurance = parseFloat(document.getElementById('insurance').value);
    const utilities = parseFloat(document.getElementById('utilities').value);
    const maintenance = parseFloat(document.getElementById('maintenance').value);
    
    const downPaymentAmount = purchasePrice * (downPaymentPct / 100);
    const loanAmount = purchasePrice - downPaymentAmount;
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = loanTerm * 12;
    const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const occupiedNights = 365 * (occupancyRate / 100);
    const avgStayLength = 3;
    const numStays = occupiedNights / avgStayLength;
    const annualRevenue = nightlyRate * occupiedNights;
    
    const annualCleaningCost = cleaningCost * numStays;
    const managementFeeAmount = annualRevenue * (managementFee / 100);
    const annualUtilities = utilities * 12;
    const annualMortgage = monthlyMortgage * 12;
    
    const totalExpenses = annualMortgage + annualCleaningCost + managementFeeAmount + propertyTax + insurance + annualUtilities + maintenance;
    const netIncome = annualRevenue - totalExpenses;
    const cashOnCash = (netIncome / downPaymentAmount) * 100;
    const capRate = ((annualRevenue - (totalExpenses - annualMortgage)) / purchasePrice) * 100;
    
    const resultHTML = `
      <div class="bg-broder p-4 md:p-6 rounded-lg border-l-4 border-primary">
        <h3 class="text-xl text-primary mb-4 flex items-center gap-2"><span class="material-icons">analytics</span> Profitability Analysis</h3>
        <div class="grid gap-4 text-text text-sm md:text-base">
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">trending_up</span><strong>Annual Revenue:</strong></div>
            <p class="text-2xl text-primary font-bold ml-8">$${annualRevenue.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
            <p class="text-sm text-light ml-8">${occupiedNights.toFixed(0)} nights occupied @ $${sanitizeText(nightlyRate)}/night</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">receipt_long</span><strong>Annual Expenses:</strong></div>
            <p class="text-2xl text-accent font-bold ml-8">$${totalExpenses.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
            <ul class="text-sm text-light ml-8 mt-2 space-y-1">
              <li>Mortgage: $${annualMortgage.toLocaleString('en-US', {maximumFractionDigits: 0})}</li>
              <li>Cleaning: $${annualCleaningCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</li>
              <li>Management: $${managementFeeAmount.toLocaleString('en-US', {maximumFractionDigits: 0})}</li>
              <li>Property Tax: $${propertyTax.toLocaleString('en-US', {maximumFractionDigits: 0})}</li>
              <li>Insurance: $${insurance.toLocaleString('en-US', {maximumFractionDigits: 0})}</li>
              <li>Utilities: $${annualUtilities.toLocaleString('en-US', {maximumFractionDigits: 0})}</li>
              <li>Maintenance: $${maintenance.toLocaleString('en-US', {maximumFractionDigits: 0})}</li>
            </ul>
          </div>
          
          <div class="bg-dark p-4 rounded border-2 border-primary">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-primary">account_balance_wallet</span><strong>Net Annual Income:</strong></div>
            <p class="text-3xl ${netIncome >= 0 ? 'text-primary' : 'text-red-500'} font-bold ml-8">$${netIncome.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
            <p class="text-sm text-light ml-8">$${(netIncome / 12).toLocaleString('en-US', {maximumFractionDigits: 0})}/month</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">percent</span><strong>Cash-on-Cash ROI:</strong></div>
            <p class="text-2xl ${cashOnCash >= 0 ? 'text-primary' : 'text-red-500'} font-bold ml-8">${cashOnCash.toFixed(2)}%</p>
            <p class="text-sm text-light ml-8">Based on $${downPaymentAmount.toLocaleString('en-US', {maximumFractionDigits: 0})} down payment</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">show_chart</span><strong>Cap Rate:</strong></div>
            <p class="text-2xl text-primary font-bold ml-8">${capRate.toFixed(2)}%</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">tips_and_updates</span><strong>Investment Insights:</strong></div>
            <ul class="ml-8 space-y-2 list-disc list-inside text-sm">
              ${cashOnCash >= 8 ? '<li class="text-green-400">Strong cash-on-cash return (8%+ is good)</li>' : '<li class="text-yellow-400">Consider improving occupancy or reducing costs</li>'}
              ${capRate >= 5 ? '<li class="text-green-400">Healthy cap rate for vacation rentals</li>' : '<li class="text-yellow-400">Cap rate below typical vacation rental average</li>'}
              ${occupancyRate >= 60 ? '<li class="text-green-400">Good occupancy rate</li>' : '<li class="text-yellow-400">Occupancy could be improved with better marketing</li>'}
              <li>Break-even occupancy: ${((totalExpenses / (nightlyRate * 365)) * 100).toFixed(1)}%</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('result-content').innerHTML = resultHTML;
  });
});

