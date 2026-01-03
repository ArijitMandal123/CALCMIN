// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`n// Recurring Subscription Savings Tracker Script

// Popup functionality
function showPopup(message) {
    document.getElementById('popupMessage').textContent = message;
    document.getElementById('customPopup').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('customPopup').classList.add('hidden');
}

// Close popup when clicking outside
document.getElementById('customPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// ===== SUBSCRIPTION MANAGEMENT =====
function addSubscription() {
    const subscriptionsList = document.getElementById('subscriptionsList');
    const newSubscription = document.createElement('div');
    newSubscription.className = 'subscription-item grid md:grid-cols-4 gap-4 p-4 bg-dark/50 rounded-lg border border-accent/20';
    newSubscription.innerHTML = `
        <input type="text" placeholder="Service Name" class="subscription-name px-3 py-2 bg-dark border border-accent/30 rounded text-text focus:border-primary focus:outline-none">
        <input type="number" placeholder="Monthly Cost" step="0.01" class="subscription-cost px-3 py-2 bg-dark border border-accent/30 rounded text-text focus:border-primary focus:outline-none">
        <select class="subscription-frequency px-3 py-2 bg-dark border border-accent/30 rounded text-text focus:border-primary focus:outline-none">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
            <option value="quarterly">Quarterly</option>
        </select>
        <button type="button" onclick="removeSubscription(this)" class="px-3 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition">
            <span class="material-icons">delete</span>
        </button>
    `;
    subscriptionsList.appendChild(newSubscription);
}

function removeSubscription(button) {
    button.closest('.subscription-item').remove();
}

// ===== DATA COLLECTION =====
function collectSubscriptionData() {
    const subscriptions = [];
    const subscriptionItems = document.querySelectorAll('.subscription-item');
    
    subscriptionItems.forEach(item => {
        const name = item.querySelector('.subscription-name').value.trim();
        const cost = parseFloat(item.querySelector('.subscription-cost').value) || 0;
        const frequency = item.querySelector('.subscription-frequency').value;
        
        if (name && cost > 0) {
            subscriptions.push({ name, cost, frequency });
        }
    });
    
    return {
        subscriptions: subscriptions,
        reviewFrequency: document.getElementById('reviewFrequency').value,
        householdSize: parseInt(document.getElementById('householdSize').value) || 1,
        entertainmentBudget: parseFloat(document.getElementById('entertainmentBudget').value) || 0,
        freeTrials: parseInt(document.getElementById('freeTrials').value) || 0,
        managementStyle: document.getElementById('managementStyle').value,
        usageLevel: document.getElementById('usageLevel').value
    };
}

// ===== CALCULATION LOGIC =====
function analyzeSubscriptions(data) {
    // Convert all subscriptions to monthly cost
    const monthlySubscriptions = data.subscriptions.map(sub => {
        let monthlyCost = sub.cost;
        switch (sub.frequency) {
            case 'yearly':
                monthlyCost = sub.cost / 12;
                break;
            case 'weekly':
                monthlyCost = sub.cost * 4.33;
                break;
            case 'quarterly':
                monthlyCost = sub.cost / 3;
                break;
        }
        return { ...sub, monthlyCost };
    });
    
    const totalMonthlyCost = monthlySubscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);
    const totalAnnualCost = totalMonthlyCost * 12;
    
    // Estimate hidden subscriptions based on user profile
    const hiddenSubscriptions = estimateHiddenSubscriptions(data, totalMonthlyCost);
    
    // Calculate potential savings
    const savingsOpportunities = calculateSavingsOpportunities(data, monthlySubscriptions, hiddenSubscriptions);
    
    // Generate recommendations
    const recommendations = generateRecommendations(data, monthlySubscriptions, savingsOpportunities);
    
    // Calculate industry benchmarks
    const benchmarks = calculateBenchmarks(data.householdSize, totalMonthlyCost);
    
    return {
        current: {
            subscriptions: monthlySubscriptions,
            monthlyTotal: totalMonthlyCost,
            annualTotal: totalAnnualCost,
            averagePerService: totalMonthlyCost / Math.max(monthlySubscriptions.length, 1)
        },
        hidden: hiddenSubscriptions,
        savings: savingsOpportunities,
        recommendations: recommendations,
        benchmarks: benchmarks,
        analysis: generateDetailedAnalysis(data, monthlySubscriptions, totalMonthlyCost)
    };
}

