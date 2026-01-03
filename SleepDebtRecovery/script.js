// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.addEventListener('DOMContentLoaded', function() {
    generateSleepDays();
    
    document.getElementById('fill-average').addEventListener('click', fillAverageHours);
    document.getElementById('sleep-form').addEventListener('submit', calculateSleepDebt);
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateSleepDays() {
    const container = document.getElementById('sleep-days');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach((day, index) => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'grid grid-cols-3 gap-2 items-center';
        dayDiv.innerHTML = `
            <label class="text-xs text-light">${escapeHtml(day)}</label>
            <input type="number" id="sleep-${sanitizeText(index)}" placeholder="7" 
                   class="px-2 py-1 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-1 focus:ring-primary" 
                   min="0" max="16" step="0.5" required>
            <span class="text-xs text-light">hours</span>
        `;
        container.appendChild(dayDiv);
    });
}

function fillAverageHours() {
    const averageHours = prompt('Enter average hours of sleep per night:');
    if (averageHours && !isNaN(averageHours)) {
        for (let i = 0; i < 7; i++) {
            document.getElementById(`sleep-${sanitizeText(i)}`).value = averageHours;
        }
    }
}

function calculateSleepDebt(e) {
    e.preventDefault();
    
    const data = collectFormData();
    const analysis = analyzeSleepDebt(data);
    displayResults(analysis);
}

function collectFormData() {
    const sleepHours = [];
    for (let i = 0; i < 7; i++) {
        sleepHours.push(parseFloat(document.getElementById(`sleep-${sanitizeText(i)}`).value));
    }
    
    return {
        age: parseInt(document.getElementById('age').value),
        idealSleep: parseFloat(document.getElementById('idealSleep').value),
        sleepHours: sleepHours,
        lifestyle: document.getElementById('lifestyle').value,
        weeksSuffering: parseInt(document.getElementById('weeksSuffering').value),
        sleepQuality: parseInt(document.getElementById('sleepQuality').value),
        recoverySpeed: document.getElementById('recoverySpeed').value,
        weekendFlexibility: document.getElementById('weekendFlexibility').value,
        napAllowed: document.getElementById('napAllowed').checked
    };
}

function analyzeSleepDebt(data) {
    // Calculate weekly sleep debt
    const weeklyIdeal = data.idealSleep * 7;
    const weeklyActual = data.sleepHours.reduce((sum, hours) => sum + hours, 0);
    const weeklyDebt = Math.max(0, weeklyIdeal - weeklyActual);
    
    // Calculate accumulated debt
    const accumulatedDebt = weeklyDebt * data.weeksSuffering;
    
    // Assess severity
    const severity = getSleepDebtSeverity(weeklyDebt, accumulatedDebt);
    
    // Calculate recovery plan
    const recoveryPlan = createRecoveryPlan(data, accumulatedDebt);
    
    // Health impact assessment
    const healthImpact = assessHealthImpact(data, accumulatedDebt);
    
    return {
        weeklyDebt,
        accumulatedDebt,
        severity,
        recoveryPlan,
        healthImpact,
        averageSleep: weeklyActual / 7
    };
}

function getSleepDebtSeverity(weeklyDebt, accumulatedDebt) {
    if (weeklyDebt < 2) return { level: 'Minimal', color: 'text-green-400', description: 'Minor sleep deficit' };
    if (weeklyDebt < 5) return { level: 'Moderate', color: 'text-yellow-400', description: 'Noticeable sleep debt' };
    if (weeklyDebt < 10) return { level: 'Significant', color: 'text-orange-400', description: 'Concerning sleep deficit' };
    return { level: 'Severe', color: 'text-red-400', description: 'Critical sleep debt requiring immediate attention' };
}

