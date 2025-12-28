// Anxiety symptom weights and scoring system
const symptomWeights = {
    // Physical symptoms
    heartbeat: 3.2,
    breathing: 3.5,
    sweating: 2.8,
    tension: 2.5,
    digestive: 2.3,
    
    // Mental/emotional symptoms
    worry: 4.0,
    concentration: 3.8,
    restlessness: 3.3,
    irritability: 2.9,
    fear: 3.7
};

// Trigger impact multipliers
const triggerImpacts = {
    work: 1.3,
    relationships: 1.4,
    finances: 1.5,
    health: 1.6,
    social: 1.2,
    change: 1.3
};

// Coping method effectiveness (reduces severity)
const copingEffectiveness = {
    exercise: 0.85,
    meditation: 0.80,
    therapy: 0.70,
    medication: 0.75,
    breathing: 0.90,
    social: 0.88
};

// Sleep quality slider update
document.getElementById('sleepQuality').addEventListener('input', function() {
    document.getElementById('sleepValue').textContent = this.value;
});

// Collect assessment data
function collectAssessmentData() {
    const symptoms = {};
    const triggers = [];
    const copingMethods = [];
    
    // Collect symptom ratings
    document.querySelectorAll('.symptom-select').forEach(select => {
        symptoms[select.dataset.symptom] = parseInt(select.value);
    });
    
    // Collect triggers
    document.querySelectorAll('.trigger-checkbox:checked').forEach(checkbox => {
        triggers.push(checkbox.dataset.trigger);
    });
    
    // Collect coping methods
    document.querySelectorAll('.coping-checkbox:checked').forEach(checkbox => {
        copingMethods.push(checkbox.dataset.coping);
    });
    
    return {
        symptoms: symptoms,
        sleepQuality: parseInt(document.getElementById('sleepQuality').value),
        caffeineIntake: parseInt(document.getElementById('caffeineIntake').value),
        triggers: triggers,
        copingMethods: copingMethods
    };
}

// Calculate anxiety severity score
function calculateAnxietySeverity(data) {
    let baseScore = 0;
    let maxPossibleScore = 0;
    
    // Calculate weighted symptom score
    Object.entries(data.symptoms).forEach(([symptom, rating]) => {
        const weight = symptomWeights[symptom] || 1;
        baseScore += rating * weight;
        maxPossibleScore += 4 * weight; // Max rating is 4
    });
    
    // Normalize to 0-100 scale
    let severityScore = (baseScore / maxPossibleScore) * 100;
    
    // Apply lifestyle factor adjustments
    const sleepImpact = (10 - data.sleepQuality) * 2; // Poor sleep increases severity
    severityScore += sleepImpact;
    
    const caffeineImpact = Math.max(0, (data.caffeineIntake - 200) * 0.05); // High caffeine increases severity
    severityScore += caffeineImpact;
    
    // Apply trigger multipliers
    let triggerMultiplier = 1;
    data.triggers.forEach(trigger => {
        triggerMultiplier *= (triggerImpacts[trigger] || 1);
    });
    severityScore *= Math.min(triggerMultiplier, 2.0); // Cap at 2x multiplier
    
    // Apply coping method reductions
    let copingReduction = 1;
    data.copingMethods.forEach(method => {
        copingReduction *= (copingEffectiveness[method] || 1);
    });
    severityScore *= copingReduction;
    
    // Ensure score stays within 0-100 range
    severityScore = Math.max(0, Math.min(100, severityScore));
    
    return {
        score: Math.round(severityScore),
        baseScore: Math.round(baseScore),
        maxPossible: Math.round(maxPossibleScore),
        adjustments: {
            sleep: sleepImpact,
            caffeine: caffeineImpact,
            triggers: (triggerMultiplier - 1) * 100,
            coping: (1 - copingReduction) * 100
        }
    };
}

