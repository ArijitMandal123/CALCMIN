// Asynchronous Communication Audit Tool Script

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

// ===== DATA COLLECTION =====
function collectAuditData() {
    return {
        dailyMessages: parseInt(document.getElementById('dailyMessages').value) || 0,
        urgentMentions: parseInt(document.getElementById('urgentMentions').value) || 0,
        weeklyMeetingHours: parseInt(document.getElementById('weeklyMeetingHours').value) || 0,
        avgMeetingDuration: parseInt(document.getElementById('avgMeetingDuration').value) || 0,
        weeklyDocumentation: parseInt(document.getElementById('weeklyDocumentation').value) || 0,
        responseExpectation: document.getElementById('responseExpectation').value,
        preferredMethod: document.getElementById('preferredMethod').value,
        teamSize: parseInt(document.getElementById('teamSize').value) || 0,
        interruptionsPerHour: parseInt(document.getElementById('interruptionsPerHour').value) || 0,
        deepWorkBlocks: parseInt(document.getElementById('deepWorkBlocks').value) || 0
    };
}

// ===== CALCULATION LOGIC =====
function calculateAsyncScore(data) {
    let score = 100;
    let factors = [];
    
    // Message volume analysis (20% weight)
    const messageVolumeScore = calculateMessageVolumeScore(data.dailyMessages);
    score = (score * 0.8) + (messageVolumeScore * 0.2);
    factors.push({
        category: 'Message Volume',
        score: messageVolumeScore,
        weight: 20,
        analysis: getMessageVolumeAnalysis(data.dailyMessages)
    });
    
    // Urgency pattern assessment (15% weight)
    const urgencyScore = calculateUrgencyScore(data.urgentMentions, data.dailyMessages);
    score = (score * 0.85) + (urgencyScore * 0.15);
    factors.push({
        category: 'Urgency Patterns',
        score: urgencyScore,
        weight: 15,
        analysis: getUrgencyAnalysis(data.urgentMentions, data.dailyMessages)
    });
    
    // Meeting efficiency evaluation (20% weight)
    const meetingScore = calculateMeetingScore(data.weeklyMeetingHours, data.avgMeetingDuration);
    score = (score * 0.8) + (meetingScore * 0.2);
    factors.push({
        category: 'Meeting Efficiency',
        score: meetingScore,
        weight: 20,
        analysis: getMeetingAnalysis(data.weeklyMeetingHours, data.avgMeetingDuration)
    });
    
    // Documentation quality score (15% weight)
    const docScore = calculateDocumentationScore(data.weeklyDocumentation);
    score = (score * 0.85) + (docScore * 0.15);
    factors.push({
        category: 'Documentation Quality',
        score: docScore,
        weight: 15,
        analysis: getDocumentationAnalysis(data.weeklyDocumentation)
    });
    
    // Response expectation score (10% weight)
    const responseScore = calculateResponseScore(data.responseExpectation);
    score = (score * 0.9) + (responseScore * 0.1);
    factors.push({
        category: 'Response Expectations',
        score: responseScore,
        weight: 10,
        analysis: getResponseAnalysis(data.responseExpectation)
    });
    
    // Communication method score (10% weight)
    const methodScore = calculateMethodScore(data.preferredMethod);
    score = (score * 0.9) + (methodScore * 0.1);
    factors.push({
        category: 'Communication Method',
        score: methodScore,
        weight: 10,
        analysis: getMethodAnalysis(data.preferredMethod)
    });
    
    // Context switching score (10% weight)
    const contextScore = calculateContextScore(data.interruptionsPerHour, data.deepWorkBlocks);
    score = (score * 0.9) + (contextScore * 0.1);
    factors.push({
        category: 'Context Switching',
        score: contextScore,
        weight: 10,
        analysis: getContextAnalysis(data.interruptionsPerHour, data.deepWorkBlocks)
    });
    
    return {
        overallScore: Math.round(score),
        factors: factors,
        level: getAsyncLevel(score),
        recommendations: generateRecommendations(data, factors),
        productivity: calculateProductivityImpact(data, score),
        timeSavings: calculateTimeSavings(data, score)
    };
}

function calculateMessageVolumeScore(dailyMessages) {
    if (dailyMessages <= 20) return 100;
    if (dailyMessages <= 40) return 85;
    if (dailyMessages <= 60) return 70;
    if (dailyMessages <= 80) return 55;
    if (dailyMessages <= 100) return 40;
    return 25;
}

function calculateUrgencyScore(urgentMentions, totalMessages) {
    const urgencyRatio = urgentMentions / Math.max(totalMessages, 1);
    if (urgencyRatio <= 0.05) return 100;
    if (urgencyRatio <= 0.1) return 85;
    if (urgencyRatio <= 0.2) return 70;
    if (urgencyRatio <= 0.3) return 55;
    if (urgencyRatio <= 0.4) return 40;
    return 25;
}

