// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`n// Study Material Format Optimizer Calculator
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('study-optimizer-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        const optimization = calculateOptimalStudyFormat(formData);
        displayResults(optimization);
    });
});

function collectFormData() {
    return {
        subject: document.getElementById('subject').value,
        learningStyle: document.getElementById('learning-style').value,
        hoursPerWeek: parseInt(document.getElementById('hours-per-week').value),
        proficiencyLevel: document.getElementById('proficiency-level').value,
        timeline: parseInt(document.getElementById('timeline').value),
        currentLevel: document.getElementById('current-level').value,
        preferences: {
            videoLectures: document.getElementById('video-lectures').checked,
            textbooks: document.getElementById('textbooks').checked,
            practiceProblems: document.getElementById('practice-problems').checked,
            interactiveTools: document.getElementById('interactive-tools').checked,
            groupStudy: document.getElementById('group-study').checked,
            flashcards: document.getElementById('flashcards').checked
        }
    };
}

function calculateOptimalStudyFormat(data) {
    // Base format allocations by subject
    const subjectFormats = {
        mathematics: { practice: 60, video: 25, reading: 10, interactive: 5 },
        science: { practice: 40, video: 30, reading: 20, interactive: 10 },
        language: { reading: 40, practice: 35, video: 15, interactive: 10 },
        history: { reading: 50, video: 20, practice: 20, interactive: 10 },
        programming: { practice: 50, video: 25, reading: 15, interactive: 10 },
        business: { reading: 35, practice: 30, video: 25, interactive: 10 },
        arts: { practice: 45, video: 25, reading: 20, interactive: 10 },
        medical: { reading: 40, practice: 35, video: 20, interactive: 5 }
    };

    // Learning style adjustments
    const styleAdjustments = {
        visual: { video: 10, interactive: 5, reading: -10, practice: -5 },
        auditory: { video: 15, reading: -10, practice: -5, interactive: 0 },
        kinesthetic: { practice: 15, interactive: 10, video: -10, reading: -15 },
        reading: { reading: 20, video: -10, practice: -5, interactive: -5 },
        multimodal: { video: 5, reading: 5, practice: 0, interactive: 0 }
    };

    // Get base format
    let format = { ...subjectFormats[data.subject] };
    
    // Apply learning style adjustments
    const adjustments = styleAdjustments[data.learningStyle];
    Object.keys(adjustments).forEach(key => {
        format[key] = Math.max(5, format[key] + adjustments[key]);
    });

    // Normalize to 100%
    const total = Object.values(format).reduce((sum, val) => sum + val, 0);
    Object.keys(format).forEach(key => {
        format[key] = Math.round((format[key] / total) * 100);
    });

    // Calculate study schedule
    const schedule = calculateStudySchedule(data, format);
    
    // Generate recommendations
    const recommendations = generateRecommendations(data, format);
    
    // Calculate timeline and milestones
    const timeline = calculateLearningTimeline(data);

    return {
        format,
        schedule,
        recommendations,
        timeline,
        efficiency: calculateEfficiencyScore(data, format)
    };
}

function calculateStudySchedule(data, format) {
    const totalHours = data.hoursPerWeek;
    
    return {
        practice: Math.round((totalHours * format.practice) / 100 * 10) / 10,
        video: Math.round((totalHours * format.video) / 100 * 10) / 10,
        reading: Math.round((totalHours * format.reading) / 100 * 10) / 10,
        interactive: Math.round((totalHours * format.interactive) / 100 * 10) / 10,
        sessionsPerWeek: Math.ceil(totalHours / 2), // 2-hour average sessions
        sessionLength: Math.round(totalHours / Math.ceil(totalHours / 2) * 10) / 10
    };
}

