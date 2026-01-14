// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

    document.getElementById('vanlife-form').addEventListener('submit', calculateVanLifeBudget);
    document.getElementById('conversionType').addEventListener('change', updateConversionCost);
});

function updateConversionCost() {
    const conversionType = document.getElementById('conversionType').value;
    const customField = document.getElementById('customConversionCost');
    
    const conversionCosts = {
        'diy-basic': 10000,
        'diy-full': 25000,
        'professional': 57500,
        'luxury': 100000
    };
    
    if (conversionCosts[conversionType]) {
        customField.value = conversionCosts[conversionType];
    }
}

function calculateVanLifeBudget(e) {
    e.preventDefault();
    
    const data = collectFormData();
    const analysis = analyzeVanLifeBudget(data);
    displayResults(analysis);
}

function collectFormData() {
    return {
        vanCost: parseInt(document.getElementById('vanCost').value),
        conversionType: document.getElementById('conversionType').value,
        customConversionCost: parseInt(document.getElementById('customConversionCost').value) || 0,
        planDuration: parseInt(document.getElementById('planDuration').value),
        fuelCost: parseInt(document.getElementById('fuelCost').value),
        insurance: parseInt(document.getElementById('insurance').value),
        campingFees: parseInt(document.getElementById('campingFees').value),
        maintenance: parseInt(document.getElementById('maintenance').value),
        food: parseInt(document.getElementById('food').value),
        internet: parseInt(document.getElementById('internet').value),
        entertainment: parseInt(document.getElementById('entertainment').value),
        laundry: parseInt(document.getElementById('laundry').value),
        monthlyIncome: parseInt(document.getElementById('monthlyIncome').value),
        currentSavings: parseInt(document.getElementById('currentSavings').value),
        incomeType: document.getElementById('incomeType').value,
        travelStyle: document.getElementById('travelStyle').value,
        comfortLevel: document.getElementById('comfortLevel').value
    };
}

function analyzeVanLifeBudget(data) {
    // Calculate initial investment
    const initialInvestment = data.vanCost + data.customConversionCost;
    
    // Calculate monthly expenses
    const monthlyExpenses = calculateMonthlyExpenses(data);
    
    // Calculate total cost over duration
    const totalCost = initialInvestment + (monthlyExpenses.total * data.planDuration);
    
    // Calculate financial feasibility
    const feasibility = assessFinancialFeasibility(data, monthlyExpenses, initialInvestment);
    
    // Generate recommendations
    const recommendations = generateRecommendations(data, monthlyExpenses, feasibility);
    
    // Calculate cost comparisons
    const comparisons = calculateCostComparisons(monthlyExpenses.total, data.planDuration);
    
    return {
        initialInvestment,
        monthlyExpenses,
        totalCost,
        feasibility,
        recommendations,
        comparisons
    };
}

function calculateMonthlyExpenses(data) {
    const baseExpenses = {
        fuel: data.fuelCost,
        insurance: data.insurance,
        camping: data.campingFees,
        maintenance: data.maintenance,
        food: data.food,
        internet: data.internet,
        entertainment: data.entertainment,
        laundry: data.laundry
    };
    
    // Apply travel style multipliers
    const travelMultipliers = {
        slow: 0.8,
        moderate: 1.0,
        fast: 1.3
    };
    
    const multiplier = travelMultipliers[data.travelStyle] || 1.0;
    
    // Adjust fuel and camping based on travel style
    baseExpenses.fuel *= multiplier;
    baseExpenses.camping *= multiplier;
    
    // Apply comfort level adjustments
    const comfortAdjustments = {
        minimal: 0.8,
        comfortable: 1.0,
        luxury: 1.4
    };
    
    const comfortMultiplier = comfortAdjustments[data.comfortLevel] || 1.0;
    baseExpenses.food *= comfortMultiplier;
    baseExpenses.entertainment *= comfortMultiplier;
    
    const total = Object.values(baseExpenses).reduce((sum, cost) => sum + cost, 0);
    
    return {
        ...baseExpenses,
        total: Math.round(total)
    };
}

function assessFinancialFeasibility(data, monthlyExpenses, initialInvestment) {
    const monthlyBalance = data.monthlyIncome - monthlyExpenses.total;
    const savingsNeeded = initialInvestment;
    const emergencyFund = monthlyExpenses.total * 3; // 3 months emergency fund
    const totalUpfront = savingsNeeded + emergencyFund;
    
    let feasibilityScore = 0;
    let issues = [];
    
    // Check upfront costs
    if (data.currentSavings >= totalUpfront) {
        feasibilityScore += 40;
    } else {
        const shortfall = totalUpfront - data.currentSavings;
        issues.push(`Need additional $${shortfall.toLocaleString()} for upfront costs`);
        feasibilityScore += Math.max(0, 40 * (data.currentSavings / totalUpfront));
    }
    
    // Check monthly cash flow
    if (monthlyBalance > 0) {
        feasibilityScore += 40;
    } else {
        issues.push(`Monthly shortfall of $${Math.abs(monthlyBalance).toLocaleString()}`);
    }
    
    // Check income stability
    const incomeStability = {
        'remote-work': 20,
        'freelance': 15,
        'passive': 18,
        'seasonal': 10,
        'savings': 5
    };
    
    feasibilityScore += incomeStability[data.incomeType] || 10;
    
    if (data.incomeType === 'savings') {
        const monthsOfSavings = data.currentSavings / monthlyExpenses.total;
        if (monthsOfSavings < data.planDuration) {
            issues.push(`Savings will last only ${Math.floor(monthsOfSavings)} months`);
        }
    }
    
    const feasibilityLevel = getFeasibilityLevel(feasibilityScore);
    
    return {
        score: feasibilityScore,
        level: feasibilityLevel,
        monthlyBalance,
        emergencyFund,
        totalUpfront,
        issues
    };
}

