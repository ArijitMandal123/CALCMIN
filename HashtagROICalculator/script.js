// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('hashtag-form');
    const avgImpressionsInput = document.getElementById('avg-impressions');
    const conversionRateInput = document.getElementById('conversion-rate');
    const customerValueInput = document.getElementById('customer-value');
    const contentCostInput = document.getElementById('content-cost');
    const platformSelect = document.getElementById('platform');
    const addHashtagBtn = document.getElementById('add-hashtag');
    const hashtagInputsContainer = document.getElementById('hashtag-inputs');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');
    
    let hashtagCount = 1;
    const maxHashtags = 10;
    
    // Add hashtag input functionality
    addHashtagBtn.addEventListener('click', function() {
        if (hashtagCount < maxHashtags) {
            const newHashtagGroup = document.createElement('div');
            newHashtagGroup.className = 'hashtag-input-group grid grid-cols-3 gap-2';
            newHashtagGroup.innerHTML = `
                <input
                  type="text"
                  placeholder="#hashtag"
                  class="hashtag-name w-full px-3 py-2 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Impressions"
                  class="hashtag-impressions w-full px-3 py-2 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Conversions"
                  class="hashtag-conversions w-full px-3 py-2 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
            `;
            hashtagInputsContainer.appendChild(newHashtagGroup);
            hashtagCount++;
            
            if (hashtagCount >= maxHashtags) {
                addHashtagBtn.style.display = 'none';
            }
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const avgImpressions = parseInt(avgImpressionsInput.value);
        const conversionRate = parseFloat(conversionRateInput.value);
        const customerValue = parseFloat(customerValueInput.value);
        const contentCost = parseFloat(contentCostInput.value);
        const platform = platformSelect.value;
        
        // Collect hashtag data
        const hashtags = [];
        const hashtagGroups = document.querySelectorAll('.hashtag-input-group');
        
        hashtagGroups.forEach(group => {
            const name = group.querySelector('.hashtag-name').value.trim();
            const impressions = parseInt(group.querySelector('.hashtag-impressions').value) || 0;
            const conversions = parseInt(group.querySelector('.hashtag-conversions').value) || 0;
            
            if (name && (impressions > 0 || conversions > 0)) {
                hashtags.push({
                    name: name.startsWith('#') ? name : '#' + name,
                    impressions: impressions || avgImpressions,
                    conversions: conversions
                });
            }
        });
        
        if (!avgImpressions || !conversionRate || !customerValue || !contentCost) {
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
        
        if (hashtags.length === 0) {
            resultContent.innerHTML = `
                <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <div class="flex items-center gap-2 text-red-400">
                        <span class="material-icons">error</span>
                        <span class="font-medium">Please add at least one hashtag with data</span>
                    </div>
                </div>
            `;
            resultsDiv.classList.remove('hidden');
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        const analysis = calculateHashtagROI(
            avgImpressions, conversionRate, customerValue, contentCost, platform, hashtags
        );
        
        displayResults(analysis);
        
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    // ===== HASHTAG ROI CALCULATION LOGIC =====
    function calculateHashtagROI(avgImpressions, baseConversionRate, customerValue, contentCost, platform, hashtags) {
        const analysis = {
            totalROI: 0,
            totalRevenue: 0,
            totalCost: contentCost,
            hashtagResults: [],
            platformMultiplier: 1.0,
            recommendations: [],
            summary: {}
        };
        
        // Platform-specific conversion multipliers
        const platformMultipliers = {
            'instagram': 1.0,
            'tiktok': 0.78,
            'twitter': 0.52,
            'linkedin': 1.35,
            'youtube': 0.65,
            'facebook': 0.61
        };
        
        analysis.platformMultiplier = platformMultipliers[platform] || 1.0;
        
        // Calculate ROI for each hashtag
        hashtags.forEach(hashtag => {
            const hashtagAnalysis = calculateIndividualHashtagROI(
                hashtag, baseConversionRate, customerValue, contentCost, analysis.platformMultiplier
            );
            analysis.hashtagResults.push(hashtagAnalysis);
            analysis.totalRevenue += hashtagAnalysis.revenue;
        });
        
        // Calculate overall ROI
        analysis.totalROI = ((analysis.totalRevenue - analysis.totalCost) / analysis.totalCost) * 100;
        
        // Sort hashtags by ROI
        analysis.hashtagResults.sort((a, b) => b.roi - a.roi);
        
        // Generate recommendations
        analysis.recommendations = generateROIRecommendations(analysis.hashtagResults, platform);
        
        // Create summary
        analysis.summary = createROISummary(analysis.hashtagResults, analysis.totalROI);
        
        return analysis;
    }
    
    function calculateIndividualHashtagROI(hashtag, baseConversionRate, customerValue, contentCost, platformMultiplier) {
        const result = {
            name: hashtag.name,
            impressions: hashtag.impressions,
            conversions: hashtag.conversions,
            conversionRate: 0,
            revenue: 0,
            costPerConversion: 0,
            roi: 0,
            efficiency: 0,
            performance: 'Poor'
        };
        
        // Calculate conversion rate
        if (hashtag.impressions > 0) {
            result.conversionRate = (hashtag.conversions / hashtag.impressions) * 100;
        } else {
            // Use base conversion rate if no impression data
            result.conversionRate = baseConversionRate * platformMultiplier;
            result.conversions = Math.round((result.conversionRate / 100) * hashtag.impressions);
        }
        
        // Calculate revenue
        result.revenue = result.conversions * customerValue;
        
        // Calculate cost per conversion
        if (result.conversions > 0) {
            result.costPerConversion = contentCost / result.conversions;
        } else {
            result.costPerConversion = contentCost;
        }
        
        // Calculate ROI
        if (contentCost > 0) {
            result.roi = ((result.revenue - contentCost) / contentCost) * 100;
        }
        
        // Calculate efficiency (revenue per 1000 impressions)
        if (result.impressions > 0) {
            result.efficiency = (result.revenue / result.impressions) * 1000;
        }
        
        // Determine performance level
        result.performance = getPerformanceLevel(result.roi);
        
        return result;
    }
    
    function getPerformanceLevel(roi) {
        if (roi >= 300) return 'Excellent';
        if (roi >= 200) return 'Very Good';
        if (roi >= 100) return 'Good';
        if (roi >= 50) return 'Fair';
        if (roi >= 0) return 'Poor';
        return 'Loss';
    }
    
    function generateROIRecommendations(hashtagResults, platform) {
        const recommendations = [];
        
        // Analyze top and bottom performers
        const topPerformers = hashtagResults.filter(h => h.roi >= 200);
        const poorPerformers = hashtagResults.filter(h => h.roi < 50);
        
        if (topPerformers.length > 0) {
            recommendations.push(`Focus more on high-ROI hashtags like ${topPerformers[0].name} (${topPerformers[0].roi.toFixed(0)}% ROI)`);
        }
        
        if (poorPerformers.length > 0) {
            recommendations.push(`Consider replacing low-ROI hashtags like ${poorPerformers[0].name} (${poorPerformers[0].roi.toFixed(0)}% ROI)`);
        }
        
        // Platform-specific recommendations
        const platformRecommendations = {
            'instagram': [
                'Use 8-15 hashtags per post for optimal reach',
                'Mix popular and niche hashtags (80/20 rule)',
                'Create branded hashtags for campaigns'
            ],
            'tiktok': [
                'Use 3-5 trending hashtags per video',
                'Focus on niche hashtags for better conversion',
                'Participate in hashtag challenges'
            ],
            'twitter': [
                'Limit to 1-2 hashtags per tweet',
                'Use hashtags in conversations and replies',
                'Monitor trending hashtags for opportunities'
            ],
            'linkedin': [
                'Use 3-5 professional hashtags',
                'Focus on industry-specific hashtags',
                'Avoid overly promotional hashtags'
            ],
            'youtube': [
                'Use hashtags in video descriptions',
                'Focus on searchable hashtags',
                'Use 3-5 relevant hashtags per video'
            ],
            'facebook': [
                'Use 1-2 hashtags per post',
                'Focus on community hashtags',
                'Use hashtags in Facebook groups'
            ]
        };
        
        const platformRecs = platformRecommendations[platform] || [];
        recommendations.push(...platformRecs.slice(0, 2));
        
        // General ROI recommendations
        const avgROI = hashtagResults.reduce((sum, h) => sum + h.roi, 0) / hashtagResults.length;
        
        if (avgROI < 100) {
            recommendations.push('Consider using more niche-specific hashtags for better conversion rates');
        }
        
        if (hashtagResults.some(h => h.conversionRate < 1)) {
            recommendations.push('Track conversions more accurately with unique promo codes or UTM parameters');
        }
        
        return recommendations.slice(0, 5);
    }
    
    function createROISummary(hashtagResults, totalROI) {
        const summary = {
            bestHashtag: null,
            worstHashtag: null,
            avgROI: 0,
            avgConversionRate: 0,
            totalConversions: 0,
            highPerformers: 0,
            lowPerformers: 0
        };
        
        if (hashtagResults.length > 0) {
            summary.bestHashtag = hashtagResults[0];
            summary.worstHashtag = hashtagResults[hashtagResults.length - 1];
            summary.avgROI = hashtagResults.reduce((sum, h) => sum + h.roi, 0) / hashtagResults.length;
            summary.avgConversionRate = hashtagResults.reduce((sum, h) => sum + h.conversionRate, 0) / hashtagResults.length;
            summary.totalConversions = hashtagResults.reduce((sum, h) => sum + h.conversions, 0);
            summary.highPerformers = hashtagResults.filter(h => h.roi >= 200).length;
            summary.lowPerformers = hashtagResults.filter(h => h.roi < 50).length;
        }
        
        return summary;
    }
    
    // ===== RESULTS DISPLAY =====
    function displayResults(analysis) {
        const roiColor = getROIColor(analysis.totalROI);
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        resultContent.innerHTML = `
            <div class="bg-broder border border-accent rounded-lg p-6">
                <div class="text-center mb-6">
                    <div class="text-4xl font-bold ${sanitizeText(roiColor)} mb-2">${analysis.totalROI.toFixed(1)}%</div>
                    <div class="text-lg text-light">Total Hashtag ROI</div>
                    <div class="text-sm text-accent mt-1">$${analysis.totalRevenue.toFixed(2)} revenue from $${analysis.totalCost.toFixed(2)} investment</div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-3">Top Performing Hashtags</h3>
                        <div class="space-y-2">
                            ${analysis.hashtagResults.slice(0, 5).map(hashtag => `
                                <div class="bg-dark border border-accent rounded p-3">
                                    <div class="flex items-center justify-between mb-1">
                                        <span class="text-text font-medium">${escapeHtml(hashtag.name)}</span>
                                        <span class="${getROIColor(hashtag.roi)} font-bold">${hashtag.roi.toFixed(0)}%</span>
                                    </div>
                                    <div class="text-xs text-light">
                                        ${sanitizeText(hashtag.conversions)} conversions â€¢ $${hashtag.revenue.toFixed(2)} revenue â€¢ ${hashtag.conversionRate.toFixed(2)}% rate
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-3">Performance Summary</h3>
                        <div class="space-y-2 text-sm">
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Best Hashtag:</strong> ${escapeHtml(analysis.summary.bestHashtag?.name || 'N/A')} 
                                (${analysis.summary.bestHashtag?.roi.toFixed(0) || 0}% ROI)
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Average ROI:</strong> ${analysis.summary.avgROI.toFixed(1)}%
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Total Conversions:</strong> ${sanitizeText(analysis.summary.totalConversions)}
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">High Performers:</strong> ${sanitizeText(analysis.summary.highPerformers)} hashtags (200%+ ROI)
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">ðŸ“Š Detailed Hashtag Analysis</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b border-accent">
                                    <th class="text-left py-2 text-accent">Hashtag</th>
                                    <th class="text-right py-2 text-accent">ROI</th>
                                    <th class="text-right py-2 text-accent">Revenue</th>
                                    <th class="text-right py-2 text-accent">Conversions</th>
                                    <th class="text-right py-2 text-accent">Conv. Rate</th>
                                    <th class="text-center py-2 text-accent">Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${analysis.hashtagResults.map(hashtag => `
                                    <tr class="border-b border-accent/30">
                                        <td class="py-2 text-text">${escapeHtml(hashtag.name)}</td>
                                        <td class="py-2 text-right ${getROIColor(hashtag.roi)} font-medium">${hashtag.roi.toFixed(0)}%</td>
                                        <td class="py-2 text-right text-text">$${hashtag.revenue.toFixed(2)}</td>
                                        <td class="py-2 text-right text-text">${sanitizeText(hashtag.conversions)}</td>
                                        <td class="py-2 text-right text-text">${hashtag.conversionRate.toFixed(2)}%</td>
                                        <td class="py-2 text-center">
                                            <span class="px-2 py-1 rounded text-xs ${getPerformanceBadgeColor(hashtag.performance)}">
                                                ${escapeHtml(hashtag.performance)}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                ${analysis.recommendations.length > 0 ? `
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">ðŸ’¡ ROI Optimization Recommendations</h3>
                    <ul class="space-y-2">
                        ${analysis.recommendations.map(rec => `
                            <li class="flex items-start gap-2 text-text">
                                <span class="material-icons text-yellow-400 text-sm mt-0.5">lightbulb</span>
                                ${escapeHtml(rec)}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-dark border border-accent rounded p-4">
                        <h4 class="text-primary font-semibold mb-2">ðŸ“ˆ ROI Insights</h4>
                        <div class="text-sm text-text">
                            ${analysis.totalROI > 200 ? 
                                `<span class="text-green-400">Excellent performance!</span> Your hashtags are generating strong returns.` :
                                analysis.totalROI > 100 ?
                                `<span class="text-yellow-400">Good performance.</span> Room for optimization with better hashtag selection.` :
                                `<span class="text-red-400">Needs improvement.</span> Focus on niche hashtags for better conversion rates.`
                            }
                        </div>
                    </div>
                    <div class="bg-dark border border-accent rounded p-4">
                        <h4 class="text-primary font-semibold mb-2">ðŸŽ¯ Next Steps</h4>
                        <div class="text-sm text-text">
                            ${analysis.summary.highPerformers > 0 ?
                                `Double down on your ${analysis.summary.highPerformers} high-performing hashtags and find similar ones.` :
                                `Research niche hashtags in your industry and test them systematically for better ROI.`
                            }
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 text-center">
                    <div class="text-primary font-semibold mb-2">ðŸš€ Hashtag ROI Analysis Complete</div>
                    <div class="text-sm text-text">
                        Total ROI: <strong>${analysis.totalROI.toFixed(1)}%</strong> â€¢ 
                        Revenue: <strong>$${analysis.totalRevenue.toFixed(2)}</strong> â€¢ 
                        Best Hashtag: <strong>${escapeHtml(analysis.summary.bestHashtag?.name || 'N/A')}</strong>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getROIColor(roi) {
        if (roi >= 300) return 'text-green-400';
        if (roi >= 200) return 'text-green-300';
        if (roi >= 100) return 'text-yellow-400';
        if (roi >= 50) return 'text-orange-400';
        if (roi >= 0) return 'text-red-400';
        return 'text-red-500';
    }
    
    function getPerformanceBadgeColor(performance) {
        const colors = {
            'Excellent': 'bg-green-500/20 text-green-400',
            'Very Good': 'bg-green-400/20 text-green-300',
            'Good': 'bg-yellow-500/20 text-yellow-400',
            'Fair': 'bg-orange-500/20 text-orange-400',
            'Poor': 'bg-red-500/20 text-red-400',
            'Loss': 'bg-red-600/20 text-red-500'
        };
        return colors[performance] || 'bg-gray-500/20 text-gray-400';
    }
});
