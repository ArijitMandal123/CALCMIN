// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`n// Career satisfaction factor weights
const satisfactionWeights = {
    compensation: {
        salary: 0.25,
        benefits: 0.15,
        bonus: 0.10
    },
    workLife: {
        balance: 0.20,
        flexibility: 0.15,
        stress: -0.15 // Negative weight (high stress reduces satisfaction)
    },
    growth: {
        opportunities: 0.20,
        learning: 0.15,
        promotion: 0.15,
        skillUtilization: 0.10
    },
    management: {
        managerQuality: 0.25,
        cultureFit: 0.20,
        teamRelationships: 0.15,
        recognition: 0.15
    },
    jobContent: {
        meaning: 0.20,
        autonomy: 0.15,
        commute: 0.10,
        security: 0.10
    }
};

// Industry-specific adjustments
const industryFactors = {
    technology: { growth: 1.3, compensation: 1.2, workLife: 0.9 },
    finance: { compensation: 1.4, growth: 1.1, workLife: 0.8 },
    healthcare: { meaning: 1.3, security: 1.2, workLife: 0.9 },
    education: { meaning: 1.4, security: 1.1, compensation: 0.8 },
    retail: { workLife: 0.8, security: 0.9, compensation: 0.9 },
    manufacturing: { security: 1.2, workLife: 0.9, growth: 0.9 },
    consulting: { growth: 1.2, compensation: 1.1, workLife: 0.8 },
    government: { security: 1.3, workLife: 1.1, compensation: 0.9 },
    nonprofit: { meaning: 1.4, workLife: 1.1, compensation: 0.7 },
    other: { growth: 1.0, compensation: 1.0, workLife: 1.0 }
};

// Update slider values in real-time
const sliders = [
    'salarysatisfaction', 'benefitsSatisfaction', 'bonusSatisfaction',
    'workLifeBalance', 'flexibility', 'stressLevel',
    'growthOpportunities', 'learningDevelopment', 'promotionProspects', 'skillUtilization',
    'managerQuality', 'cultureFit', 'teamRelationships', 'recognition',
    'jobMeaning', 'autonomy', 'commuteSatisfaction', 'jobSecurity'
];

sliders.forEach(sliderId => {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(sliderId.replace('satisfaction', 'Value').replace('Satisfaction', 'Value'));
    
    if (slider && valueDisplay) {
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    }
});

// Collect assessment data
function collectAssessmentData() {
    return {
        // Compensation
        currentSalary: parseInt(document.getElementById('currentSalary').value) || 50000,
        salarySatisfaction: parseInt(document.getElementById('salarysatisfaction').value),
        benefitsSatisfaction: parseInt(document.getElementById('benefitsSatisfaction').value),
        bonusSatisfaction: parseInt(document.getElementById('bonusSatisfaction').value),
        
        // Work-Life Balance
        hoursPerWeek: parseInt(document.getElementById('hoursPerWeek').value),
        workLifeBalance: parseInt(document.getElementById('workLifeBalance').value),
        flexibility: parseInt(document.getElementById('flexibility').value),
        stressLevel: parseInt(document.getElementById('stressLevel').value),
        
        // Growth & Development
        growthOpportunities: parseInt(document.getElementById('growthOpportunities').value),
        learningDevelopment: parseInt(document.getElementById('learningDevelopment').value),
        promotionProspects: parseInt(document.getElementById('promotionProspects').value),
        skillUtilization: parseInt(document.getElementById('skillUtilization').value),
        
        // Management & Culture
        managerQuality: parseInt(document.getElementById('managerQuality').value),
        cultureFit: parseInt(document.getElementById('cultureFit').value),
        teamRelationships: parseInt(document.getElementById('teamRelationships').value),
        recognition: parseInt(document.getElementById('recognition').value),
        
        // Job Content & Environment
        jobMeaning: parseInt(document.getElementById('jobMeaning').value),
        autonomy: parseInt(document.getElementById('autonomy').value),
        commuteSatisfaction: parseInt(document.getElementById('commuteSatisfaction').value),
        jobSecurity: parseInt(document.getElementById('jobSecurity').value),
        
        // Context
        yearsInRole: parseFloat(document.getElementById('yearsInRole').value),
        industry: document.getElementById('industry').value
    };
}

