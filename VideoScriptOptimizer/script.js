document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('script-form');
    const platformSelect = document.getElementById('platform');
    const categorySelect = document.getElementById('category');
    const audienceSelect = document.getElementById('audience');
    const targetDurationInput = document.getElementById('target-duration');
    const durationUnitSelect = document.getElementById('duration-unit');
    const speakingPaceSelect = document.getElementById('speaking-pace');
    const completionRateInput = document.getElementById('completion-rate');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const platform = platformSelect.value;
        const category = categorySelect.value;
        const audience = audienceSelect.value;
        const targetDuration = parseFloat(targetDurationInput.value);
        const durationUnit = durationUnitSelect.value;
        const speakingPace = speakingPaceSelect.value;
        const completionRate = parseFloat(completionRateInput.value) || null;
        
        if (!platform || !category || !targetDuration) {
            resultContent.innerHTML = `
                <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <div class="flex items-center gap-2 text-red-400">
                        <span class="material-icons">error</span>
                        <span class="font-medium">Please fill in all required fields</span>
                    </div>
                </div>
            `;
            resultsDiv.classList.remove('hidden');
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        const optimization = calculateScriptOptimization(
            platform, category, audience, targetDuration, durationUnit, speakingPace, completionRate
        );
        
        displayResults(optimization);
        
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    // ===== SCRIPT OPTIMIZATION CALCULATION LOGIC =====
    function calculateScriptOptimization(platform, category, audience, targetDuration, durationUnit, speakingPace, completionRate) {
        const optimization = {
            optimalWordCount: 0,
            recommendedDuration: 0,
            contentBreakdown: {},
            pacingGuide: {},
            platformOptimization: {},
            recommendations: [],
            retentionAnalysis: {}
        };
        
        // Convert duration to minutes
        const durationInMinutes = durationUnit === 'seconds' ? targetDuration / 60 : targetDuration;
        
        // Get speaking pace (words per minute)
        const wpmRates = {
            'slow': 130,
            'normal': 160,
            'fast': 190,
            'very-fast': 220
        };
        const baseWPM = wpmRates[speakingPace];
        
        // Platform-specific adjustments
        const platformData = getPlatformOptimization(platform, category, audience);
        const adjustedWPM = baseWPM * platformData.paceMultiplier;
        
        // Calculate optimal word count
        optimization.optimalWordCount = Math.round(durationInMinutes * adjustedWPM);
        
        // Calculate recommended duration based on platform
        optimization.recommendedDuration = platformData.recommendedDuration;
        
        // Generate content breakdown
        optimization.contentBreakdown = generateContentBreakdown(category, optimization.optimalWordCount, platform);
        
        // Create pacing guide
        optimization.pacingGuide = generatePacingGuide(durationInMinutes, optimization.optimalWordCount, category);
        
        // Platform optimization
        optimization.platformOptimization = platformData;
        
        // Generate recommendations
        optimization.recommendations = generateRecommendations(
            platform, category, audience, durationInMinutes, completionRate, platformData
        );
        
        // Retention analysis
        optimization.retentionAnalysis = analyzeRetention(
            platform, category, durationInMinutes, completionRate
        );
        
        return optimization;
    }
    
    function getPlatformOptimization(platform, category, audience) {
        const platformData = {
            'youtube': {
                recommendedDuration: category === 'tutorial' ? 8 : category === 'vlog' ? 12 : 10,
                paceMultiplier: 0.95,
                retentionTarget: 60,
                hookDuration: 15,
                optimalLength: '8-15 minutes',
                algorithm: 'Favors watch time and session duration'
            },
            'tiktok': {
                recommendedDuration: 0.5,
                paceMultiplier: 1.3,
                retentionTarget: 85,
                hookDuration: 3,
                optimalLength: '15-60 seconds',
                algorithm: 'Favors completion rate and engagement'
            },
            'instagram': {
                recommendedDuration: 0.75,
                paceMultiplier: 1.2,
                retentionTarget: 75,
                hookDuration: 3,
                optimalLength: '30-90 seconds',
                algorithm: 'Favors saves and shares'
            },
            'youtube-shorts': {
                recommendedDuration: 0.5,
                paceMultiplier: 1.4,
                retentionTarget: 80,
                hookDuration: 2,
                optimalLength: '15-60 seconds',
                algorithm: 'Favors completion and replays'
            },
            'facebook': {
                recommendedDuration: 2,
                paceMultiplier: 1.0,
                retentionTarget: 50,
                hookDuration: 5,
                optimalLength: '1-3 minutes',
                algorithm: 'Favors meaningful interactions'
            },
            'twitter': {
                recommendedDuration: 0.75,
                paceMultiplier: 1.1,
                retentionTarget: 70,
                hookDuration: 3,
                optimalLength: '30-60 seconds',
                algorithm: 'Favors retweets and replies'
            },
            'linkedin': {
                recommendedDuration: 3,
                paceMultiplier: 0.9,
                retentionTarget: 65,
                hookDuration: 10,
                optimalLength: '2-5 minutes',
                algorithm: 'Favors professional engagement'
            }
        };
        
        return platformData[platform] || platformData['youtube'];
    }
    
    function generateContentBreakdown(category, totalWords, platform) {
        const breakdowns = {
            'tutorial': {
                hook: 0.08,
                introduction: 0.12,
                mainContent: 0.65,
                callToAction: 0.10,
                outro: 0.05
            },
            'vlog': {
                hook: 0.10,
                introduction: 0.15,
                mainContent: 0.60,
                callToAction: 0.10,
                outro: 0.05
            },
            'educational': {
                hook: 0.06,
                introduction: 0.14,
                mainContent: 0.70,
                callToAction: 0.07,
                outro: 0.03
            },
            'entertainment': {
                hook: 0.12,
                introduction: 0.08,
                mainContent: 0.70,
                callToAction: 0.07,
                outro: 0.03
            },
            'review': {
                hook: 0.10,
                introduction: 0.15,
                mainContent: 0.60,
                callToAction: 0.12,
                outro: 0.03
            },
            'news': {
                hook: 0.15,
                introduction: 0.10,
                mainContent: 0.65,
                callToAction: 0.07,
                outro: 0.03
            },
            'promotional': {
                hook: 0.20,
                introduction: 0.10,
                mainContent: 0.50,
                callToAction: 0.15,
                outro: 0.05
            },
            'storytelling': {
                hook: 0.15,
                introduction: 0.10,
                mainContent: 0.65,
                callToAction: 0.07,
                outro: 0.03
            }
        };
        
        const breakdown = breakdowns[category] || breakdowns['tutorial'];
        const result = {};
        
        Object.keys(breakdown).forEach(section => {
            result[section] = {
                words: Math.round(totalWords * breakdown[section]),
                percentage: Math.round(breakdown[section] * 100)
            };
        });
        
        return result;
    }
    
    function generatePacingGuide(durationMinutes, totalWords, category) {
        const guide = {
            averageWPM: Math.round(totalWords / durationMinutes),
            sections: []
        };
        
        // Different pacing for different sections
        const pacingMultipliers = {
            'hook': 1.2,
            'introduction': 1.0,
            'mainContent': 0.9,
            'callToAction': 1.1,
            'outro': 1.0
        };
        
        const sectionDurations = {
            'tutorial': { hook: 0.1, introduction: 0.15, mainContent: 0.6, callToAction: 0.1, outro: 0.05 },
            'entertainment': { hook: 0.15, introduction: 0.1, mainContent: 0.65, callToAction: 0.07, outro: 0.03 }
        };
        
        const durations = sectionDurations[category] || sectionDurations['tutorial'];
        
        Object.keys(durations).forEach(section => {
            const sectionDuration = durationMinutes * durations[section];
            const sectionWPM = Math.round(guide.averageWPM * pacingMultipliers[section]);
            
            guide.sections.push({
                name: section,
                duration: sectionDuration,
                recommendedWPM: sectionWPM,
                pacing: sectionWPM > 180 ? 'Fast' : sectionWPM > 150 ? 'Normal' : 'Slow'
            });
        });
        
        return guide;
    }
    
    function generateRecommendations(platform, category, audience, duration, completionRate, platformData) {
        const recommendations = [];
        
        // Duration recommendations
        if (duration > platformData.recommendedDuration * 1.5) {
            recommendations.push(`Consider shortening to ${platformData.optimalLength} for better retention on ${platform}`);
        } else if (duration < platformData.recommendedDuration * 0.5) {
            recommendations.push(`Consider extending to ${platformData.optimalLength} for better algorithm performance`);
        }
        
        // Completion rate recommendations
        if (completionRate && completionRate < platformData.retentionTarget) {
            recommendations.push(`Improve your hook in the first ${platformData.hookDuration} seconds to boost retention`);
            recommendations.push('Consider faster pacing and more engaging visuals to maintain attention');
        }
        
        // Platform-specific recommendations
        const platformRecs = {
            'youtube': [
                'Use pattern interrupts every 30-45 seconds',
                'Include timestamps for longer videos',
                'End with a strong call-to-action for next video'
            ],
            'tiktok': [
                'Start with a visual hook in the first 3 seconds',
                'Use trending sounds and effects',
                'Include text overlays for key points'
            ],
            'instagram': [
                'Use vertical format (9:16) for better reach',
                'Include captions for sound-off viewing',
                'End with a question to drive comments'
            ],
            'youtube-shorts': [
                'Use quick cuts and fast pacing',
                'Include trending hashtags in description',
                'Create content that encourages replays'
            ]
        };
        
        const platformSpecific = platformRecs[platform] || [];
        recommendations.push(...platformSpecific.slice(0, 2));
        
        // Category-specific recommendations
        if (category === 'tutorial') {
            recommendations.push('Break complex steps into digestible chunks');
        } else if (category === 'entertainment') {
            recommendations.push('Use humor and surprise elements throughout');
        }
        
        return recommendations.slice(0, 5);
    }
    
    function analyzeRetention(platform, category, duration, completionRate) {
        const analysis = {
            expectedRetention: 0,
            dropOffPoints: [],
            optimizationTips: []
        };
        
        // Platform retention benchmarks
        const retentionBenchmarks = {
            'youtube': 55,
            'tiktok': 85,
            'instagram': 75,
            'youtube-shorts': 80,
            'facebook': 50,
            'twitter': 70,
            'linkedin': 65
        };
        
        analysis.expectedRetention = retentionBenchmarks[platform] || 60;
        
        // Common drop-off points
        if (duration > 2) {
            analysis.dropOffPoints = ['0:15 (Hook failure)', '1:30 (Interest drop)', '3:00 (Attention span limit)'];
        } else {
            analysis.dropOffPoints = ['0:05 (Immediate hook)', '0:30 (Mid-point)'];
        }
        
        // Optimization tips based on completion rate
        if (completionRate) {
            if (completionRate < analysis.expectedRetention) {
                analysis.optimizationTips = [
                    'Strengthen your opening hook',
                    'Increase pacing in the middle section',
                    'Add pattern interrupts every 30 seconds'
                ];
            } else {
                analysis.optimizationTips = [
                    'Your retention is above average!',
                    'Consider testing longer content',
                    'Focus on increasing engagement metrics'
                ];
            }
        }
        
        return analysis;
    }
    
    // ===== RESULTS DISPLAY =====
    function displayResults(optimization) {
        const durationColor = optimization.recommendedDuration <= 1 ? 'text-green-400' : 
                             optimization.recommendedDuration <= 5 ? 'text-yellow-400' : 'text-orange-400';
        
        resultContent.innerHTML = `
            <div class="bg-broder border border-accent rounded-lg p-6">
                <div class="text-center mb-6">
                    <div class="text-4xl font-bold text-primary mb-2">${optimization.optimalWordCount}</div>
                    <div class="text-lg text-light">Optimal Word Count</div>
                    <div class="text-sm text-accent mt-1">${optimization.recommendedDuration >= 1 ? 
                        `${optimization.recommendedDuration.toFixed(1)} minutes` : 
                        `${Math.round(optimization.recommendedDuration * 60)} seconds`} recommended duration</div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-3">Content Breakdown</h3>
                        <div class="space-y-2">
                            ${Object.entries(optimization.contentBreakdown).map(([section, data]) => `
                                <div class="flex items-center justify-between bg-dark border border-accent rounded p-2">
                                    <span class="text-text capitalize">${section.replace(/([A-Z])/g, ' $1')}</span>
                                    <div class="text-right">
                                        <div class="text-accent font-medium">${data.words} words</div>
                                        <div class="text-xs text-light">${data.percentage}%</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-3">Platform Optimization</h3>
                        <div class="space-y-2 text-sm">
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Optimal Length:</strong> ${optimization.platformOptimization.optimalLength}
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Target Retention:</strong> ${optimization.platformOptimization.retentionTarget}%
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Hook Duration:</strong> ${optimization.platformOptimization.hookDuration} seconds
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Algorithm Focus:</strong> ${optimization.platformOptimization.algorithm}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">📝 Pacing Guide</h3>
                    <div class="bg-dark border border-accent rounded p-4">
                        <div class="text-center mb-3">
                            <span class="text-accent font-semibold">Average Pace: ${optimization.pacingGuide.averageWPM} WPM</span>
                        </div>
                        <div class="grid md:grid-cols-2 gap-4">
                            ${optimization.pacingGuide.sections.map(section => `
                                <div class="flex items-center justify-between">
                                    <span class="text-text capitalize">${section.name.replace(/([A-Z])/g, ' $1')}</span>
                                    <div class="text-right">
                                        <div class="text-accent">${section.recommendedWPM} WPM</div>
                                        <div class="text-xs text-light">${section.pacing} pace</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                ${optimization.retentionAnalysis.dropOffPoints.length > 0 ? `
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">📊 Retention Analysis</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-dark border border-accent rounded p-3">
                            <h4 class="text-accent font-semibold mb-2">Expected Retention</h4>
                            <div class="text-2xl font-bold text-primary">${optimization.retentionAnalysis.expectedRetention}%</div>
                        </div>
                        <div class="bg-dark border border-accent rounded p-3">
                            <h4 class="text-accent font-semibold mb-2">Common Drop-off Points</h4>
                            <ul class="text-xs text-text space-y-1">
                                ${optimization.retentionAnalysis.dropOffPoints.map(point => `
                                    <li>• ${point}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                ${optimization.recommendations.length > 0 ? `
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">💡 Optimization Recommendations</h3>
                    <ul class="space-y-2">
                        ${optimization.recommendations.map(rec => `
                            <li class="flex items-start gap-2 text-text">
                                <span class="material-icons text-yellow-400 text-sm mt-0.5">lightbulb</span>
                                ${rec}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-dark border border-accent rounded p-4">
                        <h4 class="text-primary font-semibold mb-2">🎯 Script Structure</h4>
                        <div class="text-sm text-text">
                            Hook (${optimization.contentBreakdown.hook?.percentage}%) → 
                            Main Content (${optimization.contentBreakdown.mainContent?.percentage}%) → 
                            CTA (${optimization.contentBreakdown.callToAction?.percentage}%)
                        </div>
                    </div>
                    <div class="bg-dark border border-accent rounded p-4">
                        <h4 class="text-primary font-semibold mb-2">⏱️ Timing Breakdown</h4>
                        <div class="text-sm text-text">
                            ${optimization.pacingGuide.sections.length} sections with 
                            ${optimization.pacingGuide.averageWPM} WPM average pace
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 text-center">
                    <div class="text-primary font-semibold mb-2">🚀 Script Optimization Complete</div>
                    <div class="text-sm text-text">
                        Optimal script: <strong>${optimization.optimalWordCount} words</strong> for 
                        <strong>${optimization.recommendedDuration >= 1 ? 
                            `${optimization.recommendedDuration.toFixed(1)} minutes` : 
                            `${Math.round(optimization.recommendedDuration * 60)} seconds`}</strong> video
                    </div>
                </div>
            </div>
        `;
    }
});