// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('game-time-form');
    const gameSelect = document.getElementById('gameTitle');
    const customSection = document.getElementById('custom-game-section');
    
    // Show/hide custom game section
    gameSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customSection.classList.remove('hidden');
        } else {
            customSection.classList.add('hidden');
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        const results = calculateCompletionTime(formData);
        displayResults(results);
    });
});

function collectFormData() {
    const preferences = Array.from(document.querySelectorAll('input[name="preferences"]:checked')).map(cb => cb.value);
    
    return {
        gameTitle: document.getElementById('gameTitle').value,
        customGameName: document.getElementById('customGameName').value,
        customStoryHours: parseInt(document.getElementById('customStoryHours').value) || 0,
        playstyle: document.getElementById('playstyle').value,
        difficulty: document.getElementById('difficulty').value,
        hoursPerWeek: parseInt(document.getElementById('hoursPerWeek').value),
        experienceLevel: document.getElementById('experienceLevel').value,
        preferences: preferences
    };
}

function calculateCompletionTime(data) {
    // Game database with completion times (in hours)
    const gameDatabase = {
        'cyberpunk2077': { name: 'Cyberpunk 2077', story: 24, extras: 62, completionist: 103 },
        'witcher3': { name: 'The Witcher 3: Wild Hunt', story: 51, extras: 103, completionist: 173 },
        'rdr2': { name: 'Red Dead Redemption 2', story: 50, extras: 79, completionist: 181 },
        'skyrim': { name: 'The Elder Scrolls V: Skyrim', story: 34, extras: 107, completionist: 232 },
        'gta5': { name: 'Grand Theft Auto V', story: 31, extras: 79, completionist: 81 },
        'persona5': { name: 'Persona 5 Royal', story: 103, extras: 125, completionist: 143 },
        'zelda-botw': { name: 'The Legend of Zelda: Breath of the Wild', story: 50, extras: 98, completionist: 184 },
        'assassins-valhalla': { name: "Assassin's Creed Valhalla", story: 61, extras: 95, completionist: 144 },
        'horizon-zero': { name: 'Horizon Zero Dawn', story: 22, extras: 45, completionist: 61 },
        'mass-effect': { name: 'Mass Effect Legendary Edition', story: 63, extras: 88, completionist: 120 },
        'fallout4': { name: 'Fallout 4', story: 27, extras: 84, completionist: 155 },
        'divinity2': { name: 'Divinity: Original Sin 2', story: 60, extras: 87, completionist: 114 },
        'custom': { name: data.customGameName || 'Custom Game', story: data.customStoryHours, extras: data.customStoryHours * 2, completionist: data.customStoryHours * 3 }
    };

    const gameInfo = gameDatabase[data.gameTitle] || gameDatabase['custom'];
    
    // Base completion times based on playstyle
    let baseHours;
    switch (data.playstyle) {
        case 'speedrun':
            baseHours = gameInfo.story * 0.7;
            break;
        case 'casual':
            baseHours = gameInfo.story * 1.3;
            break;
        case 'completionist':
            baseHours = gameInfo.completionist;
            break;
        case 'explorer':
            baseHours = gameInfo.extras;
            break;
        case 'perfectionist':
            baseHours = gameInfo.completionist * 1.2;
            break;
        default:
            baseHours = gameInfo.story;
    }

    // Apply difficulty multiplier
    const difficultyMultipliers = {
        'easy': 0.9,
        'normal': 1.0,
        'hard': 1.3,
        'nightmare': 1.6
    };
    baseHours *= difficultyMultipliers[data.difficulty] || 1.0;

    // Apply experience level multiplier
    const experienceMultipliers = {
        'beginner': 1.4,
        'casual': 1.1,
        'experienced': 1.0,
        'expert': 0.8
    };
    baseHours *= experienceMultipliers[data.experienceLevel] || 1.0;

    // Apply preference modifiers
    if (data.preferences.includes('skip-cutscenes')) baseHours *= 0.85;
    if (data.preferences.includes('use-guides')) baseHours *= 0.9;
    if (data.preferences.includes('collectibles')) baseHours *= 1.4;
    if (data.preferences.includes('multiplayer')) baseHours *= 1.2;

    // Calculate time estimates
    const estimatedHours = Math.round(baseHours);
    const weeksToComplete = Math.ceil(estimatedHours / data.hoursPerWeek);
    const daysToComplete = Math.ceil(estimatedHours / (data.hoursPerWeek / 7));

    // Calculate different completion scenarios
    const scenarios = {
        story: {
            hours: Math.round(gameInfo.story * experienceMultipliers[data.experienceLevel] * difficultyMultipliers[data.difficulty]),
            weeks: Math.ceil((gameInfo.story * experienceMultipliers[data.experienceLevel] * difficultyMultipliers[data.difficulty]) / data.hoursPerWeek)
        },
        extras: {
            hours: Math.round(gameInfo.extras * experienceMultipliers[data.experienceLevel] * difficultyMultipliers[data.difficulty]),
            weeks: Math.ceil((gameInfo.extras * experienceMultipliers[data.experienceLevel] * difficultyMultipliers[data.difficulty]) / data.hoursPerWeek)
        },
        completionist: {
            hours: Math.round(gameInfo.completionist * experienceMultipliers[data.experienceLevel] * difficultyMultipliers[data.difficulty]),
            weeks: Math.ceil((gameInfo.completionist * experienceMultipliers[data.experienceLevel] * difficultyMultipliers[data.difficulty]) / data.hoursPerWeek)
        }
    };

    // Value assessment
    const valueAssessment = calculateValueAssessment(estimatedHours, data.hoursPerWeek);
    
    // Gaming schedule recommendations
    const scheduleRecommendations = generateScheduleRecommendations(estimatedHours, data.hoursPerWeek, data.playstyle);

    return {
        gameInfo: gameInfo,
        estimatedHours: estimatedHours,
        weeksToComplete: weeksToComplete,
        daysToComplete: daysToComplete,
        scenarios: scenarios,
        valueAssessment: valueAssessment,
        scheduleRecommendations: scheduleRecommendations,
        playstyleAnalysis: getPlaystyleAnalysis(data.playstyle, estimatedHours)
    };
}

