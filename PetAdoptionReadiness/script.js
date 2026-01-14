// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

    document.getElementById('pet-form').addEventListener('submit', assessPetReadiness);
});

function assessPetReadiness(e) {
    e.preventDefault();
    
    const data = collectFormData();
    const analysis = analyzePetReadiness(data);
    displayResults(analysis);
}

function collectFormData() {
    return {
        petType: document.getElementById('petType').value,
        petAge: document.getElementById('petAge').value,
        monthlyIncome: parseInt(document.getElementById('monthlyIncome').value),
        emergencyFund: parseInt(document.getElementById('emergencyFund').value),
        monthlyBudget: parseInt(document.getElementById('monthlyBudget').value),
        housingType: document.getElementById('housingType').value,
        workSchedule: document.getElementById('workSchedule').value,
        dailyFreeTime: parseFloat(document.getElementById('dailyFreeTime').value),
        activityLevel: document.getElementById('activityLevel').value,
        familySize: parseInt(document.getElementById('familySize').value),
        petExperience: document.getElementById('petExperience').value,
        commitmentYears: parseInt(document.getElementById('commitmentYears').value),
        hasChildren: document.getElementById('hasChildren').checked,
        hasAllergies: document.getElementById('hasAllergies').checked,
        hasOtherPets: document.getElementById('hasOtherPets').checked
    };
}

function analyzePetReadiness(data) {
    // Get pet requirements
    const petRequirements = getPetRequirements(data.petType, data.petAge);
    
    // Assess different readiness factors
    const financialReadiness = assessFinancialReadiness(data, petRequirements);
    const lifestyleCompatibility = assessLifestyleCompatibility(data, petRequirements);
    const timeAvailability = assessTimeAvailability(data, petRequirements);
    const experienceLevel = assessExperienceLevel(data, petRequirements);
    
    // Calculate overall readiness score
    const overallScore = calculateOverallScore(financialReadiness, lifestyleCompatibility, timeAvailability, experienceLevel);
    
    // Generate recommendations
    const recommendations = generateRecommendations(data, petRequirements, {
        financial: financialReadiness,
        lifestyle: lifestyleCompatibility,
        time: timeAvailability,
        experience: experienceLevel
    });
    
    return {
        petRequirements,
        financialReadiness,
        lifestyleCompatibility,
        timeAvailability,
        experienceLevel,
        overallScore,
        recommendations
    };
}

function getPetRequirements(petType, petAge) {
    const requirements = {
        'dog-small': {
            name: 'Small Dog',
            monthlyCost: { min: 80, max: 150 },
            dailyTime: 3,
            exerciseNeeds: 'Moderate',
            spaceNeeds: 'Small apartment OK',
            lifespan: 14,
            initialCost: 800,
            difficulty: 'Moderate'
        },
        'dog-medium': {
            name: 'Medium Dog',
            monthlyCost: { min: 120, max: 200 },
            dailyTime: 4,
            exerciseNeeds: 'High',
            spaceNeeds: 'House with yard preferred',
            lifespan: 12,
            initialCost: 1000,
            difficulty: 'Moderate-High'
        },
        'dog-large': {
            name: 'Large Dog',
            monthlyCost: { min: 150, max: 300 },
            dailyTime: 5,
            exerciseNeeds: 'Very High',
            spaceNeeds: 'House with large yard',
            lifespan: 10,
            initialCost: 1200,
            difficulty: 'High'
        },
        'cat': {
            name: 'Cat',
            monthlyCost: { min: 50, max: 100 },
            dailyTime: 1,
            exerciseNeeds: 'Low',
            spaceNeeds: 'Apartment friendly',
            lifespan: 15,
            initialCost: 500,
            difficulty: 'Low-Moderate'
        },
        'rabbit': {
            name: 'Rabbit',
            monthlyCost: { min: 40, max: 80 },
            dailyTime: 2,
            exerciseNeeds: 'Moderate',
            spaceNeeds: 'Indoor space with exercise area',
            lifespan: 9,
            initialCost: 400,
            difficulty: 'Moderate'
        },
        'bird': {
            name: 'Bird',
            monthlyCost: { min: 30, max: 60 },
            dailyTime: 1.5,
            exerciseNeeds: 'Low',
            spaceNeeds: 'Indoor cage',
            lifespan: 12,
            initialCost: 300,
            difficulty: 'Low'
        },
        'fish': {
            name: 'Fish',
            monthlyCost: { min: 15, max: 40 },
            dailyTime: 0.5,
            exerciseNeeds: 'None',
            spaceNeeds: 'Tank space',
            lifespan: 5,
            initialCost: 200,
            difficulty: 'Low'
        },
        'hamster': {
            name: 'Small Pet',
            monthlyCost: { min: 25, max: 50 },
            dailyTime: 1,
            exerciseNeeds: 'Low',
            spaceNeeds: 'Small cage',
            lifespan: 3,
            initialCost: 150,
            difficulty: 'Low'
        }
    };
    
    const baseReq = requirements[petType];
    
    // Adjust for age
    if (petAge === 'puppy') {
        baseReq.dailyTime *= 1.5;
        baseReq.difficulty = 'Higher (training needed)';
    } else if (petAge === 'senior') {
        baseReq.monthlyCost.max *= 1.3; // Higher vet costs
        baseReq.difficulty = 'Moderate (health needs)';
    }
    
    return baseReq;
}

