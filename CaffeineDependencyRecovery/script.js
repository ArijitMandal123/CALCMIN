document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('caffeineForm').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateRecoveryTimeline();
    });
});

function collectFormData() {
    const dailyCaffeine = parseFloat(document.getElementById('dailyCaffeine').value) || 0;
    const sensitivity = document.getElementById('sensitivity').value;
    const timeline = parseInt(document.getElementById('timeline').value);
    const dailyCost = parseFloat(document.getElementById('dailyCost').value) || 0;
    
    // Collect caffeine sources
    const sources = [];
    const sourceCheckboxes = document.querySelectorAll('input[name="sources"]:checked');
    sourceCheckboxes.forEach(checkbox => {
        sources.push(checkbox.value);
    });
    
    return {
        dailyCaffeine,
        sensitivity,
        timeline,
        dailyCost,
        sources
    };
}

function calculateRecoveryTimeline() {
    const data = collectFormData();
    
    if (data.dailyCaffeine <= 0) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                <div class="flex items-center gap-2 text-red-400">
                    <span class="material-icons">error</span>
                    <span class="font-medium">Please enter your current daily caffeine intake.</span>
                </div>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    const timeline = generateTimeline(data);
    displayResults(timeline, data);
}

function generateTimeline(data) {
    const totalDays = data.timeline * 7;
    const timeline = [];
    
    // Calculate reduction schedule based on sensitivity and timeline
    const reductionSchedule = calculateReductionSchedule(data.dailyCaffeine, totalDays, data.sensitivity);
    
    for (let day = 1; day <= totalDays + 7; day++) { // Include 7 days post-elimination
        const dayData = {
            day,
            caffeineAmount: day <= totalDays ? reductionSchedule[day - 1] : 0,
            symptoms: predictSymptoms(day, data.sensitivity, totalDays),
            strategies: getStrategies(day, data.sensitivity, totalDays),
            phase: getPhase(day, totalDays)
        };
        timeline.push(dayData);
    }
    
    return timeline;
}

function calculateReductionSchedule(initialAmount, totalDays, sensitivity) {
    const schedule = [];
    
    // Adjust reduction curve based on sensitivity
    const sensitivityMultipliers = {
        low: 1.2,      // Faster reduction
        moderate: 1.0,  // Standard reduction
        high: 0.8,     // Slower reduction
        severe: 0.6    // Much slower reduction
    };
    
    const multiplier = sensitivityMultipliers[sensitivity];
    
    for (let day = 1; day <= totalDays; day++) {
        // Exponential decay curve for smoother reduction
        const progress = (day - 1) / (totalDays - 1);
        const adjustedProgress = Math.pow(progress, 1 / multiplier);
        const remainingAmount = initialAmount * (1 - adjustedProgress);
        
        schedule.push(Math.max(0, Math.round(remainingAmount)));
    }
    
    return schedule;
}

function predictSymptoms(day, sensitivity, totalDays) {
    const symptoms = [];
    
    // Symptom intensity based on sensitivity
    const intensityLevels = {
        low: { mild: 0.3, moderate: 0.6, severe: 0.9 },
        moderate: { mild: 0.5, moderate: 0.8, severe: 1.0 },
        high: { mild: 0.7, moderate: 1.0, severe: 1.2 },
        severe: { mild: 0.9, moderate: 1.2, severe: 1.5 }
    };
    
    const intensity = intensityLevels[sensitivity];
    
    // Peak withdrawal typically occurs 1-3 days after significant reduction
    const peakDay = Math.floor(totalDays * 0.3); // Peak around 30% through timeline
    const recoveryStart = totalDays + 1;
    
    if (day <= 2) {
        symptoms.push({ type: 'Mild fatigue', severity: 'mild', intensity: intensity.mild });
        symptoms.push({ type: 'Slight headache', severity: 'mild', intensity: intensity.mild });
    } else if (day <= peakDay + 3) {
        symptoms.push({ type: 'Headache', severity: 'moderate', intensity: intensity.moderate });
        symptoms.push({ type: 'Fatigue', severity: 'moderate', intensity: intensity.moderate });
        symptoms.push({ type: 'Irritability', severity: 'moderate', intensity: intensity.moderate });
        if (day >= peakDay) {
            symptoms.push({ type: 'Difficulty concentrating', severity: 'moderate', intensity: intensity.moderate });
        }
    } else if (day <= totalDays) {
        symptoms.push({ type: 'Mild headache', severity: 'mild', intensity: intensity.mild });
        symptoms.push({ type: 'Occasional fatigue', severity: 'mild', intensity: intensity.mild });
    } else if (day <= recoveryStart + 7) {
        symptoms.push({ type: 'Improved energy', severity: 'positive', intensity: 1.0 });
        symptoms.push({ type: 'Better sleep quality', severity: 'positive', intensity: 1.0 });
    } else {
        symptoms.push({ type: 'Stable energy levels', severity: 'positive', intensity: 1.0 });
        symptoms.push({ type: 'No withdrawal symptoms', severity: 'positive', intensity: 1.0 });
    }
    
    return symptoms;
}