function estimateHiddenSubscriptions(data, currentTotal) {
    let hiddenEstimate = 0;
    let hiddenCount = 0;
    
    // Base hidden subscriptions based on management style
    const managementMultipliers = {
        'organized': 0.1,
        'moderate': 0.25,
        'casual': 0.4,
        'chaotic': 0.6
    };
    
    const baseHidden = currentTotal * managementMultipliers[data.managementStyle];
    hiddenEstimate += baseHidden;
    hiddenCount += Math.ceil(data.subscriptions.length * managementMultipliers[data.managementStyle]);
    
    // Add estimate based on free trials
    const trialConversionRate = 0.7; // 70% of free trials convert to paid
    const avgTrialCost = 12; // Average monthly cost of converted trials
    hiddenEstimate += data.freeTrials * trialConversionRate * avgTrialCost;
    hiddenCount += Math.ceil(data.freeTrials * trialConversionRate);
    
    // Add household size factor
    if (data.householdSize > 2) {
        hiddenEstimate += (data.householdSize - 2) * 15; // $15 per additional person
        hiddenCount += data.householdSize - 2;
    }
    
    return {
        estimatedMonthlyCost: hiddenEstimate,
        estimatedAnnualCost: hiddenEstimate * 12,
        estimatedCount: hiddenCount,
        confidence: getConfidenceLevel(data.managementStyle)
    };
}

function calculateSavingsOpportunities(data, subscriptions, hidden) {
    const opportunities = [];
    
    // Duplicate service detection
    const categories = categorizeSubscriptions(subscriptions);
    Object.entries(categories).forEach(([category, subs]) => {
        if (subs.length > 1) {
            const totalCost = subs.reduce((sum, sub) => sum + sub.monthlyCost, 0);
            const keepBest = Math.max(...subs.map(sub => sub.monthlyCost));
            const savings = totalCost - keepBest;
            
            if (savings > 5) {
                opportunities.push({
                    type: 'duplicate',
                    category: category,
                    description: `Multiple ${sanitizeText(category)} subscriptions detected`,
                    monthlySavings: savings,
                    annualSavings: savings * 12,
                    services: subs.map(s => s.name)
                });
            }
        }
    });
    
    // Underutilized services based on usage level
    const usageMultipliers = {
        'heavy': 0.1,
        'moderate': 0.25,
        'light': 0.4,
        'minimal': 0.6
    };
    
    const underutilizedSavings = subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0) * usageMultipliers[data.usageLevel];
    
    if (underutilizedSavings > 10) {
        opportunities.push({
            type: 'underutilized',
            description: 'Services you rarely use',
            monthlySavings: underutilizedSavings,
            annualSavings: underutilizedSavings * 12,
            confidence: 'medium'
        });
    }
    
    // Annual billing savings
    const monthlyBilledServices = subscriptions.filter(sub => sub.frequency === 'monthly');
    const annualSavings = monthlyBilledServices.reduce((sum, sub) => sum + (sub.monthlyCost * 0.15), 0);
    
    if (annualSavings > 5) {
        opportunities.push({
            type: 'billing-frequency',
            description: 'Switch to annual billing for discounts',
            monthlySavings: annualSavings,
            annualSavings: annualSavings * 12,
            services: monthlyBilledServices.map(s => s.name)
        });
    }
    
    // Hidden subscription cleanup
    if (hidden.estimatedMonthlyCost > 0) {
        opportunities.push({
            type: 'hidden',
            description: 'Cancel forgotten subscriptions',
            monthlySavings: hidden.estimatedMonthlyCost,
            annualSavings: hidden.estimatedAnnualCost,
            confidence: hidden.confidence
        });
    }
    
    return opportunities;
}

