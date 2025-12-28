document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('focus-form');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        if (validateInputs(formData)) {
            const analysis = calculateSustainability(formData);
            displayResults(analysis);
        }
    });

    function showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-popup').classList.remove('hidden');
    }

    function collectFormData() {
        const symptoms = [];
        const symptomIds = ['fatigue', 'concentration', 'procrastination', 'irritability', 'headaches', 'sleep'];
        symptomIds.forEach(id => {
            if (document.getElementById(`symptom-${id}`).checked) {
                symptoms.push(id);
            }
        });

        return {
            hoursPerWeek: parseInt(document.getElementById('hours-per-week').value) || 0,
            daysPerWeek: parseInt(document.getElementById('days-per-week').value) || 0,
            meetingHours: parseFloat(document.getElementById('meeting-hours').value) || 0,
            interruptions: parseInt(document.getElementById('interruptions').value) || 0,
            shortBreaks: parseInt(document.getElementById('short-breaks').value) || 0,
            lunchBreak: parseInt(document.getElementById('lunch-break').value) || 60,
            exerciseBreaks: parseInt(document.getElementById('exercise-breaks').value) || 0,
            activeProjects: parseInt(document.getElementById('active-projects').value) || 0,
            taskComplexity: document.getElementById('task-complexity').value,
            sleepQuality: parseInt(document.getElementById('sleep-quality').value) || 7,
            daysSinceVacation: parseInt(document.getElementById('days-since-vacation').value) || 0,
            stressLevel: parseInt(document.getElementById('stress-level').value) || 5,
            symptoms: symptoms
        };
    }

    function validateInputs(data) {
        if (data.hoursPerWeek === 0) {
            showError('Please enter hours worked per week.');
            return false;
        }

        if (data.daysPerWeek === 0) {
            showError('Please select days worked per week.');
            return false;
        }

        if (data.activeProjects === 0) {
            showError('Please select number of active projects.');
            return false;
        }

        return true;
    }

    function calculateSustainability(data) {
        const dailyHours = data.hoursPerWeek / data.daysPerWeek;
        const focusHours = dailyHours - data.meetingHours;
        
        // Calculate base sustainability score (0-100)
        let sustainabilityScore = 70; // Base score

        // Adjust for work load
        if (data.hoursPerWeek > 50) sustainabilityScore -= 15;
        else if (data.hoursPerWeek > 40) sustainabilityScore -= 5;
        else if (data.hoursPerWeek < 35) sustainabilityScore += 5;

        // Adjust for meeting load
        const meetingRatio = data.meetingHours / dailyHours;
        if (meetingRatio > 0.5) sustainabilityScore -= 20;
        else if (meetingRatio > 0.3) sustainabilityScore -= 10;

        // Adjust for interruptions
        if (data.interruptions > 8) sustainabilityScore -= 15;
        else if (data.interruptions > 5) sustainabilityScore -= 10;
        else if (data.interruptions > 2) sustainabilityScore -= 5;

        // Adjust for breaks
        const breakScore = calculateBreakScore(data);
        sustainabilityScore += breakScore;

        // Adjust for project load
        const projectPenalty = (data.activeProjects - 1) * 5;
        sustainabilityScore -= projectPenalty;

        // Adjust for task complexity
        const complexityPenalties = {
            'low': 0,
            'medium': -5,
            'high': -10,
            'very-high': -15
        };
        sustainabilityScore += complexityPenalties[data.taskComplexity] || 0;

        // Adjust for wellness factors
        sustainabilityScore += (data.sleepQuality - 5) * 3;
        sustainabilityScore -= (data.stressLevel - 5) * 2;

        // Vacation penalty
        if (data.daysSinceVacation > 180) sustainabilityScore -= 15;
        else if (data.daysSinceVacation > 90) sustainabilityScore -= 10;
        else if (data.daysSinceVacation > 60) sustainabilityScore -= 5;

        // Symptom penalties
        sustainabilityScore -= data.symptoms.length * 8;

        // Cap the score
        sustainabilityScore = Math.max(0, Math.min(100, sustainabilityScore));

        // Calculate sustainable focus capacity
        const maxDailyFocus = calculateMaxDailyFocus(sustainabilityScore, focusHours);
        const burnoutRisk = calculateBurnoutRisk(sustainabilityScore, data.symptoms.length);
        const breakSchedule = generateBreakSchedule(maxDailyFocus, data);
        const vacationRecommendation = generateVacationRecommendation(data.daysSinceVacation, sustainabilityScore);
        const weeklyCapacity = calculateWeeklyCapacity(maxDailyFocus, data.daysPerWeek, sustainabilityScore);

        return {
            sustainabilityScore,
            maxDailyFocus,
            burnoutRisk,
            breakSchedule,
            vacationRecommendation,
            weeklyCapacity,
            currentFocusHours: focusHours,
            dailyHours,
            symptoms: data.symptoms
        };
    }

    function calculateBreakScore(data) {
        let score = 0;
        
        // Short breaks bonus
        if (data.shortBreaks >= 6) score += 10;
        else if (data.shortBreaks >= 4) score += 5;
        else if (data.shortBreaks >= 2) score += 2;
        else score -= 5;

        // Lunch break bonus
        if (data.lunchBreak >= 60) score += 5;
        else if (data.lunchBreak >= 30) score += 2;
        else score -= 3;

        // Exercise breaks bonus
        score += data.exerciseBreaks * 3;

        return Math.min(15, score); // Cap at 15 points
    }

    function calculateMaxDailyFocus(sustainabilityScore, currentFocusHours) {
        let maxFocus = 6; // Base maximum

        if (sustainabilityScore >= 80) maxFocus = 7;
        else if (sustainabilityScore >= 60) maxFocus = 6;
        else if (sustainabilityScore >= 40) maxFocus = 5;
        else if (sustainabilityScore >= 20) maxFocus = 4;
        else maxFocus = 3;

        // Don't recommend more than current if they're already struggling
        if (sustainabilityScore < 50 && currentFocusHours > 0) {
            maxFocus = Math.min(maxFocus, currentFocusHours * 0.8);
        }

        return Math.max(2, Math.round(maxFocus * 10) / 10);
    }

    function calculateBurnoutRisk(sustainabilityScore, symptomCount) {
        let risk = 'Low';
        let color = 'text-green-400';
        let description = 'You appear to be managing your workload well';

        if (sustainabilityScore < 30 || symptomCount >= 4) {
            risk = 'Critical';
            color = 'text-red-500';
            description = 'Immediate action needed to prevent burnout';
        } else if (sustainabilityScore < 50 || symptomCount >= 3) {
            risk = 'High';
            color = 'text-red-400';
            description = 'Significant risk - consider reducing workload';
        } else if (sustainabilityScore < 70 || symptomCount >= 2) {
            risk = 'Moderate';
            color = 'text-orange-400';
            description = 'Some warning signs - monitor closely';
        }

        return { risk, color, description };
    }

    function generateBreakSchedule(maxDailyFocus, data) {
        const schedule = [];
        const focusBlocks = Math.ceil(maxDailyFocus / 2); // 2-hour focus blocks

        for (let i = 0; i < focusBlocks; i++) {
            const startTime = 9 + (i * 2.5); // 2 hours work + 30 min break
            const endTime = startTime + 2;
            
            schedule.push({
                block: i + 1,
                startTime: formatTime(startTime),
                endTime: formatTime(endTime),
                duration: '2 hours',
                breakAfter: i < focusBlocks - 1 ? '15-30 minutes' : 'End of focus work'
            });
        }

        return {
            blocks: schedule,
            totalBreaks: focusBlocks - 1,
            recommendedBreakType: maxDailyFocus > 5 ? 'Active breaks (walk, stretch)' : 'Rest breaks (meditation, breathing)'
        };
    }

    function generateVacationRecommendation(daysSinceVacation, sustainabilityScore) {
        let urgency = 'Low';
        let timeframe = '3-6 months';
        let duration = '1 week';
        let color = 'text-green-400';

        if (daysSinceVacation > 180 || sustainabilityScore < 40) {
            urgency = 'Critical';
            timeframe = 'Within 2 weeks';
            duration = '1-2 weeks';
            color = 'text-red-400';
        } else if (daysSinceVacation > 120 || sustainabilityScore < 60) {
            urgency = 'High';
            timeframe = 'Within 1 month';
            duration = '1 week';
            color = 'text-orange-400';
        } else if (daysSinceVacation > 60 || sustainabilityScore < 80) {
            urgency = 'Moderate';
            timeframe = '1-2 months';
            duration = '3-5 days';
            color = 'text-yellow-400';
        }

        return {
            urgency,
            timeframe,
            duration,
            color,
            daysSince: daysSinceVacation
        };
    }

    function calculateWeeklyCapacity(maxDailyFocus, daysPerWeek, sustainabilityScore) {
        const weeklyFocus = maxDailyFocus * daysPerWeek;
        const efficiency = sustainabilityScore / 100;
        const effectiveWeeklyFocus = weeklyFocus * efficiency;

        return {
            totalHours: weeklyFocus.toFixed(1),
            effectiveHours: effectiveWeeklyFocus.toFixed(1),
            efficiency: Math.round(efficiency * 100)
        };
    }

    function formatTime(hour) {
        const h = Math.floor(hour);
        const m = Math.round((hour - h) * 60);
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
        return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
    }

    function displayResults(analysis) {
        const sustainabilityColor = getSustainabilityColor(analysis.sustainabilityScore);

        resultContent.innerHTML = `
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h2 class="text-xl font-bold text-text mb-4 flex items-center gap-2">
                    <span class="material-icons text-primary">psychology</span>
                    Focus Sustainability Analysis
                </h2>
                
                <div class="grid md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Sustainability Score</h3>
                        <div class="text-3xl font-bold ${sustainabilityColor} mb-2">${analysis.sustainabilityScore}/100</div>
                        <p class="text-sm text-light">${getSustainabilityDescription(analysis.sustainabilityScore)}</p>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Daily Focus Capacity</h3>
                        <div class="text-3xl font-bold text-primary mb-2">${analysis.maxDailyFocus}h</div>
                        <p class="text-sm text-light">Sustainable deep work hours</p>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Burnout Risk</h3>
                        <div class="text-2xl font-bold ${analysis.burnoutRisk.color} mb-2">${analysis.burnoutRisk.risk}</div>
                        <p class="text-sm text-light">${analysis.burnoutRisk.description}</p>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Recommended Break Schedule</h3>
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="grid gap-3 mb-4">
                            ${analysis.breakSchedule.blocks.map(block => `
                                <div class="flex justify-between items-center p-3 bg-broder rounded">
                                    <div>
                                        <span class="text-text font-medium">Focus Block ${block.block}</span>
                                        <div class="text-sm text-light">${block.duration} of deep work</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm text-primary">${block.startTime} - ${block.endTime}</div>
                                        <div class="text-xs text-light">Break: ${block.breakAfter}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <p class="text-sm text-light">
                            <strong>Break Type:</strong> ${analysis.breakSchedule.recommendedBreakType}
                        </p>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Weekly Capacity Analysis</h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="bg-dark p-4 rounded border border-accent text-center">
                            <div class="text-2xl font-bold text-primary">${analysis.weeklyCapacity.totalHours}h</div>
                            <p class="text-sm text-light">Total Focus Hours</p>
                        </div>
                        <div class="bg-dark p-4 rounded border border-accent text-center">
                            <div class="text-2xl font-bold text-accent">${analysis.weeklyCapacity.effectiveHours}h</div>
                            <p class="text-sm text-light">Effective Hours</p>
                        </div>
                        <div class="bg-dark p-4 rounded border border-accent text-center">
                            <div class="text-2xl font-bold text-yellow-400">${analysis.weeklyCapacity.efficiency}%</div>
                            <p class="text-sm text-light">Efficiency Rate</p>
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Vacation Recommendation</h3>
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <div class="text-lg font-medium ${analysis.vacationRecommendation.color}">${analysis.vacationRecommendation.urgency} Priority</div>
                                <p class="text-sm text-light">${analysis.vacationRecommendation.daysSince} days since last vacation</p>
                            </div>
                            <div class="text-right">
                                <div class="text-primary font-semibold">${analysis.vacationRecommendation.timeframe}</div>
                                <div class="text-sm text-light">${analysis.vacationRecommendation.duration} recommended</div>
                            </div>
                        </div>
                    </div>
                </div>

                ${analysis.symptoms.length > 0 ? `
                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Current Warning Signs</h3>
                    <div class="bg-red-400/10 p-4 rounded border border-red-400">
                        <p class="text-red-400 font-medium mb-2">You're experiencing ${analysis.symptoms.length} burnout symptoms:</p>
                        <ul class="text-sm text-light space-y-1">
                            ${analysis.symptoms.map(symptom => `
                                <li>• ${getSymptomDescription(symptom)}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                ` : ''}

                <div class="bg-primary/10 p-4 rounded border border-primary">
                    <h3 class="font-semibold text-text mb-2 flex items-center gap-2">
                        <span class="material-icons text-primary">lightbulb</span>
                        Key Recommendations
                    </h3>
                    <ul class="text-sm text-light space-y-1">
                        <li>• Limit deep focus work to ${analysis.maxDailyFocus} hours per day</li>
                        <li>• Take ${analysis.breakSchedule.totalBreaks} breaks during focus sessions</li>
                        <li>• Current capacity vs recommended: ${analysis.currentFocusHours.toFixed(1)}h vs ${analysis.maxDailyFocus}h</li>
                        <li>• Weekly effective capacity: ${analysis.weeklyCapacity.effectiveHours}h at ${analysis.weeklyCapacity.efficiency}% efficiency</li>
                        ${analysis.vacationRecommendation.urgency !== 'Low' ? 
                            `<li>• Schedule vacation ${analysis.vacationRecommendation.timeframe.toLowerCase()}</li>` : ''}
                    </ul>
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function getSustainabilityColor(score) {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    }

    function getSustainabilityDescription(score) {
        if (score >= 80) return 'Excellent sustainability';
        if (score >= 60) return 'Good with room for improvement';
        if (score >= 40) return 'Moderate - needs attention';
        return 'Poor - immediate changes needed';
    }

    function getSymptomDescription(symptom) {
        const descriptions = {
            'fatigue': 'Mental fatigue by midday',
            'concentration': 'Difficulty concentrating',
            'procrastination': 'Increased procrastination',
            'irritability': 'Irritability/mood swings',
            'headaches': 'Frequent headaches',
            'sleep': 'Sleep problems'
        };
        return descriptions[symptom] || symptom;
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
});