function getStrategies(day, sensitivity, totalDays) {
    const strategies = [];
    const peakDay = Math.floor(totalDays * 0.3);
    
    // Universal strategies
    strategies.push('Drink plenty of water (8-10 glasses)');
    strategies.push('Get 7-9 hours of sleep');
    
    if (day <= 3) {
        strategies.push('Take it easy - avoid strenuous activities');
        strategies.push('Consider taking magnesium supplement (200mg)');
    } else if (day <= peakDay + 3) {
        strategies.push('Light exercise (10-15 minute walk)');
        strategies.push('Apply peppermint oil to temples for headaches');
        strategies.push('Practice deep breathing exercises');
        strategies.push('Avoid alcohol and sugar');
    } else if (day <= totalDays) {
        strategies.push('Increase exercise intensity gradually');
        strategies.push('Spend time in bright sunlight (morning preferred)');
        strategies.push('Consider cold shower for natural energy boost');
    } else {
        strategies.push('Maintain healthy sleep schedule');
        strategies.push('Continue regular exercise routine');
        strategies.push('Practice stress management techniques');
    }
    
    // Sensitivity-specific strategies
    if (sensitivity === 'high' || sensitivity === 'severe') {
        if (day <= peakDay + 5) {
            strategies.push('Consider taking time off work if possible');
            strategies.push('Ask family/friends for support');
        }
    }
    
    return strategies;
}

function getPhase(day, totalDays) {
    const recoveryStart = totalDays + 1;
    
    if (day <= 3) return 'Initial Adjustment';
    if (day <= Math.floor(totalDays * 0.5)) return 'Active Reduction';
    if (day <= totalDays) return 'Final Elimination';
    if (day <= recoveryStart + 7) return 'Early Recovery';
    return 'Full Recovery';
}