function calculateValueAssessment(hours, hoursPerWeek) {
    const costPerHour = 60 / hours; // Assuming $60 game price
    const timeCommitment = hours / hoursPerWeek;
    
    let worthRating;
    let worthDescription;
    
    if (costPerHour <= 1 && timeCommitment <= 8) {
        worthRating = "Excellent Value";
        worthDescription = "Great entertainment value for time and money invested";
    } else if (costPerHour <= 2 && timeCommitment <= 12) {
        worthRating = "Good Value";
        worthDescription = "Solid entertainment value with reasonable time commitment";
    } else if (costPerHour <= 4 && timeCommitment <= 20) {
        worthRating = "Fair Value";
        worthDescription = "Decent value but consider if you have the time";
    } else {
        worthRating = "Consider Carefully";
        worthDescription = "High time commitment or cost per hour - evaluate priorities";
    }

    return {
        costPerHour: costPerHour.toFixed(2),
        timeCommitmentWeeks: timeCommitment.toFixed(1),
        worthRating: worthRating,
        worthDescription: worthDescription
    };
}

function generateScheduleRecommendations(totalHours, hoursPerWeek, playstyle) {
    const recommendations = [];
    
    // Session length recommendations
    if (hoursPerWeek <= 5) {
        recommendations.push({
            type: "session",
            title: "Short Session Strategy",
            message: "Play 1-2 hour sessions focusing on single objectives or story chapters."
        });
    } else if (hoursPerWeek <= 15) {
        recommendations.push({
            type: "session",
            title: "Balanced Gaming Schedule",
            message: "Mix 2-3 hour sessions for story with shorter sessions for side content."
        });
    } else {
        recommendations.push({
            type: "session",
            title: "Extended Gaming Sessions",
            message: "You can enjoy longer 4+ hour sessions for deep immersion."
        });
    }

    // Playstyle-specific recommendations
    if (playstyle === 'completionist') {
        recommendations.push({
            type: "strategy",
            title: "Completionist Approach",
            message: "Use guides to track collectibles and plan efficient routes to avoid backtracking."
        });
    } else if (playstyle === 'speedrun') {
        recommendations.push({
            type: "strategy",
            title: "Speed-Focused Gaming",
            message: "Skip optional content and use fast travel. Focus on main objectives only."
        });
    }

    // Time management
    if (totalHours > hoursPerWeek * 10) {
        recommendations.push({
            type: "warning",
            title: "Long-Term Commitment",
            message: "This game requires a significant time investment. Consider if it fits your schedule."
        });
    }

    return recommendations;
}