function getFeasibilityLevel(score) {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-400', description: 'Financially ready for van life' };
    if (score >= 60) return { level: 'Good', color: 'text-green-400', description: 'Mostly prepared with minor adjustments needed' };
    if (score >= 40) return { level: 'Moderate', color: 'text-yellow-400', description: 'Significant planning required' };
    if (score >= 20) return { level: 'Challenging', color: 'text-orange-400', description: 'Major financial obstacles to address' };
    return { level: 'Not Ready', color: 'text-red-400', description: 'Substantial preparation needed' };
}

function generateRecommendations(data, monthlyExpenses, feasibility) {
    const recommendations = [];
    
    // Financial recommendations
    if (feasibility.monthlyBalance < 0) {
        recommendations.push({
            category: 'Income',
            advice: 'Increase income or reduce expenses before starting van life',
            priority: 'Critical'
        });
    }
    
    if (data.currentSavings < feasibility.totalUpfront) {
        recommendations.push({
            category: 'Savings',
            advice: `Build emergency fund of $${feasibility.emergencyFund.toLocaleString()}`,
            priority: 'High'
        });
    }
    
    // Conversion recommendations
    if (data.customConversionCost > 50000) {
        recommendations.push({
            category: 'Conversion',
            advice: 'Consider phased conversion to spread costs over time',
            priority: 'Medium'
        });
    }
    
    // Lifestyle recommendations
    if (data.travelStyle === 'fast' && monthlyExpenses.fuel > 400) {
        recommendations.push({
            category: 'Travel Style',
            advice: 'Slow down travel pace to reduce fuel costs',
            priority: 'Medium'
        });
    }
    
    // Income-specific advice
    const incomeAdvice = getIncomeSpecificAdvice(data.incomeType);
    recommendations.push(...incomeAdvice);
    
    return recommendations;
}

function getIncomeSpecificAdvice(incomeType) {
    const advice = {
        'remote-work': [
            { category: 'Work Setup', advice: 'Invest in reliable internet and mobile hotspot backup', priority: 'High' }
        ],
        'freelance': [
            { category: 'Income Stability', advice: 'Build 6-month client pipeline before departure', priority: 'High' }
        ],
        'savings': [
            { category: 'Budget Management', advice: 'Track expenses daily to avoid overspending', priority: 'Critical' }
        ],
        'seasonal': [
            { category: 'Work Planning', advice: 'Plan route around seasonal job opportunities', priority: 'High' }
        ],
        'passive': [
            { category: 'Income Monitoring', advice: 'Set up systems to monitor passive income remotely', priority: 'Medium' }
        ]
    };
    
    return advice[incomeType] || [];
}

function calculateCostComparisons(monthlyVanLife, duration) {
    // Average costs for comparison
    const avgRent = 1500; // National average
    const avgUtilities = 200;
    const avgTransport = 300;
    const monthlyApartment = avgRent + avgUtilities + avgTransport;
    
    const vanLifeTotal = monthlyVanLife * duration;
    const apartmentTotal = monthlyApartment * duration;
    const savings = apartmentTotal - vanLifeTotal;
    
    return {
        vanLife: vanLifeTotal,
        apartment: apartmentTotal,
        savings: savings,
        percentSavings: ((savings / apartmentTotal) * 100).toFixed(1)
    };
}

