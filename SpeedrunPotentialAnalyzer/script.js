// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('speedrun-form');
    const gameSelect = document.getElementById('gameTitle');
    const customSection = document.getElementById('custom-game-section');
    const reactionTestBtn = document.getElementById('reactionTest');
    const reactionResult = document.getElementById('reactionResult');
    const reactionTimeInput = document.getElementById('reactionTime');
    
    let reactionTestActive = false;
    let reactionStartTime = 0;
    let reactionAttempts = [];
    
    // Show/hide custom game section
    gameSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customSection.classList.remove('hidden');
        } else {
            customSection.classList.add('hidden');
        }
    });
    
    // Reaction time test
    reactionTestBtn.addEventListener('click', function() {
        if (!reactionTestActive) {
            startReactionTest();
        } else {
            recordReactionTime();
        }
    });
    
    function startReactionTest() {
        reactionTestBtn.textContent = 'Wait...';
        reactionTestBtn.className = 'bg-yellow-600 text-white px-6 py-3 rounded font-medium cursor-not-allowed';
        reactionTestBtn.disabled = true;
        
        const delay = Math.random() * 3000 + 1000; // 1-4 seconds
        
        setTimeout(() => {
            reactionTestBtn.textContent = 'CLICK NOW!';
            reactionTestBtn.className = 'bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-medium transition duration-200';
            reactionTestBtn.disabled = false;
            reactionTestActive = true;
            reactionStartTime = Date.now();
        }, delay);
    }
    
    function recordReactionTime() {
        const reactionTime = Date.now() - reactionStartTime;
        reactionAttempts.push(reactionTime);
        
        reactionTestActive = false;
        reactionTestBtn.textContent = 'Test Again';
        reactionTestBtn.className = 'bg-primary hover:bg-accent text-white px-6 py-3 rounded font-medium transition duration-200';
        
        const avgReaction = reactionAttempts.reduce((a, b) => a + b, 0) / reactionAttempts.length;
        reactionTimeInput.value = Math.round(avgReaction);
        
        reactionResult.innerHTML = `
            <div class="text-sm">
                <div>Last: ${sanitizeText(reactionTime)}ms</div>
                <div>Average: ${Math.round(avgReaction)}ms (${sanitizeText(reactionAttempts.length)} attempts)</div>
            </div>
        `;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        const results = analyzeSpeedrunPotential(formData);
        displayResults(results);
    });
});

