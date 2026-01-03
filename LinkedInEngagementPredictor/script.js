// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('linkedin-form');
    const followerCountInput = document.getElementById('follower-count');
    const engagementRateInput = document.getElementById('engagement-rate');
    const contentTypeSelect = document.getElementById('content-type');
    const industrySelect = document.getElementById('industry');
    const postingDaySelect = document.getElementById('posting-day');
    const postingTimeSelect = document.getElementById('posting-time');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const followerCount = parseInt(followerCountInput.value);
        const engagementRate = parseFloat(engagementRateInput.value);
        const contentType = contentTypeSelect.value;
        const industry = industrySelect.value;
        const postingDay = postingDaySelect.value;
        const postingTime = parseInt(postingTimeSelect.value);
        
        // Get quality factors
        const hasHashtags = document.getElementById('has-hashtags').checked;
        const hasMentions = document.getElementById('has-mentions').checked;
        const hasCTA = document.getElementById('has-cta').checked;
        const hasQuestion = document.getElementById('has-question').checked;
        
        if (!followerCount || !engagementRate || !contentType || !industry) {
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
        
        const prediction = calculateEngagement(
            followerCount, engagementRate, contentType, industry, 
            postingDay, postingTime, hasHashtags, hasMentions, hasCTA, hasQuestion
        );
        
        displayResults(prediction);
        
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    // ===== LINKEDIN ENGAGEMENT CALCULATION LOGIC =====
    function calculateEngagement(followerCount, baseEngagementRate, contentType, industry, postingDay, postingTime, hasHashtags, hasMentions, hasCTA, hasQuestion) {
        const prediction = {
            totalEngagement: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            impressions: 0,
            engagementRate: 0,
            optimizationScore: 0,
            recommendations: [],
            timeOptimization: '',
            industryBenchmark: 0
        };
        
        // Base engagement calculation
        let adjustedEngagementRate = baseEngagementRate / 100;
        
        // Content type multipliers
        const contentMultipliers = {
            'text': 1.0,
            'image': 1.8,
            'video': 3.2,
            'carousel': 2.4,
            'article': 1.3,
            'poll': 2.1,
            'document': 1.6
        };
        
        // Industry engagement benchmarks (%)
        const industryBenchmarks = {
            'technology': 3.2,
            'marketing': 2.9,
            'consulting': 2.7,
            'education': 2.5,
            'healthcare': 2.1,
            'finance': 1.9,
            'real-estate': 1.8,
            'legal': 1.6,
            'manufacturing': 1.4,
            'retail': 1.3,
            'nonprofit': 1.2,
            'other': 2.0
        };
        
        // Apply content type multiplier
        adjustedEngagementRate *= contentMultipliers[contentType] || 1.0;
        
        // Apply industry adjustment
        const industryBenchmark = industryBenchmarks[industry] || 2.0;
        const industryMultiplier = Math.min(1.5, Math.max(0.7, industryBenchmark / 2.0));
        adjustedEngagementRate *= industryMultiplier;
        
        // Time optimization
        const timeMultiplier = getTimeMultiplier(postingDay, postingTime);
        adjustedEngagementRate *= timeMultiplier;
        
        // Quality factors
        let qualityMultiplier = 1.0;
        if (hasHashtags) qualityMultiplier += 0.15;
        if (hasMentions) qualityMultiplier += 0.12;
        if (hasCTA) qualityMultiplier += 0.18;
        if (hasQuestion) qualityMultiplier += 0.20;
        
        adjustedEngagementRate *= qualityMultiplier;
        
        // Calculate reach (impressions)
        const reachRate = Math.min(0.4, 0.1 + (adjustedEngagementRate * 2));
        prediction.impressions = Math.round(followerCount * reachRate);
        
        // Calculate total engagement
        prediction.totalEngagement = Math.round(prediction.impressions * adjustedEngagementRate);
        
        // Break down engagement types (based on LinkedIn patterns)
        prediction.likes = Math.round(prediction.totalEngagement * 0.75);
        prediction.comments = Math.round(prediction.totalEngagement * 0.18);
        prediction.shares = Math.round(prediction.totalEngagement * 0.07);
        
        // Final engagement rate
        prediction.engagementRate = (prediction.totalEngagement / prediction.impressions) * 100;
        
        // Optimization score
        prediction.optimizationScore = calculateOptimizationScore(
            contentType, timeMultiplier, qualityMultiplier, industryMultiplier
        );
        
        // Generate recommendations
        prediction.recommendations = generateRecommendations(
            contentType, postingDay, postingTime, hasHashtags, hasMentions, hasCTA, hasQuestion, prediction.optimizationScore
        );
        
        // Time optimization feedback
        prediction.timeOptimization = getTimeOptimizationFeedback(postingDay, postingTime, timeMultiplier);
        
        // Industry benchmark
        prediction.industryBenchmark = industryBenchmark;
        
        return prediction;
    }
    
    function getTimeMultiplier(day, hour) {
        // Optimal days: Tuesday (1.2), Wednesday (1.15), Thursday (1.1)
        const dayMultipliers = {
            'monday': 0.9,
            'tuesday': 1.2,
            'wednesday': 1.15,
            'thursday': 1.1,
            'friday': 0.95,
            'saturday': 0.6,
            'sunday': 0.65
        };
        
        // Optimal hours: 8-10 AM (1.2), 12-2 PM (1.15), 5-6 PM (1.1)
        let hourMultiplier = 0.8; // Base for non-optimal hours
        
        if (hour >= 8 && hour <= 10) {
            hourMultiplier = 1.2;
        } else if (hour >= 12 && hour <= 14) {
            hourMultiplier = 1.15;
        } else if (hour >= 17 && hour <= 18) {
            hourMultiplier = 1.1;
        } else if (hour >= 11 && hour <= 11) {
            hourMultiplier = 1.05;
        } else if (hour >= 15 && hour <= 16) {
            hourMultiplier = 1.0;
        } else if (hour >= 7 && hour <= 7) {
            hourMultiplier = 0.95;
        } else if (hour >= 19 && hour <= 20) {
            hourMultiplier = 0.9;
        }
        
        return (dayMultipliers[day] || 0.8) * hourMultiplier;
    }
    
    function calculateOptimizationScore(contentType, timeMultiplier, qualityMultiplier, industryMultiplier) {
        const contentScore = {
            'video': 95,
            'carousel': 85,
            'poll': 80,
            'image': 70,
            'document': 65,
            'article': 60,
            'text': 50
        }[contentType] || 50;
        
        const timeScore = Math.min(100, timeMultiplier * 70);
        const qualityScore = Math.min(100, (qualityMultiplier - 1) * 200 + 50);
        const industryScore = Math.min(100, industryMultiplier * 70);
        
        return Math.round((contentScore * 0.3) + (timeScore * 0.25) + (qualityScore * 0.25) + (industryScore * 0.2));
    }
    
    function generateRecommendations(contentType, day, hour, hasHashtags, hasMentions, hasCTA, hasQuestion, optimizationScore) {
        const recommendations = [];
        
        // Content type recommendations
        if (contentType === 'text') {
            recommendations.push('Consider adding an image or video to increase engagement by 80-200%');
        }
        if (contentType === 'article') {
            recommendations.push('Promote your article with a separate post to increase visibility');
        }
        
        // Timing recommendations
        if (day === 'saturday' || day === 'sunday') {
            recommendations.push('Post on Tuesday-Thursday for 40-60% higher engagement');
        }
        if (hour < 7 || hour > 20) {
            recommendations.push('Post during business hours (8 AM - 6 PM) for better visibility');
        }
        
        // Quality factor recommendations
        if (!hasHashtags) {
            recommendations.push('Add 3-5 relevant hashtags to increase discoverability by 15%');
        }
        if (!hasCTA) {
            recommendations.push('Include a clear call-to-action to boost engagement by 18%');
        }
        if (!hasQuestion) {
            recommendations.push('End with a question to encourage comments and discussions');
        }
        if (!hasMentions) {
            recommendations.push('Tag relevant people or companies to expand your reach');
        }
        
        // Performance-based recommendations
        if (optimizationScore < 60) {
            recommendations.push('Consider switching to video content for 3x higher engagement');
            recommendations.push('Post during peak hours (8-10 AM or 12-2 PM) for maximum visibility');
        }
        
        return recommendations.slice(0, 4); // Limit to top 4 recommendations
    }
    
    function getTimeOptimizationFeedback(day, hour, multiplier) {
        if (multiplier >= 1.15) {
            return 'Excellent timing! This is a peak engagement window.';
        } else if (multiplier >= 1.0) {
            return 'Good timing. Consider posting slightly earlier for better results.';
        } else if (multiplier >= 0.8) {
            return 'Moderate timing. Try Tuesday-Thursday 8-10 AM for 20-40% more engagement.';
        } else {
            return 'Poor timing. Weekend and off-hours get 40-60% less engagement.';
        }
    }
    
    // ===== RESULTS DISPLAY =====
    function displayResults(prediction) {
        const engagementColor = getEngagementColor(prediction.engagementRate);
        const optimizationColor = getOptimizationColor(prediction.optimizationScore);
        
        resultContent.innerHTML = `
            <div class="bg-broder border border-accent rounded-lg p-6">
                <div class="text-center mb-6">
                    <div class="text-4xl font-bold text-primary mb-2">${prediction.totalEngagement.toLocaleString()}</div>
                    <div class="text-lg text-light">Predicted Total Engagement</div>
                    <div class="text-sm text-accent mt-1">${prediction.engagementRate.toFixed(1)}% engagement rate</div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-3">Engagement Breakdown</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-text flex items-center gap-2">
                                    <span class="material-icons text-sm">thumb_up</span>
                                    Likes
                                </span>
                                <span class="text-accent font-medium">${prediction.likes.toLocaleString()}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-text flex items-center gap-2">
                                    <span class="material-icons text-sm">comment</span>
                                    Comments
                                </span>
                                <span class="text-accent font-medium">${prediction.comments.toLocaleString()}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-text flex items-center gap-2">
                                    <span class="material-icons text-sm">share</span>
                                    Shares
                                </span>
                                <span class="text-accent font-medium">${prediction.shares.toLocaleString()}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-text flex items-center gap-2">
                                    <span class="material-icons text-sm">visibility</span>
                                    Impressions
                                </span>
                                <span class="text-accent font-medium">${prediction.impressions.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-3">Performance Analysis</h3>
                        <div class="space-y-2 text-sm">
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Optimization Score:</strong> 
                                <span class="${sanitizeText(optimizationColor)}">${sanitizeText(prediction.optimizationScore)}/100</span>
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Engagement Rate:</strong> 
                                <span class="${sanitizeText(engagementColor)}">${prediction.engagementRate.toFixed(1)}%</span>
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Industry Benchmark:</strong> ${sanitizeText(prediction.industryBenchmark)}%
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Timing:</strong> ${sanitizeText(prediction.timeOptimization)}
                            </div>
                        </div>
                    </div>
                </div>
                
                ${prediction.recommendations.length > 0 ? `
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">ðŸ’¡ Optimization Recommendations</h3>
                    <ul class="space-y-2">
                        ${prediction.recommendations.map(rec => `
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
                        <h4 class="text-primary font-semibold mb-2">ðŸ“Š Performance vs Industry</h4>
                        <div class="text-sm text-text">
                            ${prediction.engagementRate > prediction.industryBenchmark ? 
                                `<span class="text-green-400">Above average!</span> Your predicted ${prediction.engagementRate.toFixed(1)}% beats the ${sanitizeText(prediction.industryBenchmark)}% industry benchmark.` :
                                `<span class="text-yellow-400">Room for improvement.</span> Industry average is ${sanitizeText(prediction.industryBenchmark)}%, you're predicted at ${prediction.engagementRate.toFixed(1)}%.`
                            }
                        </div>
                    </div>
                    <div class="bg-dark border border-accent rounded p-4">
                        <h4 class="text-primary font-semibold mb-2">ðŸŽ¯ Reach Potential</h4>
                        <div class="text-sm text-text">
                            Your post could reach <strong>${prediction.impressions.toLocaleString()}</strong> people 
                            (${((prediction.impressions / parseInt(followerCountInput.value)) * 100).toFixed(1)}% of your network)
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 text-center">
                    <div class="text-primary font-semibold mb-2">ðŸš€ LinkedIn Success Prediction</div>
                    <div class="text-sm text-text">
                        Expected <strong>${prediction.totalEngagement.toLocaleString()} total engagements</strong> 
                        with <strong>${prediction.engagementRate.toFixed(1)}% engagement rate</strong>
                        ${prediction.optimizationScore >= 80 ? ' - Excellent optimization!' : 
                          prediction.optimizationScore >= 60 ? ' - Good potential for improvement.' : 
                          ' - Significant optimization opportunities available.'}
                    </div>
                </div>
            </div>
        `;
    }
    
    function getEngagementColor(rate) {
        if (rate >= 4.0) return 'text-green-400';
        if (rate >= 2.5) return 'text-yellow-400';
        if (rate >= 1.5) return 'text-orange-400';
        return 'text-red-400';
    }
    
    function getOptimizationColor(score) {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    }
});
