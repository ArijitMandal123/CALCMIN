// Language Learning Timeline Calculator
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('language-timeline-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        const timeline = calculateLearningTimeline(formData);
        displayResults(timeline);
    });
});

function collectFormData() {
    return {
        targetLanguage: document.getElementById('target-language').value,
        nativeLanguage: document.getElementById('native-language').value,
        fluencyLevel: document.getElementById('fluency-level').value,
        hoursPerWeek: parseInt(document.getElementById('hours-per-week').value),
        learningMethod: document.getElementById('learning-method').value,
        experienceLevel: document.getElementById('experience-level').value,
        budget: document.getElementById('budget').value,
        activities: {
            conversation: document.getElementById('conversation-practice').checked,
            media: document.getElementById('media-consumption').checked,
            reading: document.getElementById('reading-practice').checked,
            writing: document.getElementById('writing-practice').checked,
            exchange: document.getElementById('language-exchange').checked,
            flashcards: document.getElementById('flashcards').checked
        }
    };
}

function calculateLearningTimeline(data) {
    // Language difficulty categories (FSI-based)
    const languageDifficulty = {
        spanish: { category: 1, baseHours: 600, name: "Spanish" },
        french: { category: 1, baseHours: 600, name: "French" },
        italian: { category: 1, baseHours: 600, name: "Italian" },
        portuguese: { category: 1, baseHours: 750, name: "Portuguese" },
        dutch: { category: 2, baseHours: 900, name: "Dutch" },
        german: { category: 2, baseHours: 900, name: "German" },
        russian: { category: 3, baseHours: 1100, name: "Russian" },
        hindi: { category: 3, baseHours: 1100, name: "Hindi" },
        thai: { category: 3, baseHours: 1100, name: "Thai" },
        vietnamese: { category: 3, baseHours: 1100, name: "Vietnamese" },
        chinese: { category: 4, baseHours: 2200, name: "Chinese (Mandarin)" },
        japanese: { category: 4, baseHours: 2200, name: "Japanese" },
        korean: { category: 4, baseHours: 2200, name: "Korean" },
        arabic: { category: 4, baseHours: 2200, name: "Arabic" },
        other: { category: 2.5, baseHours: 1000, name: "Other Language" }
    };

    // Fluency level multipliers
    const fluencyMultipliers = {
        basic: 0.4,      // A1-A2
        conversational: 0.7,  // B1-B2
        fluent: 1.0,     // C1
        native: 1.5      // C2
    };

    // Learning method effectiveness
    const methodEffectiveness = {
        immersion: 1.5,
        'intensive-course': 1.3,
        'regular-course': 1.0,
        'online-course': 0.9,
        tutoring: 1.2,
        'app-based': 0.7,
        'self-study': 0.6,
        combination: 1.1
    };

    // Experience level modifiers
    const experienceModifiers = {
        beginner: 1.0,
        'some-experience': 0.85,
        polyglot: 0.7,
        'native-multilingual': 0.6
    };

    // Budget impact on timeline
    const budgetModifiers = {
        free: 1.4,
        low: 1.2,
        medium: 1.0,
        high: 0.8,
        premium: 0.7
    };

    const targetLang = languageDifficulty[data.targetLanguage];
    const baseHours = targetLang.baseHours * fluencyMultipliers[data.fluencyLevel];
    
    // Apply language family bonus
    const familyBonus = calculateLanguageFamilyBonus(data.nativeLanguage, data.targetLanguage);
    
    // Calculate total modifier
    const methodMod = methodEffectiveness[data.learningMethod];
    const expMod = experienceModifiers[data.experienceLevel];
    const budgetMod = budgetModifiers[data.budget];
    const activityBonus = calculateActivityBonus(data.activities);
    
    const totalModifier = methodMod * expMod * budgetMod * familyBonus * (1 + activityBonus);
    
    // Calculate adjusted hours needed
    const adjustedHours = Math.round(baseHours / totalModifier);
    
    // Calculate timeline
    const weeksNeeded = Math.ceil(adjustedHours / data.hoursPerWeek);
    const monthsNeeded = Math.round(weeksNeeded / 4.33);
    
    // Generate milestones
    const milestones = generateMilestones(data.fluencyLevel, monthsNeeded);
    
    // Calculate costs
    const costs = calculateCosts(data.budget, monthsNeeded);
    
    // Generate recommendations
    const recommendations = generateRecommendations(data, adjustedHours, monthsNeeded);

    return {
        targetLanguage: targetLang.name,
        difficulty: targetLang.category,
        totalHours: adjustedHours,
        weeks: weeksNeeded,
        months: monthsNeeded,
        milestones: milestones,
        costs: costs,
        recommendations: recommendations,
        efficiency: Math.round((1 / totalModifier) * 100),
        methodEffectiveness: Math.round(methodMod * 100)
    };
}

