document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('stepForm').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateStepEquivalent();
    });
});

function collectFormData() {
    const activityType = document.getElementById('activityType').value;
    const duration = parseFloat(document.getElementById('duration').value) || 0;
    const intensity = document.getElementById('intensity').value;
    const bodyWeight = parseFloat(document.getElementById('bodyWeight').value) || 0;
    const weightUnit = document.getElementById('weightUnit').value;
    const stepGoal = parseFloat(document.getElementById('stepGoal').value) || 10000;
    
    // Convert weight to pounds if needed
    const weightInPounds = weightUnit === 'kg' ? bodyWeight * 2.20462 : bodyWeight;
    
    return {
        activityType,
        duration,
        intensity,
        bodyWeight: weightInPounds,
        stepGoal
    };
}

function getActivityMET(activityType, intensity) {
    const activityMETs = {
        swimming: { light: 4.0, moderate: 6.0, vigorous: 8.0, high: 10.0 },
        cycling: { light: 4.0, moderate: 6.8, vigorous: 8.5, high: 12.0 },
        running: { light: 6.0, moderate: 8.0, vigorous: 11.0, high: 14.0 },
        weightTraining: { light: 3.0, moderate: 4.5, vigorous: 6.0, high: 8.0 },
        yoga: { light: 2.5, moderate: 3.0, vigorous: 4.0, high: 5.0 },
        dancing: { light: 3.0, moderate: 4.8, vigorous: 6.0, high: 8.0 },
        basketball: { light: 4.5, moderate: 6.5, vigorous: 8.0, high: 10.0 },
        tennis: { light: 4.0, moderate: 5.0, vigorous: 7.0, high: 8.0 },
        soccer: { light: 5.0, moderate: 7.0, vigorous: 9.0, high: 12.0 },
        rowing: { light: 3.5, moderate: 6.0, vigorous: 8.5, high: 12.0 },
        elliptical: { light: 4.0, moderate: 5.0, vigorous: 7.0, high: 9.0 },
        stairClimbing: { light: 4.0, moderate: 6.0, vigorous: 8.0, high: 10.0 },
        hiking: { light: 3.5, moderate: 5.0, vigorous: 7.0, high: 9.0 },
        pilates: { light: 2.5, moderate: 3.5, vigorous: 4.5, high: 6.0 },
        boxing: { light: 5.0, moderate: 7.0, vigorous: 9.0, high: 12.0 },
        volleyball: { light: 3.0, moderate: 4.0, vigorous: 6.0, high: 8.0 },
        golf: { light: 2.5, moderate: 3.5, vigorous: 4.5, high: 5.5 },
        cleaning: { light: 2.5, moderate: 3.5, vigorous: 4.0, high: 5.0 },
        gardening: { light: 2.5, moderate: 4.0, vigorous: 5.0, high: 6.0 },
        other: { light: 3.0, moderate: 4.5, vigorous: 6.0, high: 8.0 }
    };
    
    return activityMETs[activityType] ? activityMETs[activityType][intensity] : 4.0;
}

function getActivityName(activityType) {
    const activityNames = {
        swimming: 'Swimming',
        cycling: 'Cycling',
        running: 'Running',
        weightTraining: 'Weight Training',
        yoga: 'Yoga',
        dancing: 'Dancing',
        basketball: 'Basketball',
        tennis: 'Tennis',
        soccer: 'Soccer',
        rowing: 'Rowing',
        elliptical: 'Elliptical',
        stairClimbing: 'Stair Climbing',
        hiking: 'Hiking',
        pilates: 'Pilates',
        boxing: 'Boxing',
        volleyball: 'Volleyball',
        golf: 'Golf',
        cleaning: 'House Cleaning',
        gardening: 'Gardening',
        other: 'Other Activity'
    };
    
    return activityNames[activityType] || 'Unknown Activity';
}

function calculateStepEquivalent() {
    const data = collectFormData();
    
    if (data.duration <= 0) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                <div class="flex items-center gap-2 text-red-400">
                    <span class="material-icons">error</span>
                    <span class="font-medium">Please enter a valid duration.</span>
                </div>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    if (data.bodyWeight <= 0) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                <div class="flex items-center gap-2 text-red-400">
                    <span class="material-icons">error</span>
                    <span class="font-medium">Please enter a valid body weight.</span>
                </div>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    const results = calculateSteps(data);
    displayResults(results, data);
}

