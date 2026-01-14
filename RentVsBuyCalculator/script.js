// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rent-buy-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        if (validateInputs(formData)) {
            const results = calculateRentVsBuy(formData);
            displayResults(results);
        }
    });
});

function collectFormData() {
    return {
        homePrice: parseFloat(document.getElementById('homePrice').value) || 0,
        monthlyRent: parseFloat(document.getElementById('monthlyRent').value) || 0,
        downPayment: parseFloat(document.getElementById('downPayment').value) || 0,
        mortgageRate: parseFloat(document.getElementById('mortgageRate').value) || 0,
        propertyTax: parseFloat(document.getElementById('propertyTax').value) || 0,
        insurance: parseFloat(document.getElementById('insurance').value) || 0,
        maintenance: parseFloat(document.getElementById('maintenance').value) || 0,
        hoaFees: parseFloat(document.getElementById('hoaFees').value) || 0,
        closingCosts: parseFloat(document.getElementById('closingCosts').value) || 0,
        yearsToStay: parseInt(document.getElementById('yearsToStay').value) || 0,
        appreciationRate: parseFloat(document.getElementById('appreciationRate').value) || 0,
        investmentReturn: parseFloat(document.getElementById('investmentReturn').value) || 0,
        taxBracket: parseFloat(document.getElementById('taxBracket').value) || 0,
        rentIncrease: parseFloat(document.getElementById('rentIncrease').value) || 0
    };
}

function validateInputs(data) {
    if (data.homePrice <= 0) {
        showPopup('Please enter a valid home price');
        return false;
    }
    if (data.monthlyRent <= 0) {
        showPopup('Please enter a valid monthly rent amount');
        return false;
    }
    if (data.downPayment < 0) {
        showPopup('Down payment cannot be negative');
        return false;
    }
    if (data.mortgageRate <= 0 || data.mortgageRate > 20) {
        showPopup('Please enter a valid mortgage rate (0.1% - 20%)');
        return false;
    }
    if (data.yearsToStay <= 0 || data.yearsToStay > 30) {
        showPopup('Please enter a valid time period (1-30 years)');
        return false;
    }
    return true;
}

function calculateRentVsBuy(data) {
    // Calculate loan amount and monthly payment
    const loanAmount = data.homePrice - data.downPayment;
    const monthlyRate = data.mortgageRate / 100 / 12;
    const numPayments = data.yearsToStay * 12;
    
    let monthlyMortgage = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
        monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                         (Math.pow(1 + monthlyRate, numPayments) - 1);
    }
    
    // Calculate PMI if down payment is less than 20%
    const downPaymentPercent = (data.downPayment / data.homePrice) * 100;
    const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * 0.005) / 12 : 0;
    
    // Monthly ownership costs
    const monthlyPropertyTax = data.propertyTax / 12;
    const monthlyInsurance = data.insurance / 12;
    const monthlyMaintenance = data.maintenance / 12;
    const totalMonthlyOwnership = monthlyMortgage + monthlyPropertyTax + monthlyInsurance + 
                                 monthlyMaintenance + data.hoaFees + monthlyPMI;
    
    // Calculate total costs over time period
    const totalOwnershipCosts = (totalMonthlyOwnership * numPayments) + data.closingCosts + data.downPayment;
    
    // Calculate home value at end of period
    const futureHomeValue = data.homePrice * Math.pow(1 + data.appreciationRate / 100, data.yearsToStay);
    
    // Calculate remaining mortgage balance
    let remainingBalance = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
        remainingBalance = loanAmount * Math.pow(1 + monthlyRate, numPayments) - 
                          monthlyMortgage * (Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate;
    }
    
    // Calculate selling costs (typically 6-8% of home value)
    const sellingCosts = futureHomeValue * 0.07;
    
    // Net proceeds from sale
    const netProceeds = futureHomeValue - remainingBalance - sellingCosts;
    
    // Total net cost of buying
    const netBuyingCost = totalOwnershipCosts - netProceeds;
    
    // Calculate tax benefits
    const annualInterestPaid = monthlyMortgage * 12 - (loanAmount / data.yearsToStay);
    const annualTaxDeduction = (annualInterestPaid + data.propertyTax) * (data.taxBracket / 100);
    const totalTaxSavings = annualTaxDeduction * data.yearsToStay;
    
    // Adjusted net buying cost
    const adjustedBuyingCost = netBuyingCost - totalTaxSavings;
    
    // Calculate renting costs
    let totalRentCost = 0;
    let currentRent = data.monthlyRent;
    for (let year = 1; year <= data.yearsToStay; year++) {
        totalRentCost += currentRent * 12;
        currentRent *= (1 + data.rentIncrease / 100);
    }
    
    // Add renter's insurance and moving costs
    const rentersInsurance = 200 * data.yearsToStay; // $200/year typical
    const movingCosts = 2000 * Math.floor(data.yearsToStay / 3); // Move every 3 years
    totalRentCost += rentersInsurance + movingCosts;
    
    // Calculate opportunity cost of down payment
    const opportunityCost = data.downPayment * Math.pow(1 + data.investmentReturn / 100, data.yearsToStay) - data.downPayment;
    
    // Total cost of renting (including opportunity cost)
    const totalRentingCost = totalRentCost + opportunityCost;
    
    // Calculate difference
    const difference = totalRentingCost - adjustedBuyingCost;
    const monthlyDifference = difference / numPayments;
    
    // Calculate breakeven point
    let breakevenYears = 0;
    for (let years = 1; years <= 30; years++) {
        const tempBuyingCost = calculateBuyingCostForYears(data, years);
        const tempRentingCost = calculateRentingCostForYears(data, years);
        if (tempBuyingCost <= tempRentingCost) {
            breakevenYears = years;
            break;
        }
    }
    
    return {
        buyingCosts: {
            monthlyPayment: totalMonthlyOwnership,
            totalCost: adjustedBuyingCost,
            downPayment: data.downPayment,
            closingCosts: data.closingCosts,
            taxSavings: totalTaxSavings,
            netProceeds: netProceeds,
            futureHomeValue: futureHomeValue
        },
        rentingCosts: {
            initialRent: data.monthlyRent,
            totalCost: totalRentingCost,
            opportunityCost: opportunityCost,
            finalRent: currentRent / (1 + data.rentIncrease / 100)
        },
        comparison: {
            difference: difference,
            monthlyDifference: monthlyDifference,
            breakevenYears: breakevenYears,
            recommendation: difference > 0 ? 'buying' : 'renting',
            yearsAnalyzed: data.yearsToStay
        }
    };
}

