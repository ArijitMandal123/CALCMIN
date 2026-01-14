// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('alcohol-form');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        if (validateInputs(formData)) {
            const results = calculateResetPlan(formData);
            displayResults(results);
        }
    });

    function collectFormData() {
        return {
            weeklyDrinks: parseInt(document.getElementById('weekly-drinks').value) || 0,
            drinkingPattern: document.getElementById('drinking-pattern').value,
            goal: document.getElementById('goal').value,
            timeline: document.getElementById('timeline').value,
            age: parseInt(document.getElementById('age').value) || 0,
            drinkingYears: parseInt(document.getElementById('drinking-years').value) || 0,
            healthStatus: document.getElementById('health-status').value,
            supportSystem: document.getElementById('support-system').value,
            costPerDrink: parseFloat(document.getElementById('cost-per-drink').value) || 0,
            symptoms: {
                anxiety: document.getElementById('symptom-anxiety').checked,
                insomnia: document.getElementById('symptom-insomnia').checked,
                tremors: document.getElementById('symptom-tremors').checked,
                sweating: document.getElementById('symptom-sweating').checked,
                nausea: document.getElementById('symptom-nausea').checked,
                headaches: document.getElementById('symptom-headaches').checked,
                irritability: document.getElementById('symptom-irritability').checked,
                none: document.getElementById('symptom-none').checked
            }
        };
    }

    function validateInputs(data) {
        if (data.weeklyDrinks <= 0) {
            showNotification('Please enter your current weekly alcohol consumption.', 'error');
            return false;
        }
        if (!data.drinkingPattern) {
            showNotification('Please select your drinking pattern.', 'error');
            return false;
        }
        if (!data.goal) {
            showNotification('Please select your primary goal.', 'error');
            return false;
        }
        if (!data.timeline) {
            showNotification('Please select your timeline preference.', 'error');
            return false;
        }
        if (data.age < 18 || data.age > 80) {
            showNotification('Please enter a valid age between 18 and 80.', 'error');
            return false;
        }
        return true;
    }

    function calculateResetPlan(data) {
        const riskLevel = assessWithdrawalRisk(data);
        const reductionSchedule = createReductionSchedule(data);
        const healthBenefits = calculateHealthBenefits(data);
        const financialSavings = calculateFinancialSavings(data);
        const alternatives = generateAlternatives(data);
        
        return {
            riskLevel,
            reductionSchedule,
            healthBenefits,
            financialSavings,
            alternatives,
            recommendations: generateRecommendations(data, riskLevel)
        };
    }

    function assessWithdrawalRisk(data) {
        let riskScore = 0;
        
        // Weekly consumption risk
        if (data.weeklyDrinks >= 28) riskScore += 4;
        else if (data.weeklyDrinks >= 15) riskScore += 3;
        else if (data.weeklyDrinks >= 8) riskScore += 2;
        else riskScore += 1;
        
        // Pattern risk
        const patternRisk = {
            'daily': 3,
            'binge': 4,
            'social': 2,
            'weekends': 2,
            'irregular': 1
        };
        riskScore += patternRisk[data.drinkingPattern] || 1;
        
        // Duration risk
        if (data.drinkingYears >= 15) riskScore += 3;
        else if (data.drinkingYears >= 10) riskScore += 2;
        else if (data.drinkingYears >= 5) riskScore += 1;
        
        // Previous symptoms
        const symptomCount = Object.values(data.symptoms).filter(s => s && !data.symptoms.none).length;
        riskScore += Math.min(symptomCount, 4);
        
        // Health status
        const healthRisk = {
            'poor': 3,
            'fair': 2,
            'good': 1,
            'excellent': 0,
            'medical-supervision': 4
        };
        riskScore += healthRisk[data.healthStatus] || 1;
        
        if (riskScore <= 4) return { level: 'Low', color: 'green', score: riskScore };
        if (riskScore <= 8) return { level: 'Moderate', color: 'yellow', score: riskScore };
        if (riskScore <= 12) return { level: 'High', color: 'orange', score: riskScore };
        return { level: 'Severe', color: 'red', score: riskScore };
    }

    function createReductionSchedule(data) {
        const targetDrinks = getTargetDrinks(data.goal);
        const timelineWeeks = getTimelineWeeks(data.timeline);
        const currentDrinks = data.weeklyDrinks;
        
        const schedule = [];
        const totalReduction = currentDrinks - targetDrinks;
        const weeklyReduction = totalReduction / timelineWeeks;
        
        for (let week = 0; week <= timelineWeeks; week++) {
            const weeklyAmount = Math.max(0, Math.round(currentDrinks - (weeklyReduction * week)));
            const dailyAmount = Math.round((weeklyAmount / 7) * 10) / 10;
            
            schedule.push({
                week: week,
                weeklyDrinks: weeklyAmount,
                dailyDrinks: dailyAmount,
                reduction: week === 0 ? 0 : Math.round(weeklyReduction),
                percentage: week === 0 ? 0 : Math.round((weeklyReduction * week / currentDrinks) * 100)
            });
        }
        
        return {
            schedule,
            totalWeeks: timelineWeeks,
            targetDrinks,
            totalReduction: Math.round(totalReduction)
        };
    }

    function getTargetDrinks(goal) {
        const targets = {
            'complete-abstinence': 0,
            'moderate-drinking': 7, // Low-risk drinking guidelines
            'tolerance-break': 0,
            'dry-month': 0,
            'health-improvement': 4
        };
        return targets[goal] || 0;
    }

    function getTimelineWeeks(timeline) {
        const weeks = {
            'immediate': 1,
            'aggressive': 3,
            'moderate': 5,
            'gradual': 7
        };
        return weeks[timeline] || 5;
    }

    function calculateHealthBenefits(data) {
        const benefits = [];
        
        // Week 1 benefits
        benefits.push({
            timeframe: 'Week 1',
            benefits: [
                'Improved sleep quality begins',
                'Better hydration levels',
                'Reduced inflammation markers',
                'Initial energy level improvements'
            ]
        });
        
        // Week 2-4 benefits
        benefits.push({
            timeframe: 'Weeks 2-4',
            benefits: [
                'Significant sleep improvement',
                'Clearer skin and better complexion',
                'Weight loss from reduced calories',
                'Enhanced mental clarity and focus',
                'Improved immune system function'
            ]
        });
        
        // Month 2-3 benefits
        benefits.push({
            timeframe: 'Months 2-3',
            benefits: [
                'Liver function improvement',
                'Cardiovascular health enhancement',
                'Better emotional regulation',
                'Increased productivity and motivation',
                'Reduced anxiety and depression symptoms'
            ]
        });
        
        // Long-term benefits
        benefits.push({
            timeframe: '6+ Months',
            benefits: [
                'Significant liver repair and regeneration',
                'Reduced cancer risk factors',
                'Improved cognitive function and memory',
                'Better relationships and social connections',
                'Long-term financial benefits'
            ]
        });
        
        return benefits;
    }

    function calculateFinancialSavings(data) {
        if (data.costPerDrink <= 0) return null;
        
        const currentWeeklyCost = data.weeklyDrinks * data.costPerDrink;
        const currentMonthlyCost = currentWeeklyCost * 4.33;
        const currentAnnualCost = currentMonthlyCost * 12;
        
        const targetDrinks = getTargetDrinks(data.goal);
        const targetWeeklyCost = targetDrinks * data.costPerDrink;
        const targetMonthlyCost = targetWeeklyCost * 4.33;
        const targetAnnualCost = targetMonthlyCost * 12;
        
        const weeklySavings = currentWeeklyCost - targetWeeklyCost;
        const monthlySavings = currentMonthlyCost - targetMonthlyCost;
        const annualSavings = currentAnnualCost - targetAnnualCost;
        
        return {
            current: {
                weekly: Math.round(currentWeeklyCost),
                monthly: Math.round(currentMonthlyCost),
                annual: Math.round(currentAnnualCost)
            },
            target: {
                weekly: Math.round(targetWeeklyCost),
                monthly: Math.round(targetMonthlyCost),
                annual: Math.round(targetAnnualCost)
            },
            savings: {
                weekly: Math.round(weeklySavings),
                monthly: Math.round(monthlySavings),
                annual: Math.round(annualSavings)
            }
        };
    }

    function generateAlternatives(data) {
        const alternatives = {
            social: [
                'Join sober social groups or meetups',
                'Organize coffee dates instead of bar meetups',
                'Try mocktail making classes',
                'Attend fitness group activities',
                'Volunteer for meaningful causes'
            ],
            stress: [
                'Practice daily meditation or mindfulness',
                'Establish regular exercise routine',
                'Try deep breathing exercises',
                'Start journaling practice',
                'Consider professional therapy or counseling'
            ],
            evening: [
                'Create herbal tea rituals',
                'Develop reading or audiobook habits',
                'Pursue creative hobbies (art, music, writing)',
                'Establish relaxing bath routines',
                'Set earlier bedtime schedule'
            ],
            weekend: [
                'Plan outdoor activities and hiking',
                'Try new restaurants and cuisines',
                'Attend cultural events and museums',
                'Start home improvement projects',
                'Learn new skills or take classes'
            ]
        };
        
        return alternatives;
    }

    function generateRecommendations(data, riskLevel) {
        const recommendations = [];
        
        // Risk-based recommendations
        if (riskLevel.level === 'Severe' || riskLevel.level === 'High') {
            recommendations.push({
                type: 'medical',
                priority: 'high',
                text: 'Consult with a healthcare provider before starting your reduction plan. Medical supervision may be necessary for safe withdrawal.'
            });
        }
        
        if (data.supportSystem === 'none' || data.supportSystem === 'limited') {
            recommendations.push({
                type: 'support',
                priority: 'high',
                text: 'Consider joining support groups, online communities, or seeking professional counseling to increase your success rate.'
            });
        }
        
        // Timeline recommendations
        if (data.timeline === 'immediate' && data.weeklyDrinks > 14) {
            recommendations.push({
                type: 'timeline',
                priority: 'medium',
                text: 'Consider a more gradual approach to reduce withdrawal risks and improve long-term success rates.'
            });
        }
        
        // Health-based recommendations
        if (data.healthStatus === 'poor' || data.healthStatus === 'fair') {
            recommendations.push({
                type: 'health',
                priority: 'medium',
                text: 'Focus on overall health improvements including nutrition, exercise, and sleep hygiene alongside alcohol reduction.'
            });
        }
        
        return recommendations;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function displayResults(results) {
        const html = `
            <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
                <h3 class="text-2xl font-bold text-primary mb-4">Your Personalized Reset Plan</h3>
                
                <!-- Risk Assessment -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-accent mb-3">Withdrawal Risk Assessment</h4>
                    <div class="bg-${results.riskLevel.color === 'red' ? 'red' : results.riskLevel.color === 'yellow' ? 'yellow' : results.riskLevel.color === 'orange' ? 'orange' : 'green'}-900/20 border border-${results.riskLevel.color === 'red' ? 'red' : results.riskLevel.color === 'yellow' ? 'yellow' : results.riskLevel.color === 'orange' ? 'orange' : 'green'}-600 rounded p-4">
                        <div class="flex items-center gap-3">
                            <span class="material-icons text-${results.riskLevel.color === 'red' ? 'red' : results.riskLevel.color === 'yellow' ? 'yellow' : results.riskLevel.color === 'orange' ? 'orange' : 'green'}-400">health_and_safety</span>
                            <div>
                                <p class="font-semibold text-${results.riskLevel.color === 'red' ? 'red' : results.riskLevel.color === 'yellow' ? 'yellow' : results.riskLevel.color === 'orange' ? 'orange' : 'green'}-400">${escapeHtml(results.riskLevel.level)} Risk Level</p>
                                <p class="text-sm text-light">Risk Score: ${sanitizeText(results.riskLevel.score)}/16</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reduction Schedule -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-accent mb-3">Weekly Reduction Schedule</h4>
                    <div class="bg-dark rounded p-4 border border-accent">
                        <div class="grid gap-3">
                            ${results.reductionSchedule.schedule.slice(0, 6).map(week => `
                                <div class="flex justify-between items-center py-2 border-b border-accent/30 last:border-b-0">
                                    <span class="font-medium">Week ${week.week === 0 ? 'Current' : escapeHtml(week.week.toString())}</span>
                                    <div class="text-right">
                                        <span class="text-primary font-semibold">${escapeHtml(week.weeklyDrinks.toString())} drinks/week</span>
                                        <span class="text-sm text-light ml-2">(${escapeHtml(week.dailyDrinks.toString())}/day)</span>
                                        ${week.percentage > 0 ? `<span class="text-xs text-green-400 ml-2">-${escapeHtml(week.percentage.toString())}%</span>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mt-4 p-3 bg-primary/10 rounded border-l-4 border-primary">
                            <p class="text-sm text-light">
                                <strong>Target:</strong> ${sanitizeText(results.reductionSchedule.targetDrinks)} drinks/week 
                                (${Math.round(results.reductionSchedule.targetDrinks/7 * 10)/10} drinks/day)
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Health Benefits Timeline -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-accent mb-3">Health Benefits Timeline</h4>
                    <div class="space-y-4">
                        ${results.healthBenefits.map(period => `
                            <div class="bg-dark rounded p-4 border border-accent">
                                <h5 class="font-semibold text-primary mb-2">${escapeHtml(period.timeframe)}</h5>
                                <ul class="text-sm text-light space-y-1">
                                    ${period.benefits.map(benefit => `<li>• ${escapeHtml(benefit)}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${results.financialSavings ? `
                    <!-- Financial Savings -->
                    <div class="mb-6">
                        <h4 class="text-lg font-semibold text-accent mb-3">Financial Impact</h4>
                        <div class="grid md:grid-cols-3 gap-4">
                            <div class="bg-dark rounded p-4 border border-accent text-center">
                                <p class="text-sm text-light">Monthly Savings</p>
                                <p class="text-2xl font-bold text-green-400">$${results.financialSavings.savings.monthly}</p>
                            </div>
                            <div class="bg-dark rounded p-4 border border-accent text-center">
                                <p class="text-sm text-light">Annual Savings</p>
                                <p class="text-2xl font-bold text-green-400">$${sanitizeText(results.financialSavings.savings.annual)}</p>
                            </div>
                            <div class="bg-dark rounded p-4 border border-accent text-center">
                                <p class="text-sm text-light">Current Annual Cost</p>
                                <p class="text-xl font-semibold text-red-400">$${sanitizeText(results.financialSavings.current.annual)}</p>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Alternative Activities -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-accent mb-3">Recommended Alternative Activities</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-dark rounded p-4 border border-accent">
                            <h5 class="font-semibold text-primary mb-2">Social Alternatives</h5>
                            <ul class="text-sm text-light space-y-1">
                                ${results.alternatives.social.slice(0, 3).map(alt => `<li>• ${escapeHtml(alt)}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="bg-dark rounded p-4 border border-accent">
                            <h5 class="font-semibold text-primary mb-2">Stress Management</h5>
                            <ul class="text-sm text-light space-y-1">
                                ${results.alternatives.stress.slice(0, 3).map(alt => `<li>• ${escapeHtml(alt)}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="bg-dark rounded p-4 border border-accent">
                            <h5 class="font-semibold text-primary mb-2">Evening Routines</h5>
                            <ul class="text-sm text-light space-y-1">
                                ${results.alternatives.evening.slice(0, 3).map(alt => `<li>• ${escapeHtml(alt)}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="bg-dark rounded p-4 border border-accent">
                            <h5 class="font-semibold text-primary mb-2">Weekend Activities</h5>
                            <ul class="text-sm text-light space-y-1">
                                ${results.alternatives.weekend.slice(0, 3).map(alt => `<li>• ${escapeHtml(alt)}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Recommendations -->
                ${results.recommendations.length > 0 ? `
                    <div class="mb-6">
                        <h4 class="text-lg font-semibold text-accent mb-3">Important Recommendations</h4>
                        <div class="space-y-3">
                            ${results.recommendations.map(rec => `
                                <div class="bg-${rec.priority === 'high' ? 'red' : 'yellow'}-900/20 border border-${rec.priority === 'high' ? 'red' : 'yellow'}-600 rounded p-4">
                                    <div class="flex items-start gap-3">
                                        <span class="material-icons text-${rec.priority === 'high' ? 'red' : 'yellow'}-400 mt-0.5">
                                            ${rec.priority === 'high' ? 'warning' : 'info'}
                                        </span>
                                        <p class="text-sm text-light">${escapeHtml(rec.text)}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="bg-primary/10 border-l-4 border-primary p-4 rounded">
                    <p class="text-sm text-light">
                        <strong>Disclaimer:</strong> This plan is for informational purposes only. Always consult with healthcare professionals before making significant changes to alcohol consumption, especially if you experience withdrawal symptoms or have underlying health conditions.
                    </p>
                </div>
            </div>
        `;

        resultContent.innerHTML = html;
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function showNotification(message, type = 'info') {
        // Sanitize message to prevent XSS
        const sanitizedMessage = document.createElement('div');
        sanitizedMessage.textContent = message;
        const safeMessage = sanitizedMessage.innerHTML;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg border max-w-md ${
            type === 'error' ? 'bg-red-900/90 border-red-600 text-red-100' : 
            type === 'success' ? 'bg-green-900/90 border-green-600 text-green-100' :
            'bg-blue-900/90 border-blue-600 text-blue-100'
        }`;
        
        const iconType = type === 'error' ? 'error' : type === 'success' ? 'check_circle' : 'info';
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="material-icons">
                    ${sanitizeText(iconType)}
                </span>
                <p class="text-sm">${sanitizeText(safeMessage)}</p>
                <button class="ml-auto close-btn">
                    <span class="material-icons text-sm">close</span>
                </button>
            </div>
        `;
        
        // Add event listener safely
        const closeBtn = notification.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
});
