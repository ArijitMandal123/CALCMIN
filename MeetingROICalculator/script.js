// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('meeting-form');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');
    const addAttendeeBtn = document.getElementById('add-attendee');
    const attendeesContainer = document.getElementById('attendees-container');

    // Predefined hourly rates by role
    const roleRates = {
        'ceo': 200,
        'cto': 150,
        'director': 100,
        'manager': 75,
        'senior': 60,
        'mid': 45,
        'junior': 30,
        'intern': 15,
        'consultant': 100,
        'custom': 0
    };

    // Update hourly rate when role changes
    function setupRoleChangeHandler(roleSelect, rateInput) {
        roleSelect.addEventListener('change', function() {
            const selectedRole = this.value;
            if (selectedRole && selectedRole !== 'custom') {
                rateInput.value = roleRates[selectedRole];
                rateInput.readOnly = true;
            } else if (selectedRole === 'custom') {
                rateInput.value = '';
                rateInput.readOnly = false;
                rateInput.focus();
            }
        });
    }

    // Setup initial role handler
    const initialRoleSelect = document.querySelector('.attendee-role');
    const initialRateInput = document.querySelector('.attendee-rate');
    setupRoleChangeHandler(initialRoleSelect, initialRateInput);

    // Add new attendee row
    addAttendeeBtn.addEventListener('click', function() {
        const newRow = document.createElement('div');
        newRow.className = 'attendee-row grid md:grid-cols-3 gap-4 mb-3';
        newRow.innerHTML = `
            <select class="attendee-role px-3 py-3 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select role</option>
                <option value="ceo">CEO/Founder</option>
                <option value="cto">CTO/VP Engineering</option>
                <option value="director">Director</option>
                <option value="manager">Manager</option>
                <option value="senior">Senior Developer/Designer</option>
                <option value="mid">Mid-level Employee</option>
                <option value="junior">Junior Employee</option>
                <option value="intern">Intern</option>
                <option value="consultant">Consultant</option>
                <option value="custom">Custom Rate</option>
            </select>
            <input
                type="number"
                class="attendee-rate px-3 py-3 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Hourly rate ($)"
                min="0"
                step="5"
            />
            <div class="flex gap-2">
                <input
                    type="number"
                    class="attendee-count flex-1 px-3 py-3 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Count"
                    min="1"
                    value="1"
                />
                <button type="button" class="remove-attendee px-3 py-3 text-red-400 hover:text-red-300 transition">
                    <span class="material-icons text-sm">remove</span>
                </button>
            </div>
        `;

        attendeesContainer.appendChild(newRow);

        // Setup handlers for new row
        const roleSelect = newRow.querySelector('.attendee-role');
        const rateInput = newRow.querySelector('.attendee-rate');
        const removeBtn = newRow.querySelector('.remove-attendee');

        setupRoleChangeHandler(roleSelect, rateInput);

        removeBtn.addEventListener('click', function() {
            newRow.remove();
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        if (validateInputs(formData)) {
            const analysis = calculateMeetingROI(formData);
            displayResults(analysis);
        }
    });

    function collectFormData() {
        const attendeeRows = document.querySelectorAll('.attendee-row');
        const attendees = [];

        attendeeRows.forEach(row => {
            const role = row.querySelector('.attendee-role').value;
            const rate = parseFloat(row.querySelector('.attendee-rate').value) || 0;
            const count = parseInt(row.querySelector('.attendee-count').value) || 1;

            if (role && rate > 0) {
                attendees.push({ role, rate, count });
            }
        });

        return {
            hours: parseFloat(document.getElementById('meeting-hours').value) || 0,
            minutes: parseFloat(document.getElementById('meeting-minutes').value) || 0,
            meetingType: document.getElementById('meeting-type').value,
            emailAlternative: document.querySelector('input[name="email-alternative"]:checked')?.value || 'no',
            attendees: attendees,
            prepTime: parseFloat(document.getElementById('prep-time').value) || 0,
            followupTime: parseFloat(document.getElementById('followup-time').value) || 0,
            frequency: document.getElementById('meeting-frequency').value
        };
    }

    function showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-popup').classList.remove('hidden');
    }

    function validateInputs(data) {
        if (data.hours === 0 && data.minutes === 0) {
            showError('Please enter meeting duration.');
            return false;
        }

        if (!data.meetingType) {
            showError('Please select a meeting type.');
            return false;
        }

        if (data.attendees.length === 0) {
            showError('Please add at least one attendee with a valid role and hourly rate.');
            return false;
        }

        return true;
    }

    // Close error popup
    document.getElementById('close-error').addEventListener('click', function() {
        document.getElementById('error-popup').classList.add('hidden');
    });

    // Close popup when clicking outside
    document.getElementById('error-popup').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });

    function calculateMeetingROI(data) {
        const totalMinutes = (data.hours * 60) + data.minutes;
        const totalHours = totalMinutes / 60;

        // Calculate direct meeting costs
        let totalAttendees = 0;
        let directCost = 0;

        data.attendees.forEach(attendee => {
            const cost = attendee.rate * attendee.count * totalHours;
            directCost += cost;
            totalAttendees += attendee.count;
        });

        // Calculate preparation and follow-up costs
        const avgHourlyRate = directCost / (totalAttendees * totalHours);
        const prepCost = (data.prepTime / 60) * avgHourlyRate * totalAttendees;
        const followupCost = (data.followupTime / 60) * avgHourlyRate * totalAttendees;

        // Calculate context switching cost (23 minutes average to refocus)
        const contextSwitchingCost = (23 / 60) * avgHourlyRate * totalAttendees;

        const totalCost = directCost + prepCost + followupCost + contextSwitchingCost;

        // Email alternative analysis
        const emailAlternativeAnalysis = analyzeEmailAlternative(data, totalCost);

        // Frequency analysis
        const frequencyAnalysis = analyzeFrequency(data, totalCost);

        // Meeting efficiency score
        const efficiencyScore = calculateEfficiencyScore(data, totalAttendees, totalMinutes);

        // ROI recommendations
        const recommendations = generateRecommendations(data, efficiencyScore, totalCost, totalAttendees);

        return {
            totalCost,
            directCost,
            prepCost,
            followupCost,
            contextSwitchingCost,
            totalAttendees,
            totalMinutes,
            avgHourlyRate,
            emailAlternativeAnalysis,
            frequencyAnalysis,
            efficiencyScore,
            recommendations
        };
    }

    function analyzeEmailAlternative(data, totalCost) {
        const emailTime = 5; // minutes to write comprehensive email
        const readTime = 2; // minutes per person to read email
        
        const emailCost = (emailTime / 60) * data.attendees[0]?.rate + 
                         (readTime / 60) * data.attendees.reduce((sum, att) => sum + (att.rate * att.count), 0) / data.attendees.length;

        const savings = totalCost - emailCost;
        const savingsPercentage = (savings / totalCost) * 100;

        let recommendation = '';
        if (data.emailAlternative === 'yes') {
            recommendation = 'Strong candidate for email replacement';
        } else if (data.emailAlternative === 'maybe') {
            recommendation = 'Consider hybrid approach: email + brief follow-up call';
        } else {
            recommendation = 'Meeting format appropriate for this discussion';
        }

        return {
            emailCost: Math.round(emailCost),
            savings: Math.round(savings),
            savingsPercentage: Math.round(savingsPercentage),
            recommendation
        };
    }

    function analyzeFrequency(data, totalCost) {
        const frequencies = {
            'one-time': { multiplier: 1, period: 'one-time' },
            'daily': { multiplier: 250, period: 'annually' }, // ~250 working days
            'weekly': { multiplier: 52, period: 'annually' },
            'bi-weekly': { multiplier: 26, period: 'annually' },
            'monthly': { multiplier: 12, period: 'annually' },
            'quarterly': { multiplier: 4, period: 'annually' }
        };

        const freq = frequencies[data.frequency];
        const annualCost = totalCost * freq.multiplier;

        return {
            frequency: data.frequency,
            costPerOccurrence: Math.round(totalCost),
            annualCost: Math.round(annualCost),
            period: freq.period
        };
    }

    function calculateEfficiencyScore(data, totalAttendees, totalMinutes) {
        let score = 70; // Base score

        // Meeting type scoring
        const typeScores = {
            'decision-making': 10,
            'brainstorming': 8,
            'planning': 6,
            'review': 4,
            'training': 2,
            'one-on-one': 5,
            'status-update': -5,
            'all-hands': -2
        };
        score += typeScores[data.meetingType] || 0;

        // Attendee count penalty (diminishing returns)
        if (totalAttendees > 8) score -= 15;
        else if (totalAttendees > 5) score -= 10;
        else if (totalAttendees > 3) score -= 5;

        // Duration scoring
        if (totalMinutes > 120) score -= 20;
        else if (totalMinutes > 90) score -= 15;
        else if (totalMinutes > 60) score -= 10;
        else if (totalMinutes < 15) score -= 5;

        // Email alternative penalty
        if (data.emailAlternative === 'yes') score -= 25;
        else if (data.emailAlternative === 'maybe') score -= 10;

        // Preparation bonus
        if (data.prepTime > 0) score += 5;

        return Math.max(0, Math.min(100, score));
    }

    function generateRecommendations(data, efficiencyScore, totalCost, totalAttendees) {
        const recommendations = [];

        if (efficiencyScore < 50) {
            recommendations.push({
                type: 'critical',
                title: 'High-Cost, Low-Efficiency Meeting',
                description: 'This meeting shows poor ROI. Consider canceling or restructuring significantly.'
            });
        }

        if (data.emailAlternative === 'yes') {
            recommendations.push({
                type: 'warning',
                title: 'Email Alternative Available',
                description: `Save $${Math.round(data.emailAlternativeAnalysis?.savings || 0)} by sending a comprehensive email instead.`
            });
        }

        if (totalAttendees > 7) {
            recommendations.push({
                type: 'info',
                title: 'Too Many Attendees',
                description: 'Consider splitting into smaller groups or having key decision-makers attend with others receiving summary.'
            });
        }

        if (data.prepTime === 0) {
            recommendations.push({
                type: 'info',
                title: 'Add Preparation Time',
                description: 'Requiring 10-15 minutes of preparation can improve meeting efficiency by 40%.'
            });
        }

        if (totalCost > 500) {
            recommendations.push({
                type: 'warning',
                title: 'High-Cost Meeting',
                description: 'This meeting costs significant resources. Ensure outcomes justify the investment.'
            });
        }

        return recommendations;
    }

    function displayResults(analysis) {
        const efficiencyColor = getEfficiencyColor(analysis.efficiencyScore);
        const costColor = getCostColor(analysis.totalCost);

        resultContent.innerHTML = `
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h2 class="text-xl font-bold text-text mb-4 flex items-center gap-2">
                    <span class="material-icons text-primary">analytics</span>
                    Meeting ROI Analysis
                </h2>
                
                <div class="grid md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Total Cost</h3>
                        <div class="text-3xl font-bold ${sanitizeText(costColor)} mb-2">$${analysis.totalCost.toFixed(0)}</div>
                        <p class="text-sm text-light">${sanitizeText(analysis.totalMinutes)} minutes • ${sanitizeText(analysis.totalAttendees)} attendees</p>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Efficiency Score</h3>
                        <div class="text-3xl font-bold ${sanitizeText(efficiencyColor)} mb-2">${sanitizeText(analysis.efficiencyScore)}/100</div>
                        <p class="text-sm text-light">${getEfficiencyDescription(analysis.efficiencyScore)}</p>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Annual Impact</h3>
                        <div class="text-3xl font-bold text-primary mb-2">$${analysis.frequencyAnalysis.annualCost.toLocaleString()}</div>
                        <p class="text-sm text-light">${sanitizeText(analysis.frequencyAnalysis.frequency)} meetings</p>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Cost Breakdown</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center p-3 bg-dark rounded border border-accent">
                            <span class="text-text">Direct Meeting Cost</span>
                            <span class="font-semibold text-primary">$${analysis.directCost.toFixed(0)}</span>
                        </div>
                        ${analysis.prepCost > 0 ? `
                        <div class="flex justify-between items-center p-3 bg-dark rounded border border-accent">
                            <span class="text-text">Preparation Cost</span>
                            <span class="font-semibold text-accent">$${analysis.prepCost.toFixed(0)}</span>
                        </div>
                        ` : ''}
                        ${analysis.followupCost > 0 ? `
                        <div class="flex justify-between items-center p-3 bg-dark rounded border border-accent">
                            <span class="text-text">Follow-up Cost</span>
                            <span class="font-semibold text-accent">$${analysis.followupCost.toFixed(0)}</span>
                        </div>
                        ` : ''}
                        <div class="flex justify-between items-center p-3 bg-dark rounded border border-accent">
                            <span class="text-text">Context Switching Cost</span>
                            <span class="font-semibold text-yellow-400">$${analysis.contextSwitchingCost.toFixed(0)}</span>
                        </div>
                    </div>
                </div>

                ${analysis.emailAlternativeAnalysis.savings > 0 ? `
                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Email Alternative Analysis</h3>
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-text">Potential Savings</span>
                            <span class="font-semibold text-green-400">$${analysis.emailAlternativeAnalysis.savings}</span>
                        </div>
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-text">Savings Percentage</span>
                            <span class="font-semibold text-green-400">${sanitizeText(analysis.emailAlternativeAnalysis.savingsPercentage)}%</span>
                        </div>
                        <p class="text-sm text-light">${sanitizeText(analysis.emailAlternativeAnalysis.recommendation)}</p>
                    </div>
                </div>
                ` : ''}

                ${analysis.recommendations.length > 0 ? `
                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Recommendations</h3>
                    <div class="space-y-3">
                        ${analysis.recommendations.map(rec => `
                            <div class="p-4 rounded border ${getRecommendationStyle(rec.type)}">
                                <h4 class="font-medium text-text mb-1">${sanitizeText(rec.title)}</h4>
                                <p class="text-sm text-light">${sanitizeText(rec.description)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="bg-primary/10 p-4 rounded border border-primary">
                    <h3 class="font-semibold text-text mb-2 flex items-center gap-2">
                        <span class="material-icons text-primary">lightbulb</span>
                        Key Insights
                    </h3>
                    <ul class="text-sm text-light space-y-1">
                        <li>• Cost per attendee per hour: $${(analysis.avgHourlyRate).toFixed(0)}</li>
                        <li>• This meeting costs $${(analysis.totalCost / analysis.totalMinutes).toFixed(2)} per minute</li>
                        <li>• Context switching adds ${((analysis.contextSwitchingCost / analysis.totalCost) * 100).toFixed(0)}% to total cost</li>
                        ${analysis.frequencyAnalysis.frequency !== 'one-time' ? 
                            `<li>• Annual cost: $${analysis.frequencyAnalysis.annualCost.toLocaleString()} for ${sanitizeText(analysis.frequencyAnalysis.frequency)} meetings</li>` : ''}
                    </ul>
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function getEfficiencyColor(score) {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    }

    function getCostColor(cost) {
        if (cost >= 1000) return 'text-red-400';
        if (cost >= 500) return 'text-orange-400';
        if (cost >= 200) return 'text-yellow-400';
        return 'text-green-400';
    }

    function getEfficiencyDescription(score) {
        if (score >= 80) return 'Highly efficient meeting';
        if (score >= 60) return 'Good efficiency with room for improvement';
        if (score >= 40) return 'Moderate efficiency, needs optimization';
        return 'Poor efficiency, consider alternatives';
    }

    function getRecommendationStyle(type) {
        const styles = {
            'critical': 'border-red-400 bg-red-400/10',
            'warning': 'border-yellow-400 bg-yellow-400/10',
            'info': 'border-blue-400 bg-blue-400/10'
        };
        return styles[type] || 'border-accent bg-accent/10';
    }
});
