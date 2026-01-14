// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sleep-form');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSleepDebt();
    });

    function calculateSleepDebt() {
        const data = collectFormData();
        
        if (!validateInputs(data)) {
            return;
        }

        const analysis = analyzeSleepDebt(data);
        displayResults(analysis, data);
    }

    function collectFormData() {
        return {
            age: parseInt(document.getElementById('age').value),
            sleepNeed: parseFloat(document.getElementById('sleep-need').value),
            recentSleep: parseFloat(document.getElementById('recent-sleep').value),
            monthlySleep: parseFloat(document.getElementById('monthly-sleep').value),
            sleepQuality: parseInt(document.getElementById('sleep-quality').value),
            lifestyle: document.getElementById('lifestyle').value,
            caffeine: document.getElementById('caffeine').value,
            recoveryGoal: document.getElementById('recovery-goal').value,
            obstacles: {
                stress: document.getElementById('obstacle-stress').checked,
                screen: document.getElementById('obstacle-screen').checked,
                schedule: document.getElementById('obstacle-schedule').checked,
                environment: document.getElementById('obstacle-environment').checked,
                medical: document.getElementById('obstacle-medical').checked,
                social: document.getElementById('obstacle-social').checked
            }
        };
    }

    function validateInputs(data) {
        if (!data.age || !data.sleepNeed || !data.recentSleep || !data.monthlySleep || 
            !data.sleepQuality || !data.lifestyle || !data.caffeine || !data.recoveryGoal) {
            resultsDiv.innerHTML = `
                <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <div class="flex items-center gap-2 text-red-400">
                        <span class="material-icons">error</span>
                        <span class="font-medium">Please fill in all required fields to calculate your sleep debt.</span>
                    </div>
                </div>
            `;
            resultsDiv.classList.remove('hidden');
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
            return false;
        }
        return true;
    }

    function analyzeSleepDebt(data) {
        // Calculate sleep debt
        const weeklyDebt = (data.sleepNeed - data.recentSleep) * 7;
        const monthlyDebt = (data.sleepNeed - data.monthlySleep) * 30;
        const averageDebt = (weeklyDebt + monthlyDebt) / 2;

        // Calculate severity
        const debtSeverity = calculateDebtSeverity(averageDebt, data.sleepQuality);
        
        // Generate recovery plan
        const recoveryPlan = generateRecoveryPlan(data, averageDebt);
        
        // Calculate health impact
        const healthImpact = calculateHealthImpact(data, averageDebt);
        
        // Generate recommendations
        const recommendations = generateRecommendations(data, averageDebt);

        return {
            weeklyDebt: Math.round(weeklyDebt * 10) / 10,
            monthlyDebt: Math.round(monthlyDebt * 10) / 10,
            averageDebt: Math.round(averageDebt * 10) / 10,
            debtSeverity,
            recoveryPlan,
            healthImpact,
            recommendations
        };
    }

    function calculateDebtSeverity(debt, quality) {
        let severity = 'Low';
        let color = 'text-green-400';
        let description = 'Minimal sleep debt with good recovery potential';

        if (debt > 20 || quality <= 3) {
            severity = 'Critical';
            color = 'text-red-400';
            description = 'Severe sleep debt requiring immediate attention';
        } else if (debt > 10 || quality <= 5) {
            severity = 'High';
            color = 'text-orange-400';
            description = 'Significant sleep debt affecting daily function';
        } else if (debt > 5 || quality <= 7) {
            severity = 'Moderate';
            color = 'text-yellow-400';
            description = 'Noticeable sleep debt with room for improvement';
        }

        return { severity, color, description };
    }

    function generateRecoveryPlan(data, debt) {
        const timelines = {
            aggressive: { weeks: 2, dailyExtra: 1.5 },
            moderate: { weeks: 4, dailyExtra: 1.0 },
            gradual: { weeks: 8, dailyExtra: 0.5 },
            maintenance: { weeks: 12, dailyExtra: 0.25 }
        };

        const plan = timelines[data.recoveryGoal];
        const targetSleep = data.sleepNeed + plan.dailyExtra;
        const weeklyRecovery = plan.dailyExtra * 7;
        const totalRecovery = weeklyRecovery * plan.weeks;

        // Calculate lifestyle adjustments
        const lifestyleMultipliers = {
            sedentary: 1.0,
            moderate: 1.1,
            active: 1.2,
            'high-stress': 1.3,
            'shift-work': 1.4
        };

        const adjustedWeeks = Math.ceil(plan.weeks * lifestyleMultipliers[data.lifestyle]);

        return {
            timeline: plan.weeks,
            adjustedTimeline: adjustedWeeks,
            targetSleep: Math.round(targetSleep * 10) / 10,
            dailyExtra: plan.dailyExtra,
            weeklyRecovery: Math.round(weeklyRecovery * 10) / 10,
            totalRecovery: Math.round(totalRecovery * 10) / 10,
            recoveryPercentage: Math.min(100, Math.round((totalRecovery / Math.abs(debt)) * 100))
        };
    }

    function calculateHealthImpact(data, debt) {
        const impacts = [];

        // Cognitive impact
        if (debt > 10) {
            impacts.push({
                category: 'Cognitive Function',
                severity: 'High',
                effects: ['Reduced concentration', 'Impaired decision-making', 'Memory problems'],
                recoveryTime: '2-4 weeks'
            });
        } else if (debt > 5) {
            impacts.push({
                category: 'Cognitive Function',
                severity: 'Moderate',
                effects: ['Occasional focus issues', 'Slower processing'],
                recoveryTime: '1-2 weeks'
            });
        }

        // Physical impact
        if (data.sleepQuality <= 4) {
            impacts.push({
                category: 'Physical Health',
                severity: 'High',
                effects: ['Weakened immunity', 'Increased inflammation', 'Metabolic disruption'],
                recoveryTime: '4-8 weeks'
            });
        }

        // Emotional impact
        if (debt > 15 || data.sleepQuality <= 3) {
            impacts.push({
                category: 'Emotional Well-being',
                severity: 'High',
                effects: ['Increased irritability', 'Mood swings', 'Anxiety/depression risk'],
                recoveryTime: '3-6 weeks'
            });
        }

        return impacts;
    }

    function generateRecommendations(data, debt) {
        const recommendations = [];

        // Sleep schedule recommendations
        if (debt > 10) {
            recommendations.push({
                type: 'critical',
                title: 'Prioritize Sleep Recovery',
                message: 'Your sleep debt is significant. Consider taking time off or reducing commitments to focus on recovery.',
                priority: 'high'
            });
        }

        // Caffeine recommendations
        if (data.caffeine === 'high' || data.caffeine === 'excessive') {
            recommendations.push({
                type: 'lifestyle',
                title: 'Reduce Caffeine Intake',
                message: 'High caffeine consumption may be masking sleep debt and preventing quality recovery sleep.',
                priority: 'high'
            });
        }

        // Obstacle-specific recommendations
        if (data.obstacles.stress) {
            recommendations.push({
                type: 'stress',
                title: 'Stress Management',
                message: 'Implement relaxation techniques like meditation, deep breathing, or journaling before bed.',
                priority: 'medium'
            });
        }

        if (data.obstacles.screen) {
            recommendations.push({
                type: 'environment',
                title: 'Digital Detox',
                message: 'Avoid screens 1-2 hours before bedtime. Use blue light filters or glasses if necessary.',
                priority: 'medium'
            });
        }

        if (data.obstacles.schedule) {
            recommendations.push({
                type: 'schedule',
                title: 'Consistent Sleep Schedule',
                message: 'Go to bed and wake up at the same time every day, even on weekends.',
                priority: 'high'
            });
        }

        if (data.obstacles.environment) {
            recommendations.push({
                type: 'environment',
                title: 'Optimize Sleep Environment',
                message: 'Ensure your bedroom is cool (65-68°F), dark, and quiet. Consider blackout curtains and white noise.',
                priority: 'medium'
            });
        }

        // Age-specific recommendations
        if (data.age > 50) {
            recommendations.push({
                type: 'age',
                title: 'Age-Appropriate Recovery',
                message: 'Recovery may take longer as we age. Focus on sleep quality and consistency over dramatic changes.',
                priority: 'medium'
            });
        }

        return recommendations;
    }

    function displayResults(analysis, data) {
        const debtColor = analysis.averageDebt > 10 ? 'text-red-400' : 
                         analysis.averageDebt > 5 ? 'text-orange-400' : 'text-green-400';

        resultContent.innerHTML = `
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
                    <span class="material-icons text-primary">bedtime</span> 
                    Sleep Debt Analysis & Recovery Plan
                </h3>
                
                <div class="grid md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold ${sanitizeText(debtColor)}">${Math.abs(analysis.averageDebt)}h</div>
                        <div class="text-sm text-light">Average Sleep Debt</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold ${sanitizeText(analysis.debtSeverity.color)}">${sanitizeText(analysis.debtSeverity.severity)}</div>
                        <div class="text-sm text-light">Severity Level</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-primary">${sanitizeText(analysis.recoveryPlan.adjustedTimeline)}w</div>
                        <div class="text-sm text-light">Recovery Timeline</div>
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="text-lg font-medium mb-3 text-text">Sleep Debt Breakdown</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-dark p-4 rounded border border-accent">
                            <h5 class="font-medium text-accent mb-2">Recent Debt (7 days)</h5>
                            <div class="text-2xl font-bold ${sanitizeText(debtColor)} mb-1">${Math.abs(analysis.weeklyDebt)}h</div>
                            <div class="text-sm text-light">
                                ${analysis.weeklyDebt > 0 ? 'Sleep deficit' : 'Sleep surplus'} from last week
                            </div>
                        </div>
                        <div class="bg-dark p-4 rounded border border-accent">
                            <h5 class="font-medium text-accent mb-2">Monthly Pattern (30 days)</h5>
                            <div class="text-2xl font-bold ${sanitizeText(debtColor)} mb-1">${Math.abs(analysis.monthlyDebt)}h</div>
                            <div class="text-sm text-light">
                                ${analysis.monthlyDebt > 0 ? 'Chronic sleep debt' : 'Good sleep pattern'} over past month
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="text-lg font-medium mb-3 text-text">Personalized Recovery Plan</h4>
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h5 class="font-medium text-accent mb-2">Target Sleep Schedule</h5>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-light">Current average:</span>
                                        <span class="text-text">${sanitizeText(data.recentSleep)}h/night</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-light">Recovery target:</span>
                                        <span class="text-primary font-medium">${sanitizeText(analysis.recoveryPlan.targetSleep)}h/night</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-light">Extra sleep needed:</span>
                                        <span class="text-accent">+${sanitizeText(analysis.recoveryPlan.dailyExtra)}h/day</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h5 class="font-medium text-accent mb-2">Recovery Timeline</h5>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-light">Base timeline:</span>
                                        <span class="text-text">${sanitizeText(analysis.recoveryPlan.timeline)} weeks</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-light">Adjusted for lifestyle:</span>
                                        <span class="text-primary font-medium">${sanitizeText(analysis.recoveryPlan.adjustedTimeline)} weeks</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-light">Expected recovery:</span>
                                        <span class="text-accent">${sanitizeText(analysis.recoveryPlan.recoveryPercentage)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-sm text-light bg-broder p-3 rounded">
                            <strong>Recovery Strategy:</strong> Add ${sanitizeText(analysis.recoveryPlan.dailyExtra)} hours to your nightly sleep for ${sanitizeText(analysis.recoveryPlan.adjustedTimeline)} weeks. This gradual approach will help you recover approximately ${sanitizeText(analysis.recoveryPlan.recoveryPercentage)}% of your sleep debt while maintaining a sustainable schedule.
                        </div>
                    </div>
                </div>

                ${analysis.healthImpact.length > 0 ? `
                <div class="mb-6">
                    <h4 class="text-lg font-medium mb-3 text-text">Health Impact Assessment</h4>
                    <div class="space-y-3">
                        ${analysis.healthImpact.map(impact => `
                            <div class="bg-dark p-4 rounded border-l-4 ${impact.severity === 'High' ? 'border-red-500' : 'border-yellow-500'}">
                                <div class="flex justify-between items-start mb-2">
                                    <h5 class="font-medium text-accent">${sanitizeText(impact.category)}</h5>
                                    <span class="text-xs px-2 py-1 rounded ${impact.severity === 'High' ? 'bg-red-600' : 'bg-yellow-600'} text-white">${sanitizeText(impact.severity)}</span>
                                </div>
                                <div class="text-sm text-light mb-2">
                                    <strong>Current effects:</strong> ${impact.effects.join(', ')}
                                </div>
                                <div class="text-xs text-light">
                                    <strong>Recovery time:</strong> ${sanitizeText(impact.recoveryTime)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${analysis.recommendations.length > 0 ? `
                <div class="mb-6">
                    <h4 class="text-lg font-medium mb-3 text-text">Personalized Recommendations</h4>
                    <div class="space-y-3">
                        ${analysis.recommendations.map(rec => `
                            <div class="p-3 rounded border-l-4 ${rec.priority === 'high' ? 'border-red-500 bg-red-900/10' : 'border-yellow-500 bg-yellow-900/10'}">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="material-icons text-sm ${rec.priority === 'high' ? 'text-red-400' : 'text-yellow-400'}">
                                        ${rec.priority === 'high' ? 'priority_high' : 'info'}
                                    </span>
                                    <span class="font-medium text-sm">${sanitizeText(rec.title)}</span>
                                </div>
                                <div class="text-sm text-light">${sanitizeText(rec.message)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="bg-dark p-4 rounded border border-accent">
                    <h4 class="text-lg font-medium mb-3 text-text flex items-center gap-2">
                        <span class="material-icons text-accent">tips_and_updates</span>
                        Recovery Success Tips
                    </h4>
                    <ul class="space-y-2 text-sm text-light">
                        <li class="flex items-start gap-2">
                            <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
                            Start gradually - sudden schedule changes can disrupt your circadian rhythm
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
                            Maintain consistency - go to bed and wake up at the same time daily
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
                            Track your progress - monitor energy levels and cognitive function
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
                            Be patient - full recovery takes time and varies by individual
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
                            Consult a doctor if sleep problems persist despite good habits
                        </li>
                    </ul>
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
});