// Determine severity level and recommendations
function analyzeSeverity(score) {
    if (score <= 25) {
        return {
            level: "Mild",
            color: "text-green-400",
            bgColor: "bg-green-900/30",
            borderColor: "border-green-600",
            description: "Your anxiety levels are within the mild range. Symptoms are manageable and have minimal impact on daily functioning.",
            riskLevel: "Low",
            professionalHelp: "Consider self-help strategies and lifestyle modifications. Professional help may be beneficial but not urgent.",
            interventions: [
                "Regular exercise (30 minutes, 3-5 times per week)",
                "Mindfulness meditation (10-15 minutes daily)",
                "Sleep hygiene improvements",
                "Stress management techniques",
                "Limit caffeine intake",
                "Deep breathing exercises"
            ]
        };
    } else if (score <= 50) {
        return {
            level: "Moderate",
            color: "text-yellow-400",
            bgColor: "bg-yellow-900/30",
            borderColor: "border-yellow-600",
            description: "Your anxiety levels are in the moderate range. Symptoms may interfere with some daily activities and relationships.",
            riskLevel: "Moderate",
            professionalHelp: "Consider consulting with a mental health professional. Therapy and/or medication evaluation recommended.",
            interventions: [
                "Cognitive Behavioral Therapy (CBT)",
                "Regular therapy sessions",
                "Medication consultation with psychiatrist",
                "Structured exercise program",
                "Mindfulness-based stress reduction",
                "Support group participation"
            ]
        };
    } else if (score <= 75) {
        return {
            level: "Severe",
            color: "text-orange-400",
            bgColor: "bg-orange-900/30",
            borderColor: "border-orange-600",
            description: "Your anxiety levels are in the severe range. Symptoms significantly impact daily functioning and quality of life.",
            riskLevel: "High",
            professionalHelp: "Professional treatment is strongly recommended. Consider both therapy and medication evaluation.",
            interventions: [
                "Immediate therapy consultation",
                "Psychiatric evaluation for medication",
                "Intensive outpatient treatment",
                "Family/couples therapy if relationships affected",
                "Workplace accommodations if needed",
                "Crisis planning and safety strategies"
            ]
        };
    } else {
        return {
            level: "Critical",
            color: "text-red-400",
            bgColor: "bg-red-900/30",
            borderColor: "border-red-600",
            description: "Your anxiety levels are in the critical range. Immediate professional intervention is needed.",
            riskLevel: "Critical",
            professionalHelp: "Seek immediate professional help. Consider emergency services if having thoughts of self-harm.",
            interventions: [
                "Immediate professional evaluation",
                "Crisis intervention services",
                "Intensive therapy program",
                "Medication management",
                "Hospitalization if safety concerns",
                "24/7 crisis support resources"
            ]
        };
    }
}

// Generate personalized recommendations
function generateRecommendations(data, severity) {
    const recommendations = [];
    
    // Sleep-based recommendations
    if (data.sleepQuality < 6) {
        recommendations.push({
            category: "Sleep Improvement",
            priority: "High",
            suggestion: "Focus on sleep hygiene: consistent bedtime, cool dark room, no screens 1 hour before bed",
            impact: "Can reduce anxiety by 15-25%"
        });
    }
    
    // Caffeine recommendations
    if (data.caffeineIntake > 300) {
        recommendations.push({
            category: "Caffeine Reduction",
            priority: "Medium",
            suggestion: "Gradually reduce caffeine intake to under 200mg daily (about 2 cups of coffee)",
            impact: "May reduce physical anxiety symptoms"
        });
    }
    
    // Coping method recommendations
    if (!data.copingMethods.includes('exercise')) {
        recommendations.push({
            category: "Physical Activity",
            priority: "High",
            suggestion: "Start with 20-30 minutes of moderate exercise 3 times per week",
            impact: "Exercise reduces anxiety by 20-30%"
        });
    }
    
    if (!data.copingMethods.includes('meditation') && !data.copingMethods.includes('breathing')) {
        recommendations.push({
            category: "Mindfulness Practice",
            priority: "Medium",
            suggestion: "Learn 4-7-8 breathing technique and practice 10 minutes daily",
            impact: "Breathing exercises provide immediate anxiety relief"
        });
    }
    
    // Trigger-specific recommendations
    if (data.triggers.includes('work')) {
        recommendations.push({
            category: "Work Stress Management",
            priority: "High",
            suggestion: "Set boundaries, take regular breaks, consider workplace accommodations",
            impact: "Work stress management crucial for long-term recovery"
        });
    }
    
    if (data.triggers.includes('social')) {
        recommendations.push({
            category: "Social Anxiety Support",
            priority: "Medium",
            suggestion: "Consider social skills training or gradual exposure therapy",
            impact: "Structured social exposure reduces avoidance behaviors"
        });
    }
    
    return recommendations;
}