function calculateMeetingScore(weeklyHours, avgDuration) {
    let score = 100;
    
    // Penalize excessive meeting hours
    if (weeklyHours > 20) score -= 40;
    else if (weeklyHours > 15) score -= 25;
    else if (weeklyHours > 10) score -= 10;
    
    // Penalize long meetings
    if (avgDuration > 90) score -= 20;
    else if (avgDuration > 60) score -= 10;
    
    return Math.max(score, 0);
}

function calculateDocumentationScore(weeklyHours) {
    if (weeklyHours >= 5) return 100;
    if (weeklyHours >= 3) return 85;
    if (weeklyHours >= 2) return 70;
    if (weeklyHours >= 1) return 55;
    if (weeklyHours >= 0.5) return 40;
    return 25;
}

function calculateResponseScore(expectation) {
    const scores = {
        'flexible': 100,
        'next-day': 85,
        'same-day': 70,
        'quick': 40,
        'immediate': 20
    };
    return scores[expectation] || 50;
}

function calculateMethodScore(method) {
    const scores = {
        'documentation': 100,
        'email': 85,
        'instant': 60,
        'voice': 40,
        'video': 30
    };
    return scores[method] || 50;
}

function calculateContextScore(interruptions, deepWorkBlocks) {
    let score = 100;
    
    // Penalize high interruptions
    if (interruptions > 10) score -= 40;
    else if (interruptions > 7) score -= 25;
    else if (interruptions > 5) score -= 15;
    else if (interruptions > 3) score -= 5;
    
    // Reward deep work blocks
    if (deepWorkBlocks >= 3) score += 0;
    else if (deepWorkBlocks >= 2) score -= 10;
    else if (deepWorkBlocks >= 1) score -= 20;
    else score -= 35;
    
    return Math.max(score, 0);
}

function getAsyncLevel(score) {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-400', description: 'Async-first excellence' };
    if (score >= 60) return { level: 'Good', color: 'text-yellow-400', description: 'Solid async foundations' };
    if (score >= 40) return { level: 'Needs Improvement', color: 'text-orange-400', description: 'Room for optimization' };
    return { level: 'Critical', color: 'text-red-400', description: 'Immediate attention needed' };
}

function calculateProductivityImpact(data, score) {
    const baseProductivity = 40; // hours per week
    const currentEfficiency = score / 100;
    const potentialEfficiency = 0.9; // 90% efficiency target
    
    const currentProductiveHours = baseProductivity * currentEfficiency;
    const potentialProductiveHours = baseProductivity * potentialEfficiency;
    const weeklyGain = potentialProductiveHours - currentProductiveHours;
    
    return {
        currentHours: Math.round(currentProductiveHours * 10) / 10,
        potentialHours: Math.round(potentialProductiveHours * 10) / 10,
        weeklyGain: Math.round(weeklyGain * 10) / 10,
        annualGain: Math.round(weeklyGain * 50 * 10) / 10 // 50 working weeks
    };
}

function calculateTimeSavings(data, score) {
    const improvementPotential = (90 - score) / 100;
    const weeklyMeetingWaste = data.weeklyMeetingHours * 0.3; // 30% of meetings could be async
    const dailyInterruptionWaste = data.interruptionsPerHour * 8 * 0.4 / 60; // 40% of interruptions preventable, 8 hour workday
    const weeklyInterruptionWaste = dailyInterruptionWaste * 5;
    
    const totalWeeklySavings = (weeklyMeetingWaste + weeklyInterruptionWaste) * improvementPotential;
    const teamWeeklySavings = totalWeeklySavings * data.teamSize;
    const annualTeamSavings = teamWeeklySavings * 50;
    
    return {
        personalWeekly: Math.round(totalWeeklySavings * 10) / 10,
        teamWeekly: Math.round(teamWeeklySavings * 10) / 10,
        annualTeam: Math.round(annualTeamSavings * 10) / 10,
        dollarValue: Math.round(annualTeamSavings * 75) // $75/hour average
    };
}

// ===== ANALYSIS FUNCTIONS =====
function getMessageVolumeAnalysis(messages) {
    if (messages <= 20) return 'Optimal message volume - quality over quantity approach';
    if (messages <= 40) return 'Good message discipline with room for consolidation';
    if (messages <= 60) return 'High message volume may indicate fragmented communication';
    if (messages <= 80) return 'Excessive messaging likely reducing team productivity';
    return 'Critical message overload - immediate consolidation needed';
}

function getUrgencyAnalysis(urgent, total) {
    const ratio = urgent / Math.max(total, 1);
    if (ratio <= 0.05) return 'Excellent urgency discipline - true emergencies only';
    if (ratio <= 0.1) return 'Good urgency management with minor over-flagging';
    if (ratio <= 0.2) return 'Moderate urgency overuse diluting important messages';
    if (ratio <= 0.3) return 'High urgency usage creating alert fatigue';
    return 'Critical urgency abuse - everything seems urgent';
}

