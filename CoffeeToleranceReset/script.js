// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

    document.getElementById('coffee-form').addEventListener('submit', calculateResetPlan);
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function calculateResetPlan(e) {
    e.preventDefault();
    
    const data = collectFormData();
    const analysis = analyzeToleranceReset(data);
    displayResults(analysis);
}

function collectFormData() {
    return {
        dailyCups: parseFloat(document.getElementById('dailyCups').value),
        cupSize: parseInt(document.getElementById('cupSize').value),
        coffeeType: document.getElementById('coffeeType').value,
        otherCaffeine: parseInt(document.getElementById('otherCaffeine').value) || 0,
        toleranceLevel: document.getElementById('toleranceLevel').value,
        monthsHeavyUse: parseInt(document.getElementById('monthsHeavyUse').value),
        withdrawalSensitivity: document.getElementById('withdrawalSensitivity').value,
        resetType: document.getElementById('resetType').value,
        timeframe: document.getElementById('timeframe').value,
        lifestyle: document.getElementById('lifestyle').value,
        sleepQuality: parseInt(document.getElementById('sleepQuality').value),
        anxietyLevel: parseInt(document.getElementById('anxietyLevel').value),
        heartIssues: document.getElementById('heartIssues').checked,
        pregnantNursing: document.getElementById('pregnantNursing').checked
    };
}

function analyzeToleranceReset(data) {
    // Calculate current caffeine intake
    const caffeinePerOz = getCaffeineContent(data.coffeeType);
    const dailyCaffeine = (data.dailyCups * data.cupSize * caffeinePerOz) + data.otherCaffeine;
    
    // Determine target caffeine level
    const targetCaffeine = calculateTargetCaffeine(dailyCaffeine, data.resetType);
    
    // Create reduction schedule
    const schedule = createReductionSchedule(dailyCaffeine, targetCaffeine, data);
    
    // Generate recommendations
    const recommendations = generateRecommendations(data, dailyCaffeine);
    
    // Assess withdrawal risk
    const withdrawalRisk = assessWithdrawalRisk(data, dailyCaffeine);
    
    return {
        currentCaffeine: dailyCaffeine,
        targetCaffeine,
        schedule,
        recommendations,
        withdrawalRisk,
        timeline: schedule.length
    };
}

function getCaffeineContent(coffeeType) {
    const caffeineMap = {
        drip: 12,      // mg per oz
        espresso: 64,  // mg per oz (but served in smaller amounts)
        instant: 8,    // mg per oz
        cold: 16,      // mg per oz
        decaf: 0.5     // mg per oz
    };
    return caffeineMap[coffeeType] || 12;
}

function calculateTargetCaffeine(current, resetType) {
    const reductionMap = {
        partial: 0.5,    // 50% reduction
        moderate: 0.25,  // 75% reduction
        full: 0.1,       // 90% reduction
        complete: 0      // 100% reduction
    };
    return Math.round(current * reductionMap[resetType]);
}

function createReductionSchedule(start, target, data) {
    const timeframes = {
        fast: 14,      // days
        moderate: 28,
        gradual: 56,
        slow: 84
    };
    
    const totalDays = timeframes[data.timeframe];
    const totalReduction = start - target;
    const schedule = [];
    
    // Create weekly reduction steps
    const weeks = Math.ceil(totalDays / 7);
    const weeklyReduction = totalReduction / weeks;
    
    for (let week = 0; week < weeks; week++) {
        const weekCaffeine = Math.max(target, start - (weeklyReduction * (week + 1)));
        const cupsEquivalent = calculateCupsFromCaffeine(weekCaffeine, data);
        
        schedule.push({
            week: week + 1,
            caffeine: Math.round(weekCaffeine),
            cups: cupsEquivalent.cups,
            strategy: getWeekStrategy(week, weeks, data.withdrawalSensitivity)
        });
    }
    
    return schedule;
}

function calculateCupsFromCaffeine(targetCaffeine, data) {
    const caffeinePerCup = data.cupSize * getCaffeineContent(data.coffeeType);
    const cups = Math.max(0, targetCaffeine / caffeinePerCup);
    
    return {
        cups: Math.round(cups * 2) / 2, // Round to nearest 0.5
        caffeinePerCup
    };
}