function categorizeSubscriptions(subscriptions) {
    const categories = {
        'streaming': [],
        'music': [],
        'fitness': [],
        'productivity': [],
        'news': [],
        'gaming': [],
        'other': []
    };
    
    const categoryKeywords = {
        'streaming': ['netflix', 'hulu', 'disney', 'hbo', 'amazon prime', 'paramount', 'peacock', 'apple tv'],
        'music': ['spotify', 'apple music', 'youtube music', 'pandora', 'tidal', 'amazon music'],
        'fitness': ['peloton', 'nike', 'fitness', 'gym', 'yoga', 'workout', 'health'],
        'productivity': ['office', 'adobe', 'canva', 'notion', 'slack', 'zoom', 'dropbox', 'google'],
        'news': ['news', 'times', 'post', 'journal', 'magazine', 'economist', 'atlantic'],
        'gaming': ['xbox', 'playstation', 'nintendo', 'steam', 'epic', 'gaming', 'twitch']
    };
    
    subscriptions.forEach(sub => {
        const name = sub.name.toLowerCase();
        let categorized = false;
        
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => name.includes(keyword))) {
                categories[category].push(sub);
                categorized = true;
                break;
            }
        }
        
        if (!categorized) {
            categories.other.push(sub);
        }
    });
    
    return categories;
}

function generateRecommendations(data, subscriptions, opportunities) {
    const recommendations = [];
    
    // High-impact recommendations
    const totalPotentialSavings = opportunities.reduce((sum, opp) => sum + opp.monthlySavings, 0);
    
    if (totalPotentialSavings > 50) {
        recommendations.push({
            priority: 'High',
            category: 'Immediate Action',
            action: 'Conduct comprehensive subscription audit',
            impact: `Save up to $${Math.round(totalPotentialSavings * 12).toLocaleString()} annually`,
            timeframe: 'This week'
        });
    }
    
    // Management style recommendations
    if (data.managementStyle === 'chaotic' || data.managementStyle === 'casual') {
        recommendations.push({
            priority: 'High',
            category: 'Organization',
            action: 'Set up subscription tracking system',
            impact: 'Prevent future subscription creep and forgotten charges',
            timeframe: 'Next 30 days'
        });
    }
    
    // Review frequency recommendations
    if (data.reviewFrequency === 'never' || data.reviewFrequency === 'yearly') {
        recommendations.push({
            priority: 'Medium',
            category: 'Maintenance',
            action: 'Schedule quarterly subscription reviews',
            impact: 'Maintain optimal subscription portfolio',
            timeframe: 'Ongoing'
        });
    }
    
    // Budget recommendations
    const currentTotal = subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);
    if (currentTotal > data.entertainmentBudget * 2) {
        recommendations.push({
            priority: 'Medium',
            category: 'Budgeting',
            action: 'Align subscriptions with entertainment budget',
            impact: 'Better financial control and conscious spending',
            timeframe: 'Next month'
        });
    }
    
    // Free trial management
    if (data.freeTrials > 3) {
        recommendations.push({
            priority: 'Medium',
            category: 'Trial Management',
            action: 'Implement 48-hour waiting period before starting trials',
            impact: 'Reduce impulsive subscription sign-ups',
            timeframe: 'Immediate'
        });
    }
    
    return recommendations;
}

function calculateBenchmarks(householdSize, currentTotal) {
    // Industry benchmarks based on household size
    const benchmarks = {
        1: { low: 45, average: 85, high: 150 },
        2: { low: 75, average: 140, high: 220 },
        3: { low: 95, average: 180, high: 280 },
        4: { low: 115, average: 220, high: 340 }
    };
    
    const householdBenchmark = benchmarks[Math.min(householdSize, 4)] || benchmarks[4];
    
    let category = 'average';
    if (currentTotal < householdBenchmark.low) category = 'low';
    else if (currentTotal > householdBenchmark.high) category = 'high';
    
    return {
        householdSize,
        currentSpending: currentTotal,
        benchmarks: householdBenchmark,
        category,
        percentile: calculatePercentile(currentTotal, householdBenchmark)
    };
}