function createRecoveryPlan(data, accumulatedDebt) {
    const speedMultipliers = { gradual: 0.5, moderate: 1, aggressive: 1.5 };
    const flexibilityBonus = { none: 0, limited: 1, moderate: 2, high: 3 };
    
    const baseRecoveryRate = speedMultipliers[data.recoverySpeed];
    const weekendBonus = flexibilityBonus[data.weekendFlexibility];
    const napBonus = data.napAllowed ? 0.5 : 0;
    
    // Calculate recovery timeline
    const weeklyRecoveryCapacity = (baseRecoveryRate * 7) + weekendBonus + napBonus;
    const weeksToRecover = Math.ceil(accumulatedDebt / weeklyRecoveryCapacity);
    
    // Create specific recommendations
    const recommendations = generateRecoveryRecommendations(data, weeklyRecoveryCapacity);
    
    return {
        weeksToRecover,
        weeklyRecoveryCapacity,
        recommendations,
        targetBedtime: calculateOptimalBedtime(data),
        weekendStrategy: getWeekendStrategy(data)
    };
}

function generateRecoveryRecommendations(data, weeklyCapacity) {
    const recommendations = [];
    
    // Base sleep schedule
    recommendations.push({
        type: 'Sleep Schedule',
        action: `Aim for ${sanitizeText(data.idealSleep)} hours nightly`,
        priority: 'High',
        timeline: 'Immediate'
    });
    
    // Recovery-specific strategies
    if (data.recoverySpeed === 'aggressive') {
        recommendations.push({
            type: 'Weekend Recovery',
            action: 'Add 1-2 extra hours on weekends',
            priority: 'High',
            timeline: 'This weekend'
        });
    }
    
    if (data.napAllowed) {
        recommendations.push({
            type: 'Strategic Napping',
            action: '20-30 minute naps between 1-3 PM',
            priority: 'Medium',
            timeline: 'As needed'
        });
    }
    
    // Lifestyle-specific advice
    const lifestyleAdvice = getLifestyleAdvice(data.lifestyle);
    recommendations.push(...lifestyleAdvice);
    
    return recommendations;
}

function getLifestyleAdvice(lifestyle) {
    const advice = {
        work: [
            { type: 'Work Boundaries', action: 'Set strict work cutoff time', priority: 'High', timeline: 'This week' },
            { type: 'Evening Routine', action: 'Create 1-hour wind-down routine', priority: 'Medium', timeline: 'Gradual' }
        ],
        newborn: [
            { type: 'Sleep When Baby Sleeps', action: 'Prioritize naps over chores', priority: 'High', timeline: 'Immediate' },
            { type: 'Partner Support', action: 'Alternate night duties with partner', priority: 'High', timeline: 'This week' }
        ],
        student: [
            { type: 'Study Schedule', action: 'Finish studying 2 hours before bed', priority: 'High', timeline: 'This week' },
            { type: 'Exam Preparation', action: 'Spread study sessions vs. cramming', priority: 'Medium', timeline: 'Ongoing' }
        ],
        shift: [
            { type: 'Light Management', action: 'Use blackout curtains for day sleep', priority: 'High', timeline: 'Immediate' },
            { type: 'Consistent Schedule', action: 'Keep same sleep times on days off', priority: 'Medium', timeline: 'Ongoing' }
        ]
    };
    
    return advice[lifestyle] || [];
}

function calculateOptimalBedtime(data) {
    const wakeTime = 7; // Assume 7 AM wake time
    const bedtime = wakeTime - data.idealSleep;
    const adjustedBedtime = bedtime < 0 ? bedtime + 24 : bedtime;
    
    const hour = Math.floor(adjustedBedtime);
    const minute = (adjustedBedtime - hour) * 60;
    
    return `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'AM' : 'PM'}`;
}

function getWeekendStrategy(data) {
    const strategies = {
        none: 'Maintain consistent sleep schedule',
        limited: 'Allow 1-2 extra hours on weekends',
        moderate: 'Sleep in 2-4 hours on weekends for recovery',
        high: 'Use weekends for major sleep debt recovery'
    };
    
    return strategies[data.weekendFlexibility];
}

