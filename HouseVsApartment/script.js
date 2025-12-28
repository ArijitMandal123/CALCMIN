document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('housing-form').addEventListener('submit', compareHousingCosts);
});

function compareHousingCosts(e) {
    e.preventDefault();
    
    const data = collectFormData();
    const analysis = analyzeHousingCosts(data);
    displayResults(analysis);
}

function collectFormData() {
    return {
        housePrice: parseInt(document.getElementById('housePrice').value),
        downPayment: parseInt(document.getElementById('downPayment').value),
        interestRate: parseFloat(document.getElementById('interestRate').value),
        loanTerm: parseInt(document.getElementById('loanTerm').value),
        propertyTax: parseInt(document.getElementById('propertyTax').value),
        homeInsurance: parseInt(document.getElementById('homeInsurance').value),
        monthlyRent: parseInt(document.getElementById('monthlyRent').value),
        rentIncrease: parseFloat(document.getElementById('rentIncrease').value),
        securityDeposit: parseInt(document.getElementById('securityDeposit').value),
        rentersInsurance: parseInt(document.getElementById('rentersInsurance').value),
        houseUtilities: parseInt(document.getElementById('houseUtilities').value),
        apartmentUtilities: parseInt(document.getElementById('apartmentUtilities').value),
        maintenanceCost: parseInt(document.getElementById('maintenanceCost').value),
        hoaFees: parseInt(document.getElementById('hoaFees').value) || 0,
        homeAppreciation: parseFloat(document.getElementById('homeAppreciation').value),
        investmentReturn: parseFloat(document.getElementById('investmentReturn').value),
        timeHorizon: parseInt(document.getElementById('timeHorizon').value),
        taxBracket: parseFloat(document.getElementById('taxBracket').value),
        maintenanceTime: parseInt(document.getElementById('maintenanceTime').value),
        hourlyValue: parseInt(document.getElementById('hourlyValue').value),
        lifestyle: document.getElementById('lifestyle').value
    };
}

function analyzeHousingCosts(data) {
    // Calculate house costs
    const houseCosts = calculateHouseCosts(data);
    
    // Calculate apartment costs
    const apartmentCosts = calculateApartmentCosts(data);
    
    // Calculate opportunity costs
    const opportunityCosts = calculateOpportunityCosts(data);
    
    // Calculate lifestyle factors
    const lifestyleFactors = calculateLifestyleFactors(data);
    
    // Generate recommendations
    const recommendations = generateRecommendations(data, houseCosts, apartmentCosts, opportunityCosts);
    
    return {
        houseCosts,
        apartmentCosts,
        opportunityCosts,
        lifestyleFactors,
        recommendations,
        timeHorizon: data.timeHorizon
    };
}

function calculateHouseCosts(data) {
    const loanAmount = data.housePrice - data.downPayment;
    const monthlyRate = data.interestRate / 100 / 12;
    const numPayments = data.loanTerm * 12;
    
    // Monthly mortgage payment
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Monthly costs
    const monthlyPropertyTax = data.propertyTax / 12;
    const monthlyInsurance = data.homeInsurance / 12;
    const monthlyMaintenance = data.maintenanceCost / 12;
    const monthlyTotal = monthlyPayment + monthlyPropertyTax + monthlyInsurance + 
                        data.houseUtilities + monthlyMaintenance + data.hoaFees;
    
    // Calculate costs over time horizon
    const totalPayments = monthlyTotal * 12 * data.timeHorizon;
    const principalPaid = calculatePrincipalPaid(loanAmount, monthlyRate, numPayments, data.timeHorizon);
    const interestPaid = (monthlyPayment * 12 * data.timeHorizon) - principalPaid;
    
    // Tax benefits
    const annualInterest = interestPaid / data.timeHorizon;
    const taxSavings = (annualInterest + data.propertyTax) * (data.taxBracket / 100) * data.timeHorizon;
    
    // Home appreciation
    const futureValue = data.housePrice * Math.pow(1 + data.homeAppreciation / 100, data.timeHorizon);
    const equity = principalPaid + (futureValue - data.housePrice);
    
    // Closing costs (estimated)
    const closingCosts = data.housePrice * 0.03;
    const sellingCosts = futureValue * 0.06;
    
    const netCost = data.downPayment + totalPayments + closingCosts + sellingCosts - equity - taxSavings;
    
    return {
        monthlyPayment: Math.round(monthlyPayment),
        monthlyTotal: Math.round(monthlyTotal),
        totalPayments: Math.round(totalPayments),
        principalPaid: Math.round(principalPaid),
        interestPaid: Math.round(interestPaid),
        taxSavings: Math.round(taxSavings),
        equity: Math.round(equity),
        closingCosts: Math.round(closingCosts),
        sellingCosts: Math.round(sellingCosts),
        netCost: Math.round(netCost),
        futureValue: Math.round(futureValue)
    };
}

