// Micro-Credential Value Assessor Logic

// Credential type data with base scores and multipliers
const credentialData = {
    'coding-bootcamp': {
        name: 'Coding Bootcamp',
        baseValue: 8.5,
        employerRecognition: 8.0,
        marketDemand: 9.0,
        avgSalaryIncrease: 35000,
        jobPlacementRate: 75,
        timeToEmployment: 3
    },
    'data-science-bootcamp': {
        name: 'Data Science Bootcamp',
        baseValue: 8.2,
        employerRecognition: 7.5,
        marketDemand: 8.8,
        avgSalaryIncrease: 40000,
        jobPlacementRate: 70,
        timeToEmployment: 4
    },
    'ux-ui-bootcamp': {
        name: 'UX/UI Design Bootcamp',
        baseValue: 7.8,
        employerRecognition: 7.0,
        marketDemand: 8.0,
        avgSalaryIncrease: 25000,
        jobPlacementRate: 65,
        timeToEmployment: 4
    },
    'digital-marketing-cert': {
        name: 'Digital Marketing Certificate',
        baseValue: 7.5,
        employerRecognition: 7.5,
        marketDemand: 8.5,
        avgSalaryIncrease: 15000,
        jobPlacementRate: 80,
        timeToEmployment: 2
    },
    'project-management-cert': {
        name: 'Project Management Certificate',
        baseValue: 8.0,
        employerRecognition: 8.5,
        marketDemand: 8.0,
        avgSalaryIncrease: 20000,
        jobPlacementRate: 85,
        timeToEmployment: 2
    },
    'cybersecurity-cert': {
        name: 'Cybersecurity Certificate',
        baseValue: 8.8,
        employerRecognition: 9.0,
        marketDemand: 9.5,
        avgSalaryIncrease: 45000,
        jobPlacementRate: 80,
        timeToEmployment: 3
    },
    'cloud-computing-cert': {
        name: 'Cloud Computing Certificate',
        baseValue: 9.0,
        employerRecognition: 9.2,
        marketDemand: 9.8,
        avgSalaryIncrease: 50000,
        jobPlacementRate: 85,
        timeToEmployment: 2
    },
    'online-mba': {
        name: 'Online MBA Program',
        baseValue: 7.0,
        employerRecognition: 6.5,
        marketDemand: 6.0,
        avgSalaryIncrease: 30000,
        jobPlacementRate: 60,
        timeToEmployment: 6
    },
    'professional-cert': {
        name: 'Professional Certificate Program',
        baseValue: 7.2,
        employerRecognition: 7.0,
        marketDemand: 7.5,
        avgSalaryIncrease: 18000,
        jobPlacementRate: 70,
        timeToEmployment: 3
    },
    'industry-cert': {
        name: 'Industry-Specific Certificate',
        baseValue: 7.8,
        employerRecognition: 8.0,
        marketDemand: 7.0,
        avgSalaryIncrease: 22000,
        jobPlacementRate: 75,
        timeToEmployment: 3
    },
    'skill-badge': {
        name: 'Digital Skill Badge',
        baseValue: 5.5,
        employerRecognition: 5.0,
        marketDemand: 6.0,
        avgSalaryIncrease: 5000,
        jobPlacementRate: 40,
        timeToEmployment: 1
    },
    'nanodegree': {
        name: 'Nanodegree Program',
        baseValue: 6.8,
        employerRecognition: 6.5,
        marketDemand: 7.5,
        avgSalaryIncrease: 15000,
        jobPlacementRate: 55,
        timeToEmployment: 4
    },
    'other': {
        name: 'Other Credential',
        baseValue: 6.0,
        employerRecognition: 6.0,
        marketDemand: 6.0,
        avgSalaryIncrease: 10000,
        jobPlacementRate: 50,
        timeToEmployment: 4
    }
};

// Industry multipliers
const industryMultipliers = {
    'technology': 1.3,
    'finance': 1.1,
    'healthcare': 1.0,
    'marketing': 1.2,
    'consulting': 1.15,
    'education': 0.9,
    'manufacturing': 0.95,
    'retail': 0.85,
    'government': 0.9,
    'other': 1.0
};

// Experience level adjustments
const experienceAdjustments = {
    'entry-level': 1.2,
    'junior': 1.1,
    'mid-level': 1.0,
    'senior': 0.8,
    'career-change': 1.3
};

