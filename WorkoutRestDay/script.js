// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

    document.getElementById('rest-form').addEventListener('submit', calculateRestSchedule);
});

function calculateRestSchedule(e) {
    e.preventDefault();
    
    const data = collectFormData();
    const analysis = analyzeRestNeeds(data);
    displayResults(analysis);
}

function collectFormData() {
    const muscleGroups = [];
    ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'].forEach(group => {
        if (document.getElementById(group).checked) {
            muscleGroups.push(group);
        }
    });
    
    return {
        fitnessLevel: document.getElementById('fitnessLevel').value,
        age: parseInt(document.getElementById('age').value),
        primaryGoal: document.getElementById('primaryGoal').value,
        weeklyWorkouts: parseInt(document.getElementById('weeklyWorkouts').value),
        avgIntensity: parseInt(document.getElementById('avgIntensity').value),
        workoutDuration: parseInt(document.getElementById('workoutDuration').value),
        trainingType: document.getElementById('trainingType').value,
        sleepQuality: parseInt(document.getElementById('sleepQuality').value),
        sleepHours: parseFloat(document.getElementById('sleepHours').value),
        stressLevel: parseInt(document.getElementById('stressLevel').value),
        energyLevel: parseInt(document.getElementById('energyLevel').value),
        muscleGroups: muscleGroups,
        consecutiveDays: parseInt(document.getElementById('consecutiveDays').value) || 3,
        preferredRestDays: parseInt(document.getElementById('preferredRestDays').value) || 2
    };
}

function analyzeRestNeeds(data) {
    // Calculate recovery score
    const recoveryScore = calculateRecoveryScore(data);
    
    // Determine optimal rest days
    const optimalRestDays = calculateOptimalRestDays(data, recoveryScore);
    
    // Create weekly schedule
    const weeklySchedule = createWeeklySchedule(data, optimalRestDays);
    
    // Generate recommendations
    const recommendations = generateRecommendations(data, recoveryScore);
    
    // Assess overtraining risk
    const overtrainingRisk = assessOvertrainingRisk(data, recoveryScore);
    
    return {
        recoveryScore,
        optimalRestDays,
        weeklySchedule,
        recommendations,
        overtrainingRisk
    };
}

function calculateRecoveryScore(data) {
    let score = 50; // Base score
    
    // Age factor
    if (data.age > 40) score -= 5;
    if (data.age > 50) score -= 10;
    
    // Fitness level factor
    const levelBonus = { beginner: -10, intermediate: 0, advanced: 5, elite: 10 };
    score += levelBonus[data.fitnessLevel];
    
    // Sleep factor
    score += (data.sleepQuality - 5) * 3;
    score += (data.sleepHours - 7) * 2;
    
    // Stress and energy
    score -= (data.stressLevel - 5) * 2;
    score += (data.energyLevel - 5) * 2;
    
    // Training load
    const intensityPenalty = (data.avgIntensity - 5) * 2;
    const durationPenalty = Math.max(0, (data.workoutDuration - 60) / 30);
    score -= intensityPenalty + durationPenalty;
    
    return Math.max(0, Math.min(100, score));
}

function calculateOptimalRestDays(data, recoveryScore) {
    let baseRestDays = 2;
    
    // Adjust based on recovery score
    if (recoveryScore < 30) baseRestDays = 4;
    else if (recoveryScore < 50) baseRestDays = 3;
    else if (recoveryScore > 80) baseRestDays = 1;
    
    // Adjust for training frequency
    if (data.weeklyWorkouts > 5) baseRestDays++;
    if (data.weeklyWorkouts < 3) baseRestDays--;
    
    // Adjust for training type
    const typeAdjustment = {
        strength: 0,
        cardio: -1,
        hiit: 1,
        mixed: 0,
        sport: 0
    };
    baseRestDays += typeAdjustment[data.trainingType];
    
    return Math.max(1, Math.min(6, baseRestDays));
}

function createWeeklySchedule(data, optimalRestDays) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = [];
    
    // Calculate training days
    const trainingDays = 7 - optimalRestDays;
    
    // Create pattern based on consecutive day limit
    let pattern = [];
    let currentStreak = 0;
    let dayIndex = 0;
    
    for (let i = 0; i < 7; i++) {
        if (pattern.length < trainingDays && currentStreak < data.consecutiveDays) {
            pattern.push('Training');
            currentStreak++;
        } else {
            pattern.push('Rest');
            currentStreak = 0;
        }
    }
    
    // Optimize pattern for muscle groups
    const optimizedPattern = optimizeForMuscleGroups(pattern, data.muscleGroups);
    
    days.forEach((day, index) => {
        schedule.push({
            day: day,
            type: optimizedPattern[index],
            focus: getTrainingFocus(optimizedPattern[index], data.muscleGroups, index)
        });
    });
    
    return schedule;
}