function calculateSteps(data) {
    // Get MET value for activity and intensity
    const metValue = getActivityMET(data.activityType, data.intensity);
    
    // Calculate calories burned: METs × weight (kg) × time (hours)
    const weightInKg = data.bodyWeight / 2.20462;
    const timeInHours = data.duration / 60;
    const caloriesBurned = metValue * weightInKg * timeInHours;
    
    // Convert calories to steps (average: 0.045 calories per step for 150lb person)
    // Adjust for body weight
    const caloriesPerStep = 0.045 * (data.bodyWeight / 150);
    const equivalentSteps = Math.round(caloriesBurned / caloriesPerStep);
    
    // Calculate walking distance equivalent (average: 2000 steps = 1 mile)
    const walkingDistance = (equivalentSteps / 2000).toFixed(2);
    
    // Calculate walking time equivalent (average: 20 minutes per mile at 3 mph)
    const walkingTimeMinutes = Math.round((equivalentSteps / 2000) * 20);
    
    // Calculate step goal progress
    const stepGoalProgress = (equivalentSteps / data.stepGoal) * 100;
    
    // Calculate weekly projection (if done daily)
    const weeklySteps = equivalentSteps * 7;
    
    // Calculate intensity multiplier for display
    const intensityMultipliers = {
        light: 0.8,
        moderate: 1.0,
        vigorous: 1.3,
        high: 1.6
    };
    
    return {
        equivalentSteps,
        caloriesBurned: Math.round(caloriesBurned),
        walkingDistance,
        walkingTimeMinutes,
        stepGoalProgress,
        weeklySteps,
        metValue,
        intensityMultiplier: intensityMultipliers[data.intensity]
    };
}

function displayResults(results, data) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    const activityName = getActivityName(data.activityType);
    const intensityText = data.intensity.charAt(0).toUpperCase() + data.intensity.slice(1);
    
    const html = `
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-3xl font-bold text-primary">${results.equivalentSteps.toLocaleString()}</div>
                <div class="text-light text-sm">Equivalent Steps</div>
            </div>
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold text-green-400">${results.caloriesBurned}</div>
                <div class="text-light text-sm">Calories Burned</div>
            </div>
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold text-accent">${results.walkingDistance}</div>
                <div class="text-light text-sm">Miles Equivalent</div>
            </div>
        </div>

        <!-- Activity Summary -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Activity Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div class="text-light mb-2">Activity:</div>
                    <div class="text-accent font-semibold">${activityName}</div>
                </div>
                <div>
                    <div class="text-light mb-2">Intensity:</div>
                    <div class="text-accent font-semibold">${intensityText}</div>
                </div>
                <div>
                    <div class="text-light mb-2">Duration:</div>
                    <div class="text-accent font-semibold">${data.duration} minutes</div>
                </div>
                <div>
                    <div class="text-light mb-2">MET Value:</div>
                    <div class="text-accent font-semibold">${results.metValue}</div>
                </div>
            </div>
        </div>

        <!-- Walking Equivalent -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Walking Equivalent</h3>
            <div class="space-y-3">
                <div class="flex justify-between items-center">
                    <span class="text-light">Equivalent Walking Time:</span>
                    <span class="text-accent font-semibold">${results.walkingTimeMinutes} minutes</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-light">Equivalent Walking Distance:</span>
                    <span class="text-accent font-semibold">${results.walkingDistance} miles</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-light">Average Walking Pace:</span>
                    <span class="text-accent font-semibold">3.0 mph</span>
                </div>
            </div>
        </div>

        <!-- Step Goal Progress -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Daily Step Goal Progress</h3>
            <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-light">Progress toward ${data.stepGoal.toLocaleString()} steps</span>
                    <span class="text-accent">${results.stepGoalProgress.toFixed(1)}%</span>
                </div>
                <div class="w-full bg-broder rounded-full h-4">
                    <div class="bg-primary h-4 rounded-full transition-all" style="width: ${Math.min(results.stepGoalProgress, 100)}%"></div>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div class="text-light mb-2">Steps from this activity:</div>
                    <div class="text-primary font-semibold">${results.equivalentSteps.toLocaleString()}</div>
                </div>
                <div>
                    <div class="text-light mb-2">Remaining steps needed:</div>
                    <div class="text-accent font-semibold">${Math.max(0, data.stepGoal - results.equivalentSteps).toLocaleString()}</div>
                </div>
            </div>
        </div>

        <!-- Weekly Projection -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Weekly Projection</h3>
            <div class="text-center">
                <div class="text-3xl font-bold text-green-400 mb-2">${results.weeklySteps.toLocaleString()}</div>
                <div class="text-light text-sm mb-4">Total weekly steps if done daily</div>
                <div class="text-accent text-sm">
                    Equivalent to ${(results.weeklySteps / 2000).toFixed(1)} miles of walking per week
                </div>
            </div>
        </div>

        <!-- Activity Comparison -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Activity Intensity Comparison</h3>
            <div class="space-y-3">
                ${generateIntensityComparison(data, results)}
            </div>
        </div>

        <!-- Recommendations -->
        <div class="bg-dark p-6 rounded border border-accent">
            <h3 class="text-xl font-semibold text-primary mb-4">Recommendations</h3>
            <div class="space-y-3">
                ${generateRecommendations(data, results)}
            </div>
        </div>

        <!-- Tips -->
        <div class="bg-blue-900 bg-opacity-20 border border-blue-600 p-4 rounded mt-6">
            <h4 class="text-blue-400 font-semibold mb-2">Tracking Tips</h4>
            <ul class="text-blue-200 text-sm space-y-1">
                <li>• Add these equivalent steps to your fitness tracker manually</li>
                <li>• Track actual activity time, excluding rest periods</li>
                <li>• Adjust intensity level based on your actual effort</li>
                <li>• Combine with regular walking for comprehensive fitness</li>
                <li>• Update your weight periodically for accurate calculations</li>
            </ul>
        </div>
    `;
    
    resultsContent.innerHTML = html;
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateIntensityComparison(data, results) {
    const intensities = ['light', 'moderate', 'vigorous', 'high'];
    const intensityLabels = {
        light: 'Light',
        moderate: 'Moderate',
        vigorous: 'Vigorous',
        high: 'High'
    };
    
    return intensities.map(intensity => {
        const met = getActivityMET(data.activityType, intensity);
        const weightInKg = data.bodyWeight / 2.20462;
        const timeInHours = data.duration / 60;
        const calories = Math.round(met * weightInKg * timeInHours);
        const caloriesPerStep = 0.045 * (data.bodyWeight / 150);
        const steps = Math.round(calories / caloriesPerStep);
        
        const isSelected = intensity === data.intensity;
        
        return `
            <div class="flex justify-between items-center p-3 rounded ${isSelected ? 'bg-primary bg-opacity-20 border border-primary' : 'bg-broder'}">
                <div>
                    <span class="font-semibold ${isSelected ? 'text-primary' : 'text-light'}">${intensityLabels[intensity]} Intensity</span>
                    ${isSelected ? '<span class="text-primary text-sm ml-2">(Selected)</span>' : ''}
                </div>
                <div class="text-right">
                    <div class="font-semibold ${isSelected ? 'text-primary' : 'text-accent'}">${steps.toLocaleString()} steps</div>
                    <div class="text-sm text-light">${calories} calories</div>
                </div>
            </div>
        `;
    }).join('');
}

