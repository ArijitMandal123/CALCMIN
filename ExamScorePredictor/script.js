// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('exam-predictor-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        const prediction = calculateScorePrediction(formData);
        displayResults(prediction);
    });
});

function collectFormData() {
    return {
        examType: document.getElementById('exam-type').value,
        baselineScore: parseInt(document.getElementById('baseline-score').value),
        studyHours: parseInt(document.getElementById('study-hours').value),
        weeksUntil: parseInt(document.getElementById('weeks-until').value),
        targetScore: parseInt(document.getElementById('target-score').value) || null,
        testExperience: document.getElementById('test-experience').value,
        studyMethods: {
            practiceTests: document.getElementById('practice-tests').checked,
            prepCourses: document.getElementById('prep-courses').checked,
            tutoring: document.getElementById('tutoring').checked,
            selfStudy: document.getElementById('self-study').checked,
            flashcards: document.getElementById('flashcards').checked,
            studyGroups: document.getElementById('study-groups').checked
        },
        weakAreas: {
            math: document.getElementById('math-weak').checked,
            verbal: document.getElementById('verbal-weak').checked,
            writing: document.getElementById('writing-weak').checked,
            timing: document.getElementById('timing-weak').checked,
            anxiety: document.getElementById('anxiety-weak').checked,
            content: document.getElementById('content-weak').checked
        }
    };
}

function calculateScorePrediction(data) {
    // Exam-specific configurations
    const examConfigs = {
        sat: { min: 400, max: 1600, avgImprovement: 150, maxImprovement: 300 },
        act: { min: 1, max: 36, avgImprovement: 4, maxImprovement: 8 },
        gre: { min: 260, max: 340, avgImprovement: 15, maxImprovement: 30 },
        gmat: { min: 200, max: 800, avgImprovement: 75, maxImprovement: 150 },
        lsat: { min: 120, max: 180, avgImprovement: 8, maxImprovement: 15 },
        mcat: { min: 472, max: 528, avgImprovement: 6, maxImprovement: 12 },
        toefl: { min: 0, max: 120, avgImprovement: 15, maxImprovement: 30 },
        ielts: { min: 0, max: 9, avgImprovement: 1, maxImprovement: 2 },
        college: { min: 0, max: 100, avgImprovement: 10, maxImprovement: 25 }
    };

    const config = examConfigs[data.examType];
    const totalStudyHours = data.studyHours * data.weeksUntil;
    
    // Calculate base improvement potential
    let improvementFactor = calculateImprovementFactor(data, config, totalStudyHours);
    
    // Apply study method effectiveness
    const methodEffectiveness = calculateMethodEffectiveness(data.studyMethods);
    
    // Apply experience modifier
    const experienceModifier = getExperienceModifier(data.testExperience);
    
    // Apply weak area focus bonus
    const weakAreaBonus = calculateWeakAreaBonus(data.weakAreas);
    
    // Calculate predicted improvement
    const baseImprovement = config.avgImprovement * improvementFactor;
    const adjustedImprovement = baseImprovement * methodEffectiveness * experienceModifier * (1 + weakAreaBonus);
    
    // Cap improvement at maximum possible
    const finalImprovement = Math.min(adjustedImprovement, config.maxImprovement);
    
    // Calculate predicted score
    const predictedScore = Math.min(data.baselineScore + finalImprovement, config.max);
    
    // Calculate confidence interval
    const confidence = calculateConfidence(data, totalStudyHours);
    const margin = finalImprovement * (1 - confidence);
    
    return {
        predictedScore: Math.round(predictedScore),
        confidenceInterval: {
            low: Math.round(Math.max(predictedScore - margin, data.baselineScore)),
            high: Math.round(Math.min(predictedScore + margin, config.max))
        },
        improvement: Math.round(finalImprovement),
        confidence: Math.round(confidence * 100),
        recommendations: generateRecommendations(data, config, predictedScore),
        studyPlan: generateStudyPlan(data, finalImprovement),
        goalAnalysis: analyzeGoalFeasibility(data, predictedScore, config)
    };
}

function calculateImprovementFactor(data, config, totalHours) {
    // Base improvement factor based on study hours
    let factor = Math.min(totalHours / 100, 2.0); // Optimal around 100-200 hours
    
    // Diminishing returns after 200 hours
    if (totalHours > 200) {
        factor = 2.0 - (totalHours - 200) / 400;
    }
    
    // Timeline efficiency (shorter timelines less efficient)
    if (data.weeksUntil < 4) {
        factor *= 0.7; // Cramming penalty
    } else if (data.weeksUntil > 20) {
        factor *= 0.9; // Very long timeline inefficiency
    }
    
    // Baseline score factor (harder to improve from higher scores)
    const scorePercentile = (data.baselineScore - config.min) / (config.max - config.min);
    if (scorePercentile > 0.8) {
        factor *= 0.6; // Much harder to improve from top scores
    } else if (scorePercentile > 0.6) {
        factor *= 0.8;
    }
    
    return Math.max(factor, 0.1);
}

