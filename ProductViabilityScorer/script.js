// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('viability-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateViability();
    });
});

function collectFormData() {
    return {
        productName: document.getElementById('productName').value,
        problemDescription: document.getElementById('problemDescription').value,
        marketSize: document.getElementById('marketSize').value,
        competitionLevel: document.getElementById('competitionLevel').value,
        buildCost: parseFloat(document.getElementById('buildCost').value),
        timeToBuild: parseInt(document.getElementById('timeToBuild').value),
        expertiseLevel: document.getElementById('expertiseLevel').value,
        acquisitionCost: parseFloat(document.getElementById('acquisitionCost').value),
        revenuePerCustomer: parseFloat(document.getElementById('revenuePerCustomer').value),
        availableFunding: parseFloat(document.getElementById('availableFunding').value),
        firstMover: document.getElementById('firstMover').checked,
        networkEffect: document.getElementById('networkEffect').checked,
        proprietary: document.getElementById('proprietary').checked,
        brandPower: document.getElementById('brandPower').checked,
        customerInterviews: document.getElementById('customerInterviews').checked,
        preOrders: document.getElementById('preOrders').checked,
        prototype: document.getElementById('prototype').checked,
        marketResearch: document.getElementById('marketResearch').checked
    };
}

function calculateViability() {
    const data = collectFormData();
    
    // Market factors (40% weight)
    const marketScore = calculateMarketScore(data);
    
    // Financial factors (30% weight)
    const financialScore = calculateFinancialScore(data);
    
    // Execution factors (20% weight)
    const executionScore = calculateExecutionScore(data);
    
    // Validation factors (10% weight)
    const validationScore = calculateValidationScore(data);
    
    // Calculate weighted overall score
    const overallScore = Math.round(
        (marketScore * 0.4) + 
        (financialScore * 0.3) + 
        (executionScore * 0.2) + 
        (validationScore * 0.1)
    );
    
    // Risk assessment
    const riskLevel = calculateRiskLevel(overallScore);
    
    // Financial projections
    const financialProjections = calculateFinancialProjections(data);
    
    // Recommendations
    const recommendations = generateRecommendations(overallScore, data);
    
    displayResults({
        overallScore,
        marketScore,
        financialScore,
        executionScore,
        validationScore,
        riskLevel,
        financialProjections,
        recommendations,
        data
    });
}

function calculateMarketScore(data) {
    let score = 0;
    
    // Market size scoring
    const marketSizeScores = {
        'niche': 65,
        'small': 75,
        'medium': 85,
        'large': 80,
        'massive': 70
    };
    score += (marketSizeScores[data.marketSize] || 50) * 0.3;
    
    // Competition level scoring
    const competitionScores = {
        'none': 90,
        'low': 85,
        'medium': 75,
        'high': 60,
        'saturated': 40
    };
    score += (competitionScores[data.competitionLevel] || 50) * 0.4;
    
    // Customer acquisition feasibility
    const ltv = data.revenuePerCustomer;
    const cac = data.acquisitionCost;
    const ltvCacRatio = ltv / Math.max(cac, 1);
    
    let acquisitionScore = 50;
    if (ltvCacRatio >= 5) acquisitionScore = 95;
    else if (ltvCacRatio >= 3) acquisitionScore = 85;
    else if (ltvCacRatio >= 2) acquisitionScore = 70;
    else if (ltvCacRatio >= 1.5) acquisitionScore = 60;
    
    score += acquisitionScore * 0.3;
    
    return Math.round(score);
}

