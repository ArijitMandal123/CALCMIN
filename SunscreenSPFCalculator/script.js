// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sunscreen-form');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSunProtection();
    });

    function calculateSunProtection() {
        const data = collectFormData();
        
        if (!validateInputs(data)) {
            return;
        }

        const analysis = analyzeSunProtection(data);
        displayResults(analysis, data);
    }

    function collectFormData() {
        return {
            spfRating: parseInt(document.getElementById('spf-rating').value),
            amountApplied: parseFloat(document.getElementById('amount-applied').value),
            skinType: parseInt(document.getElementById('skin-type').value),
            uvIndex: parseInt(document.getElementById('uv-index').value),
            activityLevel: document.getElementById('activity-level').value,
            reapplicationFreq: parseFloat(document.getElementById('reapplication-frequency').value),
            exposureDuration: parseFloat(document.getElementById('exposure-duration').value)
        };
    }

    function validateInputs(data) {
        if (!data.spfRating || !data.amountApplied || !data.skinType || !data.uvIndex || 
            !data.activityLevel || !data.reapplicationFreq || !data.exposureDuration) {
            resultsDiv.innerHTML = `
                <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <div class="flex items-center gap-2 text-red-400">
                        <span class="material-icons">error</span>
                        <span class="font-medium">Please fill in all fields to calculate sun protection.</span>
                    </div>
                </div>
            `;
            resultsDiv.classList.remove('hidden');
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
            return false;
        }
        return true;
    }

    function analyzeSunProtection(data) {
        // Calculate effective SPF based on application amount
        const effectiveSPF = Math.round(data.spfRating * data.amountApplied);
        
        // Base protection time by skin type (minutes without sunscreen)
        const baseBurnTimes = {
            1: 5,   // Type I - Very fair
            2: 12,  // Type II - Fair  
            3: 20,  // Type III - Medium
            4: 30,  // Type IV - Olive
            5: 45,  // Type V - Brown
            6: 60   // Type VI - Dark
        };

        const baseBurnTime = baseBurnTimes[data.skinType];
        
        // UV Index multipliers (higher UV = faster burning)
        const uvMultipliers = {
            1: 1.0,   // Low
            3: 0.8,   // Moderate
            6: 0.6,   // High
            8: 0.4,   // Very High
            11: 0.2   // Extreme
        };

        const uvMultiplier = uvMultipliers[data.uvIndex];
        const adjustedBurnTime = baseBurnTime * uvMultiplier;

        // Theoretical protection time with sunscreen
        const theoreticalProtectionTime = adjustedBurnTime * effectiveSPF;

        // Activity level degradation factors
        const activityDegradation = {
            sedentary: 0.9,
            light: 0.8,
            moderate: 0.6,
            intense: 0.4,
            water: 0.3
        };

        const degradationFactor = activityDegradation[data.activityLevel];
        
        // Real protection time accounting for activity
        const realProtectionTime = theoreticalProtectionTime * degradationFactor;

        // Calculate protection periods based on reapplication
        const protectionPeriods = calculateProtectionPeriods(
            realProtectionTime, 
            data.reapplicationFreq, 
            data.exposureDuration
        );

        // Calculate sunscreen requirements
        const sunscreenNeeded = calculateSunscreenAmount(data.exposureDuration, data.reapplicationFreq);

        // Calculate skin cancer risk reduction
        const riskReduction = calculateRiskReduction(effectiveSPF, data.amountApplied, data.reapplicationFreq);

        // Generate recommendations
        const recommendations = generateRecommendations(data, effectiveSPF, realProtectionTime);

        return {
            effectiveSPF,
            theoreticalProtectionTime: Math.round(theoreticalProtectionTime),
            realProtectionTime: Math.round(realProtectionTime),
            protectionPeriods,
            sunscreenNeeded,
            riskReduction,
            recommendations,
            baseBurnTime: Math.round(adjustedBurnTime)
        };
    }

    function calculateProtectionPeriods(protectionTime, reapplyFreq, totalDuration) {
        const periods = [];
        let currentTime = 0;
        let applicationCount = 1;

        while (currentTime < totalDuration * 60) { // Convert hours to minutes
            const periodEnd = Math.min(
                currentTime + (reapplyFreq * 60), // Reapplication time
                currentTime + protectionTime,     // Protection limit
                totalDuration * 60               // Total exposure time
            );

            const actualProtection = Math.min(protectionTime, reapplyFreq * 60);
            const isProtected = actualProtection >= (periodEnd - currentTime);

            periods.push({
                start: Math.round(currentTime / 60 * 10) / 10,
                end: Math.round(periodEnd / 60 * 10) / 10,
                protected: isProtected,
                application: applicationCount,
                protectionMinutes: Math.round(actualProtection)
            });

            currentTime = periodEnd;
            if (currentTime < totalDuration * 60 && periodEnd % (reapplyFreq * 60) === 0) {
                applicationCount++;
            }
        }

        return periods;
    }

    function calculateSunscreenAmount(duration, reapplyFreq) {
        const applicationsNeeded = Math.ceil(duration / reapplyFreq);
        const ozPerApplication = 1; // 1 oz for full body
        const totalOz = applicationsNeeded * ozPerApplication;
        
        // Cost estimates (per oz)
        const costEstimates = {
            budget: 0.50,
            mid: 1.00,
            premium: 2.00
        };

        return {
            applications: applicationsNeeded,
            totalOz: totalOz,
            costs: {
                budget: Math.round(totalOz * costEstimates.budget * 100) / 100,
                mid: Math.round(totalOz * costEstimates.mid * 100) / 100,
                premium: Math.round(totalOz * costEstimates.premium * 100) / 100
            }
        };
    }

    function calculateRiskReduction(effectiveSPF, applicationAmount, reapplyFreq) {
        // Base risk reduction by SPF
        let baseReduction = 0;
        if (effectiveSPF >= 50) baseReduction = 45;
        else if (effectiveSPF >= 30) baseReduction = 40;
        else if (effectiveSPF >= 15) baseReduction = 35;
        else baseReduction = 25;

        // Adjust for proper application
        if (applicationAmount < 0.75) baseReduction *= 0.6;
        else if (applicationAmount >= 1.0) baseReduction *= 1.1;

        // Adjust for reapplication frequency
        if (reapplyFreq <= 2) baseReduction *= 1.0;
        else if (reapplyFreq <= 4) baseReduction *= 0.8;
        else baseReduction *= 0.6;

        return Math.min(50, Math.round(baseReduction));
    }

    function generateRecommendations(data, effectiveSPF, protectionTime) {
        const recommendations = [];

        // SPF recommendations
        if (effectiveSPF < 15) {
            recommendations.push({
                type: 'critical',
                title: 'Insufficient SPF Protection',
                message: 'Your effective SPF is too low. Use SPF 30+ and apply more generously.',
                priority: 'high'
            });
        }

        // Application amount
        if (data.amountApplied < 0.75) {
            recommendations.push({
                type: 'application',
                title: 'Apply More Sunscreen',
                message: 'You\'re applying too little. Use 1/4 teaspoon for face, 1 oz for full body.',
                priority: 'high'
            });
        }

        // Reapplication frequency
        if (data.reapplicationFreq > 2) {
            recommendations.push({
                type: 'reapplication',
                title: 'Reapply More Frequently',
                message: 'Reapply every 2 hours maximum, or immediately after swimming/sweating.',
                priority: 'medium'
            });
        }

        // UV Index warnings
        if (data.uvIndex >= 8) {
            recommendations.push({
                type: 'uv-warning',
                title: 'Extreme UV Conditions',
                message: 'Seek shade between 10am-4pm. Use protective clothing and wide-brim hat.',
                priority: 'high'
            });
        }

        // Activity-specific advice
        if (data.activityLevel === 'water') {
            recommendations.push({
                type: 'activity',
                title: 'Water Activity Protection',
                message: 'Use water-resistant sunscreen. Reapply immediately after swimming.',
                priority: 'medium'
            });
        }

        // Skin type specific
        if (data.skinType <= 2) {
            recommendations.push({
                type: 'skin-type',
                title: 'Fair Skin Extra Protection',
                message: 'Consider SPF 50+ and protective clothing. Your skin burns quickly.',
                priority: 'medium'
            });
        }

        return recommendations;
    }

    function displayResults(analysis, data) {
        const protectionColor = analysis.realProtectionTime >= 120 ? 'text-green-400' : 
                               analysis.realProtectionTime >= 60 ? 'text-yellow-400' : 'text-red-400';

        const riskColor = analysis.riskReduction >= 40 ? 'text-green-400' : 
                         analysis.riskReduction >= 30 ? 'text-yellow-400' : 'text-red-400';

        function sanitizeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        resultContent.innerHTML = `
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
                    <span class="material-icons text-primary">wb_sunny</span> 
                    Real Sun Protection Analysis
                </h3>
                
                <div class="grid md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-primary">${sanitizeHtml(analysis.effectiveSPF.toString())}</div>
                        <div class="text-sm text-light">Effective SPF</div>
                        <div class="text-xs text-light mt-1">(vs ${sanitizeHtml(data.spfRating.toString())} labeled)</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold ${sanitizeText(protectionColor)}">${sanitizeHtml(analysis.realProtectionTime.toString())}min</div>
                        <div class="text-sm text-light">Real Protection Time</div>
                        <div class="text-xs text-light mt-1">(vs ${sanitizeHtml(analysis.theoreticalProtectionTime.toString())}min theoretical)</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold ${sanitizeText(riskColor)}">${sanitizeHtml(analysis.riskReduction.toString())}%</div>
                        <div class="text-sm text-light">Cancer Risk Reduction</div>
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="text-lg font-medium mb-3 text-text">Protection Timeline</h4>
                    <div class="space-y-2">
                        ${analysis.protectionPeriods.map((period, index) => `
                            <div class="flex items-center justify-between p-3 rounded border ${period.protected ? 'bg-green-900/20 border-green-600' : 'bg-red-900/20 border-red-600'}">
                                <div class="flex items-center gap-2">
                                    <span class="material-icons text-sm ${period.protected ? 'text-green-400' : 'text-red-400'}">
                                        ${period.protected ? 'shield' : 'warning'}
                                    </span>
                                    <span class="text-sm">Hours ${sanitizeHtml(period.start.toString())} - ${sanitizeHtml(period.end.toString())}</span>
                                </div>
                                <div class="text-sm ${period.protected ? 'text-green-400' : 'text-red-400'}">
                                    ${period.protected ? 'Protected' : 'Risk of burning'}
                                    ${index === 0 || period.start % data.reapplicationFreq === 0 ? ' (Reapply)' : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="font-medium text-accent mb-3">Sunscreen Requirements</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Applications needed:</span>
                                <span class="text-text">${sanitizeHtml(analysis.sunscreenNeeded.applications.toString())}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Total amount:</span>
                                <span class="text-text">${sanitizeHtml(analysis.sunscreenNeeded.totalOz.toString())} oz</span>
                            </div>
                            <div class="border-t border-accent pt-2 mt-2">
                                <div class="text-xs text-light mb-1">Estimated costs:</div>
                                <div class="flex justify-between text-xs">
                                    <span class="text-light">Budget option:</span>
                                    <span class="text-text">$${sanitizeHtml(analysis.sunscreenNeeded.costs.budget.toString())}</span>
                                </div>
                                <div class="flex justify-between text-xs">
                                    <span class="text-light">Mid-range:</span>
                                    <span class="text-text">$${sanitizeHtml(analysis.sunscreenNeeded.costs.mid.toString())}</span>
                                </div>
                                <div class="flex justify-between text-xs">
                                    <span class="text-light">Premium:</span>
                                    <span class="text-text">$${sanitizeHtml(analysis.sunscreenNeeded.costs.premium.toString())}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="font-medium text-accent mb-3">Protection Factors</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Base burn time:</span>
                                <span class="text-text">${sanitizeHtml(analysis.baseBurnTime.toString())} min</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">UV Index impact:</span>
                                <span class="text-text">${data.uvIndex >= 8 ? 'Severe' : data.uvIndex >= 6 ? 'High' : 'Moderate'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Activity degradation:</span>
                                <span class="text-text">${data.activityLevel === 'water' ? '70%' : data.activityLevel === 'intense' ? '60%' : data.activityLevel === 'moderate' ? '40%' : '20%'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Application efficiency:</span>
                                <span class="text-text">${sanitizeHtml(Math.round(data.amountApplied * 100).toString())}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                ${analysis.recommendations.length > 0 ? `
                <div class="mb-6">
                    <h4 class="text-lg font-medium mb-3 text-text">Recommendations</h4>
                    <div class="space-y-3">
                        ${analysis.recommendations.map(rec => `
                            <div class="p-3 rounded border-l-4 ${rec.priority === 'high' ? 'border-red-500 bg-red-900/10' : 'border-yellow-500 bg-yellow-900/10'}">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="material-icons text-sm ${rec.priority === 'high' ? 'text-red-400' : 'text-yellow-400'}">
                                        ${rec.priority === 'high' ? 'priority_high' : 'info'}
                                    </span>
                                    <span class="font-medium text-sm">${sanitizeHtml(rec.title)}</span>
                                </div>
                                <div class="text-sm text-light">${sanitizeHtml(rec.message)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="bg-dark p-4 rounded border border-accent">
                    <h4 class="text-lg font-medium mb-3 text-text flex items-center gap-2">
                        <span class="material-icons text-accent">tips_and_updates</span>
                        Key Takeaways
                    </h4>
                    <ul class="space-y-2 text-sm text-light">
                        <li class="flex items-start gap-2">
                            <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
                            Your effective SPF is ${sanitizeHtml(analysis.effectiveSPF.toString())}, providing ${sanitizeHtml(analysis.realProtectionTime.toString())} minutes of real protection
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
                            Reapply every ${sanitizeHtml(data.reapplicationFreq.toString())} hours or immediately after water/sweat exposure
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
                            You'll need ${sanitizeHtml(analysis.sunscreenNeeded.totalOz.toString())} oz of sunscreen for ${sanitizeHtml(data.exposureDuration.toString())} hours of exposure
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
                            Proper use reduces skin cancer risk by approximately ${sanitizeHtml(analysis.riskReduction.toString())}%
                        </li>
                    </ul>
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
});