function calculatePrincipalPaid(loanAmount, monthlyRate, numPayments, years) {
    let balance = loanAmount;
    let principalPaid = 0;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    for (let month = 1; month <= years * 12; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        principalPaid += principalPayment;
        balance -= principalPayment;
        
        if (balance <= 0) break;
    }
    
    return principalPaid;
}

function calculateApartmentCosts(data) {
    let totalRent = 0;
    let currentRent = data.monthlyRent;
    
    // Calculate rent with annual increases
    for (let year = 0; year < data.timeHorizon; year++) {
        totalRent += currentRent * 12;
        currentRent *= (1 + data.rentIncrease / 100);
    }
    
    const totalUtilities = data.apartmentUtilities * 12 * data.timeHorizon;
    const totalInsurance = data.rentersInsurance * data.timeHorizon;
    
    // Security deposit (returned at end, so not included in net cost)
    const netCost = totalRent + totalUtilities + totalInsurance;
    
    return {
        monthlyRent: data.monthlyRent,
        totalRent: Math.round(totalRent),
        totalUtilities: Math.round(totalUtilities),
        totalInsurance: Math.round(totalInsurance),
        netCost: Math.round(netCost),
        finalRent: Math.round(currentRent)
    };
}

function calculateOpportunityCosts(data) {
    // Opportunity cost of down payment invested
    const downPaymentGrowth = data.downPayment * Math.pow(1 + data.investmentReturn / 100, data.timeHorizon);
    const opportunityCost = downPaymentGrowth - data.downPayment;
    
    // Difference in monthly costs invested
    const houseMonthlyCost = data.housePrice > 0 ? 
        (data.housePrice - data.downPayment) * (data.interestRate / 100 / 12) + 
        (data.propertyTax + data.homeInsurance + data.maintenanceCost) / 12 + 
        data.houseUtilities + data.hoaFees : 0;
    
    const apartmentMonthlyCost = data.monthlyRent + data.apartmentUtilities + data.rentersInsurance / 12;
    
    let monthlyDifference = 0;
    let investedDifference = 0;
    
    if (houseMonthlyCost > apartmentMonthlyCost) {
        monthlyDifference = houseMonthlyCost - apartmentMonthlyCost;
        // If house costs more monthly, apartment dweller can invest the difference
        investedDifference = calculateFutureValueAnnuity(monthlyDifference, data.investmentReturn / 100 / 12, data.timeHorizon * 12);
    } else {
        monthlyDifference = apartmentMonthlyCost - houseMonthlyCost;
        // If apartment costs more monthly, homeowner saves the difference
        investedDifference = -calculateFutureValueAnnuity(monthlyDifference, data.investmentReturn / 100 / 12, data.timeHorizon * 12);
    }
    
    return {
        downPaymentOpportunityCost: Math.round(opportunityCost),
        monthlyDifference: Math.round(monthlyDifference),
        investedDifference: Math.round(investedDifference),
        totalOpportunityCost: Math.round(opportunityCost + investedDifference)
    };
}

function calculateFutureValueAnnuity(payment, rate, periods) {
    if (rate === 0) return payment * periods;
    return payment * (Math.pow(1 + rate, periods) - 1) / rate;
}

function calculateLifestyleFactors(data) {
    // Time cost of maintenance
    const annualTimeCost = data.maintenanceTime * 12 * data.hourlyValue;
    const totalTimeCost = annualTimeCost * data.timeHorizon;
    
    // Lifestyle scoring
    const lifestyleScores = {
        flexibility: { house: 2, apartment: 8 },
        stability: { house: 9, apartment: 4 },
        investment: { house: 8, apartment: 3 },
        convenience: { house: 3, apartment: 9 }
    };
    
    const scores = lifestyleScores[data.lifestyle] || { house: 5, apartment: 5 };
    
    return {
        annualTimeCost: Math.round(annualTimeCost),
        totalTimeCost: Math.round(totalTimeCost),
        lifestyleScores: scores
    };
}