function calculateFinancialScore(data) {
    let score = 0;
    
    // Funding adequacy
    const fundingRatio = data.availableFunding / Math.max(data.buildCost, 1);
    let fundingScore = 50;
    if (fundingRatio >= 3) fundingScore = 95;
    else if (fundingRatio >= 2) fundingScore = 85;
    else if (fundingRatio >= 1.5) fundingScore = 75;
    else if (fundingRatio >= 1) fundingScore = 65;
    else if (fundingRatio >= 0.7) fundingScore = 50;
    else fundingScore = 30;
    
    score += fundingScore * 0.4;
    
    // Revenue model viability
    const ltv = data.revenuePerCustomer;
    const cac = data.acquisitionCost;
    const paybackPeriod = cac / (ltv * 0.1); // Assuming 10% monthly revenue
    
    let revenueScore = 50;
    if (paybackPeriod <= 6) revenueScore = 90;
    else if (paybackPeriod <= 12) revenueScore = 80;
    else if (paybackPeriod <= 18) revenueScore = 70;
    else if (paybackPeriod <= 24) revenueScore = 60;
    else revenueScore = 40;
    
    score += revenueScore * 0.3;
    
    // Build cost reasonableness
    let costScore = 70;
    if (data.buildCost > 500000) costScore = 40;
    else if (data.buildCost > 200000) costScore = 55;
    else if (data.buildCost > 100000) costScore = 70;
    else if (data.buildCost > 50000) costScore = 80;
    else costScore = 90;
    
    score += costScore * 0.3;
    
    return Math.round(score);
}

function calculateExecutionScore(data) {
    let score = 0;
    
    // Expertise level scoring
    const expertiseScores = {
        'beginner': 40,
        'some': 60,
        'experienced': 75,
        'expert': 85,
        'domain': 95
    };
    score += (expertiseScores[data.expertiseLevel] || 50) * 0.4;
    
    // Time to build feasibility
    let timeScore = 70;
    if (data.timeToBuild <= 3) timeScore = 90;
    else if (data.timeToBuild <= 6) timeScore = 80;
    else if (data.timeToBuild <= 12) timeScore = 70;
    else if (data.timeToBuild <= 18) timeScore = 60;
    else timeScore = 40;
    
    score += timeScore * 0.3;
    
    // Unique value propositions
    let uniquenessScore = 50;
    if (data.firstMover) uniquenessScore += 15;
    if (data.networkEffect) uniquenessScore += 15;
    if (data.proprietary) uniquenessScore += 10;
    if (data.brandPower) uniquenessScore += 10;
    
    score += Math.min(uniquenessScore, 100) * 0.3;
    
    return Math.round(score);
}

function calculateValidationScore(data) {
    let score = 50;
    
    if (data.customerInterviews) score += 15;
    if (data.preOrders) score += 20;
    if (data.prototype) score += 10;
    if (data.marketResearch) score += 5;
    
    return Math.min(score, 100);
}

function calculateRiskLevel(score) {
    if (score >= 80) {
        return {
            level: 'Low Risk',
            color: 'text-green-400',
            description: 'Strong viability indicators',
            recommendation: 'Proceed with development'
        };
    } else if (score >= 60) {
        return {
            level: 'Medium Risk',
            color: 'text-yellow-400',
            description: 'Good potential with areas for improvement',
            recommendation: 'Validate and refine before proceeding'
        };
    } else {
        return {
            level: 'High Risk',
            color: 'text-red-400',
            description: 'Significant concerns identified',
            recommendation: 'Consider pivoting or extensive validation'
        };
    }
}

function calculateFinancialProjections(data) {
    const ltv = data.revenuePerCustomer;
    const cac = data.acquisitionCost;
    const buildCost = data.buildCost;
    const funding = data.availableFunding;
    
    // Break-even analysis
    const fixedCosts = buildCost;
    const variableCostPerCustomer = cac;
    const revenuePerCustomer = ltv;
    const contributionMargin = revenuePerCustomer - variableCostPerCustomer;
    
    const breakEvenCustomers = Math.ceil(fixedCosts / Math.max(contributionMargin, 1));
    const monthsToBreakEven = Math.ceil(breakEvenCustomers / Math.max(10, 1)); // Assuming 10 customers per month initially
    
    // ROI calculation
    const totalInvestment = buildCost;
    const yearOneRevenue = breakEvenCustomers * revenuePerCustomer * 1.5; // 50% growth after break-even
    const roi = ((yearOneRevenue - totalInvestment) / totalInvestment) * 100;
    
    return {
        breakEvenCustomers,
        monthsToBreakEven,
        ltvCacRatio: ltv / Math.max(cac, 1),
        roi: Math.round(roi),
        fundingRunway: Math.round(funding / (buildCost / Math.max(data.timeToBuild, 1))),
        yearOneRevenue: Math.round(yearOneRevenue)
    };
}