function getMeetingAnalysis(hours, duration) {
    let analysis = '';
    if (hours > 20) analysis += 'Excessive meeting load consuming deep work time. ';
    else if (hours > 15) analysis += 'High meeting volume with optimization opportunities. ';
    else if (hours <= 5) analysis += 'Efficient meeting discipline. ';
    
    if (duration > 90) analysis += 'Long meetings often indicate poor preparation.';
    else if (duration > 60) analysis += 'Standard meeting length with room for efficiency.';
    else analysis += 'Good meeting duration control.';
    
    return analysis;
}

function getDocumentationAnalysis(hours) {
    if (hours >= 5) return 'Excellent documentation habits creating lasting value';
    if (hours >= 3) return 'Good documentation practice with room for expansion';
    if (hours >= 2) return 'Moderate documentation - increase for better async support';
    if (hours >= 1) return 'Minimal documentation limiting async effectiveness';
    return 'Critical documentation gap - knowledge trapped in conversations';
}

function getResponseAnalysis(expectation) {
    const analyses = {
        'flexible': 'Excellent async mindset allowing for thoughtful responses',
        'next-day': 'Good async approach balancing speed and quality',
        'same-day': 'Moderate expectations with room for async improvement',
        'quick': 'Fast expectations limiting deep work and thoughtful responses',
        'immediate': 'Synchronous expectations destroying async benefits'
    };
    return analyses[expectation] || 'Standard response expectations';
}

function getMethodAnalysis(method) {
    const analyses = {
        'documentation': 'Excellent async-first approach creating searchable knowledge',
        'email': 'Good async foundation with structured communication',
        'instant': 'Mixed async/sync approach with optimization potential',
        'voice': 'Synchronous preference limiting async benefits',
        'video': 'High-sync preference requiring significant async transformation'
    };
    return analyses[method] || 'Standard communication preferences';
}

function getContextAnalysis(interruptions, blocks) {
    let analysis = '';
    if (interruptions > 10) analysis += 'Severe interruption overload destroying focus. ';
    else if (interruptions > 7) analysis += 'High interruption rate limiting deep work. ';
    else if (interruptions > 5) analysis += 'Moderate interruptions with room for improvement. ';
    else analysis += 'Good interruption management. ';
    
    if (blocks >= 3) analysis += 'Excellent deep work discipline.';
    else if (blocks >= 2) analysis += 'Good focus time with room for expansion.';
    else if (blocks >= 1) analysis += 'Minimal deep work - increase for better productivity.';
    else analysis += 'Critical lack of deep work time.';
    
    return analysis;
}

function generateRecommendations(data, factors) {
    const recommendations = [];
    
    // Message volume recommendations
    if (data.dailyMessages > 40) {
        recommendations.push({
            category: 'Message Consolidation',
            priority: 'High',
            action: 'Batch similar messages and create comprehensive updates instead of frequent short messages',
            impact: 'Reduce message volume by 30-50%'
        });
    }
    
    // Urgency recommendations
    const urgencyRatio = data.urgentMentions / Math.max(data.dailyMessages, 1);
    if (urgencyRatio > 0.1) {
        recommendations.push({
            category: 'Urgency Management',
            priority: 'High',
            action: 'Reserve urgent flags for true emergencies only. Create clear urgency criteria.',
            impact: 'Reduce alert fatigue and improve response quality'
        });
    }
    
    // Meeting recommendations
    if (data.weeklyMeetingHours > 15) {
        recommendations.push({
            category: 'Meeting Optimization',
            priority: 'High',
            action: 'Convert 30% of meetings to async updates or decision documents',
            impact: `Save ${Math.round(data.weeklyMeetingHours * 0.3)} hours weekly`
        });
    }
    
    // Documentation recommendations
    if (data.weeklyDocumentation < 3) {
        recommendations.push({
            category: 'Documentation',
            priority: 'Medium',
            action: 'Increase documentation time to 3-5 hours weekly. Focus on searchable knowledge bases.',
            impact: 'Reduce repetitive questions by 40-60%'
        });
    }
    
    // Response time recommendations
    if (data.responseExpectation === 'immediate' || data.responseExpectation === 'quick') {
        recommendations.push({
            category: 'Response Expectations',
            priority: 'Medium',
            action: 'Implement 24-hour default response time for non-urgent communications',
            impact: 'Increase deep work time and response quality'
        });
    }
    
    // Context switching recommendations
    if (data.interruptionsPerHour > 5) {
        recommendations.push({
            category: 'Focus Protection',
            priority: 'High',
            action: 'Create 2-4 hour notification-free blocks daily. Use batched communication windows.',
            impact: 'Increase productive hours by 20-30%'
        });
    }
    
    return recommendations;
}

