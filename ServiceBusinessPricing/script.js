// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

    const form = document.getElementById('pricing-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculatePricing();
    });
});

function collectFormData() {
    return {
        serviceType: document.getElementById('serviceType').value,
        geoMarket: document.getElementById('geoMarket').value,
        experience: parseInt(document.getElementById('experience').value),
        education: document.getElementById('education').value,
        operatingCosts: parseFloat(document.getElementById('operatingCosts').value),
        desiredIncome: parseFloat(document.getElementById('desiredIncome').value),
        billableHours: parseInt(document.getElementById('billableHours').value),
        vacationWeeks: parseInt(document.getElementById('vacationWeeks').value),
        specialized: document.getElementById('specialized').checked,
        certified: document.getElementById('certified').checked,
        results: document.getElementById('results').checked,
        premium: document.getElementById('premium').checked,
        demand: document.querySelector('input[name="demand"]:checked').value
    };
}

function calculatePricing() {
    const data = collectFormData();
    
    // Base rate calculation
    const workingWeeks = 52 - data.vacationWeeks;
    const annualBillableHours = data.billableHours * workingWeeks;
    const totalAnnualCosts = (data.operatingCosts * 12) + data.desiredIncome;
    const baseHourlyRate = totalAnnualCosts / annualBillableHours;
    
    // Market multipliers
    const marketMultipliers = {
        'tier1': 1.5,
        'tier2': 1.2,
        'tier3': 1.0,
        'rural': 0.8,
        'global': 1.1
    };
    
    // Service type base rates (market average)
    const serviceBaseRates = {
        'consulting': 150,
        'coaching': 125,
        'freelance-design': 85,
        'freelance-dev': 95,
        'freelance-writing': 65,
        'marketing': 110,
        'legal': 200,
        'accounting': 120,
        'therapy': 100,
        'fitness': 75,
        'other': 90
    };
    
    // Experience multipliers
    const experienceMultipliers = {
        0: 0.6, 1: 0.7, 2: 0.8, 3: 0.9, 4: 1.0,
        5: 1.1, 6: 1.2, 7: 1.3, 8: 1.4, 9: 1.5,
        10: 1.6, 15: 1.8, 20: 2.0, 25: 2.2, 30: 2.4
    };
    
    // Education multipliers
    const educationMultipliers = {
        'highschool': 0.8,
        'associate': 0.9,
        'bachelor': 1.0,
        'master': 1.2,
        'phd': 1.4,
        'certification': 1.1
    };
    
    // Demand multipliers
    const demandMultipliers = {
        'low': 0.85,
        'medium': 1.0,
        'high': 1.25
    };
    
    // Calculate market-based rate
    const marketBaseRate = serviceBaseRates[data.serviceType] || 90;
    const expMultiplier = experienceMultipliers[Math.min(data.experience, 30)] || 
                         (data.experience > 30 ? 2.5 : 1.0);
    
    let marketRate = marketBaseRate * 
                    marketMultipliers[data.geoMarket] * 
                    expMultiplier * 
                    educationMultipliers[data.education] * 
                    demandMultipliers[data.demand];
    
    // Value proposition adjustments
    let valueMultiplier = 1.0;
    if (data.specialized) valueMultiplier += 0.15;
    if (data.certified) valueMultiplier += 0.10;
    if (data.results) valueMultiplier += 0.12;
    if (data.premium) valueMultiplier += 0.20;
    
    marketRate *= valueMultiplier;
    
    // Calculate recommended rates
    const costBasedRate = Math.ceil(baseHourlyRate);
    const marketBasedRate = Math.ceil(marketRate);
    const recommendedRate = Math.ceil((costBasedRate + marketBasedRate) / 2);
    
    // Pricing tiers
    const budgetRate = Math.ceil(recommendedRate * 0.8);
    const standardRate = recommendedRate;
    const premiumRate = Math.ceil(recommendedRate * 1.3);
    
    // Project pricing estimates
    const smallProject = standardRate * 20; // 20 hours
    const mediumProject = standardRate * 50; // 50 hours
    const largeProject = standardRate * 100; // 100 hours
    
    // Monthly retainer estimates
    const partTimeRetainer = standardRate * data.billableHours * 0.5; // 50% capacity
    const fullTimeRetainer = standardRate * data.billableHours; // Full capacity
    
    // Annual projections
    const annualRevenueLow = budgetRate * annualBillableHours;
    const annualRevenueStandard = standardRate * annualBillableHours;
    const annualRevenueHigh = premiumRate * annualBillableHours;
    
    // Profitability analysis
    const annualCosts = data.operatingCosts * 12;
    const netIncomeLow = annualRevenueLow - annualCosts;
    const netIncomeStandard = annualRevenueStandard - annualCosts;
    const netIncomeHigh = annualRevenueHigh - annualCosts;
    
    // Competitive analysis
    const competitivePosition = marketBasedRate > costBasedRate ? 'competitive' : 'below-market';
    const pricingConfidence = calculatePricingConfidence(data, marketRate, baseHourlyRate);
    
    displayResults({
        costBasedRate,
        marketBasedRate,
        recommendedRate,
        budgetRate,
        standardRate,
        premiumRate,
        smallProject,
        mediumProject,
        largeProject,
        partTimeRetainer,
        fullTimeRetainer,
        annualRevenueLow,
        annualRevenueStandard,
        annualRevenueHigh,
        netIncomeLow,
        netIncomeStandard,
        netIncomeHigh,
        competitivePosition,
        pricingConfidence,
        annualBillableHours,
        data
    });
}

