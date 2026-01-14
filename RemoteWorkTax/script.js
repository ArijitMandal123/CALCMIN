// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

document.getElementById('tax-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const employmentType = document.getElementById('employmentType').value;
  const annualIncome = parseFloat(document.getElementById('annualIncome').value);
  const officeSquareFeet = parseFloat(document.getElementById('officeSquareFeet').value);
  const totalHomeSquareFeet = parseFloat(document.getElementById('totalHomeSquareFeet').value);
  const monthlyRentMortgage = parseFloat(document.getElementById('monthlyRentMortgage').value);
  const monthlyUtilities = parseFloat(document.getElementById('monthlyUtilities').value) || 0;
  const computerEquipment = parseFloat(document.getElementById('computerEquipment').value) || 0;
  const furniture = parseFloat(document.getElementById('furniture').value) || 0;
  const internetPhone = parseFloat(document.getElementById('internetPhone').value) || 0;
  const softwareSubscriptions = parseFloat(document.getElementById('softwareSubscriptions').value) || 0;
  const officeSupplies = parseFloat(document.getElementById('officeSupplies').value) || 0;
  const workDaysPerWeek = parseFloat(document.getElementById('workDaysPerWeek').value);
  const businessUsePercentage = parseFloat(document.getElementById('businessUsePercentage').value) / 100;

  // Calculate home office percentage
  const homeOfficePercentage = officeSquareFeet / totalHomeSquareFeet;
  
  // Annual rent/mortgage
  const annualRentMortgage = monthlyRentMortgage * 12;
  const annualUtilities = monthlyUtilities * 12;
  
  // Home office deduction (direct method)
  const directHomeOfficeDeduction = (annualRentMortgage + annualUtilities) * homeOfficePercentage;
  
  // Simplified method (IRS allows $5 per sq ft, max 300 sq ft)
  const simplifiedDeduction = Math.min(officeSquareFeet, 300) * 5;
  
  // Equipment deductions (can be depreciated or Section 179)
  const equipmentDeduction = (computerEquipment + furniture) * businessUsePercentage;
  
  // Operating expenses
  const annualInternetPhone = internetPhone * 12 * businessUsePercentage;
  const operatingExpenses = annualInternetPhone + softwareSubscriptions + officeSupplies;
  
  // Total deductions
  const totalDirectMethod = directHomeOfficeDeduction + equipmentDeduction + operatingExpenses;
  const totalSimplifiedMethod = simplifiedDeduction + equipmentDeduction + operatingExpenses;
  
  // Recommended method
  const recommendedMethod = totalDirectMethod > totalSimplifiedMethod ? 'Direct' : 'Simplified';
  const recommendedDeduction = Math.max(totalDirectMethod, totalSimplifiedMethod);
  
  // Tax savings estimate (assuming 25% effective tax rate)
  const estimatedTaxSavings = recommendedDeduction * 0.25;
  
  // Self-employment tax savings (if applicable)
  let selfEmploymentSavings = 0;
  if (employmentType === 'selfEmployed' || employmentType === 'contractor') {
    selfEmploymentSavings = recommendedDeduction * 0.153; // 15.3% SE tax
  }
  
  const totalSavings = estimatedTaxSavings + selfEmploymentSavings;
  
  // Eligibility check
  const isEligible = employmentType !== 'employee' || workDaysPerWeek >= 5;
  
  displayResults(
    recommendedMethod,
    recommendedDeduction,
    totalDirectMethod,
    totalSimplifiedMethod,
    equipmentDeduction,
    operatingExpenses,
    totalSavings,
    isEligible,
    employmentType
  );
});

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function displayResults(method, total, direct, simplified, equipment, operating, savings, eligible, empType) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');
  
  const eligibilityNote = empType === 'employee' 
    ? '<div class="bg-red-900/30 border border-red-500 rounded p-3 text-sm mb-4"><strong>⚠️ Note:</strong> W-2 employees generally cannot deduct home office expenses under current tax law (TCJA 2017-2025). These calculations are for informational purposes.</div>'
    : '';
  
  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">receipt_long</span> Tax Deduction Results
      </h2>
      
      ${sanitizeText(eligibilityNote)}
      
      <div class="bg-dark p-4 rounded mb-4">
        <div class="text-center">
          <div class="text-primary text-4xl md:text-5xl font-bold mb-2">$${total.toFixed(2)}</div>
          <div class="text-light text-sm">Total Annual Deductions (${escapeHtml(method)} Method)</div>
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="bg-dark p-3 rounded">
          <div class="text-accent text-sm mb-1">Estimated Tax Savings</div>
          <div class="text-text text-xl font-medium">$${savings.toFixed(2)}</div>
        </div>
        <div class="bg-dark p-3 rounded">
          <div class="text-accent text-sm mb-1">Recommended Method</div>
          <div class="text-text text-xl font-medium">${escapeHtml(method)}</div>
        </div>
      </div>
      
      <div class="bg-dark p-4 rounded mb-4">
        <h3 class="text-text font-medium mb-3">Deduction Breakdown</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-light">Direct Method Total:</span><span class="text-text font-medium">$${direct.toFixed(2)}</span></div>
          <div class="flex justify-between"><span class="text-light">Simplified Method Total:</span><span class="text-text font-medium">$${simplified.toFixed(2)}</span></div>
          <div class="flex justify-between border-t border-accent pt-2 mt-2"><span class="text-light">Equipment Deduction:</span><span class="text-text font-medium">$${equipment.toFixed(2)}</span></div>
          <div class="flex justify-between"><span class="text-light">Operating Expenses:</span><span class="text-text font-medium">$${operating.toFixed(2)}</span></div>
        </div>
      </div>
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>📋 Important Notes:</strong>
        <ul class="mt-2 space-y-1 text-light">
          <li>• Keep detailed records and receipts for all expenses</li>
          <li>• Home office must be used regularly and exclusively for business</li>
          <li>• Equipment over $2,500 may need to be depreciated</li>
          <li>• Consult a tax professional for personalized advice</li>
          <li>• Tax laws vary by state and change frequently</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