// Display results
function displayResults(data) {
    const severityResult = calculateAnxietySeverity(data);
    const analysis = analyzeSeverity(severityResult.score);
    const recommendations = generateRecommendations(data, analysis);
    
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    resultsContent.innerHTML = `
        <!-- Severity Score Card -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="md:col-span-2 ${analysis.bgColor} p-6 rounded-lg border ${analysis.borderColor}">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-2xl font-bold ${analysis.color}">Anxiety Severity: ${analysis.level}</h3>
                    <div class="text-right">
                        <div class="text-4xl font-bold ${analysis.color}">${severityResult.score}/100</div>
                        <div class="text-sm text-light">Risk Level: ${analysis.riskLevel}</div>
                    </div>
                </div>
                <p class="text-light mb-4">${analysis.description}</p>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-light">Base Symptom Score:</span>
                        <span class="text-primary font-semibold ml-2">${severityResult.baseScore}/${severityResult.maxPossible}</span>
                    </div>
                    <div>
                        <span class="text-light">Sleep Impact:</span>
                        <span class="text-primary font-semibold ml-2">${severityResult.adjustments.sleep > 0 ? '+' : ''}${severityResult.adjustments.sleep.toFixed(1)}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-dark p-6 rounded-lg border border-accent">
                <h4 class="text-lg font-semibold text-primary mb-4">Professional Help Guidance</h4>
                <p class="text-light text-sm mb-4">${analysis.professionalHelp}</p>
                <div class="space-y-2">
                    <div class="flex items-center text-sm">
                        <span class="material-icons text-primary mr-2 text-lg">schedule</span>
                        <span class="text-light">Urgency: ${analysis.riskLevel}</span>
                    </div>
                    <div class="flex items-center text-sm">
                        <span class="material-icons text-primary mr-2 text-lg">local_hospital</span>
                        <span class="text-light">${severityResult.score > 75 ? 'Immediate' : severityResult.score > 50 ? 'Within 2 weeks' : 'Within 1 month'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Symptom Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div class="bg-dark p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-primary mb-4">📊 Symptom Analysis</h3>
                <div class="space-y-3">
                    ${Object.entries(data.symptoms)
                        .filter(([_, rating]) => rating > 0)
                        .sort((a, b) => b[1] - a[1])
                        .map(([symptom, rating]) => {
                            const intensity = rating === 4 ? 'Very High' : rating === 3 ? 'High' : rating === 2 ? 'Moderate' : 'Low';
                            const color = rating >= 3 ? 'text-red-400' : rating === 2 ? 'text-yellow-400' : 'text-green-400';
                            return `
                                <div class="flex justify-between items-center">
                                    <span class="text-light capitalize">${symptom.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                                    <div class="text-right">
                                        <span class="${color} font-semibold">${intensity}</span>
                                        <div class="w-20 bg-broder rounded-full h-2 ml-2">
                                            <div class="bg-primary h-2 rounded-full" style="width: ${(rating/4)*100}%"></div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                </div>
            </div>

            <div class="bg-dark p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-primary mb-4">🎯 Contributing Factors</h3>
                <div class="space-y-4">
                    <div>
                        <h4 class="text-sm font-semibold text-accent mb-2">Active Triggers:</h4>
                        <div class="flex flex-wrap gap-2">
                            ${data.triggers.map(trigger => `
                                <span class="px-2 py-1 bg-red-900/30 border border-red-600 rounded text-red-200 text-xs capitalize">
                                    ${trigger}
                                </span>
                            `).join('')}
                            ${data.triggers.length === 0 ? '<span class="text-light text-sm">None identified</span>' : ''}
                        </div>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-accent mb-2">Current Coping Methods:</h4>
                        <div class="flex flex-wrap gap-2">
                            ${data.copingMethods.map(method => `
                                <span class="px-2 py-1 bg-green-900/30 border border-green-600 rounded text-green-200 text-xs capitalize">
                                    ${method}
                                </span>
                            `).join('')}
                            ${data.copingMethods.length === 0 ? '<span class="text-light text-sm">None selected</span>' : ''}
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-light">Sleep Quality:</span>
                            <span class="text-primary font-semibold ml-2">${data.sleepQuality}/10</span>
                        </div>
                        <div>
                            <span class="text-light">Daily Caffeine:</span>
                            <span class="text-primary font-semibold ml-2">${data.caffeineIntake}mg</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recommended Interventions -->
        <div class="mb-8">
            <h3 class="text-xl font-semibold text-primary mb-4">💡 Recommended Interventions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${analysis.interventions.map((intervention, index) => `
                    <div class="bg-dark p-4 rounded-lg border border-accent">
                        <div class="flex items-start">
                            <span class="material-icons text-primary mr-3 mt-1">
                                ${index < 2 ? 'priority_high' : index < 4 ? 'schedule' : 'info'}
                            </span>
                            <div>
                                <h4 class="font-semibold text-primary mb-1">
                                    ${index < 2 ? 'High Priority' : index < 4 ? 'Medium Priority' : 'Additional Support'}
                                </h4>
                                <p class="text-light text-sm">${intervention}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Personalized Recommendations -->
        <div class="mb-8">
            <h3 class="text-xl font-semibold text-primary mb-4">🎯 Personalized Recommendations</h3>
            <div class="space-y-4">
                ${recommendations.map(rec => `
                    <div class="bg-dark p-4 rounded-lg border border-accent">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <h4 class="font-semibold text-primary mr-3">${rec.category}</h4>
                                    <span class="px-2 py-1 text-xs rounded ${
                                        rec.priority === 'High' ? 'bg-red-900/30 border border-red-600 text-red-200' :
                                        rec.priority === 'Medium' ? 'bg-yellow-900/30 border border-yellow-600 text-yellow-200' :
                                        'bg-blue-900/30 border border-blue-600 text-blue-200'
                                    }">${rec.priority} Priority</span>
                                </div>
                                <p class="text-light text-sm mb-2">${rec.suggestion}</p>
                                <p class="text-accent text-xs">${rec.impact}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-dark p-6 rounded-lg border border-accent">
            <h3 class="text-xl font-semibold text-primary mb-4">📋 Your Next Steps</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="text-lg font-semibold text-primary mb-2">This Week</h4>
                    <ul class="text-light space-y-2 text-sm">
                        <li>• ${severityResult.score > 50 ? 'Contact a mental health professional' : 'Implement sleep hygiene improvements'}</li>
                        <li>• Start daily breathing exercises (4-7-8 technique)</li>
                        <li>• ${data.sleepQuality < 6 ? 'Establish consistent sleep schedule' : 'Begin regular exercise routine'}</li>
                        <li>• ${data.caffeineIntake > 300 ? 'Reduce caffeine intake gradually' : 'Practice mindfulness meditation'}</li>
                        <li>• Track symptoms daily to monitor progress</li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-primary mb-2">This Month</h4>
                    <ul class="text-light space-y-2 text-sm">
                        <li>• ${severityResult.score > 75 ? 'Begin intensive treatment program' : severityResult.score > 50 ? 'Start therapy sessions' : 'Consider therapy consultation'}</li>
                        <li>• Build support network and communicate needs</li>
                        <li>• Implement stress management techniques</li>
                        <li>• ${data.triggers.includes('work') ? 'Address workplace stress factors' : 'Focus on trigger management'}</li>
                        <li>• Re-assess symptoms and adjust strategies</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Form submission handler
document.getElementById('anxietyAssessmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const assessmentData = collectAssessmentData();
    
    // Validation
    const hasSymptoms = Object.values(assessmentData.symptoms).some(rating => rating > 0);
    if (!hasSymptoms) {
        alert('Please rate at least one symptom to complete the assessment.');
        return;
    }
    
    // Display results
    displayResults(assessmentData);
    
    // Show success message
    const popup = document.createElement('div');
    popup.className = 'fixed top-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50';
    popup.innerHTML = `
        <div class="flex items-center">
            <span class="material-icons mr-2">psychology</span>
            <span>Assessment completed! Review your results below.</span>
        </div>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 4000);
});