// Calculate overall satisfaction score
function calculateSatisfactionScore(data) {
    const industryMods = industryFactors[data.industry] || industryFactors.other;
    
    // Calculate category scores
    const compensationScore = (
        (data.salarySatisfaction * satisfactionWeights.compensation.salary) +
        (data.benefitsSatisfaction * satisfactionWeights.compensation.benefits) +
        (data.bonusSatisfaction * satisfactionWeights.compensation.bonus)
    ) * (industryMods.compensation || 1);
    
    const workLifeScore = (
        (data.workLifeBalance * satisfactionWeights.workLife.balance) +
        (data.flexibility * satisfactionWeights.workLife.flexibility) +
        (data.stressLevel * satisfactionWeights.workLife.stress) // Negative weight
    ) * (industryMods.workLife || 1);
    
    const growthScore = (
        (data.growthOpportunities * satisfactionWeights.growth.opportunities) +
        (data.learningDevelopment * satisfactionWeights.growth.learning) +
        (data.promotionProspects * satisfactionWeights.growth.promotion) +
        (data.skillUtilization * satisfactionWeights.growth.skillUtilization)
    ) * (industryMods.growth || 1);
    
    const managementScore = (
        (data.managerQuality * satisfactionWeights.management.managerQuality) +
        (data.cultureFit * satisfactionWeights.management.cultureFit) +
        (data.teamRelationships * satisfactionWeights.management.teamRelationships) +
        (data.recognition * satisfactionWeights.management.recognition)
    );
    
    const jobContentScore = (
        (data.jobMeaning * satisfactionWeights.jobContent.meaning) +
        (data.autonomy * satisfactionWeights.jobContent.autonomy) +
        (data.commuteSatisfaction * satisfactionWeights.jobContent.commute) +
        (data.jobSecurity * satisfactionWeights.jobContent.security)
    );
    
    // Calculate overall score (0-100)
    const totalScore = (compensationScore + workLifeScore + growthScore + managementScore + jobContentScore) * 10;
    
    // Apply tenure adjustments
    let tenureAdjustment = 0;
    if (data.yearsInRole < 0.5) tenureAdjustment = -5; // Honeymoon period may inflate scores
    else if (data.yearsInRole > 5) tenureAdjustment = -3; // Long tenure may indicate complacency
    
    // Apply hours worked adjustment
    let hoursAdjustment = 0;
    if (data.hoursPerWeek > 50) hoursAdjustment = -5;
    else if (data.hoursPerWeek > 60) hoursAdjustment = -10;
    
    const finalScore = Math.max(0, Math.min(100, totalScore + tenureAdjustment + hoursAdjustment));
    
    return {
        overall: Math.round(finalScore),
        categories: {
            compensation: Math.round(compensationScore * 10),
            workLife: Math.round(workLifeScore * 10),
            growth: Math.round(growthScore * 10),
            management: Math.round(managementScore * 10),
            jobContent: Math.round(jobContentScore * 10)
        },
        adjustments: {
            tenure: tenureAdjustment,
            hours: hoursAdjustment
        }
    };
}

// Predict retention likelihood
function predictRetention(satisfactionScore, data) {
    let baseRetention = 50; // Base 50% retention likelihood
    
    // Satisfaction score impact (primary factor)
    if (satisfactionScore >= 80) baseRetention = 95;
    else if (satisfactionScore >= 70) baseRetention = 85;
    else if (satisfactionScore >= 60) baseRetention = 70;
    else if (satisfactionScore >= 50) baseRetention = 55;
    else if (satisfactionScore >= 40) baseRetention = 35;
    else baseRetention = 15;
    
    // Manager quality has outsized impact
    if (data.managerQuality <= 3) baseRetention -= 20;
    else if (data.managerQuality >= 8) baseRetention += 10;
    
    // Growth opportunities impact
    if (data.growthOpportunities <= 3) baseRetention -= 15;
    else if (data.growthOpportunities >= 8) baseRetention += 10;
    
    // Tenure impact
    if (data.yearsInRole < 1) baseRetention += 10; // Less likely to leave quickly
    else if (data.yearsInRole > 3 && satisfactionScore < 60) baseRetention -= 10; // Stagnation risk
    
    // Industry-specific adjustments
    const industryRetentionMods = {
        technology: -5, // High turnover industry
        finance: 0,
        healthcare: 5, // More stable
        education: 10, // Very stable
        retail: -10, // High turnover
        manufacturing: 5,
        consulting: -5,
        government: 15, // Very stable
        nonprofit: 5,
        other: 0
    };
    
    baseRetention += industryRetentionMods[data.industry] || 0;
    
    return Math.max(5, Math.min(95, Math.round(baseRetention)));
}