// Duration impact on value
const durationImpact = {
    '1-3-months': 0.8,
    '3-6-months': 1.0,
    '6-12-months': 1.1,
    '1-2-years': 1.0,
    '2-4-years': 0.9
};

// Location multipliers
const locationMultipliers = {
    'major-us-city': 1.2,
    'mid-tier-us-city': 1.0,
    'small-us-city': 0.8,
    'international': 0.9,
    'remote': 1.1
};

// Form submission handler
document.getElementById('credential-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = collectFormData();
    if (validateFormData(formData)) {
        const results = assessCredentialValue(formData);
        displayResults(results);
    }
});

// Collect form data
function collectFormData() {
    return {
        credentialType: document.getElementById('credential-type').value,
        credentialName: document.getElementById('credential-name').value,
        credentialCost: parseFloat(document.getElementById('credential-cost').value),
        duration: document.getElementById('credential-duration').value,
        targetIndustry: document.getElementById('target-industry').value,
        experienceLevel: document.getElementById('experience-level').value,
        targetJob: document.getElementById('target-job').value,
        currentSalary: parseFloat(document.getElementById('current-salary').value) || 0,
        location: document.getElementById('location').value
    };
}

// Validate form data
function validateFormData(data) {
    if (!data.credentialType || !data.credentialName || !data.credentialCost || 
        !data.duration || !data.targetIndustry || !data.experienceLevel || 
        !data.targetJob || !data.location) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (data.credentialCost < 0 || data.credentialCost > 100000) {
        alert('Please enter a realistic cost between $0 and $100,000.');
        return false;
    }
    
    return true;
}

// Assess credential value
function assessCredentialValue(data) {
    const credential = credentialData[data.credentialType];
    
    // Base calculations
    let valueScore = credential.baseValue;
    let employerRecognition = credential.employerRecognition;
    let marketDemand = credential.marketDemand;
    let salaryIncrease = credential.avgSalaryIncrease;
    
    // Apply multipliers
    const industryMultiplier = industryMultipliers[data.targetIndustry] || 1.0;
    const experienceAdjustment = experienceAdjustments[data.experienceLevel] || 1.0;
    const durationMultiplier = durationImpact[data.duration] || 1.0;
    const locationMultiplier = locationMultipliers[data.location] || 1.0;
    
    // Adjust scores
    valueScore = valueScore * industryMultiplier * experienceAdjustment * durationMultiplier;
    salaryIncrease = salaryIncrease * industryMultiplier * locationMultiplier;
    
    // Cost-benefit analysis
    const roi = data.currentSalary > 0 ? ((salaryIncrease * 3) - data.credentialCost) / data.credentialCost * 100 : 0;
    const paybackMonths = salaryIncrease > 0 ? (data.credentialCost / (salaryIncrease / 12)) : 0;
    
    // Value rating (1-10)
    const finalValueRating = Math.min(Math.max(valueScore, 1), 10);
    
    // Generate recommendations
    let recommendation = '';
    let recommendationClass = '';
    
    if (finalValueRating >= 8.5) {
        recommendation = 'Excellent Investment - High value with strong market recognition';
        recommendationClass = 'text-green-400';
    } else if (finalValueRating >= 7.0) {
        recommendation = 'Good Investment - Solid value with decent market acceptance';
        recommendationClass = 'text-yellow-400';
    } else if (finalValueRating >= 5.5) {
        recommendation = 'Moderate Value - Consider alternatives or timing';
        recommendationClass = 'text-orange-400';
    } else {
        recommendation = 'Low Value - Explore better alternatives';
        recommendationClass = 'text-red-400';
    }
    
    // Generate alternatives
    const alternatives = generateAlternatives(data.credentialType, data.targetIndustry);
    
    return {
        credentialName: data.credentialName,
        credentialType: credential.name,
        valueRating: finalValueRating,
        employerRecognition: Math.min(employerRecognition * industryMultiplier, 10),
        marketDemand: Math.min(marketDemand * industryMultiplier, 10),
        jobPlacementRate: credential.jobPlacementRate,
        salaryIncrease: salaryIncrease,
        roi: roi,
        paybackMonths: paybackMonths,
        timeToEmployment: credential.timeToEmployment,
        cost: data.credentialCost,
        recommendation: recommendation,
        recommendationClass: recommendationClass,
        alternatives: alternatives,
        multipliers: {
            industry: industryMultiplier,
            experience: experienceAdjustment,
            duration: durationMultiplier,
            location: locationMultiplier
        }
    };
}