function generateRecommendations(data, houseCosts, apartmentCosts, opportunityCosts) {
    const recommendations = [];
    
    // Financial comparison
    const houseNetCost = houseCosts.netCost + opportunityCosts.totalOpportunityCost;
    const apartmentNetCost = apartmentCosts.netCost;
    
    if (houseNetCost < apartmentNetCost) {
        recommendations.push({
            category: 'Financial Winner',
            advice: `House is $${Math.round(apartmentNetCost - houseNetCost).toLocaleString()} cheaper over ${data.timeHorizon} years`,
            priority: 'High'
        });
    } else {
        recommendations.push({
            category: 'Financial Winner',
            advice: `Apartment is $${Math.round(houseNetCost - apartmentNetCost).toLocaleString()} cheaper over ${data.timeHorizon} years`,
            priority: 'High'
        });
    }
    
    // Cash flow considerations
    if (houseCosts.monthlyTotal > apartmentCosts.monthlyRent + data.apartmentUtilities + data.rentersInsurance / 12) {
        recommendations.push({
            category: 'Cash Flow',
            advice: 'House requires higher monthly payments - ensure adequate cash flow',
            priority: 'Medium'
        });
    }
    
    // Down payment impact
    if (data.downPayment > data.monthlyRent * 24) {
        recommendations.push({
            category: 'Liquidity',
            advice: 'Large down payment reduces liquidity - consider emergency fund impact',
            priority: 'Medium'
        });
    }
    
    // Time horizon considerations
    if (data.timeHorizon < 5) {
        recommendations.push({
            category: 'Time Horizon',
            advice: 'Short time horizon favors renting due to transaction costs',
            priority: 'High'
        });
    }
    
    // Lifestyle recommendations
    const lifestyleAdvice = getLifestyleAdvice(data.lifestyle);
    recommendations.push(...lifestyleAdvice);
    
    return recommendations;
}

function getLifestyleAdvice(lifestyle) {
    const advice = {
        flexibility: [
            { category: 'Lifestyle Match', advice: 'Apartment provides better flexibility for career/location changes', priority: 'Medium' }
        ],
        stability: [
            { category: 'Lifestyle Match', advice: 'House ownership provides stability and control over living space', priority: 'Medium' }
        ],
        investment: [
            { category: 'Lifestyle Match', advice: 'House can serve as forced savings and potential investment', priority: 'Medium' }
        ],
        convenience: [
            { category: 'Lifestyle Match', advice: 'Apartment offers convenience with minimal maintenance responsibilities', priority: 'Medium' }
        ]
    };
    
    return advice[lifestyle] || [];
}