function assessHealthImpact(data, accumulatedDebt) {
    const impacts = [];
    
    if (accumulatedDebt > 20) {
        impacts.push('Significantly impaired cognitive function');
        impacts.push('Weakened immune system');
        impacts.push('Increased risk of accidents');
    }
    
    if (accumulatedDebt > 40) {
        impacts.push('Elevated stress hormones');
        impacts.push('Impaired memory consolidation');
        impacts.push('Reduced emotional regulation');
    }
    
    if (data.sleepQuality < 5) {
        impacts.push('Poor sleep quality compounds debt effects');
    }
    
    return impacts.length > 0 ? impacts : ['Minimal health impact from current sleep debt'];
}

function displayResults(analysis) {
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = `
        <div class="bg-broder p-4 md:p-6 rounded border border-accent">
            <h2 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
                <span class="material-icons text-primary">assessment</span> Sleep Debt Analysis
            </h2>
            
            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-dark p-4 rounded border border-accent">
                    <h3 class="font-medium text-accent mb-2">Current Status</h3>
                    <div class="space-y-2 text-sm">
                        <div>Average Sleep: <span class="text-primary font-medium">${analysis.averageSleep.toFixed(1)} hours/night</span></div>
                        <div>Weekly Debt: <span class="text-primary font-medium">${analysis.weeklyDebt.toFixed(1)} hours</span></div>
                        <div>Total Accumulated: <span class="text-primary font-medium">${analysis.accumulatedDebt.toFixed(1)} hours</span></div>
                        <div>Severity: <span class="${sanitizeText(analysis.severity.color)} font-medium">${sanitizeText(analysis.severity.level)}</span></div>
                    </div>
                </div>
                
                <div class="bg-dark p-4 rounded border border-accent">
                    <h3 class="font-medium text-accent mb-2">Recovery Timeline</h3>
                    <div class="space-y-2 text-sm">
                        <div>Recovery Time: <span class="text-primary font-medium">${sanitizeText(analysis.recoveryPlan.weeksToRecover)} weeks</span></div>
                        <div>Weekly Recovery: <span class="text-primary font-medium">${analysis.recoveryPlan.weeklyRecoveryCapacity.toFixed(1)} hours</span></div>
                        <div>Target Bedtime: <span class="text-primary font-medium">${sanitizeText(analysis.recoveryPlan.targetBedtime)}</span></div>
                        <div>Weekend Strategy: <span class="text-light">${sanitizeText(analysis.recoveryPlan.weekendStrategy)}</span></div>
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">playlist_add_check</span> Recovery Action Plan
                </h3>
                <div class="space-y-3">
                    ${analysis.recoveryPlan.recommendations.map(rec => `
                        <div class="bg-dark p-3 rounded border-l-4 border-primary">
                            <div class="flex justify-between items-start mb-1">
                                <span class="font-medium text-sm">${rec.type}</span>
                                <span class="text-xs px-2 py-1 rounded ${rec.priority === 'High' ? 'bg-red-600' : rec.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'} text-white">${sanitizeText(rec.priority)}</span>
                            </div>
                            <div class="text-sm text-light">${sanitizeText(rec.action)}</div>
                            <div class="text-xs text-accent mt-1">Timeline: ${sanitizeText(rec.timeline)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-dark p-4 rounded border border-accent">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">health_and_safety</span> Health Impact Assessment
                </h3>
                <ul class="space-y-1 text-sm text-light">
                    ${analysis.healthImpact.map(impact => `<li>â€¢ ${impact}</li>`).join('')}
                </ul>
            </div>
            
            <div class="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded border border-primary/30">
                <h3 class="font-medium text-primary mb-2">ðŸ’¡ Key Insights</h3>
                <div class="text-sm text-light space-y-1">
                    <p>â€¢ Sleep debt recovery requires consistency rather than occasional long sleeps</p>
                    <p>â€¢ Your ${analysis.severity.level.toLowerCase()} sleep debt level needs ${sanitizeText(analysis.recoveryPlan.weeksToRecover)} weeks of dedicated recovery</p>
                    <p>â€¢ Focus on sleep hygiene improvements alongside debt repayment for lasting results</p>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