function assessFinancialReadiness(data, petReq) {
    let score = 0;
    const issues = [];
    
    // Monthly budget assessment
    if (data.monthlyBudget >= petReq.monthlyCost.max) {
        score += 30;
    } else if (data.monthlyBudget >= petReq.monthlyCost.min) {
        score += 20;
    } else {
        issues.push(`Budget too low: need $${sanitizeText(petReq.monthlyCost.min)}-${sanitizeText(petReq.monthlyCost.max)}/month`);
        score += 10;
    }
    
    // Income ratio
    const budgetRatio = (data.monthlyBudget / data.monthlyIncome) * 100;
    if (budgetRatio <= 5) {
        score += 25;
    } else if (budgetRatio <= 10) {
        score += 15;
    } else {
        issues.push('Pet budget exceeds 10% of income');
        score += 5;
    }
    
    // Emergency fund
    const emergencyMonths = data.emergencyFund / petReq.monthlyCost.max;
    if (emergencyMonths >= 6) {
        score += 25;
    } else if (emergencyMonths >= 3) {
        score += 15;
    } else {
        issues.push('Need larger emergency fund for pet expenses');
        score += 5;
    }
    
    // Initial costs
    if (data.emergencyFund >= petReq.initialCost) {
        score += 20;
    } else {
        issues.push(`Need $${sanitizeText(petReq.initialCost)} for initial setup costs`);
        score += 10;
    }
    
    return {
        score: Math.min(100, score),
        level: getScoreLevel(score),
        issues,
        monthlyRange: `$${sanitizeText(petReq.monthlyCost.min)}-${sanitizeText(petReq.monthlyCost.max)}`,
        initialCost: petReq.initialCost
    };
}

function assessLifestyleCompatibility(data, petReq) {
    let score = 0;
    const issues = [];
    
    // Housing compatibility
    const housingScores = {
        'own-house': 30,
        'own-apartment': 25,
        'rent-pet-friendly': 20,
        'rent-no-pets': 0,
        'family-home': 15
    };
    
    score += housingScores[data.housingType] || 0;
    if (data.housingType === 'rent-no-pets') {
        issues.push('Housing does not allow pets');
    }
    
    // Activity level match
    const activityMatch = {
        'dog-large': { high: 25, moderate: 15, low: 5 },
        'dog-medium': { high: 25, moderate: 20, low: 10 },
        'dog-small': { high: 20, moderate: 25, low: 15 },
        'cat': { high: 15, moderate: 25, low: 20 },
        'rabbit': { high: 20, moderate: 25, low: 15 },
        'bird': { high: 15, moderate: 20, low: 25 },
        'fish': { high: 20, moderate: 25, low: 25 },
        'hamster': { high: 15, moderate: 20, low: 25 }
    };
    
    score += activityMatch[data.petType]?.[data.activityLevel] || 15;
    
    // Family considerations
    if (data.hasChildren && ['dog-large', 'dog-medium'].includes(data.petType)) {
        score += 10; // Good for families
    } else if (data.hasChildren && data.petType === 'hamster') {
        score -= 10; // Small pets can be fragile with young children
        issues.push('Small pets may not be suitable for young children');
    }
    
    if (data.hasAllergies && ['cat', 'rabbit'].includes(data.petType)) {
        score -= 20;
        issues.push('Pet type may trigger allergies');
    }
    
    // Other pets
    if (data.hasOtherPets) {
        score += 5; // Experience with multi-pet household
    }
    
    // Work schedule impact
    const workScores = {
        'work-from-home': 25,
        'part-time': 20,
        'full-time': 15,
        'long-hours': 5,
        'travel-frequent': 0
    };
    
    score += workScores[data.workSchedule] || 10;
    if (data.workSchedule === 'travel-frequent') {
        issues.push('Frequent travel incompatible with pet ownership');
    }
    
    return {
        score: Math.min(100, score),
        level: getScoreLevel(score),
        issues
    };
}