function displayResults(analysis) {
    const resultsDiv = document.getElementById('results');
    
    const houseNetTotal = analysis.houseCosts.netCost + analysis.opportunityCosts.totalOpportunityCost + analysis.lifestyleFactors.totalTimeCost;
    const apartmentNetTotal = analysis.apartmentCosts.netCost;
    const winner = houseNetTotal < apartmentNetTotal ? 'house' : 'apartment';
    const savings = Math.abs(houseNetTotal - apartmentNetTotal);
    
    resultsDiv.innerHTML = `
        <div class="bg-broder p-4 md:p-6 rounded border border-accent">
            <h2 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
                <span class="material-icons text-primary">analytics</span> Housing Cost Comparison
            </h2>
            
            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-dark p-4 rounded border border-accent ${winner === 'house' ? 'border-green-500' : ''}">
                    <h3 class="font-medium text-accent mb-2 flex items-center gap-2">
                        <span class="material-icons">house</span> House Option
                        ${winner === 'house' ? '<span class="text-green-400 text-xs ml-2">WINNER</span>' : ''}
                    </h3>
                    <div class="space-y-2 text-sm">
                        <div>Monthly Payment: <span class="text-primary font-medium">$${analysis.houseCosts.monthlyTotal.toLocaleString()}</span></div>
                        <div>Total Net Cost: <span class="text-primary font-medium">$${houseNetTotal.toLocaleString()}</span></div>
                        <div>Equity Built: <span class="text-green-400 font-medium">$${analysis.houseCosts.equity.toLocaleString()}</span></div>
                    </div>
                </div>
                
                <div class="bg-dark p-4 rounded border border-accent ${winner === 'apartment' ? 'border-green-500' : ''}">
                    <h3 class="font-medium text-accent mb-2 flex items-center gap-2">
                        <span class="material-icons">apartment</span> Apartment Option
                        ${winner === 'apartment' ? '<span class="text-green-400 text-xs ml-2">WINNER</span>' : ''}
                    </h3>
                    <div class="space-y-2 text-sm">
                        <div>Monthly Rent: <span class="text-primary font-medium">$${analysis.apartmentCosts.monthlyRent.toLocaleString()}</span></div>
                        <div>Total Net Cost: <span class="text-primary font-medium">$${apartmentNetTotal.toLocaleString()}</span></div>
                        <div>Final Rent: <span class="text-orange-400 font-medium">$${analysis.apartmentCosts.finalRent.toLocaleString()}/month</span></div>
                    </div>
                </div>
            </div>
            
            <div class="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded border border-primary/30">
                <h3 class="font-medium text-primary mb-2">💰 Financial Summary (${analysis.timeHorizon} years)</h3>
                <div class="text-sm text-light">
                    <p><strong>${winner === 'house' ? 'House' : 'Apartment'}</strong> is $${savings.toLocaleString()} cheaper overall</p>
                    <p>This includes all costs: payments, maintenance, opportunity costs, and time investment</p>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">receipt_long</span> Detailed Cost Breakdown
                </h3>
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="font-medium text-sm mb-3">House Costs</h4>
                        <div class="space-y-1 text-xs">
                            <div class="flex justify-between">
                                <span>Mortgage Payments</span>
                                <span>$${(analysis.houseCosts.monthlyPayment * 12 * analysis.timeHorizon).toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Property Tax</span>
                                <span>$${(analysis.houseCosts.totalPayments - analysis.houseCosts.monthlyPayment * 12 * analysis.timeHorizon).toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Maintenance & Utilities</span>
                                <span>$${((document.getElementById('maintenanceCost').value * analysis.timeHorizon) + (document.getElementById('houseUtilities').value * 12 * analysis.timeHorizon)).toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Closing/Selling Costs</span>
                                <span>$${(analysis.houseCosts.closingCosts + analysis.houseCosts.sellingCosts).toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between text-green-400">
                                <span>- Tax Savings</span>
                                <span>-$${analysis.houseCosts.taxSavings.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between text-green-400">
                                <span>- Equity Built</span>
                                <span>-$${analysis.houseCosts.equity.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between text-red-400">
                                <span>+ Opportunity Cost</span>
                                <span>+$${analysis.opportunityCosts.totalOpportunityCost.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between text-red-400">
                                <span>+ Time Cost</span>
                                <span>+$${analysis.lifestyleFactors.totalTimeCost.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between font-medium border-t border-accent pt-1 mt-2">
                                <span>Net Total</span>
                                <span>$${houseNetTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="font-medium text-sm mb-3">Apartment Costs</h4>
                        <div class="space-y-1 text-xs">
                            <div class="flex justify-between">
                                <span>Total Rent</span>
                                <span>$${analysis.apartmentCosts.totalRent.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Utilities</span>
                                <span>$${analysis.apartmentCosts.totalUtilities.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Renters Insurance</span>
                                <span>$${analysis.apartmentCosts.totalInsurance.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between font-medium border-t border-accent pt-1 mt-2">
                                <span>Net Total</span>
                                <span>$${apartmentNetTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">lightbulb</span> Recommendations
                </h3>
                <div class="space-y-3">
                    ${analysis.recommendations.map(rec => `
                        <div class="bg-dark p-3 rounded border-l-4 border-primary">
                            <div class="flex justify-between items-start mb-1">
                                <span class="font-medium text-sm">${rec.category}</span>
                                <span class="text-xs px-2 py-1 rounded ${rec.priority === 'High' ? 'bg-red-600' : rec.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'} text-white">${rec.priority}</span>
                            </div>
                            <div class="text-sm text-light">${rec.advice}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-dark p-4 rounded border border-accent">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">insights</span> Key Insights
                </h3>
                <ul class="space-y-1 text-sm text-light">
                    <li>• Monthly cash flow difference: $${Math.abs(analysis.houseCosts.monthlyTotal - (analysis.apartmentCosts.monthlyRent + document.getElementById('apartmentUtilities').value)).toLocaleString()}</li>
                    <li>• Down payment opportunity cost: $${analysis.opportunityCosts.downPaymentOpportunityCost.toLocaleString()}</li>
                    <li>• Annual maintenance time value: $${analysis.lifestyleFactors.annualTimeCost.toLocaleString()}</li>
                    <li>• Home appreciation adds $${(analysis.houseCosts.futureValue - document.getElementById('housePrice').value).toLocaleString()} in value</li>
                    <li>• Consider your lifestyle priorities and financial flexibility needs</li>
                </ul>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}