function displayResults(analysis) {
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = `
        <div class="bg-broder p-4 md:p-6 rounded border border-accent">
            <h2 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
                <span class="material-icons text-primary">analytics</span> Van Life Budget Analysis
            </h2>
            
            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-dark p-4 rounded border border-accent">
                    <h3 class="font-medium text-accent mb-2">Initial Investment</h3>
                    <div class="space-y-2 text-sm">
                        <div>Total Upfront: <span class="text-primary font-medium">$${analysis.initialInvestment.toLocaleString()}</span></div>
                        <div>Emergency Fund: <span class="text-primary font-medium">$${analysis.feasibility.emergencyFund.toLocaleString()}</span></div>
                        <div>Total Needed: <span class="text-primary font-medium">$${analysis.feasibility.totalUpfront.toLocaleString()}</span></div>
                    </div>
                </div>
                
                <div class="bg-dark p-4 rounded border border-accent">
                    <h3 class="font-medium text-accent mb-2">Financial Readiness</h3>
                    <div class="space-y-2 text-sm">
                        <div>Feasibility: <span class="${sanitizeText(analysis.feasibility.level.color)} font-medium">${sanitizeText(analysis.feasibility.level.level)}</span></div>
                        <div>Monthly Balance: <span class="${analysis.feasibility.monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'} font-medium">${analysis.feasibility.monthlyBalance >= 0 ? '+' : ''}$${analysis.feasibility.monthlyBalance.toLocaleString()}</span></div>
                        <div class="text-light text-xs">${sanitizeText(analysis.feasibility.level.description)}</div>
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">receipt_long</span> Monthly Expense Breakdown
                </h3>
                <div class="grid md:grid-cols-2 gap-3">
                    <div class="bg-dark p-3 rounded border border-accent">
                        <div class="flex justify-between text-sm mb-1">
                            <span>Fuel/Gas</span>
                            <span class="text-primary">$${sanitizeText(analysis.monthlyExpenses.fuel)}</span>
                        </div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Insurance</span>
                            <span class="text-primary">$${sanitizeText(analysis.monthlyExpenses.insurance)}</span>
                        </div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Camping/Parking</span>
                            <span class="text-primary">$${sanitizeText(analysis.monthlyExpenses.camping)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>Maintenance</span>
                            <span class="text-primary">$${sanitizeText(analysis.monthlyExpenses.maintenance)}</span>
                        </div>
                    </div>
                    <div class="bg-dark p-3 rounded border border-accent">
                        <div class="flex justify-between text-sm mb-1">
                            <span>Food</span>
                            <span class="text-primary">$${sanitizeText(analysis.monthlyExpenses.food)}</span>
                        </div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Internet/Phone</span>
                            <span class="text-primary">$${sanitizeText(analysis.monthlyExpenses.internet)}</span>
                        </div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Entertainment</span>
                            <span class="text-primary">$${sanitizeText(analysis.monthlyExpenses.entertainment)}</span>
                        </div>
                        <div class="flex justify-between text-sm border-t border-accent pt-1 mt-1 font-medium">
                            <span>Total Monthly</span>
                            <span class="text-primary">$${sanitizeText(analysis.monthlyExpenses.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${analysis.feasibility.issues.length > 0 ? `
            <div class="mb-6">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">warning</span> Financial Challenges
                </h3>
                <div class="space-y-2">
                    ${analysis.feasibility.issues.map(issue => `
                        <div class="bg-red-900/20 border border-red-600 p-3 rounded text-sm text-red-300">
                            ${issue}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="mb-6">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">lightbulb</span> Recommendations
                </h3>
                <div class="space-y-3">
                    ${analysis.recommendations.map(rec => `
                        <div class="bg-dark p-3 rounded border-l-4 border-primary">
                            <div class="flex justify-between items-start mb-1">
                                <span class="font-medium text-sm">${rec.category}</span>
                                <span class="text-xs px-2 py-1 rounded ${rec.priority === 'Critical' ? 'bg-red-600' : rec.priority === 'High' ? 'bg-orange-600' : 'bg-yellow-600'} text-white">${sanitizeText(rec.priority)}</span>
                            </div>
                            <div class="text-sm text-light">${sanitizeText(rec.advice)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-dark p-4 rounded border border-accent">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">compare</span> Cost Comparison
                </h3>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <div class="mb-2">Van Life (${document.getElementById('planDuration').value} months)</div>
                        <div class="text-2xl font-bold text-primary">$${analysis.comparisons.vanLife.toLocaleString()}</div>
                    </div>
                    <div>
                        <div class="mb-2">Apartment Living (same period)</div>
                        <div class="text-2xl font-bold text-light">$${analysis.comparisons.apartment.toLocaleString()}</div>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded">
                    <div class="text-sm">
                        ${analysis.comparisons.savings > 0 ? 
                            `💰 Potential savings: $${analysis.comparisons.savings.toLocaleString()} (${sanitizeText(analysis.comparisons.percentSavings)}%)` :
                            `💸 Additional cost: $${Math.abs(analysis.comparisons.savings).toLocaleString()}`
                        }
                    </div>
                </div>
            </div>
            
            <div class="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded border border-primary/30">
                <h3 class="font-medium text-primary mb-2">🚐 Van Life Readiness Summary</h3>
                <div class="text-sm text-light space-y-1">
                    <p>• Financial readiness: ${sanitizeText(analysis.feasibility.level.level)} (${sanitizeText(analysis.feasibility.score)}/100)</p>
                    <p>• Monthly budget: $${analysis.monthlyExpenses.total.toLocaleString()} for your lifestyle</p>
                    <p>• ${analysis.feasibility.issues.length === 0 ? 'Ready to hit the road!' : 'Address financial challenges before departure'}</p>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