function generateRecommendations(data, format) {
    const recommendations = [];
    
    // Subject-specific recommendations
    const subjectTips = {
        mathematics: [
            "Focus on problem-solving patterns and worked examples",
            "Use spaced repetition for formula memorization",
            "Practice problems of increasing difficulty"
        ],
        science: [
            "Create visual diagrams and concept maps",
            "Conduct virtual or hands-on experiments",
            "Connect theoretical concepts to real-world applications"
        ],
        language: [
            "Read diverse texts and practice active vocabulary",
            "Engage in conversation practice or language exchange",
            "Use multimedia resources for pronunciation and listening"
        ],
        history: [
            "Create timelines and cause-effect diagrams",
            "Use primary sources and multiple perspectives",
            "Practice essay writing and argumentation"
        ],
        programming: [
            "Code daily with hands-on projects",
            "Debug and analyze others' code",
            "Build progressively complex applications"
        ],
        business: [
            "Analyze real case studies and current events",
            "Practice presentation and communication skills",
            "Apply concepts to personal or hypothetical scenarios"
        ],
        arts: [
            "Practice techniques through regular creation",
            "Study and analyze masterworks in your field",
            "Seek feedback from peers and mentors"
        ],
        medical: [
            "Use mnemonics and visual aids for memorization",
            "Practice clinical reasoning with case studies",
            "Review anatomy with 3D models and diagrams"
        ]
    };

    recommendations.push(...subjectTips[data.subject]);

    // Learning style recommendations
    if (data.learningStyle === 'visual') {
        recommendations.push("Use mind maps, diagrams, and color-coding");
        recommendations.push("Create visual summaries and infographics");
    } else if (data.learningStyle === 'auditory') {
        recommendations.push("Record yourself explaining concepts");
        recommendations.push("Join study groups for discussion");
    } else if (data.learningStyle === 'kinesthetic') {
        recommendations.push("Use hands-on activities and simulations");
        recommendations.push("Take breaks for physical movement");
    }

    // Timeline-based recommendations
    if (data.timeline <= 4) {
        recommendations.push("Focus on high-yield topics and practice tests");
        recommendations.push("Use active recall and spaced repetition intensively");
    } else {
        recommendations.push("Build strong foundational understanding first");
        recommendations.push("Gradually increase difficulty and complexity");
    }

    return recommendations;
}

function calculateLearningTimeline(data) {
    const levelMultipliers = {
        beginner: 1.5,
        novice: 1.2,
        intermediate: 1.0,
        advanced: 0.8
    };

    const targetMultipliers = {
        basic: 0.7,
        intermediate: 1.0,
        advanced: 1.4,
        expert: 2.0
    };

    const baseWeeks = data.timeline;
    const currentMultiplier = levelMultipliers[data.currentLevel];
    const targetMultiplier = targetMultipliers[data.proficiencyLevel];
    
    const adjustedWeeks = Math.ceil(baseWeeks * currentMultiplier * targetMultiplier);
    
    return {
        totalWeeks: adjustedWeeks,
        milestones: generateMilestones(adjustedWeeks, data.proficiencyLevel),
        weeklyGoals: generateWeeklyGoals(data)
    };
}

function generateMilestones(weeks, target) {
    const milestones = [];
    const quarter = Math.ceil(weeks / 4);
    
    milestones.push({
        week: quarter,
        goal: "Foundation building and basic concepts",
        completion: "25%"
    });
    
    milestones.push({
        week: quarter * 2,
        goal: "Intermediate understanding and application",
        completion: "50%"
    });
    
    milestones.push({
        week: quarter * 3,
        goal: "Advanced concepts and problem-solving",
        completion: "75%"
    });
    
    milestones.push({
        week: weeks,
        goal: `${sanitizeText(target)} level mastery achieved`,
        completion: "100%"
    });
    
    return milestones;
}

function generateWeeklyGoals(data) {
    const goals = [];
    const hoursPerWeek = data.hoursPerWeek;
    
    if (hoursPerWeek < 10) {
        goals.push("Focus on consistency over intensity");
        goals.push("Complete 2-3 focused study sessions");
    } else if (hoursPerWeek < 20) {
        goals.push("Balance theory and practice daily");
        goals.push("Complete 4-5 study sessions with breaks");
    } else {
        goals.push("Intensive study with regular assessment");
        goals.push("Daily practice with weekly reviews");
    }
    
    return goals;
}