// Generate improvement recommendations
function generateRecommendations(data, scores) {
    const recommendations = [];
    
    // Compensation recommendations
    if (scores.categories.compensation < 60) {
        recommendations.push({
            category: "Compensation",
            priority: "High",
            issue: "Below-market compensation affecting satisfaction",
            action: "Research market rates and schedule compensation discussion with manager",
            impact: "Could increase overall satisfaction by 10-15 points"
        });
    }
    
    // Manager relationship
    if (data.managerQuality <= 4) {
        recommendations.push({
            category: "Management",
            priority: "Critical",
            issue: "Poor manager relationship is primary retention risk",
            action: "Consider requesting manager change or transfer to different team",
            impact: "Manager quality is the #1 predictor of retention"
        });
    }
    
    // Growth opportunities
    if (data.growthOpportunities <= 4) {
        recommendations.push({
            category: "Career Growth",
            priority: "High",
            issue: "Limited growth opportunities reducing long-term satisfaction",
            action: "Create development plan with manager and seek stretch assignments",
            impact: "Growth opportunities strongly predict retention"
        });
    }
    
    // Work-life balance
    if (data.workLifeBalance <= 4 || data.hoursPerWeek > 50) {
        recommendations.push({
            category: "Work-Life Balance",
            priority: "Medium",
            issue: "Poor work-life balance leading to burnout risk",
            action: "Discuss workload management and flexible work options",
            impact: "Better balance improves satisfaction and performance"
        });
    }
    
    // Stress levels
    if (data.stressLevel >= 7) {
        recommendations.push({
            category: "Stress Management",
            priority: "High",
            issue: "High stress levels unsustainable long-term",
            action: "Identify stress sources and develop coping strategies",
            impact: "Stress reduction can improve satisfaction by 8-12 points"
        });
    }
    
    // Recognition
    if (data.recognition <= 4) {
        recommendations.push({
            category: "Recognition",
            priority: "Medium",
            issue: "Lack of recognition affecting motivation",
            action: "Communicate achievements more effectively and request feedback",
            impact: "Recognition significantly impacts engagement"
        });
    }
    
    // Job meaning
    if (data.jobMeaning <= 4) {
        recommendations.push({
            category: "Job Purpose",
            priority: "Medium",
            issue: "Low sense of purpose in current role",
            action: "Explore how your work connects to larger organizational mission",
            impact: "Meaningful work is key to long-term satisfaction"
        });
    }
    
    return recommendations.slice(0, 6); // Return top 6 recommendations
}

