// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`n// Salary Negotiation Calculator Script

// Popup functionality
function showPopup(message) {
    document.getElementById('popupMessage').textContent = message;
    document.getElementById('customPopup').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('customPopup').classList.add('hidden');
}

// Close popup when clicking outside
document.getElementById('customPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// ===== SALARY DATA AND MULTIPLIERS =====
const SALARY_DATA = {
    'software-engineer': { base: 95000, growth: 0.08 },
    'data-scientist': { base: 105000, growth: 0.09 },
    'product-manager': { base: 115000, growth: 0.07 },
    'marketing-manager': { base: 85000, growth: 0.06 },
    'sales-manager': { base: 90000, growth: 0.07 },
    'business-analyst': { base: 75000, growth: 0.06 },
    'project-manager': { base: 85000, growth: 0.06 },
    'designer': { base: 80000, growth: 0.06 },
    'accountant': { base: 65000, growth: 0.05 },
    'hr-manager': { base: 75000, growth: 0.05 },
    'consultant': { base: 95000, growth: 0.07 },
    'other': { base: 70000, growth: 0.06 }
};

const LOCATION_MULTIPLIERS = {
    'san-francisco': 1.4,
    'new-york': 1.3,
    'seattle': 1.25,
    'los-angeles': 1.2,
    'chicago': 1.1,
    'boston': 1.15,
    'austin': 1.05,
    'denver': 1.0,
    'atlanta': 0.95,
    'remote': 1.1,
    'other': 1.0
};

const COMPANY_SIZE_MULTIPLIERS = {
    'startup': 0.9,
    'small': 0.95,
    'medium': 1.0,
    'large': 1.1,
    'enterprise': 1.2
};

const EDUCATION_MULTIPLIERS = {
    'high-school': 0.85,
    'associates': 0.9,
    'bachelors': 1.0,
    'masters': 1.15,
    'phd': 1.3,
    'bootcamp': 0.95
};

// ===== DATA COLLECTION =====
function collectSalaryData() {
    return {
        currentSalary: parseFloat(document.getElementById('currentSalary').value) || 0,
        jobTitle: document.getElementById('jobTitle').value,
        experience: parseInt(document.getElementById('experience').value) || 0,
        education: document.getElementById('education').value,
        location: document.getElementById('location').value,
        companySize: document.getElementById('companySize').value,
        specialSkills: document.getElementById('specialSkills').value,
        performance: document.getElementById('performance').value,
        negotiationType: document.getElementById('negotiationType').value,
        marketDemand: document.getElementById('marketDemand').value
    };
}

// ===== CALCULATION LOGIC =====
function calculateSalaryRange(data) {
    const jobData = SALARY_DATA[data.jobTitle] || SALARY_DATA.other;
    
    // Base market salary calculation
    let marketSalary = jobData.base;
    
    // Apply experience multiplier
    const experienceMultiplier = 1 + (data.experience * jobData.growth);
    marketSalary *= experienceMultiplier;
    
    // Apply location multiplier
    marketSalary *= LOCATION_MULTIPLIERS[data.location] || 1.0;
    
    // Apply company size multiplier
    marketSalary *= COMPANY_SIZE_MULTIPLIERS[data.companySize] || 1.0;
    
    // Apply education multiplier
    marketSalary *= EDUCATION_MULTIPLIERS[data.education] || 1.0;
    
    // Apply skills multiplier
    const skillsMultipliers = {
        'none': 1.0,
        'basic': 1.05,
        'intermediate': 1.1,
        'advanced': 1.2,
        'expert': 1.35
    };
    marketSalary *= skillsMultipliers[data.specialSkills] || 1.0;
    
    // Apply performance multiplier
    const performanceMultipliers = {
        'below': 0.9,
        'meets': 1.0,
        'exceeds': 1.1,
        'outstanding': 1.25
    };
    marketSalary *= performanceMultipliers[data.performance] || 1.0;
    
    // Apply market demand multiplier
    const demandMultipliers = {
        'low': 0.95,
        'moderate': 1.0,
        'high': 1.1,
        'very-high': 1.2
    };
    marketSalary *= demandMultipliers[data.marketDemand] || 1.0;
    
    // Calculate salary range
    const range = {
        low: marketSalary * 0.85,
        market: marketSalary,
        high: marketSalary * 1.25
    };
    
    // Calculate negotiation recommendations
    const negotiationStrategy = calculateNegotiationStrategy(data, range);
    
    return {
        range: range,
        strategy: negotiationStrategy,
        analysis: generateSalaryAnalysis(data, range),
        talkingPoints: generateTalkingPoints(data, range),
        careerProjection: calculateCareerProjection(data, range)
    };
}

function calculateNegotiationStrategy(data, range) {
    let recommendedAsk = range.market;
    let confidence = 'medium';
    let approach = 'standard';
    
    // Adjust based on negotiation type
    const typeMultipliers = {
        'raise': 1.08,
        'promotion': 1.15,
        'new-job': 1.12,
        'counter-offer': 1.18
    };
    recommendedAsk *= typeMultipliers[data.negotiationType] || 1.0;
    
    // Adjust based on current salary vs market
    const currentVsMarket = data.currentSalary / range.market;
    if (currentVsMarket < 0.8) {
        recommendedAsk *= 1.1;
        confidence = 'high';
        approach = 'aggressive';
    } else if (currentVsMarket > 1.2) {
        recommendedAsk *= 0.95;
        confidence = 'low';
        approach = 'conservative';
    }
    
    // Cap the ask at reasonable levels
    recommendedAsk = Math.min(recommendedAsk, range.high);
    
    return {
        recommendedAsk: recommendedAsk,
        confidence: confidence,
        approach: approach,
        percentileTarget: calculatePercentile(recommendedAsk, range),
        negotiationLeverage: calculateLeverage(data, range)
    };
}

function calculatePercentile(salary, range) {
    if (salary <= range.low) return 25;
    if (salary <= range.market) return 50 + ((salary - range.low) / (range.market - range.low)) * 25;
    if (salary <= range.high) return 75 + ((salary - range.market) / (range.high - range.market)) * 20;
    return 95;
}

function calculateLeverage(data, range) {
    let leverage = 50; // Base leverage score
    
    // Performance impact
    const performanceScores = { 'below': -20, 'meets': 0, 'exceeds': 15, 'outstanding': 30 };
    leverage += performanceScores[data.performance] || 0;
    
    // Market demand impact
    const demandScores = { 'low': -15, 'moderate': 0, 'high': 15, 'very-high': 25 };
    leverage += demandScores[data.marketDemand] || 0;
    
    // Skills impact
    const skillsScores = { 'none': -10, 'basic': 0, 'intermediate': 10, 'advanced': 20, 'expert': 30 };
    leverage += skillsScores[data.specialSkills] || 0;
    
    // Current salary vs market impact
    const currentVsMarket = data.currentSalary / range.market;
    if (currentVsMarket < 0.8) leverage += 20;
    else if (currentVsMarket > 1.2) leverage -= 15;
    
    return Math.max(0, Math.min(100, leverage));
}

function generateSalaryAnalysis(data, range) {
    const currentVsMarket = (data.currentSalary / range.market - 1) * 100;
    const gapAnalysis = data.currentSalary < range.low ? 'underpaid' : 
                       data.currentSalary > range.high ? 'overpaid' : 'market-rate';
    
    return {
        currentVsMarket: currentVsMarket,
        gapAnalysis: gapAnalysis,
        marketPosition: getMarketPosition(currentVsMarket),
        strengthAreas: identifyStrengths(data),
        improvementAreas: identifyImprovements(data)
    };
}

function getMarketPosition(percentage) {
    if (percentage < -20) return 'Significantly below market';
    if (percentage < -10) return 'Below market';
    if (percentage < 10) return 'At market rate';
    if (percentage < 25) return 'Above market';
    return 'Significantly above market';
}

function identifyStrengths(data) {
    const strengths = [];
    
    if (data.experience >= 7) strengths.push('Extensive experience');
    if (data.education === 'masters' || data.education === 'phd') strengths.push('Advanced education');
    if (data.specialSkills === 'advanced' || data.specialSkills === 'expert') strengths.push('Specialized skills');
    if (data.performance === 'exceeds' || data.performance === 'outstanding') strengths.push('Strong performance');
    if (data.marketDemand === 'high' || data.marketDemand === 'very-high') strengths.push('High market demand');
    
    return strengths.length > 0 ? strengths : ['Solid professional background'];
}

function identifyImprovements(data) {
    const improvements = [];
    
    if (data.experience < 3) improvements.push('Build more experience');
    if (data.specialSkills === 'none' || data.specialSkills === 'basic') improvements.push('Develop specialized skills');
    if (data.performance === 'below' || data.performance === 'meets') improvements.push('Improve performance metrics');
    if (data.education === 'high-school') improvements.push('Consider additional education/certifications');
    
    return improvements;
}

function generateTalkingPoints(data, range) {
    const points = [];
    
    // Experience-based points
    if (data.experience >= 5) {
        points.push(`${sanitizeText(data.experience)} years of proven experience in the field`);
    }
    
    // Performance-based points
    if (data.performance === 'exceeds' || data.performance === 'outstanding') {
        points.push('Consistently exceeding performance expectations');
    }
    
    // Skills-based points
    if (data.specialSkills === 'advanced' || data.specialSkills === 'expert') {
        points.push('Specialized skills that add significant value');
    }
    
    // Market-based points
    if (data.marketDemand === 'high' || data.marketDemand === 'very-high') {
        points.push('High market demand for this role and skill set');
    }
    
    // Education-based points
    if (data.education === 'masters' || data.education === 'phd') {
        points.push('Advanced education providing strategic perspective');
    }
    
    // Current salary analysis
    if (data.currentSalary < range.market * 0.9) {
        points.push('Current compensation below market standards');
    }
    
    return points.length > 0 ? points : ['Strong professional background and contributions'];
}

function calculateCareerProjection(data, range) {
    const jobData = SALARY_DATA[data.jobTitle] || SALARY_DATA.other;
    const annualGrowth = jobData.growth;
    
    const projections = [];
    let currentProjected = range.market;
    
    for (let year = 1; year <= 10; year++) {
        currentProjected *= (1 + annualGrowth);
        if (year === 1 || year === 3 || year === 5 || year === 10) {
            projections.push({
                year: year,
                salary: currentProjected,
                totalIncrease: currentProjected - range.market
            });
        }
    }
    
    return {
        projections: projections,
        lifetimeEarnings: calculateLifetimeEarnings(range.market, annualGrowth),
        negotiationImpact: calculateNegotiationImpact(data.currentSalary, range.market)
    };
}

function calculateLifetimeEarnings(startingSalary, growthRate) {
    let total = 0;
    let currentSalary = startingSalary;
    
    for (let year = 0; year < 30; year++) {
        total += currentSalary;
        currentSalary *= (1 + growthRate);
    }
    
    return total;
}

function calculateNegotiationImpact(currentSalary, marketSalary) {
    const increase = marketSalary - currentSalary;
    const lifetimeImpact = increase * 25; // Simplified 25-year impact
    
    return {
        immediateIncrease: increase,
        lifetimeImpact: lifetimeImpact,
        percentageIncrease: (increase / currentSalary) * 100
    };
}

// ===== RESULTS DISPLAY =====
function displayResults(results) {
    const resultsDiv = document.getElementById('result-content');
    
    resultsDiv.innerHTML = `
        <!-- Salary Range Overview -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-dark/50 rounded-lg p-6 border border-accent/20 text-center">
                <h3 class="text-lg font-semibold text-light mb-2">Market Range</h3>
                <p class="text-sm text-light mb-2">Low - High</p>
                <p class="text-xl font-bold text-accent">$${Math.round(results.range.low).toLocaleString()} - $${Math.round(results.range.high).toLocaleString()}</p>
            </div>
            <div class="bg-dark/50 rounded-lg p-6 border border-primary/30 text-center">
                <h3 class="text-lg font-semibold text-primary mb-2">Market Average</h3>
                <p class="text-sm text-light mb-2">50th Percentile</p>
                <p class="text-2xl font-bold text-primary">$${Math.round(results.range.market).toLocaleString()}</p>
            </div>
            <div class="bg-dark/50 rounded-lg p-6 border border-green-500/30 text-center">
                <h3 class="text-lg font-semibold text-green-400 mb-2">Recommended Ask</h3>
                <p class="text-sm text-light mb-2">${Math.round(results.strategy.percentileTarget)}th Percentile</p>
                <p class="text-2xl font-bold text-green-400">$${Math.round(results.strategy.recommendedAsk).toLocaleString()}</p>
            </div>
        </div>

        <!-- Negotiation Strategy -->
        <div class="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-8 border border-primary/20">
            <h3 class="text-xl font-bold text-primary mb-4">Your Negotiation Strategy</h3>
            <div class="grid md:grid-cols-3 gap-6">
                <div>
                    <h4 class="font-semibold text-accent mb-2">Approach</h4>
                    <p class="text-light capitalize">${sanitizeText(results.strategy.approach)}</p>
                </div>
                <div>
                    <h4 class="font-semibold text-accent mb-2">Confidence Level</h4>
                    <p class="text-light capitalize">${sanitizeText(results.strategy.confidence)}</p>
                </div>
                <div>
                    <h4 class="font-semibold text-accent mb-2">Leverage Score</h4>
                    <p class="text-light">${sanitizeText(results.strategy.negotiationLeverage)}/100</p>
                </div>
            </div>
        </div>

        <!-- Current Position Analysis -->
        <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-dark/50 rounded-lg p-6 border border-accent/20">
                <h3 class="text-lg font-semibold text-accent mb-4">Current Position Analysis</h3>
                <div class="space-y-3">
                    <div>
                        <span class="text-light">Market Position:</span>
                        <span class="text-primary font-semibold ml-2">${sanitizeText(results.analysis.marketPosition)}</span>
                    </div>
                    <div>
                        <span class="text-light">vs Market Average:</span>
                        <span class="font-semibold ml-2 ${results.analysis.currentVsMarket >= 0 ? 'text-green-400' : 'text-red-400'}">
                            ${results.analysis.currentVsMarket >= 0 ? '+' : ''}${results.analysis.currentVsMarket.toFixed(1)}%
                        </span>
                    </div>
                    <div>
                        <span class="text-light">Gap Analysis:</span>
                        <span class="text-primary font-semibold ml-2 capitalize">${results.analysis.gapAnalysis.replace('-', ' ')}</span>
                    </div>
                </div>
            </div>

            <div class="bg-dark/50 rounded-lg p-6 border border-accent/20">
                <h3 class="text-lg font-semibold text-accent mb-4">Negotiation Impact</h3>
                <div class="space-y-3">
                    <div>
                        <span class="text-light">Immediate Increase:</span>
                        <span class="text-green-400 font-semibold ml-2">$${Math.round(results.careerProjection.negotiationImpact.immediateIncrease).toLocaleString()}</span>
                    </div>
                    <div>
                        <span class="text-light">Percentage Increase:</span>
                        <span class="text-green-400 font-semibold ml-2">${results.careerProjection.negotiationImpact.percentageIncrease.toFixed(1)}%</span>
                    </div>
                    <div>
                        <span class="text-light">Lifetime Impact:</span>
                        <span class="text-green-400 font-semibold ml-2">$${Math.round(results.careerProjection.negotiationImpact.lifetimeImpact).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Talking Points -->
        <div class="mb-8">
            <h3 class="text-xl font-bold text-primary mb-6">Key Talking Points</h3>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-dark/50 rounded-lg p-6 border border-green-500/30">
                    <h4 class="font-semibold text-green-400 mb-3">Your Strengths</h4>
                    <ul class="space-y-2">
                        ${results.analysis.strengthAreas.map(strength => `
                            <li class="text-light text-sm flex items-center">
                                <span class="material-icons text-green-400 text-sm mr-2">check_circle</span>
                                ${strength}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="bg-dark/50 rounded-lg p-6 border border-yellow-500/30">
                    <h4 class="font-semibold text-yellow-400 mb-3">Negotiation Points</h4>
                    <ul class="space-y-2">
                        ${results.talkingPoints.slice(0, 4).map(point => `
                            <li class="text-light text-sm flex items-start">
                                <span class="material-icons text-yellow-400 text-sm mr-2 mt-0.5">star</span>
                                ${point}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <!-- Career Projection -->
        <div class="mb-8">
            <h3 class="text-xl font-bold text-primary mb-6">Career Earnings Projection</h3>
            <div class="bg-dark/50 rounded-lg p-6 border border-accent/20">
                <div class="grid md:grid-cols-4 gap-4">
                    ${results.careerProjection.projections.map(proj => `
                        <div class="text-center">
                            <p class="text-sm text-light">Year ${proj.year}</p>
                            <p class="text-lg font-bold text-accent">$${Math.round(proj.salary).toLocaleString()}</p>
                            <p class="text-xs text-green-400">+$${Math.round(proj.totalIncrease).toLocaleString()}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-6 text-center">
                    <p class="text-light">Projected 30-year career earnings: 
                        <span class="text-primary font-bold">$${Math.round(results.careerProjection.lifetimeEarnings).toLocaleString()}</span>
                    </p>
                </div>
            </div>
        </div>

        <!-- Improvement Areas -->
        ${results.analysis.improvementAreas.length > 0 ? `
        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
            <h3 class="text-lg font-semibold text-yellow-400 mb-3">Areas for Improvement</h3>
            <ul class="space-y-2">
                ${results.analysis.improvementAreas.map(area => `
                    <li class="text-light text-sm flex items-center">
                        <span class="material-icons text-yellow-400 text-sm mr-2">trending_up</span>
                        ${area}
                    </li>
                `).join('')}
            </ul>
        </div>
        ` : ''}

        <!-- Action Plan -->
        <div class="bg-primary/10 border-l-4 border-primary p-6">
            <h3 class="text-lg font-semibold text-primary mb-3">Next Steps</h3>
            <ol class="text-light space-y-2 list-decimal list-inside">
                <li>Research specific salary data for your company and role</li>
                <li>Document your achievements and contributions</li>
                <li>Practice your negotiation conversation</li>
                <li>Schedule the negotiation meeting at an appropriate time</li>
                <li>Present your case confidently with supporting data</li>
            </ol>
        </div>
    `;

    // Show results section
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ===== EVENT HANDLERS =====
document.getElementById('salaryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = collectSalaryData();
    
    // Validation
    if (data.currentSalary <= 0) {
        showPopup('Please enter a valid current salary.');
        return;
    }
    
    if (data.experience < 0 || data.experience > 50) {
        showPopup('Please enter a valid years of experience (0-50).');
        return;
    }
    
    const results = calculateSalaryRange(data);
    displayResults(results);
});