function calculatePercentile(current, benchmarks) {
    if (current <= benchmarks.low) return Math.round((current / benchmarks.low) * 25);
    if (current <= benchmarks.average) return Math.round(25 + ((current - benchmarks.low) / (benchmarks.average - benchmarks.low)) * 25);
    if (current <= benchmarks.high) return Math.round(50 + ((current - benchmarks.average) / (benchmarks.high - benchmarks.average)) * 35);
    return Math.min(95, Math.round(85 + ((current - benchmarks.high) / benchmarks.high) * 10));
}

function generateDetailedAnalysis(data, subscriptions, totalCost) {
    const analysis = {
        subscriptionDensity: subscriptions.length / data.householdSize,
        averageCostPerService: totalCost / Math.max(subscriptions.length, 1),
        budgetAlignment: totalCost / Math.max(data.entertainmentBudget, 1),
        managementRisk: getManagementRisk(data.managementStyle, data.reviewFrequency),
        optimizationPotential: getOptimizationPotential(data.usageLevel, subscriptions.length)
    };
    
    return analysis;
}

function getConfidenceLevel(managementStyle) {
    const confidence = {
        'organized': 'low',
        'moderate': 'medium',
        'casual': 'high',
        'chaotic': 'very high'
    };
    return confidence[managementStyle] || 'medium';
}

function getManagementRisk(style, frequency) {
    const styleRisk = { 'organized': 1, 'moderate': 2, 'casual': 3, 'chaotic': 4 };
    const frequencyRisk = { 'monthly': 1, 'quarterly': 2, 'yearly': 3, 'never': 4 };
    
    const totalRisk = styleRisk[style] + frequencyRisk[frequency];
    
    if (totalRisk <= 3) return 'Low';
    if (totalRisk <= 5) return 'Medium';
    if (totalRisk <= 7) return 'High';
    return 'Critical';
}

function getOptimizationPotential(usageLevel, subscriptionCount) {
    const usageScore = { 'heavy': 1, 'moderate': 2, 'light': 3, 'minimal': 4 };
    const countScore = subscriptionCount > 10 ? 3 : subscriptionCount > 5 ? 2 : 1;
    
    const totalScore = usageScore[usageLevel] + countScore;
    
    if (totalScore <= 3) return 'Low';
    if (totalScore <= 5) return 'Medium';
    return 'High';
}