function calculateLanguageFamilyBonus(native, target) {
    const languageFamilies = {
        romance: ['spanish', 'french', 'italian', 'portuguese'],
        germanic: ['english', 'german', 'dutch'],
        slavic: ['russian'],
        sinitic: ['chinese'],
        japonic: ['japanese'],
        koreanic: ['korean'],
        semitic: ['arabic'],
        indoeuropean: ['hindi']
    };

    // Find families for both languages
    let nativeFamily = null;
    let targetFamily = null;

    for (const [family, languages] of Object.entries(languageFamilies)) {
        if (languages.includes(native)) nativeFamily = family;
        if (languages.includes(target)) targetFamily = family;
    }

    // Same family bonus
    if (nativeFamily && targetFamily && nativeFamily === targetFamily) {
        return 1.3; // 30% faster
    }

    // Related family bonus (Indo-European)
    const indoEuropean = ['spanish', 'french', 'italian', 'portuguese', 'english', 'german', 'dutch', 'russian', 'hindi'];
    if (indoEuropean.includes(native) && indoEuropean.includes(target)) {
        return 1.1; // 10% faster
    }

    return 1.0; // No bonus
}

function calculateActivityBonus(activities) {
    let bonus = 0;
    
    // High-impact activities
    if (activities.conversation) bonus += 0.2;
    if (activities.exchange) bonus += 0.15;
    if (activities.writing) bonus += 0.1;
    
    // Medium-impact activities
    if (activities.media) bonus += 0.08;
    if (activities.reading) bonus += 0.08;
    if (activities.flashcards) bonus += 0.05;
    
    return Math.min(bonus, 0.4); // Cap at 40% bonus
}

function generateMilestones(fluencyLevel, totalMonths) {
    const milestoneTemplates = {
        basic: [
            { month: Math.ceil(totalMonths * 0.3), level: "A1", description: "Can introduce yourself and ask basic questions" },
            { month: Math.ceil(totalMonths * 0.7), level: "A2", description: "Can handle routine tasks and simple exchanges" },
            { month: totalMonths, level: "A2+", description: "Basic conversational ability achieved" }
        ],
        conversational: [
            { month: Math.ceil(totalMonths * 0.2), level: "A2", description: "Basic communication established" },
            { month: Math.ceil(totalMonths * 0.5), level: "B1", description: "Can deal with most travel situations" },
            { month: Math.ceil(totalMonths * 0.8), level: "B2", description: "Can express opinions and explain plans" },
            { month: totalMonths, level: "B2+", description: "Conversational fluency achieved" }
        ],
        fluent: [
            { month: Math.ceil(totalMonths * 0.15), level: "A2", description: "Basic foundation complete" },
            { month: Math.ceil(totalMonths * 0.35), level: "B1", description: "Independent user level" },
            { month: Math.ceil(totalMonths * 0.6), level: "B2", description: "Upper intermediate proficiency" },
            { month: Math.ceil(totalMonths * 0.85), level: "C1", description: "Advanced proficiency developing" },
            { month: totalMonths, level: "C1+", description: "Fluent proficiency achieved" }
        ],
        native: [
            { month: Math.ceil(totalMonths * 0.1), level: "A2", description: "Solid foundation established" },
            { month: Math.ceil(totalMonths * 0.25), level: "B1", description: "Independent communication" },
            { month: Math.ceil(totalMonths * 0.45), level: "B2", description: "Complex topics manageable" },
            { month: Math.ceil(totalMonths * 0.7), level: "C1", description: "Advanced fluency" },
            { month: Math.ceil(totalMonths * 0.9), level: "C2", description: "Near-native proficiency" },
            { month: totalMonths, level: "C2+", description: "Mastery level achieved" }
        ]
    };

    return milestoneTemplates[fluencyLevel] || milestoneTemplates.conversational;
}

function calculateCosts(budget, months) {
    const budgetRanges = {
        free: { min: 0, max: 0, resources: "Free apps, YouTube, library books" },
        low: { min: 10, max: 50, resources: "Premium apps, basic textbooks" },
        medium: { min: 50, max: 200, resources: "Online courses, regular tutoring" },
        high: { min: 200, max: 500, resources: "Intensive courses, frequent tutoring" },
        premium: { min: 500, max: 1000, resources: "Immersion programs, private instruction" }
    };

    const range = budgetRanges[budget];
    const avgMonthly = (range.min + range.max) / 2;
    const totalCost = avgMonthly * months;

    return {
        monthly: avgMonthly,
        total: totalCost,
        resources: range.resources
    };
}