function optimizeForMuscleGroups(pattern, muscleGroups) {
    // Simple optimization - ensure rest days are well distributed
    const optimized = [...pattern];
    
    // If too many consecutive training days, insert rest
    for (let i = 0; i < optimized.length - 2; i++) {
        if (optimized[i] === 'Training' && 
            optimized[i + 1] === 'Training' && 
            optimized[i + 2] === 'Training') {
            // Find next rest day to swap
            for (let j = i + 3; j < optimized.length; j++) {
                if (optimized[j] === 'Rest') {
                    optimized[i + 2] = 'Rest';
                    optimized[j] = 'Training';
                    break;
                }
            }
        }
    }
    
    return optimized;
}

function getTrainingFocus(type, muscleGroups, dayIndex) {
    if (type === 'Rest') {
        return dayIndex % 2 === 0 ? 'Complete Rest' : 'Active Recovery';
    }
    
    // Rotate through muscle groups
    const focusMap = {
        0: ['chest', 'shoulders'],
        1: ['back', 'arms'],
        2: ['legs', 'core'],
        3: ['chest', 'arms'],
        4: ['back', 'shoulders'],
        5: ['legs', 'core']
    };
    
    const dayFocus = focusMap[dayIndex % 6];
    const availableFocus = dayFocus.filter(group => muscleGroups.includes(group));
    
    return availableFocus.length > 0 ? availableFocus.join(' + ') : 'Full Body';
}

function generateRecommendations(data, recoveryScore) {
    const recommendations = [];
    
    // Recovery-based recommendations
    if (recoveryScore < 40) {
        recommendations.push({
            category: 'Recovery Priority',
            advice: 'Focus on improving sleep and reducing stress before increasing training',
            priority: 'High'
        });
    }
    
    if (data.sleepHours < 7) {
        recommendations.push({
            category: 'Sleep Optimization',
            advice: 'Aim for 7-9 hours of sleep for optimal recovery',
            priority: 'High'
        });
    }
    
    if (data.stressLevel > 7) {
        recommendations.push({
            category: 'Stress Management',
            advice: 'High stress impairs recovery - consider meditation or stress reduction',
            priority: 'Medium'
        });
    }
    
    // Training-specific recommendations
    if (data.avgIntensity > 8 && data.weeklyWorkouts > 4) {
        recommendations.push({
            category: 'Training Load',
            advice: 'Consider reducing intensity or frequency to prevent overtraining',
            priority: 'High'
        });
    }
    
    // Age-specific recommendations
    if (data.age > 40) {
        recommendations.push({
            category: 'Age Considerations',
            advice: 'Include more mobility work and longer warm-ups in routine',
            priority: 'Medium'
        });
    }
    
    // Goal-specific recommendations
    const goalAdvice = getGoalSpecificAdvice(data.primaryGoal);
    recommendations.push(...goalAdvice);
    
    return recommendations;
}

function getGoalSpecificAdvice(goal) {
    const advice = {
        strength: [
            { category: 'Strength Focus', advice: 'Allow 48-72 hours between training same muscle groups', priority: 'High' }
        ],
        muscle: [
            { category: 'Muscle Growth', advice: 'Ensure adequate protein intake (0.8-1g per lb bodyweight)', priority: 'Medium' }
        ],
        endurance: [
            { category: 'Endurance Training', advice: 'Include easy recovery days between high-intensity sessions', priority: 'Medium' }
        ],
        'weight-loss': [
            { category: 'Weight Loss', advice: 'Balance cardio and strength training with adequate rest', priority: 'Medium' }
        ],
        performance: [
            { category: 'Performance', advice: 'Periodize training with planned deload weeks', priority: 'High' }
        ]
    };
    
    return advice[goal] || [];
}