function getWeekStrategy(week, totalWeeks, sensitivity) {
    const strategies = [];
    
    if (week === 0) {
        strategies.push('Start with smaller cup sizes');
        strategies.push('Switch to lighter roasts');
    } else if (week < totalWeeks / 2) {
        strategies.push('Replace some cups with decaf');
        strategies.push('Delay first cup by 30 minutes');
    } else {
        strategies.push('Switch to green tea for some servings');
        strategies.push('Focus on hydration and sleep');
    }
    
    if (sensitivity === 'high' || sensitivity === 'severe') {
        strategies.push('Take L-theanine supplements');
        strategies.push('Increase B-vitamin intake');
    }
    
    return strategies;
}

function generateRecommendations(data, currentCaffeine) {
    const recommendations = [];
    
    // Health-based recommendations
    if (data.heartIssues || data.anxietyLevel > 7) {
        recommendations.push({
            category: 'Health Priority',
            advice: 'Consult healthcare provider before starting reduction',
            priority: 'Critical'
        });
    }
    
    if (data.pregnantNursing) {
        recommendations.push({
            category: 'Pregnancy Safety',
            advice: 'Limit to 200mg caffeine daily (about 1-2 cups)',
            priority: 'Critical'
        });
    }
    
    // Lifestyle recommendations
    const lifestyleAdvice = getLifestyleRecommendations(data.lifestyle);
    recommendations.push(...lifestyleAdvice);
    
    // Sleep optimization
    if (data.sleepQuality < 6) {
        recommendations.push({
            category: 'Sleep Optimization',
            advice: 'No caffeine after 2 PM to improve sleep quality',
            priority: 'High'
        });
    }
    
    // Withdrawal management
    const withdrawalAdvice = getWithdrawalManagement(data.withdrawalSensitivity);
    recommendations.push(...withdrawalAdvice);
    
    return recommendations;
}

function getLifestyleRecommendations(lifestyle) {
    const advice = {
        flexible: [
            { category: 'Timing', advice: 'Start reduction on weekend for easier adjustment', priority: 'Medium' }
        ],
        work: [
            { category: 'Work Performance', advice: 'Schedule important meetings in mornings', priority: 'High' },
            { category: 'Energy Management', advice: 'Take short walks instead of coffee breaks', priority: 'Medium' }
        ],
        student: [
            { category: 'Study Schedule', advice: 'Avoid starting during exam periods', priority: 'High' },
            { category: 'Focus Alternatives', advice: 'Use Pomodoro technique for concentration', priority: 'Medium' }
        ],
        parent: [
            { category: 'Energy Management', advice: 'Prioritize sleep over caffeine reduction speed', priority: 'High' },
            { category: 'Support System', advice: 'Ask partner to help with morning routines', priority: 'Medium' }
        ],
        shift: [
            { category: 'Schedule Coordination', advice: 'Align reduction with shift schedule changes', priority: 'High' },
            { category: 'Light Therapy', advice: 'Use bright light therapy to maintain alertness', priority: 'Medium' }
        ]
    };
    
    return advice[lifestyle] || [];
}

function getWithdrawalManagement(sensitivity) {
    const management = {
        low: [
            { category: 'Mild Support', advice: 'Stay hydrated and maintain regular meals', priority: 'Low' }
        ],
        moderate: [
            { category: 'Symptom Management', advice: 'Keep ibuprofen handy for headaches', priority: 'Medium' },
            { category: 'Energy Support', advice: 'Take short naps (20 minutes) if needed', priority: 'Medium' }
        ],
        high: [
            { category: 'Withdrawal Support', advice: 'Consider L-theanine (200mg) for anxiety', priority: 'High' },
            { category: 'Headache Prevention', advice: 'Magnesium supplement may help with headaches', priority: 'High' }
        ],
        severe: [
            { category: 'Medical Support', advice: 'Consider medical supervision for withdrawal', priority: 'Critical' },
            { category: 'Gradual Approach', advice: 'Extend timeline to minimize severe symptoms', priority: 'Critical' }
        ]
    };
    
    return management[sensitivity] || [];
}

function assessWithdrawalRisk(data, currentCaffeine) {
    let riskScore = 0;
    
    // High caffeine intake increases risk
    if (currentCaffeine > 400) riskScore += 3;
    else if (currentCaffeine > 300) riskScore += 2;
    else if (currentCaffeine > 200) riskScore += 1;
    
    // Sensitivity factors
    const sensitivityScores = { low: 0, moderate: 1, high: 2, severe: 3 };
    riskScore += sensitivityScores[data.withdrawalSensitivity];
    
    // Duration of use
    if (data.monthsHeavyUse > 24) riskScore += 2;
    else if (data.monthsHeavyUse > 12) riskScore += 1;
    
    // Health factors
    if (data.anxietyLevel > 7) riskScore += 1;
    if (data.sleepQuality < 5) riskScore += 1;
    
    const riskLevels = {
        0: { level: 'Very Low', color: 'text-green-400', description: 'Minimal withdrawal expected' },
        1: { level: 'Low', color: 'text-green-400', description: 'Mild symptoms possible' },
        2: { level: 'Moderate', color: 'text-yellow-400', description: 'Noticeable withdrawal likely' },
        3: { level: 'High', color: 'text-orange-400', description: 'Significant symptoms expected' },
        4: { level: 'Very High', color: 'text-red-400', description: 'Severe withdrawal risk' }
    };
    
    const finalScore = Math.min(riskScore, 4);
    return riskLevels[finalScore];
}