function calculatePricingConfidence(data, marketRate, costRate) {
    let confidence = 70; // Base confidence
    
    // Experience boost
    if (data.experience >= 5) confidence += 10;
    if (data.experience >= 10) confidence += 10;
    
    // Education boost
    if (data.education === 'master' || data.education === 'phd') confidence += 8;
    
    // Value proposition boost
    if (data.specialized) confidence += 8;
    if (data.certified) confidence += 6;
    if (data.results) confidence += 8;
    if (data.premium) confidence += 10;
    
    // Market alignment
    const rateAlignment = Math.abs(marketRate - costRate) / marketRate;
    if (rateAlignment < 0.2) confidence += 10;
    else if (rateAlignment > 0.5) confidence -= 15;
    
    // Demand factor
    if (data.demand === 'high') confidence += 8;
    else if (data.demand === 'low') confidence -= 10;
    
    return Math.min(Math.max(confidence, 30), 95);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    const getConfidenceColor = (confidence) => {
        if (confidence >= 80) return 'text-green-400';
        if (confidence >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };
    
    const getPositionColor = (position) => {
        return position === 'competitive' ? 'text-green-400' : 'text-yellow-400';
    };
    
    contentDiv.innerHTML = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">Your Optimal Pricing Strategy</h3>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-3xl font-bold text-accent">$${sanitizeText(results.recommendedRate)}</div>
                    <div class="text-light">Recommended Hourly Rate</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold ${getConfidenceColor(results.pricingConfidence)}">${sanitizeText(results.pricingConfidence)}%</div>
                    <div class="text-light">Pricing Confidence</div>
                </div>
                <div class="text-center">
                    <div class="text-lg font-bold ${getPositionColor(results.competitivePosition)} capitalize">${escapeHtml(results.competitivePosition)}</div>
                    <div class="text-light">Market Position</div>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Pricing Tiers</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center p-3 bg-dark rounded">
                        <span class="text-light">Budget Tier</span>
                        <span class="text-accent font-bold">$${sanitizeText(results.budgetRate)}/hr</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-primary/20 rounded border border-primary">
                        <span class="text-light">Standard Tier (Recommended)</span>
                        <span class="text-primary font-bold">$${sanitizeText(results.standardRate)}/hr</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-dark rounded">
                        <span class="text-light">Premium Tier</span>
                        <span class="text-accent font-bold">$${sanitizeText(results.premiumRate)}/hr</span>
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Rate Analysis</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-light">Cost-Based Rate:</span>
                        <span class="text-accent">$${sanitizeText(results.costBasedRate)}/hr</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Market-Based Rate:</span>
                        <span class="text-accent">$${sanitizeText(results.marketBasedRate)}/hr</span>
                    </div>
                    <div class="flex justify-between border-t border-accent pt-2">
                        <span class="text-light font-bold">Optimal Rate:</span>
                        <span class="text-primary font-bold">$${sanitizeText(results.recommendedRate)}/hr</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Project Pricing Guide</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-light">Small Project (20 hrs):</span>
                        <span class="text-accent">$${results.smallProject.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Medium Project (50 hrs):</span>
                        <span class="text-accent">$${results.mediumProject.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Large Project (100 hrs):</span>
                        <span class="text-accent">$${results.largeProject.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Retainer Options</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-light">Part-Time Retainer:</span>
                        <span class="text-accent">$${results.partTimeRetainer.toLocaleString()}/mo</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Full-Time Retainer:</span>
                        <span class="text-accent">$${results.fullTimeRetainer.toLocaleString()}/mo</span>
                    </div>
                    <div class="text-sm text-light mt-2">
                        Based on ${escapeHtml(results.data.billableHours.toString())} hours/week capacity
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-broder p-6 rounded border border-accent mb-6">
            <h4 class="text-xl font-bold text-primary mb-4">Annual Revenue Projections</h4>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center p-4 bg-dark rounded">
                    <div class="text-2xl font-bold text-yellow-400">$${results.annualRevenueLow.toLocaleString()}</div>
                    <div class="text-light text-sm">Budget Tier Revenue</div>
                    <div class="text-green-400 text-sm">Net: $${results.netIncomeLow.toLocaleString()}</div>
                </div>
                <div class="text-center p-4 bg-primary/20 rounded border border-primary">
                    <div class="text-2xl font-bold text-primary">$${results.annualRevenueStandard.toLocaleString()}</div>
                    <div class="text-light text-sm">Standard Tier Revenue</div>
                    <div class="text-green-400 text-sm">Net: $${results.netIncomeStandard.toLocaleString()}</div>
                </div>
                <div class="text-center p-4 bg-dark rounded">
                    <div class="text-2xl font-bold text-accent">$${results.annualRevenueHigh.toLocaleString()}</div>
                    <div class="text-light text-sm">Premium Tier Revenue</div>
                    <div class="text-green-400 text-sm">Net: $${results.netIncomeHigh.toLocaleString()}</div>
                </div>
            </div>
            <div class="text-sm text-light mt-4 text-center">
                Based on ${escapeHtml(results.annualBillableHours.toString())} billable hours annually
            </div>
        </div>

        <div class="bg-dark p-6 rounded border border-accent">
            <h4 class="text-xl font-bold text-primary mb-4">Pricing Strategy Recommendations</h4>
            <div class="space-y-4">
                ${results.pricingConfidence >= 80 ? `
                    <div class="flex items-start space-x-3">
                        <span class="material-icons text-green-400 mt-1">check_circle</span>
                        <div>
                            <div class="font-semibold text-green-400">High Confidence Pricing</div>
                            <div class="text-light text-sm">Your pricing is well-supported by market data and value proposition. Implement with confidence.</div>
                        </div>
                    </div>
                ` : results.pricingConfidence >= 60 ? `
                    <div class="flex items-start space-x-3">
                        <span class="material-icons text-yellow-400 mt-1">warning</span>
                        <div>
                            <div class="font-semibold text-yellow-400">Moderate Confidence Pricing</div>
                            <div class="text-light text-sm">Consider testing rates with new clients and gathering market feedback to validate pricing.</div>
                        </div>
                    </div>
                ` : `
                    <div class="flex items-start space-x-3">
                        <span class="material-icons text-red-400 mt-1">error</span>
                        <div>
                            <div class="font-semibold text-red-400">Low Confidence Pricing</div>
                            <div class="text-light text-sm">Start conservatively and build evidence of value delivery before implementing full rates.</div>
                        </div>
                    </div>
                `}
                
                ${results.competitivePosition === 'below-market' ? `
                    <div class="flex items-start space-x-3">
                        <span class="material-icons text-yellow-400 mt-1">trending_up</span>
                        <div>
                            <div class="font-semibold text-yellow-400">Below Market Rates</div>
                            <div class="text-light text-sm">Your costs require higher rates than market average. Focus on value differentiation and premium positioning.</div>
                        </div>
                    </div>
                ` : `
                    <div class="flex items-start space-x-3">
                        <span class="material-icons text-green-400 mt-1">balance</span>
                        <div>
                            <div class="font-semibold text-green-400">Market-Aligned Pricing</div>
                            <div class="text-light text-sm">Your rates align well with market expectations while meeting your financial requirements.</div>
                        </div>
                    </div>
                `}
                
                <div class="flex items-start space-x-3">
                    <span class="material-icons text-primary mt-1">lightbulb</span>
                    <div>
                        <div class="font-semibold text-primary">Implementation Tips</div>
                        <div class="text-light text-sm">
                            Start with standard rates for new clients. Offer premium rates for rush projects or specialized expertise. 
                            Consider value-based pricing for outcome-focused engagements.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