function calculateBuyingCostForYears(data, years) {
    const loanAmount = data.homePrice - data.downPayment;
    const monthlyRate = data.mortgageRate / 100 / 12;
    const numPayments = years * 12;
    
    let monthlyMortgage = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
        monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                         (Math.pow(1 + monthlyRate, numPayments) - 1);
    }
    
    const downPaymentPercent = (data.downPayment / data.homePrice) * 100;
    const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * 0.005) / 12 : 0;
    
    const monthlyPropertyTax = data.propertyTax / 12;
    const monthlyInsurance = data.insurance / 12;
    const monthlyMaintenance = data.maintenance / 12;
    const totalMonthlyOwnership = monthlyMortgage + monthlyPropertyTax + monthlyInsurance + 
                                 monthlyMaintenance + data.hoaFees + monthlyPMI;
    
    const totalOwnershipCosts = (totalMonthlyOwnership * numPayments) + data.closingCosts + data.downPayment;
    
    const futureHomeValue = data.homePrice * Math.pow(1 + data.appreciationRate / 100, years);
    
    let remainingBalance = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
        remainingBalance = loanAmount * Math.pow(1 + monthlyRate, numPayments) - 
                          monthlyMortgage * (Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate;
    }
    
    const sellingCosts = futureHomeValue * 0.07;
    const netProceeds = futureHomeValue - remainingBalance - sellingCosts;
    
    const annualInterestPaid = monthlyMortgage * 12 - (loanAmount / years);
    const annualTaxDeduction = (annualInterestPaid + data.propertyTax) * (data.taxBracket / 100);
    const totalTaxSavings = annualTaxDeduction * years;
    
    return totalOwnershipCosts - netProceeds - totalTaxSavings;
}