// Generate alternative recommendations
function generateAlternatives(credentialType, industry) {
    const alternatives = [];
    
    // Industry-specific alternatives
    if (industry === 'technology') {
        alternatives.push(
            'Free coding resources (freeCodeCamp, Codecademy)',
            'Open source project contributions',
            'Google Career Certificates',
            'University computer science courses'
        );
    } else if (industry === 'marketing') {
        alternatives.push(
            'Google Ads and Analytics certifications',
            'HubSpot Academy courses',
            'Facebook Blueprint certification',
            'Content marketing internships'
        );
    } else if (industry === 'finance') {
        alternatives.push(
            'CFA or FRM certifications',
            'Financial modeling courses',
            'Bloomberg Market Concepts',
            'University finance programs'
        );
    } else {
        alternatives.push(
            'Professional association courses',
            'Industry conferences and workshops',
            'Mentorship programs',
            'Traditional degree programs'
        );
    }
    
    return alternatives;
}

// Display results
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    contentDiv.innerHTML = `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">Value Assessment: ${results.credentialName}</h3>
            
            <!-- Overall Rating -->
            <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-primary">Overall Value Rating</h4>
                    <div class="text-3xl font-bold text-primary">${results.valueRating.toFixed(1)}/10</div>
                </div>
                <p class="text-lg ${results.recommendationClass}">${results.recommendation}</p>
            </div>
            
            <!-- Key Metrics -->
            <div class="grid md:grid-cols-3 gap-6 mb-6">
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-accent">${results.employerRecognition.toFixed(1)}/10</div>
                    <div class="text-sm text-light">Employer Recognition</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-green-400">${results.marketDemand.toFixed(1)}/10</div>
                    <div class="text-sm text-light">Market Demand</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-yellow-400">${results.jobPlacementRate}%</div>
                    <div class="text-sm text-light">Job Placement Rate</div>
                </div>
            </div>
            
            <!-- Financial Analysis -->
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-dark p-4 rounded border border-accent">
                    <h4 class="font-semibold text-accent mb-3">Financial Impact</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-light">Program Cost:</span>
                            <span class="text-text">$${results.cost.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Expected Salary Increase:</span>
                            <span class="text-primary">$${Math.round(results.salaryIncrease).toLocaleString()}</span>
                        </div>
                        ${results.roi > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-light">3-Year ROI:</span>
                            <span class="text-green-400">${Math.round(results.roi)}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Payback Period:</span>
                            <span class="text-accent">${Math.round(results.paybackMonths)} months</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="bg-dark p-4 rounded border border-accent">
                    <h4 class="font-semibold text-accent mb-3">Career Timeline</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-light">Time to Employment:</span>
                            <span class="text-text">${results.timeToEmployment} months</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Credential Type:</span>
                            <span class="text-text">${results.credentialType}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Market Position:</span>
                            <span class="text-accent">${results.marketDemand >= 8 ? 'High Demand' : results.marketDemand >= 6 ? 'Moderate Demand' : 'Low Demand'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Adjustment Factors -->
            <div class="bg-dark p-4 rounded border border-accent mb-6">
                <h4 class="font-semibold text-accent mb-3">Assessment Factors Applied</h4>
                <div class="grid md:grid-cols-4 gap-4 text-sm">
                    <div class="text-center">
                        <div class="text-lg font-bold text-primary">${(results.multipliers.industry * 100).toFixed(0)}%</div>
                        <div class="text-light">Industry Factor</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-primary">${(results.multipliers.experience * 100).toFixed(0)}%</div>
                        <div class="text-light">Experience Level</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-primary">${(results.multipliers.duration * 100).toFixed(0)}%</div>
                        <div class="text-light">Program Duration</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-primary">${(results.multipliers.location * 100).toFixed(0)}%</div>
                        <div class="text-light">Location Factor</div>
                    </div>
                </div>
            </div>
            
            <!-- Alternative Recommendations -->
            <div class="bg-dark p-4 rounded border border-accent">
                <h4 class="font-semibold text-accent mb-3">Alternative Options to Consider</h4>
                <div class="grid md:grid-cols-2 gap-4">
                    ${results.alternatives.map(alt => `
                        <div class="bg-broder p-3 rounded border border-accent">
                            <p class="text-sm text-light">• ${alt}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Load footer component
fetch('../src/components/Footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    })
    .catch(error => console.log('Footer loading failed:', error));