// Determine satisfaction level and next steps
function analyzeSatisfaction(score) {
    if (score >= 80) {
        return {
            level: "Excellent",
            color: "text-green-400",
            bgColor: "bg-green-900/30",
            borderColor: "border-green-600",
            description: "You have excellent career satisfaction. Focus on maintaining this level and continuing your growth trajectory.",
            nextSteps: [
                "Continue building on your strengths",
                "Mentor others and share your positive experience",
                "Set new stretch goals for continued growth",
                "Consider leadership opportunities"
            ]
        };
    } else if (score >= 65) {
        return {
            level: "Good",
            color: "text-blue-400",
            bgColor: "bg-blue-900/30",
            borderColor: "border-blue-600",
            description: "You have good career satisfaction with room for improvement in specific areas.",
            nextSteps: [
                "Identify and address top 2-3 improvement areas",
                "Have regular career conversations with your manager",
                "Seek feedback and act on development opportunities",
                "Build stronger relationships with key stakeholders"
            ]
        };
    } else if (score >= 50) {
        return {
            level: "Moderate",
            color: "text-yellow-400",
            bgColor: "bg-yellow-900/30",
            borderColor: "border-yellow-600",
            description: "Your career satisfaction is moderate. Several areas need attention to improve your experience.",
            nextSteps: [
                "Prioritize addressing critical satisfaction gaps",
                "Schedule formal career discussion with manager",
                "Consider internal opportunities or role changes",
                "Develop specific improvement timeline with milestones"
            ]
        };
    } else if (score >= 35) {
        return {
            level: "Low",
            color: "text-orange-400",
            bgColor: "bg-orange-900/30",
            borderColor: "border-orange-600",
            description: "Your career satisfaction is low. Significant changes are needed to improve your situation.",
            nextSteps: [
                "Address critical issues immediately (especially manager relationship)",
                "Explore internal transfer opportunities",
                "Update resume and consider external opportunities",
                "Set timeline for improvement or transition"
            ]
        };
    } else {
        return {
            level: "Critical",
            color: "text-red-400",
            bgColor: "bg-red-900/30",
            borderColor: "border-red-600",
            description: "Your career satisfaction is critically low. Immediate action is needed to address your situation.",
            nextSteps: [
                "Begin active job search immediately",
                "Document any workplace issues for HR if applicable",
                "Seek support from mentors or career counselors",
                "Prioritize your mental health and wellbeing"
            ]
        };
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Display results
function displayResults(data) {
    const scores = calculateSatisfactionScore(data);
    const retentionLikelihood = predictRetention(scores.overall, data);
    const analysis = analyzeSatisfaction(scores.overall);
    const recommendations = generateRecommendations(data, scores);
    
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    resultsContent.innerHTML = `
        <!-- Overall Score Card -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="md:col-span-2 ${sanitizeText(analysis.bgColor)} p-6 rounded-lg border ${sanitizeText(analysis.borderColor)}">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-2xl font-bold ${sanitizeText(analysis.color)}">Career Satisfaction: ${sanitizeText(analysis.level)}</h3>
                    <div class="text-right">
                        <div class="text-4xl font-bold ${sanitizeText(analysis.color)}">${sanitizeText(scores.overall)}/100</div>
                        <div class="text-sm text-light">Retention Likelihood: ${sanitizeText(retentionLikelihood)}%</div>
                    </div>
                </div>
                <p class="text-light mb-4">${sanitizeText(analysis.description)}</p>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-light">Years in Role:</span>
                        <span class="text-primary font-semibold ml-2">${sanitizeText(data.yearsInRole)} years</span>
                    </div>
                    <div>
                        <span class="text-light">Industry:</span>
                        <span class="text-primary font-semibold ml-2 capitalize">${sanitizeText(data.industry)}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-dark p-6 rounded-lg border border-accent">
                <h4 class="text-lg font-semibold text-primary mb-4">Retention Prediction</h4>
                <div class="text-center mb-4">
                    <div class="text-3xl font-bold ${retentionLikelihood >= 70 ? 'text-green-400' : retentionLikelihood >= 50 ? 'text-yellow-400' : 'text-red-400'} mb-2">
                        ${sanitizeText(retentionLikelihood)}%
                    </div>
                    <div class="text-sm text-light">Likelihood to stay 2+ years</div>
                </div>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-light">Risk Level:</span>
                        <span class="${retentionLikelihood >= 70 ? 'text-green-400' : retentionLikelihood >= 50 ? 'text-yellow-400' : 'text-red-400'}">
                            ${retentionLikelihood >= 70 ? 'Low' : retentionLikelihood >= 50 ? 'Moderate' : 'High'}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Expected Tenure:</span>
                        <span class="text-primary">${retentionLikelihood >= 70 ? '3+ years' : retentionLikelihood >= 50 ? '1-2 years' : '<1 year'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Category Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div class="bg-dark p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-primary mb-4">ðŸ“Š Satisfaction by Category</h3>
                <div class="space-y-4">
                    ${Object.entries(scores.categories).map(([category, score]) => {
                        const categoryNames = {
                            compensation: 'Compensation & Benefits',
                            workLife: 'Work-Life Balance',
                            growth: 'Growth & Development',
                            management: 'Management & Culture',
                            jobContent: 'Job Content & Environment'
                        };
                        const color = score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
                        const bgColor = score >= 70 ? 'bg-green-400' : score >= 50 ? 'bg-yellow-400' : 'bg-red-400';
                        return `
                            <div class="flex justify-between items-center">
                                <span class="text-light">${escapeHtml(categoryNames[category])}</span>
                                <div class="flex items-center">
                                    <span class="${sanitizeText(color)} font-semibold mr-3">${sanitizeText(score)}/100</span>
                                    <div class="w-20 bg-broder rounded-full h-2">
                                        <div class="${sanitizeText(bgColor)} h-2 rounded-full" style="width: ${sanitizeText(score)}%"></div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="bg-dark p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-primary mb-4">ðŸŽ¯ Key Metrics</h3>
                <div class="space-y-4">
                    <div class="flex justify-between">
                        <span class="text-light">Manager Quality:</span>
                        <span class="${data.managerQuality >= 7 ? 'text-green-400' : data.managerQuality >= 5 ? 'text-yellow-400' : 'text-red-400'} font-semibold">
                            ${sanitizeText(data.managerQuality)}/10
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Growth Opportunities:</span>
                        <span class="${data.growthOpportunities >= 7 ? 'text-green-400' : data.growthOpportunities >= 5 ? 'text-yellow-400' : 'text-red-400'} font-semibold">
                            ${sanitizeText(data.growthOpportunities)}/10
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Work-Life Balance:</span>
                        <span class="${data.workLifeBalance >= 7 ? 'text-green-400' : data.workLifeBalance >= 5 ? 'text-yellow-400' : 'text-red-400'} font-semibold">
                            ${sanitizeText(data.workLifeBalance)}/10
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Salary Satisfaction:</span>
                        <span class="${data.salarySatisfaction >= 7 ? 'text-green-400' : data.salarySatisfaction >= 5 ? 'text-yellow-400' : 'text-red-400'} font-semibold">
                            ${sanitizeText(data.salarySatisfaction)}/10
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Hours per Week:</span>
                        <span class="${data.hoursPerWeek <= 45 ? 'text-green-400' : data.hoursPerWeek <= 50 ? 'text-yellow-400' : 'text-red-400'} font-semibold">
                            ${sanitizeText(data.hoursPerWeek)}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Stress Level:</span>
                        <span class="${data.stressLevel <= 4 ? 'text-green-400' : data.stressLevel <= 6 ? 'text-yellow-400' : 'text-red-400'} font-semibold">
                            ${sanitizeText(data.stressLevel)}/10
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recommendations -->
        <div class="mb-8">
            <h3 class="text-xl font-semibold text-primary mb-4">ðŸ’¡ Personalized Recommendations</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${recommendations.map(rec => `
                    <div class="bg-dark p-4 rounded-lg border border-accent">
                        <div class="flex items-start justify-between mb-2">
                            <h4 class="font-semibold text-primary">${escapeHtml(rec.category)}</h4>
                            <span class="px-2 py-1 text-xs rounded ${
                                rec.priority === 'Critical' ? 'bg-red-900/30 border border-red-600 text-red-200' :
                                rec.priority === 'High' ? 'bg-orange-900/30 border border-orange-600 text-orange-200' :
                                rec.priority === 'Medium' ? 'bg-yellow-900/30 border border-yellow-600 text-yellow-200' :
                                'bg-blue-900/30 border border-blue-600 text-blue-200'
                            }">${escapeHtml(rec.priority)}</span>
                        </div>
                        <p class="text-light text-sm mb-2"><strong>Issue:</strong> ${escapeHtml(rec.issue)}</p>
                        <p class="text-light text-sm mb-2"><strong>Action:</strong> ${escapeHtml(rec.action)}</p>
                        <p class="text-accent text-xs">${escapeHtml(rec.impact)}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-dark p-6 rounded-lg border border-accent">
            <h3 class="text-xl font-semibold text-primary mb-4">ðŸ“‹ Your Next Steps</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="text-lg font-semibold text-primary mb-2">Immediate Actions (This Week)</h4>
                    <ul class="text-light space-y-2 text-sm">
                        ${analysis.nextSteps.slice(0, 2).map(step => `<li>â€¢ ${escapeHtml(step)}</li>`).join('')}
                        <li>â€¢ ${recommendations.length > 0 ? `Address ${recommendations[0].category.toLowerCase()} concerns` : 'Focus on maintaining current satisfaction levels'}</li>
                        <li>â€¢ Document specific examples of satisfaction drivers and detractors</li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-primary mb-2">Strategic Actions (This Month)</h4>
                    <ul class="text-light space-y-2 text-sm">
                        ${analysis.nextSteps.slice(2).map(step => `<li>â€¢ ${escapeHtml(step)}</li>`).join('')}
                        <li>â€¢ Re-assess satisfaction after implementing changes</li>
                        <li>â€¢ ${retentionLikelihood < 50 ? 'Begin exploring alternative opportunities' : 'Continue building on positive momentum'}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Form submission handler
document.getElementById('careerSatisfactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const assessmentData = collectAssessmentData();
    
    // Validation
    if (!assessmentData.currentSalary || assessmentData.currentSalary < 20000) {
        alert('Please enter a valid current salary.');
        return;
    }
    
    // Display results
    displayResults(assessmentData);
    
    // Show success message
    const popup = document.createElement('div');
    popup.className = 'fixed top-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50';
    popup.innerHTML = `
        <div class="flex items-center">
            <span class="material-icons mr-2">assessment</span>
            <span>Career satisfaction analysis complete!</span>
        </div>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 4000);
});