function generateRecommendations(data, results) {
    const recommendations = [];
    
    // Step goal recommendations
    if (results.stepGoalProgress < 50) {
        recommendations.push({
            type: 'info',
            title: 'Increase Activity Duration',
            message: `Consider extending your ${getActivityName(data.activityType).toLowerCase()} session to ${Math.ceil(data.duration * (data.stepGoal / results.equivalentSteps))} minutes to reach your daily step goal.`
        });
    } else if (results.stepGoalProgress >= 100) {
        recommendations.push({
            type: 'success',
            title: 'Goal Achieved!',
            message: `Great job! This activity alone meets your daily step goal. Consider adding variety with other activities.`
        });
    }
    
    // Intensity recommendations
    if (data.intensity === 'light') {
        recommendations.push({
            type: 'tip',
            title: 'Intensity Boost',
            message: `Try increasing to moderate intensity to earn ${Math.round(results.equivalentSteps * 1.25).toLocaleString()} equivalent steps for the same duration.`
        });
    }
    
    // Activity-specific recommendations
    if (data.activityType === 'weightTraining') {
        recommendations.push({
            type: 'tip',
            title: 'Combine with Cardio',
            message: 'Weight training is excellent for strength. Consider adding 10-15 minutes of cardio for additional step equivalents.'
        });
    }
    
    if (results.caloriesBurned < 200) {
        recommendations.push({
            type: 'info',
            title: 'Calorie Burn',
            message: 'For higher calorie burn and more step equivalents, try increasing duration or intensity level.'
        });
    }
    
    return recommendations.map(rec => {
        const colors = {
            success: 'bg-green-900 bg-opacity-20 border-green-600 text-green-400',
            info: 'bg-blue-900 bg-opacity-20 border-blue-600 text-blue-400',
            tip: 'bg-yellow-900 bg-opacity-20 border-yellow-600 text-yellow-400',
            warning: 'bg-orange-900 bg-opacity-20 border-orange-600 text-orange-400'
        };
        
        return `
            <div class="${colors[rec.type]} border p-3 rounded">
                <div class="font-semibold mb-1">${rec.title}</div>
                <div class="text-sm opacity-90">${rec.message}</div>
            </div>
        `;
    }).join('');
}