function calculateMethodEffectiveness(methods) {
    let effectiveness = 0.5; // Base effectiveness
    
    // High-impact methods
    if (methods.practiceTests) effectiveness += 0.4;
    if (methods.tutoring) effectiveness += 0.3;
    if (methods.prepCourses) effectiveness += 0.25;
    
    // Moderate-impact methods
    if (methods.selfStudy) effectiveness += 0.15;
    if (methods.studyGroups) effectiveness += 0.1;
    if (methods.flashcards) effectiveness += 0.05;
    
    return Math.min(effectiveness, 1.5); // Cap at 150% effectiveness
}

function getExperienceModifier(experience) {
    const modifiers = {
        'first-time': 0.9,
        'retake': 1.1,
        'similar': 1.05,
        'experienced': 1.15
    };
    return modifiers[experience] || 1.0;
}

function calculateWeakAreaBonus(weakAreas) {
    const areaCount = Object.values(weakAreas).filter(area => area).length;
    
    // More weak areas = more improvement potential, but also more to work on
    if (areaCount === 0) return 0; // No identified weaknesses
    if (areaCount <= 2) return 0.2; // Focused improvement
    if (areaCount <= 4) return 0.1; // Moderate focus needed
    return 0.05; // Too many areas to focus effectively
}

function calculateConfidence(data, totalHours) {
    let confidence = 0.5; // Base confidence
    
    // Study time confidence
    if (totalHours >= 100) confidence += 0.2;
    if (totalHours >= 200) confidence += 0.1;
    
    // Timeline confidence
    if (data.weeksUntil >= 8) confidence += 0.15;
    if (data.weeksUntil >= 12) confidence += 0.1;
    
    // Method confidence
    if (data.studyMethods.practiceTests) confidence += 0.15;
    if (data.studyMethods.tutoring || data.studyMethods.prepCourses) confidence += 0.1;
    
    // Experience confidence
    if (data.testExperience === 'retake' || data.testExperience === 'experienced') {
        confidence += 0.1;
    }
    
    return Math.min(confidence, 0.9); // Cap at 90% confidence
}

function generateRecommendations(data, config, predictedScore) {
    const recommendations = [];
    
    // Study method recommendations
    if (!data.studyMethods.practiceTests) {
        recommendations.push("Take full-length practice tests weekly - this is the most effective preparation method");
    }
    
    if (data.weeksUntil < 6 && !data.studyMethods.tutoring) {
        recommendations.push("Consider intensive tutoring for short-term preparation");
    }
    
    // Weak area recommendations
    const weakCount = Object.values(data.weakAreas).filter(area => area).length;
    if (weakCount > 3) {
        recommendations.push("Focus on 1-2 weakest areas rather than trying to improve everything");
    }
    
    if (data.weakAreas.timing) {
        recommendations.push("Practice timed sections daily to improve pacing and time management");
    }
    
    if (data.weakAreas.anxiety) {
        recommendations.push("Implement stress management techniques and simulate test conditions");
    }
    
    // Timeline recommendations
    if (data.studyHours < 10) {
        recommendations.push("Increase study time to at least 10-15 hours per week for meaningful improvement");
    }
    
    if (data.studyHours > 25) {
        recommendations.push("Consider reducing study hours to avoid burnout - quality over quantity");
    }
    
    // Score-specific recommendations
    const scorePercentile = (predictedScore - config.min) / (config.max - config.min);
    if (scorePercentile > 0.8) {
        recommendations.push("Focus on advanced strategies and avoiding careless mistakes");
    }
    
    return recommendations;
}

function generateStudyPlan(data, improvement) {
    const plan = {
        phase1: "Foundation Building (Weeks 1-2)",
        phase2: "Skill Development (Weeks 3-4)",
        phase3: "Practice & Refinement (Weeks 5+)",
        weeklySchedule: []
    };
    
    // Generate weekly breakdown
    const hoursPerWeek = data.studyHours;
    const practiceTestHours = Math.ceil(hoursPerWeek * 0.4);
    const contentReviewHours = Math.ceil(hoursPerWeek * 0.3);
    const weakAreaHours = Math.ceil(hoursPerWeek * 0.3);
    
    plan.weeklySchedule = [
        { activity: "Practice Tests & Review", hours: practiceTestHours },
        { activity: "Content Review", hours: contentReviewHours },
        { activity: "Weak Area Focus", hours: weakAreaHours }
    ];
    
    return plan;
}

