// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`n// Expat Cost of Living Advisor
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('expat-form');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');

    // Cost of living indices (base 100 = average)
    const costIndices = {
        // High-cost countries
        US: 100, UK: 95, CA: 85, AU: 90, DE: 80, FR: 85, NL: 88, SE: 85, NO: 110, DK: 95,
        // Popular expat destinations
        TH: 35, PT: 55, MX: 40, CR: 60, MY: 30, PH: 25, VN: 25, ID: 28, ES: 65, IT: 70,
        GR: 60, CZ: 50, PL: 45, HU: 45, EE: 55, LV: 50, LT: 48, BG: 35, RO: 40, UA: 30
    };

    // Lifestyle multipliers
    const lifestyleMultipliers = {
        budget: 0.7,
        comfortable: 1.0,
        luxury: 1.5
    };

    // Family size multipliers
    const familyMultipliers = {
        1: 1.0,
        2: 1.6,
        3: 2.1,
        4: 2.5,
        5: 2.8
    };

    // Healthcare costs (monthly per person)
    const healthcareCosts = {
        basic: { TH: 30, PT: 50, MX: 40, CR: 60, MY: 25, PH: 20, VN: 15, ID: 20, ES: 60, IT: 70, GR: 50, CZ: 40, PL: 35, HU: 35, EE: 45, LV: 40, LT: 38, BG: 25, RO: 30, UA: 20 },
        international: { TH: 150, PT: 200, MX: 120, CR: 180, MY: 100, PH: 80, VN: 70, ID: 85, ES: 250, IT: 280, GR: 200, CZ: 180, PL: 150, HU: 140, EE: 200, LV: 180, LT: 170, BG: 120, RO: 140, UA: 100 },
        premium: { TH: 300, PT: 400, MX: 250, CR: 350, MY: 200, PH: 150, VN: 140, ID: 170, ES: 500, IT: 550, GR: 400, CZ: 350, PL: 300, HU: 280, EE: 400, LV: 350, LT: 330, BG: 250, RO: 280, UA: 200 }
    };

    // Education costs (monthly per child)
    const educationCosts = {
        none: 0,
        local: { TH: 50, PT: 100, MX: 80, CR: 120, MY: 40, PH: 30, VN: 25, ID: 35, ES: 150, IT: 200, GR: 100, CZ: 80, PL: 60, HU: 70, EE: 100, LV: 80, LT: 75, BG: 50, RO: 60, UA: 40 },
        international: { TH: 800, PT: 1200, MX: 600, CR: 1000, MY: 500, PH: 400, VN: 350, ID: 450, ES: 1500, IT: 1800, GR: 1200, CZ: 1000, PL: 800, HU: 900, EE: 1200, LV: 1000, LT: 950, BG: 700, RO: 800, UA: 600 }
    };

    // Visa costs (annual)
    const visaCosts = {
        TH: 500, PT: 800, MX: 300, CR: 600, MY: 400, PH: 200, VN: 300, ID: 350, ES: 1000, IT: 1200, GR: 800, CZ: 600, PL: 500, HU: 550, EE: 700, LV: 600, LT: 580, BG: 400, RO: 500, UA: 300
    };

    // Country names
    const countryNames = {
        US: 'United States', UK: 'United Kingdom', CA: 'Canada', AU: 'Australia', DE: 'Germany', FR: 'France', NL: 'Netherlands', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
        TH: 'Thailand', PT: 'Portugal', MX: 'Mexico', CR: 'Costa Rica', MY: 'Malaysia', PH: 'Philippines', VN: 'Vietnam', ID: 'Indonesia', ES: 'Spain', IT: 'Italy',
        GR: 'Greece', CZ: 'Czech Republic', PL: 'Poland', HU: 'Hungary', EE: 'Estonia', LV: 'Latvia', LT: 'Lithuania', BG: 'Bulgaria', RO: 'Romania', UA: 'Ukraine'
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateExpatCosts();
    });

    function calculateExpatCosts() {
        // Collect form data
        const currentCountry = document.getElementById('current-country').value;
        const targetCountry = document.getElementById('target-country').value;
        const currentExpenses = parseFloat(document.getElementById('current-expenses').value);
        const familySize = parseInt(document.getElementById('family-size').value);
        const lifestyle = document.getElementById('lifestyle').value;
        const healthInsurance = document.getElementById('health-insurance').value;
        const education = document.getElementById('education').value;

        // Calculate base living costs
        const currentIndex = costIndices[currentCountry];
        const targetIndex = costIndices[targetCountry];
        const costRatio = targetIndex / currentIndex;
        
        // Apply lifestyle and family multipliers
        const lifestyleMultiplier = lifestyleMultipliers[lifestyle];
        const familyMultiplier = familyMultipliers[familySize];
        
        // Base monthly cost in target country
        const baseMonthlyCost = (currentExpenses * costRatio * lifestyleMultiplier * familyMultiplier) / familySize;
        const totalBaseCost = baseMonthlyCost * familySize;

        // Add healthcare costs
        const healthcareCostPerPerson = healthcareCosts[healthInsurance][targetCountry] || 100;
        const totalHealthcareCost = healthcareCostPerPerson * familySize;

        // Add education costs
        const childrenCount = Math.max(0, familySize - 2); // Assume max 2 adults
        const educationCostPerChild = educationCosts[education][targetCountry] || 0;
        const totalEducationCost = educationCostPerChild * childrenCount;

        // Calculate total monthly cost
        const totalMonthlyCost = totalBaseCost + totalHealthcareCost + totalEducationCost;
        
        // Annual costs
        const annualLivingCost = totalMonthlyCost * 12;
        const annualVisaCost = visaCosts[targetCountry] || 500;
        const totalAnnualCost = annualLivingCost + annualVisaCost;

        // Setup costs (first year)
        const setupCosts = calculateSetupCosts(targetCountry, familySize, lifestyle);
        const firstYearTotal = totalAnnualCost + setupCosts;

        // Cost comparison
        const currentAnnualCost = currentExpenses * 12;
        const costDifference = totalAnnualCost - currentAnnualCost;
        const costSavings = costDifference < 0 ? Math.abs(costDifference) : 0;

        // Affordability analysis
        const affordabilityScore = calculateAffordabilityScore(currentExpenses, totalMonthlyCost, costRatio);
        const recommendation = generateRecommendation(affordabilityScore, costRatio, targetCountry);

        // Display results
        displayResults({
            currentCountry: countryNames[currentCountry],
            targetCountry: countryNames[targetCountry],
            currentExpenses,
            totalMonthlyCost,
            totalAnnualCost,
            firstYearTotal,
            setupCosts,
            annualVisaCost,
            totalHealthcareCost,
            totalEducationCost,
            costDifference,
            costSavings,
            costRatio,
            affordabilityScore,
            recommendation,
            familySize,
            lifestyle
        });
    }

    function calculateSetupCosts(targetCountry, familySize, lifestyle) {
        const baseCosts = {
            TH: 2000, PT: 3500, MX: 1800, CR: 2500, MY: 1500, PH: 1200, VN: 1000, ID: 1300, ES: 4000, IT: 4500,
            GR: 3000, CZ: 2800, PL: 2200, HU: 2400, EE: 3200, LV: 2800, LT: 2600, BG: 1800, RO: 2000, UA: 1500
        };
        
        const baseSetup = baseCosts[targetCountry] || 2500;
        const familyMultiplier = 1 + (familySize - 1) * 0.3;
        const lifestyleMultiplier = lifestyle === 'luxury' ? 1.5 : lifestyle === 'comfortable' ? 1.2 : 1.0;
        
        return Math.round(baseSetup * familyMultiplier * lifestyleMultiplier);
    }

    function calculateAffordabilityScore(currentExpenses, targetMonthlyCost, costRatio) {
        let score = 50; // Base score
        
        // Cost ratio factor (40% of score)
        if (costRatio < 0.5) score += 25;
        else if (costRatio < 0.7) score += 15;
        else if (costRatio < 0.9) score += 5;
        else if (costRatio < 1.1) score -= 5;
        else if (costRatio < 1.3) score -= 15;
        else score -= 25;
        
        // Budget buffer factor (30% of score)
        const budgetRatio = currentExpenses / targetMonthlyCost;
        if (budgetRatio > 1.5) score += 20;
        else if (budgetRatio > 1.2) score += 10;
        else if (budgetRatio > 1.0) score += 0;
        else if (budgetRatio > 0.8) score -= 10;
        else score -= 20;
        
        // Lifestyle sustainability (30% of score)
        if (costRatio < 0.6) score += 15; // Very affordable
        else if (costRatio > 1.2) score -= 10; // Expensive move
        
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    function generateRecommendation(score, costRatio, targetCountry) {
        let recommendation = {
            verdict: '',
            reasoning: '',
            tips: []
        };

        if (score >= 80) {
            recommendation.verdict = 'Highly Recommended';
            recommendation.reasoning = 'This destination offers excellent value for your budget with significant cost savings and good quality of life.';
        } else if (score >= 65) {
            recommendation.verdict = 'Recommended';
            recommendation.reasoning = 'This is a viable expat destination that fits well within your budget with some cost advantages.';
        } else if (score >= 50) {
            recommendation.verdict = 'Proceed with Caution';
            recommendation.reasoning = 'This destination is financially feasible but requires careful budgeting and planning.';
        } else if (score >= 35) {
            recommendation.verdict = 'Challenging';
            recommendation.reasoning = 'This move would strain your budget. Consider increasing income or choosing a more affordable destination.';
        } else {
            recommendation.verdict = 'Not Recommended';
            recommendation.reasoning = 'This destination exceeds your current budget capacity. Significant financial preparation would be needed.';
        }

        // Add specific tips
        if (costRatio < 0.7) {
            recommendation.tips.push('Take advantage of the lower cost of living to build savings');
        }
        if (costRatio > 1.2) {
            recommendation.tips.push('Consider remote work to maintain higher income');
            recommendation.tips.push('Look into more affordable cities within the country');
        }
        if (score < 60) {
            recommendation.tips.push('Build a larger emergency fund before moving');
            recommendation.tips.push('Research visa requirements and associated costs carefully');
        }

        return recommendation;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function displayResults(data) {
        const costDifferenceClass = data.costDifference > 0 ? 'text-red-400' : 'text-green-400';
        const scoreClass = data.affordabilityScore >= 70 ? 'text-green-400' : 
                          data.affordabilityScore >= 50 ? 'text-yellow-400' : 'text-red-400';

        resultContent.innerHTML = `
            <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
                <h3 class="text-2xl font-bold text-primary mb-4">Expat Cost Analysis: ${sanitizeText(data.targetCountry)}</h3>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="text-lg font-semibold text-accent mb-3">Monthly Costs</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Current (${sanitizeText(data.currentCountry)}):</span>
                                <span class="text-text font-medium">$${data.currentExpenses.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Target (${sanitizeText(data.targetCountry)}):</span>
                                <span class="text-text font-medium">$${Math.round(data.totalMonthlyCost).toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between border-t border-accent pt-2">
                                <span class="text-light">Monthly Difference:</span>
                                <span class="${sanitizeText(costDifferenceClass)} font-medium">
                                    ${data.costDifference > 0 ? '+' : ''}$${Math.round(data.costDifference/12).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="text-lg font-semibold text-accent mb-3">Annual Costs</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Living Expenses:</span>
                                <span class="text-text font-medium">$${Math.round(data.totalAnnualCost - data.annualVisaCost).toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Visa Costs:</span>
                                <span class="text-text font-medium">$${data.annualVisaCost.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between border-t border-accent pt-2">
                                <span class="text-light">Total Annual:</span>
                                <span class="text-text font-medium">$${Math.round(data.totalAnnualCost).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-xl font-bold text-primary">Affordability Score</h4>
                        <div class="text-3xl font-bold ${sanitizeText(scoreClass)}">${sanitizeText(data.affordabilityScore)}/100</div>
                    </div>
                    <div class="mb-4">
                        <div class="w-full bg-dark rounded-full h-3">
                            <div class="h-3 rounded-full transition-all duration-500 ${
                                data.affordabilityScore >= 70 ? 'bg-green-400' : 
                                data.affordabilityScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                            }" style="width: ${sanitizeText(data.affordabilityScore)}%"></div>
                        </div>
                    </div>
                    <div class="text-center">
                        <span class="text-lg font-semibold ${sanitizeText(scoreClass)}">${sanitizeText(data.recommendation.verdict)}</span>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">$${data.setupCosts.toLocaleString()}</div>
                        <div class="text-sm text-light">First Year Setup</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">$${data.totalHealthcareCost.toLocaleString()}</div>
                        <div class="text-sm text-light">Monthly Healthcare</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">$${data.totalEducationCost.toLocaleString()}</div>
                        <div class="text-sm text-light">Monthly Education</div>
                    </div>
                </div>

                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-lg font-semibold text-accent mb-3">Recommendation</h4>
                    <p class="text-light mb-4">${escapeHtml(data.recommendation.reasoning)}</p>
                    
                    ${data.recommendation.tips.length > 0 ? `
                        <div class="mt-4">
                            <h5 class="font-semibold text-primary mb-2">Financial Tips:</h5>
                            <ul class="text-sm text-light space-y-1">
                                ${data.recommendation.tips.map(tip => `<li>â€¢ ${escapeHtml(tip)}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="mt-4 p-4 bg-broder rounded border border-accent">
                        <h5 class="font-semibold text-primary mb-2">First Year Budget Summary:</h5>
                        <div class="text-sm text-light">
                            <div class="flex justify-between mb-1">
                                <span>Annual Living Costs:</span>
                                <span>$${Math.round(data.totalAnnualCost).toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between mb-1">
                                <span>Setup & Moving Costs:</span>
                                <span>$${data.setupCosts.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between font-semibold border-t border-accent pt-1">
                                <span>Total First Year:</span>
                                <span>$${Math.round(data.firstYearTotal).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
});