function getPlaystyleAnalysis(playstyle, estimatedHours) {
    const analyses = {
        'speedrun': {
            focus: "Story completion only",
            benefits: "Quick completion, see ending fast",
            drawbacks: "Miss side content and exploration",
            timeRange: "Shortest possible"
        },
        'casual': {
            focus: "Story + light exploration",
            benefits: "Balanced experience, not overwhelming",
            drawbacks: "May miss some interesting content",
            timeRange: "Moderate length"
        },
        'completionist': {
            focus: "Everything the game offers",
            benefits: "Full experience, maximum value",
            drawbacks: "Very time-consuming, potential burnout",
            timeRange: "Longest completion time"
        },
        'explorer': {
            focus: "Story + most side content",
            benefits: "Rich experience without obsessive completion",
            drawbacks: "Still quite time-consuming",
            timeRange: "Extended playtime"
        },
        'perfectionist': {
            focus: "All achievements and trophies",
            benefits: "Ultimate completion satisfaction",
            drawbacks: "May require multiple playthroughs",
            timeRange: "Maximum time investment"
        }
    };

    return analyses[playstyle] || analyses['casual'];
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    const html = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-2">Completion Time Estimate for ${escapeHtml(results.gameInfo.name)}</h3>
            <p class="text-light">Based on your playstyle and gaming schedule</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="bg-broder p-6 rounded-lg border border-accent text-center">
                <div class="text-3xl font-bold text-primary mb-2">${sanitizeText(results.estimatedHours)}</div>
                <div class="text-sm text-light mb-1">Hours to Complete</div>
                <div class="text-xs text-accent">Your Playstyle</div>
            </div>
            <div class="bg-broder p-6 rounded-lg border border-accent text-center">
                <div class="text-3xl font-bold text-accent mb-2">${sanitizeText(results.weeksToComplete)}</div>
                <div class="text-sm text-light mb-1">Weeks to Finish</div>
                <div class="text-xs text-accent">At Your Pace</div>
            </div>
            <div class="bg-broder p-6 rounded-lg border border-accent text-center">
                <div class="text-3xl font-bold text-yellow-400 mb-2">$${sanitizeText(results.valueAssessment.costPerHour)}</div>
                <div class="text-sm text-light mb-1">Cost per Hour</div>
                <div class="text-xs text-accent">Entertainment Value</div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Completion Scenarios</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-light">Story Only</span>
                        <span class="text-primary font-semibold">${sanitizeText(results.scenarios.story.hours)}h (${sanitizeText(results.scenarios.story.weeks)} weeks)</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Main + Extras</span>
                        <span class="text-primary font-semibold">${sanitizeText(results.scenarios.extras.hours)}h (${sanitizeText(results.scenarios.extras.weeks)} weeks)</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Completionist</span>
                        <span class="text-primary font-semibold">${sanitizeText(results.scenarios.completionist.hours)}h (${sanitizeText(results.scenarios.completionist.weeks)} weeks)</span>
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Value Assessment</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-light">Worth Rating</span>
                        <span class="text-primary font-semibold">${escapeHtml(results.valueAssessment.worthRating)}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Time Commitment</span>
                        <span class="text-primary font-semibold">${sanitizeText(results.valueAssessment.timeCommitmentWeeks)} weeks</span>
                    </div>
                    <div class="text-sm text-light mt-3">
                        ${escapeHtml(results.valueAssessment.worthDescription)}
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-broder p-6 rounded-lg border border-accent mb-6">
            <h4 class="text-xl font-bold text-accent mb-4">Your Playstyle Analysis</h4>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h5 class="font-semibold text-primary mb-2">Focus: ${escapeHtml(results.playstyleAnalysis.focus)}</h5>
                    <div class="text-sm text-light mb-3">${escapeHtml(results.playstyleAnalysis.timeRange)}</div>
                    <div class="text-sm text-green-400 mb-2">âœ“ Benefits:</div>
                    <div class="text-sm text-light mb-3">${escapeHtml(results.playstyleAnalysis.benefits)}</div>
                </div>
                <div>
                    <div class="text-sm text-yellow-400 mb-2">âš  Considerations:</div>
                    <div class="text-sm text-light">${escapeHtml(results.playstyleAnalysis.drawbacks)}</div>
                </div>
            </div>
        </div>

        ${results.scheduleRecommendations.length > 0 ? `
        <div class="bg-broder p-6 rounded-lg border border-accent">
            <h4 class="text-xl font-bold text-accent mb-4">Gaming Schedule Recommendations</h4>
            <div class="space-y-4">
                ${results.scheduleRecommendations.map(rec => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex items-start gap-3">
                            <span class="material-icons text-${rec.type === 'warning' ? 'yellow' : rec.type === 'strategy' ? 'blue' : 'green'}-400 mt-1">
                                ${rec.type === 'warning' ? 'warning' : rec.type === 'strategy' ? 'lightbulb' : 'schedule'}
                            </span>
                            <div>
                                <h5 class="font-semibold text-accent mb-1">${escapeHtml(rec.title)}</h5>
                                <p class="text-sm text-light">${escapeHtml(rec.message)}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;

    contentDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