function assessTimeAvailability(data, petReq) {
    let score = 0;
    const issues = [];
    
    // Daily time availability
    if (data.dailyFreeTime >= petReq.dailyTime * 1.5) {
        score += 40;
    } else if (data.dailyFreeTime >= petReq.dailyTime) {
        score += 30;
    } else {
        issues.push(`Need ${sanitizeText(petReq.dailyTime)} hours daily, you have ${sanitizeText(data.dailyFreeTime)}`);
        score += 15;
    }
    
    // Work schedule flexibility
    const scheduleScores = {
        'work-from-home': 30,
        'part-time': 25,
        'full-time': 20,
        'long-hours': 10,
        'travel-frequent': 5
    };
    
    score += scheduleScores[data.workSchedule] || 15;
    
    // Family support
    if (data.familySize > 1) {
        score += 15; // More people to help with care
    }
    
    // Pet age considerations
    if (data.petAge === 'puppy' && data.dailyFreeTime < 4) {
        issues.push('Puppies need extensive time for training and socialization');
        score -= 15;
    }
    
    return {
        score: Math.min(100, score),
        level: getScoreLevel(score),
        issues,
        requiredTime: petReq.dailyTime
    };
}

function assessExperienceLevel(data, petReq) {
    let score = 0;
    const issues = [];
    
    // Experience scoring
    const expScores = {
        'none': 10,
        'childhood': 20,
        'some': 30,
        'experienced': 40
    };
    
    score += expScores[data.petExperience] || 15;
    
    // Match experience to pet difficulty
    const difficultyPenalty = {
        'none': { 'High': -20, 'Moderate-High': -15, 'Moderate': -10 },
        'childhood': { 'High': -15, 'Moderate-High': -10 },
        'some': { 'High': -5 }
    };
    
    const penalty = difficultyPenalty[data.petExperience]?.[petReq.difficulty] || 0;
    score += penalty;
    
    if (penalty < 0) {
        issues.push(`${sanitizeText(petReq.name)} may be challenging for your experience level`);
    }
    
    // Commitment assessment
    if (data.commitmentYears >= petReq.lifespan) {
        score += 30;
    } else {
        issues.push(`Pet lifespan (${sanitizeText(petReq.lifespan)} years) exceeds commitment (${sanitizeText(data.commitmentYears)} years)`);
        score += 15;
    }
    
    // Age-specific experience needs
    if (data.petAge === 'puppy' && data.petExperience === 'none') {
        issues.push('First-time owners should consider adult pets over puppies');
        score -= 10;
    }
    
    return {
        score: Math.min(100, score),
        level: getScoreLevel(score),
        issues,
        petLifespan: petReq.lifespan
    };
}

function calculateOverallScore(financial, lifestyle, time, experience) {
    const weightedScore = (financial.score * 0.3) + (lifestyle.score * 0.25) + (time.score * 0.25) + (experience.score * 0.2);
    return {
        score: Math.round(weightedScore),
        level: getScoreLevel(weightedScore)
    };
}