function analyzeGoalFeasibility(data, predictedScore, config) {
    if (!data.targetScore) {
        return {
            hasGoal: false,
            message: "No target score specified"
        };
    }
    
    const gap = data.targetScore - predictedScore;
    const feasibility = gap <= 0 ? "Achievable" : 
                       gap <= config.avgImprovement * 0.3 ? "Challenging but possible" :
                       gap <= config.avgImprovement * 0.6 ? "Very challenging" : "Unlikely with current plan";
    
    return {
        hasGoal: true,
        targetScore: data.targetScore,
        gap: gap,
        feasibility: feasibility,
        recommendation: gap > 0 ? 
            "Consider extending preparation time or intensifying study methods" :
            "You're on track to meet or exceed your goal!"
    };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function displayResults(prediction) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    contentDiv.innerHTML = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-2">Your Exam Score Prediction</h3>
            <p class="text-light">Confidence Level: <span class="text-accent font-bold">${sanitizeText(prediction.confidence)}%</span></p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-dark p-6 rounded border border-accent">
                <h4 class="text-xl font-semibold mb-4 text-accent">Predicted Score</h4>
                <div class="text-center">
                    <div class="text-4xl font-bold text-primary mb-2">${sanitizeText(prediction.predictedScore)}</div>
                    <div class="text-sm text-light mb-4">Expected Score</div>
                    <div class="bg-broder p-3 rounded">
                        <div class="text-sm text-light mb-1">Confidence Range</div>
                        <div class="text-lg font-semibold text-accent">
                            ${sanitizeText(prediction.confidenceInterval.low)} - ${sanitizeText(prediction.confidenceInterval.high)}
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-dark p-6 rounded border border-accent">
                <h4 class="text-xl font-semibold mb-4 text-accent">Improvement Analysis</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span>Expected Improvement:</span>
                        <span class="font-bold text-primary">+${sanitizeText(prediction.improvement)} points</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Confidence Level:</span>
                        <span class="font-bold text-accent">${sanitizeText(prediction.confidence)}%</span>
                    </div>
                    <div class="w-full bg-broder rounded-full h-3">
                        <div class="bg-primary h-3 rounded-full" style="width: ${sanitizeText(prediction.confidence)}%"></div>
                    </div>
                </div>
            </div>
        </div>

        ${prediction.goalAnalysis.hasGoal ? `
            <div class="bg-dark p-6 rounded border border-accent mb-6">
                <h4 class="text-xl font-semibold mb-4 text-accent">Goal Analysis</h4>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <div class="text-sm text-light">Target Score</div>
                        <div class="text-2xl font-bold text-primary">${prediction.goalAnalysis.targetScore}</div>
                    </div>
                    <div>
                        <div class="text-sm text-light">Feasibility</div>
                        <div class="text-lg font-semibold ${
                            prediction.goalAnalysis.feasibility === 'Achievable' ? 'text-green-400' :
                            prediction.goalAnalysis.feasibility.includes('possible') ? 'text-yellow-400' : 'text-red-400'
                        }">${escapeHtml(prediction.goalAnalysis.feasibility)}</div>
                    </div>
                </div>
                <p class="text-light mt-3">${escapeHtml(prediction.goalAnalysis.recommendation)}</p>
            </div>
        ` : ''}

        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h4 class="text-xl font-semibold mb-4 text-accent">Recommended Study Plan</h4>
            <div class="grid md:grid-cols-3 gap-4 mb-4">
                <div class="bg-broder p-3 rounded text-center">
                    <div class="text-sm text-light">Phase 1</div>
                    <div class="font-semibold text-primary">${sanitizeText(prediction.studyPlan.phase1)}</div>
                </div>
                <div class="bg-broder p-3 rounded text-center">
                    <div class="text-sm text-light">Phase 2</div>
                    <div class="font-semibold text-accent">${sanitizeText(prediction.studyPlan.phase2)}</div>
                </div>
                <div class="bg-broder p-3 rounded text-center">
                    <div class="text-sm text-light">Phase 3</div>
                    <div class="font-semibold text-light">${sanitizeText(prediction.studyPlan.phase3)}</div>
                </div>
            </div>
            <h5 class="font-semibold text-accent mb-2">Weekly Time Allocation</h5>
            <div class="space-y-2">
                ${prediction.studyPlan.weeklySchedule.map(item => `
                    <div class="flex justify-between items-center p-2 bg-broder rounded">
                        <span class="text-light">${escapeHtml(item.activity)}</span>
                        <span class="font-bold text-primary">${sanitizeText(item.hours)} hours</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="bg-dark p-6 rounded border border-accent">
            <h4 class="text-xl font-semibold mb-4 text-accent">Personalized Recommendations</h4>
            <ul class="space-y-3">
                ${prediction.recommendations.map(rec => `
                    <li class="flex items-start">
                        <span class="material-icons text-primary mr-3 mt-1">lightbulb</span>
                        <span class="text-light">${escapeHtml(rec)}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