function displayResults(timeline, data) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    const totalDays = data.timeline * 7;
    const totalSavings = data.dailyCost > 0 ? (data.dailyCost * 365).toFixed(0) : null;
    const initialAmount = data.dailyCaffeine;
    
    const html = `
        <!-- Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold text-primary">${totalDays}</div>
                <div class="text-light text-sm">Days to Zero Caffeine</div>
            </div>
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold text-green-400">${initialAmount}mg</div>
                <div class="text-light text-sm">Starting Daily Intake</div>
            </div>
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold text-accent">${totalSavings ? '$' + totalSavings : 'N/A'}</div>
                <div class="text-light text-sm">Annual Savings</div>
            </div>
        </div>

        <!-- Timeline Summary -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Recovery Timeline Summary</h3>
            <div class="space-y-3">
                ${generateTimelineSummary(timeline, totalDays)}
            </div>
        </div>

        <!-- Weekly Breakdown -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Weekly Breakdown</h3>
            <div class="space-y-4">
                ${generateWeeklyBreakdown(timeline, data.timeline)}
            </div>
        </div>

        <!-- Daily Schedule (First Week) -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">First Week Daily Schedule</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-accent">
                            <th class="text-left text-light p-2">Day</th>
                            <th class="text-right text-light p-2">Caffeine (mg)</th>
                            <th class="text-left text-light p-2">Expected Symptoms</th>
                            <th class="text-left text-light p-2">Key Strategies</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${timeline.slice(0, 7).map(day => `
                            <tr class="border-b border-broder">
                                <td class="text-text p-2">Day ${day.day}</td>
                                <td class="text-right text-accent p-2">${day.caffeineAmount}mg</td>
                                <td class="text-light p-2 text-xs">
                                    ${day.symptoms.slice(0, 2).map(s => s.type).join(', ')}
                                </td>
                                <td class="text-light p-2 text-xs">
                                    ${day.strategies.slice(0, 2).join(', ')}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Symptom Management Guide -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Symptom Management Guide</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 class="text-accent font-semibold mb-2">For Headaches:</h4>
                    <ul class="text-light text-sm space-y-1">
                        <li>• Stay hydrated (extra water)</li>
                        <li>• Apply cold/warm compress</li>
                        <li>• Gentle neck massage</li>
                        <li>• Peppermint oil on temples</li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-accent font-semibold mb-2">For Fatigue:</h4>
                    <ul class="text-light text-sm space-y-1">
                        <li>• Light exercise (10-15 min walk)</li>
                        <li>• Cold shower or splash face</li>
                        <li>• Bright light exposure</li>
                        <li>• Power nap (20 min max)</li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-accent font-semibold mb-2">For Irritability:</h4>
                    <ul class="text-light text-sm space-y-1">
                        <li>• Deep breathing exercises</li>
                        <li>• Meditation or mindfulness</li>
                        <li>• Avoid stressful situations</li>
                        <li>• Talk to supportive friends</li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-accent font-semibold mb-2">For Sleep Issues:</h4>
                    <ul class="text-light text-sm space-y-1">
                        <li>• Consistent sleep schedule</li>
                        <li>• No screens 1 hour before bed</li>
                        <li>• Chamomile tea or melatonin</li>
                        <li>• Cool, dark bedroom</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Progress Tracking -->
        <div class="bg-dark p-6 rounded border border-accent">
            <h3 class="text-xl font-semibold text-primary mb-4">Track Your Progress</h3>
            <div class="space-y-3">
                <div class="bg-broder p-3 rounded">
                    <div class="text-accent font-semibold mb-1">Daily Checklist:</div>
                    <div class="text-light text-sm">
                        □ Measured caffeine intake<br>
                        □ Tracked symptoms (1-10 scale)<br>
                        □ Followed mitigation strategies<br>
                        □ Got adequate sleep<br>
                        □ Stayed hydrated
                    </div>
                </div>
                <div class="bg-broder p-3 rounded">
                    <div class="text-accent font-semibold mb-1">Weekly Goals:</div>
                    <div class="text-light text-sm">
                        □ Reduced caffeine as scheduled<br>
                        □ Maintained work/life balance<br>
                        □ Exercised regularly<br>
                        □ Managed stress effectively
                    </div>
                </div>
            </div>
        </div>

        <!-- Emergency Tips -->
        <div class="bg-red-900 bg-opacity-20 border border-red-600 p-4 rounded mt-6">
            <h4 class="text-red-400 font-semibold mb-2">If Symptoms Become Severe:</h4>
            <ul class="text-red-200 text-sm space-y-1">
                <li>• Slow down the reduction schedule</li>
                <li>• Consider a small amount of caffeine to stabilize</li>
                <li>• Consult healthcare provider if symptoms persist</li>
                <li>• Don't hesitate to take time off work if needed</li>
                <li>• Remember: temporary discomfort for long-term benefits</li>
            </ul>
        </div>
    `;
    
    resultsContent.innerHTML = html;
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateTimelineSummary(timeline, totalDays) {
    const phases = [
        { name: 'Initial Adjustment', days: '1-3', description: 'Mild symptoms begin, body starts adapting' },
        { name: 'Active Reduction', days: `4-${Math.floor(totalDays * 0.5)}`, description: 'Peak withdrawal symptoms, gradual improvement' },
        { name: 'Final Elimination', days: `${Math.floor(totalDays * 0.5) + 1}-${totalDays}`, description: 'Symptoms subside, approaching zero caffeine' },
        { name: 'Recovery Phase', days: `${totalDays + 1}-${totalDays + 7}`, description: 'Energy stabilizes, sleep improves' }
    ];
    
    return phases.map(phase => `
        <div class="flex justify-between items-center p-3 bg-broder rounded">
            <div>
                <div class="font-semibold text-accent">${phase.name}</div>
                <div class="text-light text-sm">${phase.description}</div>
            </div>
            <div class="text-primary font-semibold">Days ${phase.days}</div>
        </div>
    `).join('');
}

function generateWeeklyBreakdown(timeline, totalWeeks) {
    const weeks = [];
    
    for (let week = 1; week <= totalWeeks; week++) {
        const startDay = (week - 1) * 7 + 1;
        const endDay = Math.min(week * 7, timeline.length);
        const weekData = timeline.slice(startDay - 1, endDay);
        
        const avgCaffeine = Math.round(weekData.reduce((sum, day) => sum + day.caffeineAmount, 0) / weekData.length);
        const commonSymptoms = getCommonSymptoms(weekData);
        
        weeks.push(`
            <div class="bg-broder p-4 rounded">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="text-accent font-semibold">Week ${week}</h4>
                    <div class="text-primary font-semibold">${avgCaffeine}mg avg</div>
                </div>
                <div class="text-light text-sm">
                    <strong>Common symptoms:</strong> ${commonSymptoms.join(', ')}<br>
                    <strong>Focus:</strong> ${getWeekFocus(week, totalWeeks)}
                </div>
            </div>
        `);
    }
    
    return weeks.join('');
}

function getCommonSymptoms(weekData) {
    const symptomCounts = {};
    
    weekData.forEach(day => {
        day.symptoms.forEach(symptom => {
            symptomCounts[symptom.type] = (symptomCounts[symptom.type] || 0) + 1;
        });
    });
    
    return Object.entries(symptomCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([symptom]) => symptom);
}

function getWeekFocus(week, totalWeeks) {
    const focuses = [
        'Establishing new routines and managing initial symptoms',
        'Peak withdrawal management and symptom mitigation',
        'Maintaining motivation and preventing relapse',
        'Final push to zero caffeine and recovery preparation'
    ];
    
    const index = Math.min(week - 1, focuses.length - 1);
    return focuses[index];
}