function calculateEfficiencyScore(data, format) {
    let score = 70; // Base score
    
    // Learning style alignment
    if (data.learningStyle === 'visual' && format.video > 30) score += 10;
    if (data.learningStyle === 'kinesthetic' && format.practice > 40) score += 10;
    if (data.learningStyle === 'auditory' && format.video > 25) score += 8;
    if (data.learningStyle === 'reading' && format.reading > 35) score += 10;
    
    // Time allocation efficiency
    if (data.hoursPerWeek >= 15 && data.hoursPerWeek <= 25) score += 10;
    if (data.hoursPerWeek > 30) score -= 5; // Diminishing returns
    
    // Timeline realism
    if (data.timeline >= 8) score += 5; // Adequate time
    if (data.timeline <= 2) score -= 10; // Too rushed
    
    // Preference alignment
    const preferenceCount = Object.values(data.preferences).filter(p => p).length;
    if (preferenceCount >= 3 && preferenceCount <= 5) score += 5;
    
    return Math.min(100, Math.max(40, score));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function displayResults(optimization) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    contentDiv.innerHTML = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-2">Your Optimized Study Plan</h3>
            <p class="text-light">Efficiency Score: <span class="text-accent font-bold">${sanitizeText(optimization.efficiency)}/100</span></p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-dark p-6 rounded border border-accent">
                <h4 class="text-xl font-semibold mb-4 text-accent">Study Format Breakdown</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span>Practice Problems:</span>
                        <span class="font-bold text-primary">${sanitizeText(optimization.format.practice)}%</span>
                    </div>
                    <div class="w-full bg-broder rounded-full h-2">
                        <div class="bg-primary h-2 rounded-full" style="width: ${sanitizeText(optimization.format.practice)}%"></div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span>Video Learning:</span>
                        <span class="font-bold text-accent">${sanitizeText(optimization.format.video)}%</span>
                    </div>
                    <div class="w-full bg-broder rounded-full h-2">
                        <div class="bg-accent h-2 rounded-full" style="width: ${sanitizeText(optimization.format.video)}%"></div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span>Reading/Theory:</span>
                        <span class="font-bold text-light">${sanitizeText(optimization.format.reading)}%</span>
                    </div>
                    <div class="w-full bg-broder rounded-full h-2">
                        <div class="bg-light h-2 rounded-full" style="width: ${sanitizeText(optimization.format.reading)}%"></div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span>Interactive Tools:</span>
                        <span class="font-bold text-green-400">${sanitizeText(optimization.format.interactive)}%</span>
                    </div>
                    <div class="w-full bg-broder rounded-full h-2">
                        <div class="bg-green-400 h-2 rounded-full" style="width: ${sanitizeText(optimization.format.interactive)}%"></div>
                    </div>
                </div>
            </div>

            <div class="bg-dark p-6 rounded border border-accent">
                <h4 class="text-xl font-semibold mb-4 text-accent">Weekly Schedule</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span>Practice Time:</span>
                        <span class="font-bold text-primary">${sanitizeText(optimization.schedule.practice)} hours</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Video Learning:</span>
                        <span class="font-bold text-accent">${sanitizeText(optimization.schedule.video)} hours</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Reading Time:</span>
                        <span class="font-bold text-light">${sanitizeText(optimization.schedule.reading)} hours</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Interactive Study:</span>
                        <span class="font-bold text-green-400">${sanitizeText(optimization.schedule.interactive)} hours</span>
                    </div>
                    <hr class="border-accent">
                    <div class="flex justify-between">
                        <span>Sessions per Week:</span>
                        <span class="font-bold">${sanitizeText(optimization.schedule.sessionsPerWeek)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Session Length:</span>
                        <span class="font-bold">${sanitizeText(optimization.schedule.sessionLength)} hours</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h4 class="text-xl font-semibold mb-4 text-accent">Learning Timeline & Milestones</h4>
            <p class="text-light mb-4">Estimated completion: <span class="font-bold text-primary">${sanitizeText(optimization.timeline.totalWeeks)} weeks</span></p>
            <div class="space-y-3">
                ${optimization.timeline.milestones.map(milestone => `
                    <div class="flex items-center justify-between p-3 bg-broder rounded border border-accent">
                        <div>
                            <span class="font-semibold">Week ${milestone.week}:</span>
                            <span class="text-light">${escapeHtml(milestone.goal)}</span>
                        </div>
                        <span class="text-primary font-bold">${escapeHtml(milestone.completion)}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h4 class="text-xl font-semibold mb-4 text-accent">Personalized Recommendations</h4>
            <ul class="space-y-2">
                ${optimization.recommendations.map(rec => `
                    <li class="flex items-start">
                        <span class="material-icons text-primary mr-2 mt-1">check_circle</span>
                        <span class="text-light">${escapeHtml(rec)}</span>
                    </li>
                `).join('')}
            </ul>
        </div>

        <div class="bg-dark p-6 rounded border border-accent">
            <h4 class="text-xl font-semibold mb-4 text-accent">Weekly Goals</h4>
            <ul class="space-y-2">
                ${optimization.timeline.weeklyGoals.map(goal => `
                    <li class="flex items-start">
                        <span class="material-icons text-accent mr-2 mt-1">star</span>
                        <span class="text-light">${escapeHtml(goal)}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