function generateRecommendations(score, data) {
    const recommendations = [];
    
    if (score >= 80) {
        recommendations.push('Strong viability - proceed with MVP development');
        recommendations.push('Focus on rapid prototyping and user feedback');
        recommendations.push('Establish key metrics tracking from day one');
    } else if (score >= 60) {
        recommendations.push('Conduct additional market validation');
        recommendations.push('Refine value proposition based on customer feedback');
        recommendations.push('Consider building a simpler MVP first');
    } else {
        recommendations.push('Significant validation needed before proceeding');
        recommendations.push('Consider pivoting to address identified weaknesses');
        recommendations.push('Seek expert mentorship and advice');
    }
    
    // Specific recommendations based on weak areas
    if (data.acquisitionCost > data.revenuePerCustomer * 0.5) {
        recommendations.push('Reduce customer acquisition costs or increase pricing');
    }
    
    if (data.buildCost > data.availableFunding * 0.7) {
        recommendations.push('Secure additional funding or reduce development scope');
    }
    
    if (data.competitionLevel === 'saturated') {
        recommendations.push('Focus on unique differentiation or niche positioning');
    }
    
    return recommendations;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };
    
    contentDiv.innerHTML = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">Viability Assessment for "${escapeHtml(results.data.productName)}"</h3>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-4xl font-bold ${getScoreColor(results.overallScore)}">${sanitizeText(results.overallScore)}/100</div>
                    <div class="text-light">Overall Viability Score</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold ${sanitizeText(results.riskLevel.color)}">${sanitizeText(results.riskLevel.level)}</div>
                    <div class="text-light">Risk Assessment</div>
                </div>
                <div class="text-center">
                    <div class="text-lg font-bold text-accent">${sanitizeText(results.financialProjections.monthsToBreakEven)} months</div>
                    <div class="text-light">Est. Break-even Time</div>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Score Breakdown</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-light">Market Factors (40%)</span>
                        <span class="${getScoreColor(results.marketScore)} font-bold">${sanitizeText(results.marketScore)}/100</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Financial Factors (30%)</span>
                        <span class="${getScoreColor(results.financialScore)} font-bold">${sanitizeText(results.financialScore)}/100</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Execution Factors (20%)</span>
                        <span class="${getScoreColor(results.executionScore)} font-bold">${sanitizeText(results.executionScore)}/100</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Validation Factors (10%)</span>
                        <span class="${getScoreColor(results.validationScore)} font-bold">${sanitizeText(results.validationScore)}/100</span>
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Financial Projections</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-light">Break-even Customers:</span>
                        <span class="text-accent">${results.financialProjections.breakEvenCustomers.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">LTV:CAC Ratio:</span>
                        <span class="text-accent">${results.financialProjections.ltvCacRatio.toFixed(1)}:1</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Projected ROI:</span>
                        <span class="text-accent">${sanitizeText(results.financialProjections.roi)}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Funding Runway:</span>
                        <span class="text-accent">${sanitizeText(results.financialProjections.fundingRunway)} months</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-broder p-6 rounded border border-accent mb-6">
            <h4 class="text-xl font-bold text-primary mb-4">Risk Assessment</h4>
            <div class="flex items-center space-x-4 mb-4">
                <div class="text-2xl font-bold ${sanitizeText(results.riskLevel.color)}">${sanitizeText(results.riskLevel.level)}</div>
                <div class="text-light">${sanitizeText(results.riskLevel.description)}</div>
            </div>
            <div class="bg-dark p-4 rounded border border-accent">
                <div class="font-semibold text-accent mb-2">Recommendation:</div>
                <div class="text-light">${sanitizeText(results.riskLevel.recommendation)}</div>
            </div>
        </div>

        <div class="bg-dark p-6 rounded border border-accent">
            <h4 class="text-xl font-bold text-primary mb-4">Next Steps & Recommendations</h4>
            <div class="space-y-3">
                ${results.recommendations.map(rec => `
                    <div class="flex items-start space-x-3">
                        <span class="material-icons text-primary mt-1">arrow_forward</span>
                        <div class="text-light">${escapeHtml(rec)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