function collectFormData() {
    const setupItems = Array.from(document.querySelectorAll('input[name="setup"]:checked')).map(cb => cb.value);
    
    const hours = parseInt(document.getElementById('currentHours').value) || 0;
    const minutes = parseInt(document.getElementById('currentMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('currentSeconds').value) || 0;
    const currentTimeSeconds = hours * 3600 + minutes * 60 + seconds;
    
    return {
        gameTitle: document.getElementById('gameTitle').value,
        customGameName: document.getElementById('customGameName').value,
        currentTimeSeconds: currentTimeSeconds,
        practiceHours: parseInt(document.getElementById('practiceHours').value),
        experienceLevel: document.getElementById('experienceLevel').value,
        learningStyle: document.getElementById('learningStyle').value,
        reactionTime: parseInt(document.getElementById('reactionTime').value) || 300,
        setupItems: setupItems
    };
}

function analyzeSpeedrunPotential(data) {
    // Game database with speedrun data
    const gameDatabase = {
        'mario64': { 
            name: 'Super Mario 64', 
            worldRecord: 875, // ~14:35 in seconds
            beginnerGoal: 1800, // 30:00
            categories: ['Any%', '16 Star', '70 Star', '120 Star'],
            difficulty: 'Very High',
            keySkills: ['BLJs', 'Precise movement', 'Wall kicks']
        },
        'zelda-oot': { 
            name: 'The Legend of Zelda: Ocarina of Time', 
            worldRecord: 1020, // ~17:00
            beginnerGoal: 3600, // 60:00
            categories: ['Any%', 'MST', '100%', 'Glitchless'],
            difficulty: 'High',
            keySkills: ['Wrong warp', 'Bottle adventure', 'RBA']
        },
        'portal': { 
            name: 'Portal', 
            worldRecord: 413, // ~6:53
            beginnerGoal: 900, // 15:00
            categories: ['Any%', 'Glitchless', 'No OoB'],
            difficulty: 'Medium',
            keySkills: ['Portal momentum', 'ABH', 'Save glitch']
        },
        'celeste': { 
            name: 'Celeste', 
            worldRecord: 1632, // ~27:12
            beginnerGoal: 2700, // 45:00
            categories: ['Any%', 'All Red Berries', 'All Chapters'],
            difficulty: 'Medium-High',
            keySkills: ['Wavedashing', 'Hyperdashing', 'Demodashing']
        },
        'custom': {
            name: data.customGameName || 'Custom Game',
            worldRecord: Math.max(300, data.currentTimeSeconds * 0.3),
            beginnerGoal: data.currentTimeSeconds * 0.8,
            categories: ['Any%', 'Glitchless'],
            difficulty: 'Unknown',
            keySkills: ['Game-specific techniques']
        }
    };

    const gameInfo = gameDatabase[data.gameTitle] || gameDatabase['custom'];
    
    // Calculate potential score (0-100)
    let potentialScore = 50; // Base score
    
    // Reaction time factor (lower is better)
    if (data.reactionTime <= 180) potentialScore += 15;
    else if (data.reactionTime <= 220) potentialScore += 10;
    else if (data.reactionTime <= 280) potentialScore += 5;
    else if (data.reactionTime >= 400) potentialScore -= 10;
    
    // Experience level factor
    const experienceBonus = {
        'beginner': -5,
        'casual': 0,
        'experienced': 10,
        'expert': 20
    };
    potentialScore += experienceBonus[data.experienceLevel] || 0;
    
    // Learning style factor
    const learningBonus = {
        'visual': 5,
        'practice': 10,
        'analytical': 15,
        'social': 8
    };
    potentialScore += learningBonus[data.learningStyle] || 0;
    
    // Setup bonuses
    potentialScore += data.setupItems.length * 3;
    
    // Practice time factor
    if (data.practiceHours >= 20) potentialScore += 15;
    else if (data.practiceHours >= 10) potentialScore += 10;
    else if (data.practiceHours >= 5) potentialScore += 5;
    else potentialScore -= 5;
    
    // Current time analysis
    const timeGapRatio = data.currentTimeSeconds / gameInfo.beginnerGoal;
    if (timeGapRatio <= 1.2) potentialScore += 20;
    else if (timeGapRatio <= 2.0) potentialScore += 10;
    else if (timeGapRatio >= 4.0) potentialScore -= 15;
    
    potentialScore = Math.max(0, Math.min(100, potentialScore));
    
    // Generate feasibility assessment
    const feasibility = getFeasibilityAssessment(potentialScore, data, gameInfo);
    
    // Calculate time estimates
    const timeEstimates = calculateTimeEstimates(data, gameInfo, potentialScore);
    
    // Generate practice plan
    const practicePlan = generatePracticePlan(data, gameInfo, potentialScore);
    
    // Recommend categories
    const categoryRecommendations = recommendCategories(gameInfo, potentialScore, data.experienceLevel);

    return {
        gameInfo: gameInfo,
        potentialScore: potentialScore,
        feasibility: feasibility,
        timeEstimates: timeEstimates,
        practicePlan: practicePlan,
        categoryRecommendations: categoryRecommendations,
        reactionAnalysis: analyzeReactionTime(data.reactionTime)
    };
}

function getFeasibilityAssessment(score, data, gameInfo) {
    let level, description, recommendation;
    
    if (score >= 80) {
        level = "Excellent Potential";
        description = "You have strong fundamentals and setup for competitive speedrunning";
        recommendation = "Start with advanced techniques and aim for leaderboard positions";
    } else if (score >= 65) {
        level = "Good Potential";
        description = "Solid foundation with room for competitive improvement";
        recommendation = "Focus on consistency and gradual time improvements";
    } else if (score >= 50) {
        level = "Moderate Potential";
        description = "Can achieve respectable times with dedicated practice";
        recommendation = "Start with easier categories and build fundamentals";
    } else if (score >= 35) {
        level = "Limited Potential";
        description = "Significant challenges but improvement possible with effort";
        recommendation = "Consider glitchless categories or focus on personal bests";
    } else {
        level = "Consider Alternatives";
        description = "Current setup/skills may limit competitive potential";
        recommendation = "Focus on casual speedrunning or consider different games";
    }
    
    return { level, description, recommendation };
}

function calculateTimeEstimates(data, gameInfo, score) {
    const practiceEfficiency = Math.min(data.practiceHours / 10, 2); // Max 2x efficiency
    const skillMultiplier = score / 100;
    
    // Estimate weeks to reach different goals
    const beginnerWeeks = Math.max(2, Math.round(8 / (practiceEfficiency * skillMultiplier)));
    const intermediateWeeks = Math.max(4, Math.round(20 / (practiceEfficiency * skillMultiplier)));
    const advancedWeeks = Math.max(12, Math.round(52 / (practiceEfficiency * skillMultiplier)));
    
    // Estimate achievable times
    const currentGap = data.currentTimeSeconds - gameInfo.beginnerGoal;
    const beginnerTime = Math.max(gameInfo.beginnerGoal, data.currentTimeSeconds * 0.8);
    const intermediateTime = Math.max(gameInfo.worldRecord * 2, beginnerTime * 0.7);
    const competitiveTime = Math.max(gameInfo.worldRecord * 1.5, intermediateTime * 0.8);
    
    return {
        beginner: { weeks: beginnerWeeks, time: beginnerTime },
        intermediate: { weeks: intermediateWeeks, time: intermediateTime },
        competitive: { weeks: advancedWeeks, time: competitiveTime }
    };
}

function generatePracticePlan(data, gameInfo, score) {
    const plan = [];
    
    // Week 1-2: Fundamentals
    plan.push({
        phase: "Fundamentals (Weeks 1-2)",
        focus: "Learn basic route and controls",
        goals: [
            "Complete first successful run",
            "Learn movement mechanics",
            "Memorize basic route",
            "Practice save/reset timing"
        ]
    });
    
    // Week 3-6: Consistency
    plan.push({
        phase: "Consistency Building (Weeks 3-6)",
        focus: "Improve execution reliability",
        goals: [
            "Achieve 80% success rate on key tricks",
            "Reduce major time losses",
            "Learn backup strategies",
            "Start timing splits"
        ]
    });
    
    // Week 7+: Optimization
    if (score >= 50) {
        plan.push({
            phase: "Optimization (Weeks 7+)",
            focus: "Advanced techniques and time saves",
            goals: [
                "Master advanced glitches",
                "Optimize individual sections",
                "Learn risky time saves",
                "Compete in community races"
            ]
        });
    }
    
    return plan;
}

function recommendCategories(gameInfo, score, experience) {
    const recommendations = [];
    
    gameInfo.categories.forEach(category => {
        let difficulty, suitability;
        
        if (category.includes('Any%')) {
            difficulty = "High";
            suitability = score >= 60 ? "Recommended" : "Challenging";
        } else if (category.includes('Glitchless') || category.includes('No OoB')) {
            difficulty = "Medium";
            suitability = score >= 40 ? "Good starting point" : "Consider with practice";
        } else if (category.includes('100%') || category.includes('All')) {
            difficulty = "Very High";
            suitability = score >= 70 ? "Advanced goal" : "Long-term objective";
        } else {
            difficulty = "Medium-High";
            suitability = score >= 55 ? "Viable option" : "Requires dedication";
        }
        
        recommendations.push({
            category: category,
            difficulty: difficulty,
            suitability: suitability
        });
    });
    
    return recommendations;
}

function analyzeReactionTime(reactionTime) {
    let rating, description;
    
    if (reactionTime <= 180) {
        rating = "Excellent";
        description = "Top-tier reaction time perfect for competitive speedrunning";
    } else if (reactionTime <= 220) {
        rating = "Very Good";
        description = "Above average reactions suitable for most speedrun techniques";
    } else if (reactionTime <= 280) {
        rating = "Good";
        description = "Solid reaction time that won't limit most speedrunning goals";
    } else if (reactionTime <= 350) {
        rating = "Average";
        description = "Typical reaction time, may need extra practice for frame-perfect tricks";
    } else {
        rating = "Below Average";
        description = "Consider focusing on routing and consistency over reaction-based tricks";
    }
    
    return { rating, description, time: reactionTime };
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${sanitizeText(hours)}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${sanitizeText(minutes)}:${secs.toString().padStart(2, '0')}`;
    }
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');

    const html = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-2">Speedrun Analysis for ${sanitizeText(results.gameInfo.name)}</h3>
            <p class="text-light">Potential Score: <span class="text-accent font-semibold">${sanitizeText(results.potentialScore)}/100</span></p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="bg-broder p-6 rounded-lg border border-accent text-center">
                <div class="text-3xl font-bold text-primary mb-2">${sanitizeText(results.feasibility.level)}</div>
                <div class="text-sm text-light">Feasibility Rating</div>
            </div>
            <div class="bg-broder p-6 rounded-lg border border-accent text-center">
                <div class="text-3xl font-bold text-accent mb-2">${sanitizeText(results.reactionAnalysis.time)}ms</div>
                <div class="text-sm text-light">Reaction Time</div>
                <div class="text-xs text-accent">${sanitizeText(results.reactionAnalysis.rating)}</div>
            </div>
            <div class="bg-broder p-6 rounded-lg border border-accent text-center">
                <div class="text-3xl font-bold text-yellow-400 mb-2">${formatTime(results.timeEstimates.beginner.time)}</div>
                <div class="text-sm text-light">Target Time</div>
                <div class="text-xs text-accent">Beginner Goal</div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Feasibility Assessment</h4>
                <div class="space-y-3">
                    <div class="text-primary font-semibold">${sanitizeText(results.feasibility.level)}</div>
                    <div class="text-sm text-light">${sanitizeText(results.feasibility.description)}</div>
                    <div class="text-sm text-accent mt-3">
                        <strong>Recommendation:</strong> ${sanitizeText(results.feasibility.recommendation)}
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Time Progression Estimates</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-light">Beginner Goal</span>
                        <span class="text-primary font-semibold">${formatTime(results.timeEstimates.beginner.time)} (${sanitizeText(results.timeEstimates.beginner.weeks)} weeks)</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Intermediate</span>
                        <span class="text-primary font-semibold">${formatTime(results.timeEstimates.intermediate.time)} (${sanitizeText(results.timeEstimates.intermediate.weeks)} weeks)</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Competitive</span>
                        <span class="text-primary font-semibold">${formatTime(results.timeEstimates.competitive.time)} (${sanitizeText(results.timeEstimates.competitive.weeks)} weeks)</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-broder p-6 rounded-lg border border-accent mb-6">
            <h4 class="text-xl font-bold text-accent mb-4">Category Recommendations</h4>
            <div class="grid md:grid-cols-2 gap-4">
                ${results.categoryRecommendations.map(cat => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-primary font-semibold">${cat.category}</span>
                            <span class="text-xs px-2 py-1 rounded ${cat.difficulty === 'High' || cat.difficulty === 'Very High' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}">${sanitizeText(cat.difficulty)}</span>
                        </div>
                        <div class="text-sm text-light">${sanitizeText(cat.suitability)}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="bg-broder p-6 rounded-lg border border-accent">
            <h4 class="text-xl font-bold text-accent mb-4">Practice Plan</h4>
            <div class="space-y-4">
                ${results.practicePlan.map(phase => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h5 class="font-semibold text-primary mb-2">${phase.phase}</h5>
                        <div class="text-sm text-light mb-3">${sanitizeText(phase.focus)}</div>
                        <div class="text-sm text-light">
                            <strong>Goals:</strong>
                            <ul class="list-disc list-inside mt-1 space-y-1">
                                ${phase.goals.map(goal => `<li>${goal}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    contentDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
