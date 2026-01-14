// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

    const form = document.getElementById('deepwork-form');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        if (validateInputs(formData)) {
            const schedule = calculateDeepWorkSchedule(formData);
            displayResults(schedule);
        }
    });

    function collectFormData() {
        return {
            workStart: document.getElementById('work-start').value,
            workEnd: document.getElementById('work-end').value,
            morningEnergy: document.getElementById('morning-energy').checked,
            afternoonEnergy: document.getElementById('afternoon-energy').checked,
            eveningEnergy: document.getElementById('evening-energy').checked,
            meetingLoad: document.getElementById('meeting-load').value,
            interruptions: parseInt(document.getElementById('interruptions').value) || 0,
            highComplexity: parseInt(document.getElementById('high-complexity').value) || 30,
            mediumComplexity: parseInt(document.getElementById('medium-complexity').value) || 50,
            lowComplexity: parseInt(document.getElementById('low-complexity').value) || 20,
            blockLength: parseInt(document.getElementById('block-length').value),
            environment: document.getElementById('environment').value
        };
    }

    function showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-popup').classList.remove('hidden');
    }

    function validateInputs(data) {
        if (!data.workStart || !data.workEnd || !data.meetingLoad) {
            showError('Please fill in all required fields.');
            return false;
        }

        const complexityTotal = data.highComplexity + data.mediumComplexity + data.lowComplexity;
        if (complexityTotal !== 100) {
            showError('Task complexity percentages must add up to 100%.');
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

    function calculateDeepWorkSchedule(data) {
        const workHours = calculateWorkHours(data.workStart, data.workEnd);
        const energyPeaks = identifyEnergyPeaks(data);
        const meetingImpact = calculateMeetingImpact(data.meetingLoad);
        const interruptionFactor = calculateInterruptionFactor(data.interruptions);
        const optimalBlocks = generateOptimalBlocks(workHours, energyPeaks, data.blockLength, meetingImpact);
        const taskRecommendations = generateTaskRecommendations(data);
        const focusScore = calculateFocusScore(data, interruptionFactor);
        const productivityMetrics = calculateProductivityMetrics(data, optimalBlocks);

        return {
            workHours,
            energyPeaks,
            optimalBlocks,
            taskRecommendations,
            focusScore,
            productivityMetrics,
            interruptionFactor,
            meetingImpact
        };
    }

    function calculateWorkHours(startTime, endTime) {
        const start = new Date(`2000-01-01T${sanitizeText(startTime)}`);
        const end = new Date(`2000-01-01T${sanitizeText(endTime)}`);
        const diffMs = end - start;
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours;
    }

    function identifyEnergyPeaks(data) {
        const peaks = [];
        if (data.morningEnergy) peaks.push({ period: 'Morning', time: '9:00-12:00', score: 95 });
        if (data.afternoonEnergy) peaks.push({ period: 'Afternoon', time: '13:00-17:00', score: 85 });
        if (data.eveningEnergy) peaks.push({ period: 'Evening', time: '18:00-21:00', score: 75 });
        
        if (peaks.length === 0) {
            peaks.push({ period: 'Morning', time: '9:00-12:00', score: 80 });
        }
        
        return peaks;
    }

    function calculateMeetingImpact(meetingLoad) {
        const impacts = {
            'low': { factor: 0.9, description: 'Minimal meeting disruption' },
            'medium': { factor: 0.7, description: 'Moderate meeting disruption' },
            'high': { factor: 0.5, description: 'High meeting disruption' },
            'very-high': { factor: 0.3, description: 'Severe meeting disruption' }
        };
        return impacts[meetingLoad] || impacts['medium'];
    }

    function calculateInterruptionFactor(interruptions) {
        if (interruptions <= 1) return { factor: 0.95, level: 'Excellent' };
        if (interruptions <= 3) return { factor: 0.8, level: 'Good' };
        if (interruptions <= 5) return { factor: 0.6, level: 'Fair' };
        if (interruptions <= 8) return { factor: 0.4, level: 'Poor' };
        return { factor: 0.2, level: 'Critical' };
    }

    function generateOptimalBlocks(workHours, energyPeaks, blockLength, meetingImpact) {
        const blocks = [];
        const blockHours = blockLength / 60;
        
        energyPeaks.forEach(peak => {
            const adjustedScore = peak.score * meetingImpact.factor;
            const blocksInPeriod = Math.floor(3 / blockHours); // Assuming 3-hour peak periods
            
            for (let i = 0; i < blocksInPeriod && blocks.length < 3; i++) {
                blocks.push({
                    period: peak.period,
                    duration: blockLength,
                    score: Math.round(adjustedScore),
                    timeSlot: peak.time,
                    recommendation: getBlockRecommendation(adjustedScore)
                });
            }
        });

        return blocks.sort((a, b) => b.score - a.score);
    }

    function getBlockRecommendation(score) {
        if (score >= 85) return 'Ideal for high-complexity tasks';
        if (score >= 70) return 'Good for medium-complexity tasks';
        if (score >= 50) return 'Suitable for routine deep work';
        return 'Consider rescheduling or reducing block length';
    }

    function generateTaskRecommendations(data) {
        const recommendations = [];
        
        if (data.highComplexity > 40) {
            recommendations.push({
                type: 'High Complexity Tasks',
                percentage: data.highComplexity,
                recommendation: 'Schedule during peak energy periods with longest blocks',
                examples: 'Strategic planning, creative work, complex problem-solving'
            });
        }
        
        if (data.mediumComplexity > 30) {
            recommendations.push({
                type: 'Medium Complexity Tasks',
                percentage: data.mediumComplexity,
                recommendation: 'Schedule during good energy periods with standard blocks',
                examples: 'Writing, analysis, detailed planning, research'
            });
        }
        
        if (data.lowComplexity > 10) {
            recommendations.push({
                type: 'Low Complexity Tasks',
                percentage: data.lowComplexity,
                recommendation: 'Schedule during lower energy periods or between deep work blocks',
                examples: 'Email, data entry, routine administrative tasks'
            });
        }

        return recommendations;
    }

    function calculateFocusScore(data, interruptionFactor) {
        let baseScore = 70;
        
        // Energy peak bonus
        const energyPeakCount = [data.morningEnergy, data.afternoonEnergy, data.eveningEnergy].filter(Boolean).length;
        baseScore += energyPeakCount * 5;
        
        // Meeting load penalty
        const meetingPenalties = { 'low': 0, 'medium': -10, 'high': -20, 'very-high': -30 };
        baseScore += meetingPenalties[data.meetingLoad] || -10;
        
        // Interruption factor
        baseScore *= interruptionFactor.factor;
        
        // Environment bonus
        const environmentBonus = { 'home': 5, 'coworking': 0, 'office': -5, 'hybrid': -2 };
        baseScore += environmentBonus[data.environment] || 0;
        
        return Math.max(10, Math.min(100, Math.round(baseScore)));
    }

    function calculateProductivityMetrics(data, optimalBlocks) {
        const totalDeepWorkHours = optimalBlocks.reduce((sum, block) => sum + (block.duration / 60), 0);
        const workHours = calculateWorkHours(data.workStart, data.workEnd);
        const deepWorkPercentage = Math.round((totalDeepWorkHours / workHours) * 100);
        
        const weeklyDeepWork = totalDeepWorkHours * 5; // 5 working days
        const monthlyDeepWork = weeklyDeepWork * 4.33; // Average weeks per month
        
        const productivityMultiplier = optimalBlocks.length > 0 ? 
            optimalBlocks.reduce((sum, block) => sum + (block.score / 100), 0) / optimalBlocks.length : 1;
        
        const effectiveHours = totalDeepWorkHours * productivityMultiplier;
        
        return {
            dailyDeepWork: totalDeepWorkHours.toFixed(1),
            weeklyDeepWork: weeklyDeepWork.toFixed(1),
            monthlyDeepWork: monthlyDeepWork.toFixed(1),
            deepWorkPercentage,
            effectiveHours: effectiveHours.toFixed(1),
            productivityMultiplier: productivityMultiplier.toFixed(2)
        };
    }

    function displayResults(schedule) {
        const focusScoreColor = getFocusScoreColor(schedule.focusScore);
        
        resultContent.innerHTML = `
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h2 class="text-xl font-bold text-text mb-4 flex items-center gap-2">
                    <span class="material-icons text-primary">schedule</span>
                    Your Personalized Deep Work Schedule
                </h2>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Focus Score</h3>
                        <div class="text-3xl font-bold ${sanitizeText(focusScoreColor)} mb-2">${sanitizeText(schedule.focusScore)}/100</div>
                        <p class="text-sm text-light">${getFocusScoreDescription(schedule.focusScore)}</p>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Daily Deep Work Capacity</h3>
                        <div class="text-3xl font-bold text-primary mb-2">${sanitizeText(schedule.productivityMetrics.dailyDeepWork)}h</div>
                        <p class="text-sm text-light">${sanitizeText(schedule.productivityMetrics.deepWorkPercentage)}% of your work day</p>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Optimal Deep Work Blocks</h3>
                    <div class="space-y-3">
                        ${schedule.optimalBlocks.map((block, index) => `
                            <div class="bg-dark p-4 rounded border border-accent">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 class="font-medium text-text">Block ${index + 1}: ${sanitizeText(block.period)}</h4>
                                        <p class="text-sm text-light">${sanitizeText(block.timeSlot)} • ${sanitizeText(block.duration)} minutes</p>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-lg font-bold ${getScoreColor(block.score)}">${sanitizeText(block.score)}%</div>
                                        <p class="text-xs text-light">Effectiveness</p>
                                    </div>
                                </div>
                                <p class="text-sm text-light">${sanitizeText(block.recommendation)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Task-to-Time Matching</h3>
                    <div class="space-y-3">
                        ${schedule.taskRecommendations.map(task => `
                            <div class="bg-dark p-4 rounded border border-accent">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-medium text-text">${task.type}</h4>
                                    <span class="text-primary font-semibold">${sanitizeText(task.percentage)}%</span>
                                </div>
                                <p class="text-sm text-light mb-2">${sanitizeText(task.recommendation)}</p>
                                <p class="text-xs text-light italic">Examples: ${sanitizeText(task.examples)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Productivity Metrics</h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="bg-dark p-4 rounded border border-accent text-center">
                            <div class="text-2xl font-bold text-primary">${sanitizeText(schedule.productivityMetrics.weeklyDeepWork)}h</div>
                            <p class="text-sm text-light">Weekly Deep Work</p>
                        </div>
                        <div class="bg-dark p-4 rounded border border-accent text-center">
                            <div class="text-2xl font-bold text-primary">${sanitizeText(schedule.productivityMetrics.monthlyDeepWork)}h</div>
                            <p class="text-sm text-light">Monthly Deep Work</p>
                        </div>
                        <div class="bg-dark p-4 rounded border border-accent text-center">
                            <div class="text-2xl font-bold text-primary">${sanitizeText(schedule.productivityMetrics.effectiveHours)}h</div>
                            <p class="text-sm text-light">Effective Daily Hours</p>
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Environment Analysis</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-dark p-4 rounded border border-accent">
                            <h4 class="font-medium text-text mb-2">Interruption Impact</h4>
                            <div class="flex justify-between items-center">
                                <span class="text-light">Level: ${sanitizeText(schedule.interruptionFactor.level)}</span>
                                <span class="font-semibold ${getInterruptionColor(schedule.interruptionFactor.level)}">${Math.round(schedule.interruptionFactor.factor * 100)}%</span>
                            </div>
                        </div>
                        <div class="bg-dark p-4 rounded border border-accent">
                            <h4 class="font-medium text-text mb-2">Meeting Impact</h4>
                            <div class="flex justify-between items-center">
                                <span class="text-light">${sanitizeText(schedule.meetingImpact.description)}</span>
                                <span class="font-semibold ${getMeetingColor(schedule.meetingImpact.factor)}">${Math.round(schedule.meetingImpact.factor * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-primary/10 p-4 rounded border border-primary">
                    <h3 class="font-semibold text-text mb-2 flex items-center gap-2">
                        <span class="material-icons text-primary">lightbulb</span>
                        Key Recommendations
                    </h3>
                    <ul class="text-sm text-light space-y-1">
                        <li>• Start with ${schedule.optimalBlocks[0]?.duration || 120}-minute blocks during your ${schedule.energyPeaks[0]?.period.toLowerCase() || 'peak'} energy period</li>
                        <li>• Protect your deep work time by setting clear boundaries and expectations</li>
                        <li>• Use the Pomodoro Technique within blocks if you're new to extended focus</li>
                        <li>• Track your actual focus duration and adjust block lengths accordingly</li>
                        <li>• Consider noise-canceling headphones or "Do Not Disturb" signals</li>
                    </ul>
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function getFocusScoreColor(score) {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    }

    function getFocusScoreDescription(score) {
        if (score >= 80) return 'Excellent conditions for deep work';
        if (score >= 60) return 'Good potential with some optimization';
        if (score >= 40) return 'Moderate challenges to address';
        return 'Significant improvements needed';
    }

    function getScoreColor(score) {
        if (score >= 85) return 'text-green-400';
        if (score >= 70) return 'text-yellow-400';
        if (score >= 50) return 'text-orange-400';
        return 'text-red-400';
    }

    function getInterruptionColor(level) {
        const colors = {
            'Excellent': 'text-green-400',
            'Good': 'text-yellow-400',
            'Fair': 'text-orange-400',
            'Poor': 'text-red-400',
            'Critical': 'text-red-500'
        };
        return colors[level] || 'text-gray-400';
    }

    function getMeetingColor(factor) {
        if (factor >= 0.8) return 'text-green-400';
        if (factor >= 0.6) return 'text-yellow-400';
        if (factor >= 0.4) return 'text-orange-400';
        return 'text-red-400';
    }
});