function getScoreLevel(score) {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-400', description: 'Very well prepared' };
    if (score >= 65) return { level: 'Good', color: 'text-green-400', description: 'Well prepared with minor considerations' };
    if (score >= 50) return { level: 'Fair', color: 'text-yellow-400', description: 'Some preparation needed' };
    if (score >= 35) return { level: 'Poor', color: 'text-orange-400', description: 'Significant preparation required' };
    return { level: 'Not Ready', color: 'text-red-400', description: 'Not prepared for pet ownership' };
}

function generateRecommendations(data, petReq, assessments) {
    const recommendations = [];
    
    // Financial recommendations
    if (assessments.financial.score < 70) {
        recommendations.push({
            category: 'Financial Planning',
            advice: 'Build larger emergency fund and increase monthly pet budget',
            priority: 'High'
        });
    }
    
    // Lifestyle recommendations
    if (assessments.lifestyle.issues.length > 0) {
        recommendations.push({
            category: 'Lifestyle Adjustment',
            advice: assessments.lifestyle.issues[0],
            priority: 'High'
        });
    }
    
    // Time management
    if (assessments.time.score < 60) {
        recommendations.push({
            category: 'Time Management',
            advice: 'Consider pet daycare or dog walker services',
            priority: 'Medium'
        });
    }
    
    // Experience building
    if (assessments.experience.score < 50) {
        recommendations.push({
            category: 'Experience Building',
            advice: 'Volunteer at shelters or foster pets before adopting',
            priority: 'High'
        });
    }
    
    // Pet-specific advice
    const petAdvice = getPetSpecificAdvice(data.petType, data.petAge);
    recommendations.push(...petAdvice);
    
    return recommendations;
}