// ===== RESULTS DISPLAY =====
function displayResults(results) {
    const resultsDiv = document.getElementById('result-content');
    
    resultsDiv.innerHTML = `
        <!-- Overall Score -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                <span class="text-4xl font-bold text-white">${results.overallScore}</span>
            </div>
            <h3 class="text-2xl font-bold ${results.level.color} mb-2">${results.level.level}</h3>
            <p class="text-light">${results.level.description}</p>
        </div>

        <!-- Factor Breakdown -->
        <div class="grid md:grid-cols-2 gap-6 mb-8">
            ${results.factors.map(factor => `
                <div class="bg-dark/50 rounded-lg p-6 border border-accent/20">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-semibold text-primary">${factor.category}</h4>
                        <span class="text-sm text-light">${factor.weight}% weight</span>
                    </div>
                    <div class="flex items-center mb-3">
                        <div class="flex-1 bg-broder rounded-full h-2 mr-3">
                            <div class="bg-gradient-to-r from-primary to-accent h-2 rounded-full" 
                                 style="width: ${factor.score}%"></div>
                        </div>
                        <span class="text-sm font-medium text-text">${Math.round(factor.score)}</span>
                    </div>
                    <p class="text-sm text-light">${factor.analysis}</p>
                </div>
            `).join('')}
        </div>

        <!-- Productivity Impact -->
        <div class="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-8 border border-primary/20">
            <h3 class="text-xl font-bold text-primary mb-4">Productivity Impact Analysis</h3>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-semibold text-accent mb-2">Current State</h4>
                    <p class="text-light mb-1">Productive Hours/Week: <span class="text-primary font-semibold">${results.productivity.currentHours}</span></p>
                </div>
                <div>
                    <h4 class="font-semibold text-accent mb-2">Potential State</h4>
                    <p class="text-light mb-1">Productive Hours/Week: <span class="text-green-400 font-semibold">${results.productivity.potentialHours}</span></p>
                    <p class="text-light mb-1">Weekly Gain: <span class="text-green-400 font-semibold">+${results.productivity.weeklyGain} hours</span></p>
                    <p class="text-light">Annual Gain: <span class="text-green-400 font-semibold">+${results.productivity.annualGain} hours</span></p>
                </div>
            </div>
        </div>

        <!-- Time Savings -->
        <div class="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-6 mb-8 border border-accent/20">
            <h3 class="text-xl font-bold text-accent mb-4">Team Time Savings Potential</h3>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                    <p class="text-2xl font-bold text-primary">${results.timeSavings.personalWeekly}h</p>
                    <p class="text-sm text-light">Personal Weekly Savings</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-accent">${results.timeSavings.teamWeekly}h</p>
                    <p class="text-sm text-light">Team Weekly Savings</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-green-400">$${results.timeSavings.dollarValue.toLocaleString()}</p>
                    <p class="text-sm text-light">Annual Value</p>
                </div>
            </div>
        </div>

        <!-- Recommendations -->
        <div class="mb-8">
            <h3 class="text-xl font-bold text-primary mb-6">Personalized Recommendations</h3>
            <div class="space-y-4">
                ${results.recommendations.map(rec => `
                    <div class="bg-dark/50 rounded-lg p-6 border border-accent/20">
                        <div class="flex justify-between items-start mb-3">
                            <h4 class="font-semibold text-accent">${rec.category}</h4>
                            <span class="px-2 py-1 text-xs rounded ${rec.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}">${rec.priority}</span>
                        </div>
                        <p class="text-light mb-2">${rec.action}</p>
                        <p class="text-sm text-primary font-medium">Expected Impact: ${rec.impact}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Action Steps -->
        <div class="bg-primary/10 rounded-lg p-6 border border-primary/20">
            <h3 class="text-xl font-bold text-primary mb-4">Next Steps</h3>
            <ol class="text-light space-y-2">
                <li>1. Share these results with your team to establish baseline async practices</li>
                <li>2. Implement the highest priority recommendations first</li>
                <li>3. Track your progress using the metrics provided</li>
                <li>4. Re-audit your communication patterns monthly</li>
                <li>5. Celebrate improvements and share successful practices</li>
            </ol>
        </div>
    `;

    // Show results section
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ===== EVENT HANDLERS =====
document.getElementById('asyncAuditForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = collectAuditData();
    
    // Validation
    if (data.teamSize < 2) {
        showPopup('Please enter a valid team size (minimum 2 people).');
        return;
    }
    
    if (data.weeklyMeetingHours > 40) {
        showPopup('Weekly meeting hours cannot exceed 40. Please enter a realistic value.');
        return;
    }
    
    const results = calculateAsyncScore(data);
    displayResults(results);
});