function assessOvertrainingRisk(data, recoveryScore) {
    let riskScore = 0;
    
    // High training volume
    if (data.weeklyWorkouts > 6) riskScore += 2;
    if (data.avgIntensity > 8) riskScore += 2;
    if (data.workoutDuration > 90) riskScore += 1;
    
    // Poor recovery markers
    if (data.sleepQuality < 6) riskScore += 2;
    if (data.sleepHours < 7) riskScore += 1;
    if (data.stressLevel > 7) riskScore += 2;
    if (data.energyLevel < 5) riskScore += 2;
    
    // Recovery score factor
    if (recoveryScore < 40) riskScore += 3;
    else if (recoveryScore < 60) riskScore += 1;
    
    const riskLevels = {
        0: { level: 'Very Low', color: 'text-green-400', description: 'Excellent recovery balance' },
        1: { level: 'Low', color: 'text-green-400', description: 'Good training-recovery balance' },
        2: { level: 'Moderate', color: 'text-yellow-400', description: 'Monitor for overtraining signs' },
        3: { level: 'High', color: 'text-orange-400', description: 'Consider reducing training load' },
        4: { level: 'Very High', color: 'text-red-400', description: 'High overtraining risk - take action' }
    };
    
    const finalScore = Math.min(riskScore, 4);
    return riskLevels[finalScore];
}

function displayResults(analysis) {
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = `
        <div class="bg-broder p-4 md:p-6 rounded border border-accent">
            <h2 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
                <span class="material-icons text-primary">analytics</span> Rest Day Analysis
            </h2>
            
            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-dark p-4 rounded border border-accent">
                    <h3 class="font-medium text-accent mb-2">Recovery Status</h3>
                    <div class="space-y-2 text-sm">
                        <div>Recovery Score: <span class="text-primary font-medium">${sanitizeText(analysis.recoveryScore)}/100</span></div>
                        <div>Optimal Rest Days: <span class="text-primary font-medium">${sanitizeText(analysis.optimalRestDays)} per week</span></div>
                        <div>Overtraining Risk: <span class="${sanitizeText(analysis.overtrainingRisk.color)} font-medium">${sanitizeText(analysis.overtrainingRisk.level)}</span></div>
                    </div>
                </div>
                
                <div class="bg-dark p-4 rounded border border-accent">
                    <h3 class="font-medium text-accent mb-2">Risk Assessment</h3>
                    <div class="text-sm text-light">${sanitizeText(analysis.overtrainingRisk.description)}</div>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">calendar_view_week</span> Optimized Weekly Schedule
                </h3>
                <div class="grid gap-2">
                    ${analysis.weeklySchedule.map(day => `
                        <div class="bg-dark p-3 rounded border border-accent flex justify-between items-center">
                            <div>
                                <span class="font-medium text-sm">${day.day}</span>
                                <span class="ml-2 text-xs px-2 py-1 rounded ${day.type === 'Training' ? 'bg-primary' : 'bg-green-600'} text-white">${sanitizeText(day.type)}</span>
                            </div>
                            <div class="text-sm text-light">${sanitizeText(day.focus)}</div>
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
                                <span class="font-medium text-sm">${rec.category}</span>
                                <span class="text-xs px-2 py-1 rounded ${rec.priority === 'High' ? 'bg-red-600' : rec.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'} text-white">${sanitizeText(rec.priority)}</span>
                            </div>
                            <div class="text-sm text-light">${sanitizeText(rec.advice)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-dark p-4 rounded border border-accent">
                <h3 class="font-medium text-accent mb-3 flex items-center gap-2">
                    <span class="material-icons text-lg">tips_and_updates</span> Recovery Optimization Tips
                </h3>
                <ul class="space-y-1 text-sm text-light">
                    <li>• Listen to your body - adjust rest days based on how you feel</li>
                    <li>• Active recovery (light walking, yoga) can enhance blood flow</li>
                    <li>• Prioritize sleep quality over training intensity</li>
                    <li>• Hydration and nutrition significantly impact recovery speed</li>
                    <li>• Consider deload weeks every 4-6 weeks for advanced trainees</li>
                </ul>
            </div>
            
            <div class="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded border border-primary/30">
                <h3 class="font-medium text-primary mb-2">🎯 Recovery Strategy</h3>
                <div class="text-sm text-light space-y-1">
                    <p>• Your ${sanitizeText(analysis.recoveryScore)}/100 recovery score suggests ${sanitizeText(analysis.optimalRestDays)} rest days per week</p>
                    <p>• ${sanitizeText(analysis.overtrainingRisk.level)} overtraining risk requires careful monitoring</p>
                    <p>• Focus on sleep quality and stress management for optimal recovery</p>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