function getPetSpecificAdvice(petType, petAge) {
    const advice = [];
    
    if (petType.includes('dog') && petAge === 'puppy') {
        advice.push({
            category: 'Training',
            advice: 'Budget for puppy training classes and socialization',
            priority: 'High'
        });
    }
    
    if (petType === 'cat') {
        advice.push({
            category: 'Indoor Safety',
            advice: 'Cat-proof home and consider indoor-only lifestyle',
            priority: 'Medium'
        });
    }
    
    if (petAge === 'senior') {
        advice.push({
            category: 'Health Care',
            advice: 'Budget for increased veterinary care needs',
            priority: 'Medium'
        });
    }
    
    return advice;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function displayResults(analysis) {
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = `
        <div class="bg-broder p-4 md:p-6 rounded border border-accent">
            <h2 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
                <span class="material-icons text-primary">assessment</span> Pet Adoption Readiness Assessment
            </h2>
            
            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-dark p-4 rounded border border-accent">
                    <h3 class="font-medium text-accent mb-2">Overall Readiness</h3>
                    <div class="space-y-2 text-sm">
                        <div>Readiness Score: <span class="text-primary font-medium">${sanitizeText(analysis.overallScore.score)}/100</span></div>
                        <div>Level: <span class="${sanitizeText(analysis.overallScore.level.color)} font-medium">${sanitizeText(analysis.overallScore.level.level)}</span></div>
                        <div class="text-light text-xs">${sanitizeText(analysis.overallScore.level.description)}</div>
                    </div>
                </div>
                
                <div class="bg-dark p-4 rounded border border-accent">
                    <h3 class="font-medium text-accent mb-2">Pet Requirements</h3>
                    <div class="space-y-2 text-sm">
                        <div>Pet: <span class="text-primary font-medium">${sanitizeText(analysis.petRequirements.name)}</span></div>
                        <div>Monthly Cost: <span class="text-primary font-medium">${sanitizeText(analysis.financialReadiness.monthlyRange)}</span></div>
                        <div>Daily Time: <span class="text-primary font-medium">${sanitizeText(analysis.timeAvailability.requiredTime)} hours</span></div>
                        <div>Lifespan: <span class="text-primary font-medium">${sanitizeText(analysis.experienceLevel.petLifespan)} years</span></div>
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">analytics</span> Readiness Breakdown
                </h3>
                <div class="grid md:grid-cols-2 gap-3">
                    <div class="bg-dark p-3 rounded border border-accent">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium">Financial Readiness</span>
                            <span class="${sanitizeText(analysis.financialReadiness.level.color)} text-sm">${sanitizeText(analysis.financialReadiness.score)}/100</span>
                        </div>
                        ${analysis.financialReadiness.issues.length > 0 ? `
                            <div class="text-xs text-red-300">
                                ${analysis.financialReadiness.issues.map(issue => `• ${escapeHtml(issue)}`).join('<br>')}
                            </div>
                        ` : '<div class="text-xs text-green-300">✓ Financially prepared</div>'}
                    </div>
                    
                    <div class="bg-dark p-3 rounded border border-accent">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium">Lifestyle Compatibility</span>
                            <span class="${sanitizeText(analysis.lifestyleCompatibility.level.color)} text-sm">${sanitizeText(analysis.lifestyleCompatibility.score)}/100</span>
                        </div>
                        ${analysis.lifestyleCompatibility.issues.length > 0 ? `
                            <div class="text-xs text-red-300">
                                ${analysis.lifestyleCompatibility.issues.map(issue => `• ${escapeHtml(issue)}`).join('<br>')}
                            </div>
                        ` : '<div class="text-xs text-green-300">✓ Lifestyle compatible</div>'}
                    </div>
                    
                    <div class="bg-dark p-3 rounded border border-accent">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium">Time Availability</span>
                            <span class="${sanitizeText(analysis.timeAvailability.level.color)} text-sm">${sanitizeText(analysis.timeAvailability.score)}/100</span>
                        </div>
                        ${analysis.timeAvailability.issues.length > 0 ? `
                            <div class="text-xs text-red-300">
                                ${analysis.timeAvailability.issues.map(issue => `• ${escapeHtml(issue)}`).join('<br>')}
                            </div>
                        ` : '<div class="text-xs text-green-300">✓ Sufficient time available</div>'}
                    </div>
                    
                    <div class="bg-dark p-3 rounded border border-accent">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium">Experience Level</span>
                            <span class="${sanitizeText(analysis.experienceLevel.level.color)} text-sm">${sanitizeText(analysis.experienceLevel.score)}/100</span>
                        </div>
                        ${analysis.experienceLevel.issues.length > 0 ? `
                            <div class="text-xs text-red-300">
                                ${analysis.experienceLevel.issues.map(issue => `• ${escapeHtml(issue)}`).join('<br>')}
                            </div>
                        ` : '<div class="text-xs text-green-300">✓ Appropriate experience level</div>'}
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
                                <span class="font-medium text-sm">${escapeHtml(rec.category)}</span>
                                <span class="text-xs px-2 py-1 rounded ${rec.priority === 'High' ? 'bg-red-600' : rec.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'} text-white">${escapeHtml(rec.priority)}</span>
                            </div>
                            <div class="text-sm text-light">${escapeHtml(rec.advice)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-dark p-4 rounded border border-accent">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">pets</span> Next Steps
                </h3>
                <div class="text-sm text-light space-y-2">
                    ${analysis.overallScore.score >= 70 ? `
                        <p>✅ You appear ready for pet adoption! Consider visiting local shelters.</p>
                        <p>• Research reputable shelters and rescue organizations</p>
                        <p>• Prepare your home with necessary supplies</p>
                        <p>• Schedule a meet-and-greet with potential pets</p>
                    ` : `
                        <p>⚠️ Address the identified issues before adopting.</p>
                        <p>• Work on improving your readiness score</p>
                        <p>• Consider fostering to gain experience</p>
                        <p>• Volunteer at shelters to learn more about pet care</p>
                    `}
                </div>
            </div>
            
            <div class="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded border border-primary/30">
                <h3 class="font-medium text-primary mb-2">🐾 Adoption Success Tips</h3>
                <div class="text-sm text-light space-y-1">
                    <p>• Your ${analysis.overallScore.level.level.toLowerCase()} readiness score suggests ${analysis.overallScore.score >= 70 ? 'you\'re prepared' : 'more preparation is needed'}</p>
                    <p>• ${sanitizeText(analysis.petRequirements.name)} requires ${sanitizeText(analysis.petRequirements.dailyTime)} hours daily and $${sanitizeText(analysis.petRequirements.monthlyCost.min)}-${sanitizeText(analysis.petRequirements.monthlyCost.max)}/month</p>
                    <p>• Proper preparation reduces the chance of pet returns and ensures a happy relationship</p>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