function calculateRentingCostForYears(data, years) {
    let totalRentCost = 0;
    let currentRent = data.monthlyRent;
    for (let year = 1; year <= years; year++) {
        totalRentCost += currentRent * 12;
        currentRent *= (1 + data.rentIncrease / 100);
    }
    
    const rentersInsurance = 200 * years;
    const movingCosts = 2000 * Math.floor(years / 3);
    totalRentCost += rentersInsurance + movingCosts;
    
    const opportunityCost = data.downPayment * Math.pow(1 + data.investmentReturn / 100, years) - data.downPayment;
    
    return totalRentCost + opportunityCost;
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    // Sanitize recommendation to prevent code injection
    const recommendation = results.comparison.recommendation === 'buying' ? 'buying' : 'renting';
    const savingsAmount = Math.abs(results.comparison.difference);
    const monthlySavings = Math.abs(results.comparison.monthlyDifference);
    
    contentDiv.innerHTML = `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">Rent vs Buy Analysis Results</h3>
            
            <div class="bg-${recommendation === 'buying' ? 'green' : 'blue'}-900/20 border border-${recommendation === 'buying' ? 'green' : 'blue'}-600 rounded p-6 mb-6">
                <h4 class="text-xl font-bold text-${recommendation === 'buying' ? 'green' : 'blue'}-400 mb-2">
                    Recommendation: ${recommendation === 'buying' ? 'Buying' : 'Renting'} is Better
                </h4>
                <p class="text-light">
                    ${recommendation === 'buying' ? 'Buying' : 'Renting'} will save you approximately 
                    <span class="font-bold text-${recommendation === 'buying' ? 'green' : 'blue'}-400">$${savingsAmount.toLocaleString()}</span> 
                    over ${sanitizeText(results.comparison.yearsAnalyzed)} years 
                    (about $${monthlySavings.toLocaleString()}/month).
                </p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-xl font-bold text-primary mb-4">Buying Costs</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-light">Monthly Payment:</span>
                            <span class="font-semibold">$${results.buyingCosts.monthlyPayment.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Down Payment:</span>
                            <span class="font-semibold">$${results.buyingCosts.downPayment.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Closing Costs:</span>
                            <span class="font-semibold">$${results.buyingCosts.closingCosts.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Tax Savings:</span>
                            <span class="font-semibold text-green-400">-$${results.buyingCosts.taxSavings.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Net Sale Proceeds:</span>
                            <span class="font-semibold text-green-400">-$${results.buyingCosts.netProceeds.toLocaleString()}</span>
                        </div>
                        <hr class="border-accent">
                        <div class="flex justify-between text-lg font-bold">
                            <span>Total Net Cost:</span>
                            <span class="text-primary">$${results.buyingCosts.totalCost.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-xl font-bold text-primary mb-4">Renting Costs</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-light">Initial Monthly Rent:</span>
                            <span class="font-semibold">$${results.rentingCosts.initialRent.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Final Monthly Rent:</span>
                            <span class="font-semibold">$${results.rentingCosts.finalRent.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Opportunity Cost:</span>
                            <span class="font-semibold">$${results.rentingCosts.opportunityCost.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Insurance & Moving:</span>
                            <span class="font-semibold">$${(results.rentingCosts.totalCost - results.rentingCosts.opportunityCost - (results.rentingCosts.initialRent * 12 * results.comparison.yearsAnalyzed)).toLocaleString()}</span>
                        </div>
                        <hr class="border-accent">
                        <div class="flex justify-between text-lg font-bold">
                            <span>Total Cost:</span>
                            <span class="text-primary">$${results.rentingCosts.totalCost.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-4 mb-6">
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <h5 class="font-semibold text-accent mb-2">Breakeven Point</h5>
                    <p class="text-2xl font-bold text-primary">
                        ${results.comparison.breakevenYears > 0 ? results.comparison.breakevenYears + ' years' : 'Never'}
                    </p>
                    <p class="text-sm text-light">When buying becomes better</p>
                </div>
                
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <h5 class="font-semibold text-accent mb-2">Future Home Value</h5>
                    <p class="text-2xl font-bold text-primary">$${results.buyingCosts.futureHomeValue.toLocaleString()}</p>
                    <p class="text-sm text-light">Estimated value after ${sanitizeText(results.comparison.yearsAnalyzed)} years</p>
                </div>
                
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <h5 class="font-semibold text-accent mb-2">Monthly Difference</h5>
                    <p class="text-2xl font-bold text-primary">$${monthlySavings.toLocaleString()}</p>
                    <p class="text-sm text-light">${recommendation === 'buying' ? 'Buying' : 'Renting'} saves per month</p>
                </div>
            </div>
            
            <div class="bg-yellow-900/20 border border-yellow-600 rounded p-4">
                <h5 class="font-semibold text-yellow-400 mb-2">Important Considerations</h5>
                <ul class="text-sm text-light space-y-1">
                    <li>• This analysis assumes you invest the down payment difference when renting</li>
                    <li>• Actual costs may vary based on market conditions and personal circumstances</li>
                    <li>• Consider non-financial factors like stability, flexibility, and lifestyle preferences</li>
                    <li>• Consult with financial and real estate professionals for personalized advice</li>
                </ul>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showPopup(message) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'bg-broder border border-accent rounded-lg p-6 max-w-md mx-4';
    popup.innerHTML = `
        <div class="flex items-center mb-4">
            <span class="material-icons text-primary mr-2">info</span>
            <h3 class="text-lg font-semibold text-primary">Input Validation</h3>
        </div>
        <p class="text-light mb-4">${escapeHtml(message)}</p>
        <button class="w-full bg-primary hover:bg-accent text-white font-medium py-2 px-4 rounded transition duration-200 close-popup-btn">
            OK
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Add event listener safely
    const closeBtn = popup.querySelector('.close-popup-btn');
    closeBtn.addEventListener('click', () => {
        overlay.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 5000);
}