// ===== RESULTS DISPLAY =====
function displayResults(results) {
    const resultsDiv = document.getElementById('result-content');
    
    function sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    resultsDiv.innerHTML = `
        <!-- Current Spending Overview -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-dark/50 rounded-lg p-6 border border-accent/20 text-center">
                <h3 class="text-lg font-semibold text-primary mb-2">Monthly Total</h3>
                <p class="text-3xl font-bold text-accent">$${sanitizeHtml(results.current.monthlyTotal.toFixed(2))}</p>
                <p class="text-sm text-light mt-2">${sanitizeHtml(results.current.subscriptions.length.toString())} active subscriptions</p>
            </div>
            <div class="bg-dark/50 rounded-lg p-6 border border-accent/20 text-center">
                <h3 class="text-lg font-semibold text-primary mb-2">Annual Total</h3>
                <p class="text-3xl font-bold text-accent">$${sanitizeHtml(results.current.annualTotal.toFixed(2))}</p>
                <p class="text-sm text-light mt-2">Average $${sanitizeHtml(results.current.averagePerService.toFixed(2))} per service</p>
            </div>
            <div class="bg-dark/50 rounded-lg p-6 border border-accent/20 text-center">
                <h3 class="text-lg font-semibold text-primary mb-2">Spending Percentile</h3>
                <p class="text-3xl font-bold text-accent">${sanitizeHtml(results.benchmarks.percentile.toString())}th</p>
                <p class="text-sm text-light mt-2">Compared to similar households</p>
            </div>
        </div>

        <!-- Hidden Subscriptions Estimate -->
        ${results.hidden.estimatedMonthlyCost > 0 ? `
        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
            <h3 class="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                <span class="material-icons mr-2">visibility_off</span>
                Estimated Hidden Subscriptions
            </h3>
            <div class="grid md:grid-cols-3 gap-4">
                <div>
                    <p class="text-sm text-light">Estimated Monthly Cost</p>
                    <p class="text-2xl font-bold text-yellow-400">$${sanitizeHtml(results.hidden.estimatedMonthlyCost.toFixed(2))}</p>
                </div>
                <div>
                    <p class="text-sm text-light">Estimated Annual Cost</p>
                    <p class="text-2xl font-bold text-yellow-400">$${sanitizeHtml(results.hidden.estimatedAnnualCost.toFixed(2))}</p>
                </div>
                <div>
                    <p class="text-sm text-light">Confidence Level</p>
                    <p class="text-lg font-semibold text-yellow-400 capitalize">${sanitizeHtml(results.hidden.confidence)}</p>
                </div>
            </div>
            <p class="text-light text-sm mt-4">Based on your management style and habits, you likely have ${sanitizeHtml(results.hidden.estimatedCount.toString())} forgotten subscriptions.</p>
        </div>
        ` : ''}

        <!-- Savings Opportunities -->
        <div class="mb-8">
            <h3 class="text-xl font-bold text-primary mb-6">Savings Opportunities</h3>
            <div class="space-y-4">
                ${results.savings.map(opportunity => `
                    <div class="bg-dark/50 rounded-lg p-6 border border-green-500/30">
                        <div class="flex justify-between items-start mb-3">
                            <h4 class="font-semibold text-green-400 capitalize">${sanitizeHtml(opportunity.type.replace('-', ' '))}</h4>
                            <div class="text-right">
                                <p class="text-green-400 font-bold">$${sanitizeHtml(opportunity.monthlySavings.toFixed(2))}/month</p>
                                <p class="text-sm text-light">$${sanitizeHtml(opportunity.annualSavings.toFixed(2))}/year</p>
                            </div>
                        </div>
                        <p class="text-light text-sm mb-2">${sanitizeHtml(opportunity.description)}</p>
                        ${opportunity.services ? `
                            <p class="text-xs text-accent">Affected services: ${sanitizeHtml(opportunity.services.join(', '))}</p>
                        ` : ''}
                        ${opportunity.confidence ? `
                            <p class="text-xs text-light mt-2">Confidence: ${sanitizeHtml(opportunity.confidence)}</p>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            
            <div class="bg-gradient-to-r from-green-500/10 to-primary/10 rounded-lg p-6 mt-6 border border-green-500/20">
                <h4 class="text-lg font-semibold text-green-400 mb-2">Total Potential Savings</h4>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <p class="text-2xl font-bold text-green-400">$${sanitizeHtml(results.savings.reduce((sum, opp) => sum + opp.monthlySavings, 0).toFixed(2))}</p>
                        <p class="text-sm text-light">Per Month</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-green-400">$${sanitizeHtml(results.savings.reduce((sum, opp) => sum + opp.annualSavings, 0).toFixed(2))}</p>
                        <p class="text-sm text-light">Per Year</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Current Subscriptions Breakdown -->
        <div class="mb-8">
            <h3 class="text-xl font-bold text-primary mb-6">Your Current Subscriptions</h3>
            <div class="space-y-3">
                ${results.current.subscriptions.map(sub => `
                    <div class="flex justify-between items-center p-4 bg-dark/50 rounded-lg border border-accent/20">
                        <div>
                            <h4 class="font-semibold text-text">${sanitizeHtml(sub.name)}</h4>
                            <p class="text-sm text-light capitalize">${sanitizeHtml(sub.frequency)} billing</p>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-accent">$${sanitizeHtml(sub.monthlyCost.toFixed(2))}/month</p>
                            <p class="text-sm text-light">$${sanitizeHtml((sub.monthlyCost * 12).toFixed(2))}/year</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Benchmark Comparison -->
        <div class="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-8 border border-primary/20">
            <h3 class="text-xl font-bold text-primary mb-4">Spending Comparison</h3>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                    <p class="text-sm text-light">Low Spenders</p>
                    <p class="text-lg font-semibold text-green-400">$${sanitizeHtml(results.benchmarks.benchmarks.low.toString())}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm text-light">Average Spenders</p>
                    <p class="text-lg font-semibold text-yellow-400">$${sanitizeHtml(results.benchmarks.benchmarks.average.toString())}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm text-light">High Spenders</p>
                    <p class="text-lg font-semibold text-red-400">$${sanitizeHtml(results.benchmarks.benchmarks.high.toString())}</p>
                </div>
            </div>
            <div class="mt-4 text-center">
                <p class="text-light">Your spending: <span class="font-semibold text-primary">$${sanitizeHtml(results.benchmarks.currentSpending.toFixed(2))}</span> 
                (${sanitizeHtml(results.benchmarks.category)} spender)</p>
            </div>
        </div>

        <!-- Recommendations -->
        <div class="mb-8">
            <h3 class="text-xl font-bold text-primary mb-6">Personalized Recommendations</h3>
            <div class="space-y-4">
                ${results.recommendations.map(rec => `
                    <div class="bg-dark/50 rounded-lg p-6 border border-accent/20">
                        <div class="flex justify-between items-start mb-3">
                            <h4 class="font-semibold text-accent">${sanitizeHtml(rec.category)}</h4>
                            <span class="px-2 py-1 text-xs rounded ${rec.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}">${sanitizeHtml(rec.priority)}</span>
                        </div>
                        <p class="text-light mb-2">${sanitizeHtml(rec.action)}</p>
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-primary font-medium">${sanitizeHtml(rec.impact)}</span>
                            <span class="text-light">${sanitizeHtml(rec.timeframe)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Analysis Summary -->
        <div class="bg-broder/50 rounded-lg p-6 border border-accent/20">
            <h3 class="text-xl font-bold text-primary mb-4">Analysis Summary</h3>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-semibold text-accent mb-2">Risk Assessment</h4>
                    <p class="text-light text-sm mb-1">Management Risk: <span class="text-primary">${sanitizeHtml(results.analysis.managementRisk)}</span></p>
                    <p class="text-light text-sm mb-1">Optimization Potential: <span class="text-primary">${sanitizeHtml(results.analysis.optimizationPotential)}</span></p>
                    <p class="text-light text-sm">Subscription Density: <span class="text-primary">${sanitizeHtml(results.analysis.subscriptionDensity.toFixed(1))} per person</span></p>
                </div>
                <div>
                    <h4 class="font-semibold text-accent mb-2">Key Metrics</h4>
                    <p class="text-light text-sm mb-1">Budget Alignment: <span class="text-primary">${sanitizeHtml((results.analysis.budgetAlignment * 100).toFixed(0))}%</span></p>
                    <p class="text-light text-sm mb-1">Avg Cost/Service: <span class="text-primary">$${sanitizeHtml(results.analysis.averageCostPerService.toFixed(2))}</span></p>
                    <p class="text-light text-sm">Total Services: <span class="text-primary">${sanitizeHtml(results.current.subscriptions.length.toString())}</span></p>
                </div>
            </div>
        </div>
    `;

    // Show results section
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ===== EVENT HANDLERS =====
document.getElementById('subscriptionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = collectSubscriptionData();
    
    // Validation
    if (data.subscriptions.length === 0) {
        showPopup('Please add at least one subscription to analyze.');
        return;
    }
    
    if (data.householdSize < 1 || data.householdSize > 10) {
        showPopup('Please enter a valid household size between 1 and 10.');
        return;
    }
    
    const results = analyzeSubscriptions(data);
    displayResults(results);
});