function displayResults(analysis) {
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = `
        <div class="bg-broder p-4 md:p-6 rounded border border-accent">
            <h2 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
                <span class="material-icons text-primary">analytics</span> Tolerance Reset Analysis
            </h2>
            
            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-dark p-4 rounded border border-accent">
                    <h3 class="font-medium text-accent mb-2">Current Status</h3>
                    <div class="space-y-2 text-sm">
                        <div>Daily Caffeine: <span class="text-primary font-medium">${sanitizeText(analysis.currentCaffeine)}mg</span></div>
                        <div>Target Caffeine: <span class="text-primary font-medium">${sanitizeText(analysis.targetCaffeine)}mg</span></div>
                        <div>Total Reduction: <span class="text-primary font-medium">${analysis.currentCaffeine - analysis.targetCaffeine}mg</span></div>
                        <div>Timeline: <span class="text-primary font-medium">${sanitizeText(analysis.timeline)} weeks</span></div>
                    </div>
                </div>
                
                <div class="bg-dark p-4 rounded border border-accent">
                    <h3 class="font-medium text-accent mb-2">Withdrawal Risk</h3>
                    <div class="space-y-2 text-sm">
                        <div>Risk Level: <span class="${sanitizeText(analysis.withdrawalRisk.color)} font-medium">${escapeHtml(analysis.withdrawalRisk.level)}</span></div>
                        <div class="text-light">${escapeHtml(analysis.withdrawalRisk.description)}</div>
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">schedule</span> Weekly Reduction Schedule
                </h3>
                <div class="space-y-3">
                    ${analysis.schedule.map(week => `
                        <div class="bg-dark p-3 rounded border border-accent">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-medium text-sm">Week ${week.week}</span>
                                <span class="text-primary font-medium">${sanitizeText(week.caffeine)}mg (${sanitizeText(week.cups)} cups)</span>
                            </div>
                            <div class="text-xs text-light">
                                ${week.strategy.map(s => `• ${escapeHtml(s)}`).join('<br>')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">lightbulb</span> Personalized Recommendations
                </h3>
                <div class="space-y-3">
                    ${analysis.recommendations.map(rec => `
                        <div class="bg-dark p-3 rounded border-l-4 border-primary">
                            <div class="flex justify-between items-start mb-1">
                                <span class="font-medium text-sm">${escapeHtml(rec.category)}</span>
                                <span class="text-xs px-2 py-1 rounded ${rec.priority === 'Critical' ? 'bg-red-600' : rec.priority === 'High' ? 'bg-orange-600' : rec.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'} text-white">${escapeHtml(rec.priority)}</span>
                            </div>
                            <div class="text-sm text-light">${escapeHtml(rec.advice)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-dark p-4 rounded border border-accent">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">tips_and_updates</span> Success Tips
                </h3>
                <ul class="space-y-1 text-sm text-light">
                    <li>• Track your progress daily to stay motivated</li>
                    <li>• Replace coffee rituals with herbal tea or decaf</li>
                    <li>• Exercise regularly to boost natural energy</li>
                    <li>• Stay hydrated - dehydration worsens withdrawal</li>
                    <li>• Get adequate sleep to reduce caffeine dependence</li>
                </ul>
            </div>
            
            <div class="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded border border-primary/30">
                <h3 class="font-medium text-primary mb-2">🎯 Reset Success Strategy</h3>
                <div class="text-sm text-light space-y-1">
                    <p>• Your ${escapeHtml(analysis.withdrawalRisk.level.toLowerCase())} withdrawal risk suggests a ${sanitizeText(analysis.timeline)}-week timeline is appropriate</p>
                    <p>• Focus on gradual reduction rather than sudden elimination for lasting results</p>
                    <p>• After reset, maintain 1-2 cups daily maximum to preserve sensitivity</p>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