function generateRecommendations(data, hours, months) {
    const recommendations = [];

    // Method-specific recommendations
    if (data.learningMethod === 'app-based') {
        recommendations.push("Supplement app learning with conversation practice for faster progress");
    }
    
    if (data.learningMethod === 'self-study') {
        recommendations.push("Consider adding structured courses or tutoring to accelerate learning");
    }

    // Timeline-specific recommendations
    if (months > 24) {
        recommendations.push("Consider increasing study hours or adding immersive activities to reduce timeline");
    }

    if (data.hoursPerWeek < 5) {
        recommendations.push("Increase study time to at least 5-7 hours per week for meaningful progress");
    }

    // Activity recommendations
    if (!data.activities.conversation) {
        recommendations.push("Add regular conversation practice - it's crucial for developing fluency");
    }

    if (!data.activities.media) {
        recommendations.push("Watch movies/TV shows in your target language with subtitles");
    }

    // Budget recommendations
    if (data.budget === 'free') {
        recommendations.push("Consider investing in at least one premium resource for structured learning");
    }

    // Language-specific recommendations
    const difficulty = { spanish: 1, chinese: 4, japanese: 4, arabic: 4 }[data.targetLanguage] || 2;
    if (difficulty >= 3) {
        recommendations.push("Focus on consistent daily practice - difficult languages require regular exposure");
    }

    return recommendations;
}

function displayResults(timeline) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    contentDiv.innerHTML = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-2">Your ${timeline.targetLanguage} Learning Timeline</h3>
            <p class="text-light">Estimated time to fluency: <span class="text-accent font-bold">${timeline.months} months</span></p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="bg-dark p-6 rounded border border-accent text-center">
                <div class="text-3xl font-bold text-primary mb-2">${timeline.totalHours}</div>
                <div class="text-sm text-light">Total Study Hours</div>
            </div>
            <div class="bg-dark p-6 rounded border border-accent text-center">
                <div class="text-3xl font-bold text-accent mb-2">${timeline.months}</div>
                <div class="text-sm text-light">Months to Fluency</div>
            </div>
            <div class="bg-dark p-6 rounded border border-accent text-center">
                <div class="text-3xl font-bold text-green-400 mb-2">${timeline.methodEffectiveness}%</div>
                <div class="text-sm text-light">Method Effectiveness</div>
            </div>
        </div>

        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h4 class="text-xl font-semibold mb-4 text-accent">Learning Milestones</h4>
            <div class="space-y-3">
                ${timeline.milestones.map(milestone => `
                    <div class="flex items-center justify-between p-3 bg-broder rounded border border-accent">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                                ${milestone.level}
                            </div>
                            <div>
                                <div class="font-semibold text-light">${milestone.description}</div>
                                <div class="text-sm text-accent">Month ${milestone.month}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-dark p-6 rounded border border-accent">
                <h4 class="text-xl font-semibold mb-4 text-accent">Cost Estimate</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span>Monthly Budget:</span>
                        <span class="font-bold text-primary">$${timeline.costs.monthly}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Total Investment:</span>
                        <span class="font-bold text-accent">$${timeline.costs.total}</span>
                    </div>
                    <div class="text-sm text-light mt-3">
                        <strong>Recommended Resources:</strong><br>
                        ${timeline.costs.resources}
                    </div>
                </div>
            </div>

            <div class="bg-dark p-6 rounded border border-accent">
                <h4 class="text-xl font-semibold mb-4 text-accent">Language Difficulty</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span>FSI Category:</span>
                        <span class="font-bold text-primary">Category ${timeline.difficulty}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Difficulty Level:</span>
                        <span class="font-bold ${
                            timeline.difficulty <= 2 ? 'text-green-400' :
                            timeline.difficulty <= 3 ? 'text-yellow-400' : 'text-red-400'
                        }">
                            ${timeline.difficulty <= 2 ? 'Moderate' :
                              timeline.difficulty <= 3 ? 'Challenging' : 'Very Difficult'}
                        </span>
                    </div>
                    <div class="w-full bg-broder rounded-full h-3">
                        <div class="bg-primary h-3 rounded-full" style="width: ${Math.min(timeline.efficiency, 100)}%"></div>
                    </div>
                    <div class="text-sm text-light">Learning Efficiency: ${timeline.efficiency}%</div>
                </div>
            </div>
        </div>

        <div class="bg-dark p-6 rounded border border-accent">
            <h4 class="text-xl font-semibold mb-4 text-accent">Personalized Recommendations</h4>
            <ul class="space-y-3">
                ${timeline.recommendations.map(rec => `
                    <li class="flex items-start">
                        <span class="material-icons text-primary mr-3 mt-1">lightbulb</span>
                        <span class="text-light">${rec}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}