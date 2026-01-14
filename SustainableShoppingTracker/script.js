// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

let shoppingItems = [];

// Material impact factors (CO2 kg per dollar spent)
const materialImpact = {
    cotton: 0.8,
    polyester: 1.2,
    plastic: 1.5,
    metal: 0.6,
    wood: 0.3,
    glass: 0.4,
    paper: 0.2,
    leather: 1.0,
    organic: 0.4,
    recycled: 0.2
};

// Category impact multipliers
const categoryMultipliers = {
    clothing: 1.2,
    electronics: 2.0,
    home: 0.8,
    food: 0.5,
    personal: 0.7,
    books: 0.3,
    toys: 1.0,
    other: 1.0
};

// Purchase type impact reduction
const purchaseTypeReduction = {
    new: 1.0,
    secondhand: 0.2,
    refurbished: 0.3,
    rental: 0.1
};

// Packaging impact factors
const packagingImpact = {
    minimal: 0.1,
    recyclable: 0.3,
    biodegradable: 0.2,
    plastic: 0.8,
    excessive: 1.2
};

// Collect form data
function collectFormData() {
    return {
        itemName: document.getElementById('itemName').value,
        itemCategory: document.getElementById('itemCategory').value,
        itemCost: parseFloat(document.getElementById('itemCost').value) || 0,
        purchaseType: document.getElementById('purchaseType').value,
        primaryMaterial: document.getElementById('primaryMaterial').value,
        brandRating: parseInt(document.getElementById('brandRating').value),
        packagingType: document.getElementById('packagingType').value,
        expectedLifespan: parseInt(document.getElementById('expectedLifespan').value),
        trackingPeriod: document.getElementById('trackingPeriod').value,
        budgetGoal: parseFloat(document.getElementById('budgetGoal').value) || 500
    };
}

// Calculate item environmental impact
function calculateItemImpact(item) {
    // Base carbon footprint (kg CO2)
    let baseCO2 = item.itemCost * materialImpact[item.primaryMaterial] * categoryMultipliers[item.itemCategory];
    
    // Apply purchase type reduction
    baseCO2 *= purchaseTypeReduction[item.purchaseType];
    
    // Add packaging impact
    baseCO2 += item.itemCost * packagingImpact[item.packagingType] * 0.1;
    
    // Brand sustainability adjustment (1-5 scale, lower is worse)
    const brandMultiplier = (6 - item.brandRating) * 0.2;
    baseCO2 *= (1 + brandMultiplier);
    
    // Calculate waste generation (kg)
    let wasteGeneration = item.itemCost * 0.05; // Base: 50g per dollar
    if (item.purchaseType === 'secondhand') wasteGeneration *= 0.1;
    if (item.packagingType === 'excessive') wasteGeneration *= 2;
    
    // Calculate cost per year
    const costPerYear = item.itemCost / item.expectedLifespan;
    
    // Sustainability score (1-100)
    let sustainabilityScore = 50;
    sustainabilityScore += (item.brandRating - 3) * 15; // Brand rating impact
    sustainabilityScore += item.expectedLifespan * 3; // Longevity bonus
    if (item.purchaseType === 'secondhand') sustainabilityScore += 20;
    if (item.purchaseType === 'refurbished') sustainabilityScore += 15;
    if (item.primaryMaterial === 'recycled') sustainabilityScore += 10;
    if (item.primaryMaterial === 'organic') sustainabilityScore += 8;
    if (item.packagingType === 'minimal') sustainabilityScore += 10;
    sustainabilityScore = Math.max(1, Math.min(100, sustainabilityScore));
    
    return {
        carbonFootprint: baseCO2,
        wasteGeneration: wasteGeneration,
        costPerYear: costPerYear,
        sustainabilityScore: sustainabilityScore,
        costPerUse: item.itemCost / (item.expectedLifespan * 50) // Assuming 50 uses per year
    };
}

// Calculate tracking period analysis
function calculateTrackingAnalysis(items, period) {
    const periodMultiplier = period === 'monthly' ? 1 : period === 'quarterly' ? 3 : 12;
    
    let totalCO2 = 0;
    let totalWaste = 0;
    let totalCost = 0;
    let totalSustainabilityScore = 0;
    let categoryBreakdown = {};
    let materialBreakdown = {};
    
    items.forEach(item => {
        const impact = calculateItemImpact(item);
        totalCO2 += impact.carbonFootprint;
        totalWaste += impact.wasteGeneration;
        totalCost += item.itemCost;
        totalSustainabilityScore += impact.sustainabilityScore;
        
        // Category breakdown
        if (!categoryBreakdown[item.itemCategory]) {
            categoryBreakdown[item.itemCategory] = { cost: 0, co2: 0, count: 0 };
        }
        categoryBreakdown[item.itemCategory].cost += item.itemCost;
        categoryBreakdown[item.itemCategory].co2 += impact.carbonFootprint;
        categoryBreakdown[item.itemCategory].count += 1;
        
        // Material breakdown
        if (!materialBreakdown[item.primaryMaterial]) {
            materialBreakdown[item.primaryMaterial] = { cost: 0, co2: 0, count: 0 };
        }
        materialBreakdown[item.primaryMaterial].cost += item.itemCost;
        materialBreakdown[item.primaryMaterial].co2 += impact.carbonFootprint;
        materialBreakdown[item.primaryMaterial].count += 1;
    });
    
    const avgSustainabilityScore = items.length > 0 ? totalSustainabilityScore / items.length : 0;
    
    // Project to period
    const projectedCO2 = totalCO2 * periodMultiplier;
    const projectedWaste = totalWaste * periodMultiplier;
    const projectedCost = totalCost * periodMultiplier;
    
    return {
        totalItems: items.length,
        totalCost: totalCost,
        projectedCost: projectedCost,
        totalCO2: totalCO2,
        projectedCO2: projectedCO2,
        totalWaste: totalWaste,
        projectedWaste: projectedWaste,
        avgSustainabilityScore: avgSustainabilityScore,
        categoryBreakdown: categoryBreakdown,
        materialBreakdown: materialBreakdown,
        period: period,
        periodMultiplier: periodMultiplier
    };
}

// Generate recommendations
function generateRecommendations(analysis, budgetGoal) {
    const recommendations = [];
    
    // Budget analysis
    if (analysis.projectedCost > budgetGoal) {
        recommendations.push({
            type: 'budget',
            title: 'Budget Optimization',
            description: `You're projected to spend $${analysis.projectedCost.toFixed(0)} vs your $${sanitizeText(budgetGoal)} goal. Consider the 24-hour rule for non-essential purchases.`,
            impact: 'high'
        });
    }
    
    // Sustainability score
    if (analysis.avgSustainabilityScore < 60) {
        recommendations.push({
            type: 'sustainability',
            title: 'Improve Sustainability Score',
            description: `Your average sustainability score is ${analysis.avgSustainabilityScore.toFixed(0)}/100. Focus on secondhand purchases and sustainable brands.`,
            impact: 'high'
        });
    }
    
    // Carbon footprint
    if (analysis.projectedCO2 > 100) {
        recommendations.push({
            type: 'carbon',
            title: 'Reduce Carbon Footprint',
            description: `Your projected ${sanitizeText(analysis.period)} carbon footprint is ${analysis.projectedCO2.toFixed(1)} kg CO2. Consider buying less or choosing lower-impact materials.`,
            impact: 'medium'
        });
    }
    
    // Category-specific recommendations
    const highestCostCategory = Object.entries(analysis.categoryBreakdown)
        .sort((a, b) => b[1].cost - a[1].cost)[0];
    
    if (highestCostCategory && highestCostCategory[1].cost > analysis.totalCost * 0.4) {
        recommendations.push({
            type: 'category',
            title: `${highestCostCategory[0]} Spending Alert`,
            description: `${highestCostCategory[0]} accounts for ${((highestCostCategory[1].cost / analysis.totalCost) * 100).toFixed(0)}% of your spending. Consider secondhand options in this category.`,
            impact: 'medium'
        });
    }
    
    // Waste reduction
    if (analysis.projectedWaste > 5) {
        recommendations.push({
            type: 'waste',
            title: 'Waste Reduction Opportunity',
            description: `You're projected to generate ${analysis.projectedWaste.toFixed(1)} kg of waste. Choose items with minimal packaging and longer lifespans.`,
            impact: 'medium'
        });
    }
    
    return recommendations;
}

// Display results
function displayResults(data) {
    const analysis = calculateTrackingAnalysis(shoppingItems, data.trackingPeriod);
    const recommendations = generateRecommendations(analysis, data.budgetGoal);
    
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    resultsContent.innerHTML = `
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-dark p-4 rounded-lg border border-accent">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-light text-sm">Total Items</p>
                        <p class="text-2xl font-bold text-primary">${sanitizeText(analysis.totalItems)}</p>
                    </div>
                    <span class="material-icons text-primary text-3xl">shopping_cart</span>
                </div>
            </div>
            
            <div class="bg-dark p-4 rounded-lg border border-accent">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-light text-sm">${analysis.period.charAt(0).toUpperCase() + analysis.period.slice(1)} Spending</p>
                        <p class="text-2xl font-bold text-primary">$${analysis.projectedCost.toFixed(0)}</p>
                        <p class="text-xs text-light">Goal: $${sanitizeText(data.budgetGoal)}</p>
                    </div>
                    <span class="material-icons text-primary text-3xl">attach_money</span>
                </div>
            </div>
            
            <div class="bg-dark p-4 rounded-lg border border-accent">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-light text-sm">Carbon Footprint</p>
                        <p class="text-2xl font-bold text-primary">${analysis.projectedCO2.toFixed(1)}</p>
                        <p class="text-xs text-light">kg CO2 ${sanitizeText(analysis.period)}</p>
                    </div>
                    <span class="material-icons text-primary text-3xl">co2</span>
                </div>
            </div>
            
            <div class="bg-dark p-4 rounded-lg border border-accent">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-light text-sm">Sustainability Score</p>
                        <p class="text-2xl font-bold text-primary">${analysis.avgSustainabilityScore.toFixed(0)}/100</p>
                        <p class="text-xs text-light">${analysis.avgSustainabilityScore >= 70 ? 'Excellent' : analysis.avgSustainabilityScore >= 50 ? 'Good' : 'Needs Improvement'}</p>
                    </div>
                    <span class="material-icons text-primary text-3xl">eco</span>
                </div>
            </div>
        </div>

        <!-- Recommendations -->
        <div class="mb-8">
            <h3 class="text-xl font-semibold text-primary mb-4">🎯 Personalized Recommendations</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${recommendations.map(rec => `
                    <div class="bg-dark p-4 rounded-lg border border-accent">
                        <div class="flex items-start">
                            <span class="material-icons text-${rec.impact === 'high' ? 'red-400' : rec.impact === 'medium' ? 'yellow-400' : 'green-400'} mr-3 mt-1">
                                ${rec.type === 'budget' ? 'account_balance_wallet' : 
                                  rec.type === 'sustainability' ? 'eco' : 
                                  rec.type === 'carbon' ? 'co2' : 
                                  rec.type === 'category' ? 'category' : 'delete'}
                            </span>
                            <div>
                                <h4 class="font-semibold text-primary mb-1">${sanitizeText(rec.title)}</h4>
                                <p class="text-light text-sm">${sanitizeText(rec.description)}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Category Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div class="bg-dark p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-primary mb-4">📊 Spending by Category</h3>
                <div class="space-y-3">
                    ${Object.entries(analysis.categoryBreakdown)
                        .sort((a, b) => b[1].cost - a[1].cost)
                        .map(([category, data]) => `
                            <div class="flex justify-between items-center">
                                <span class="text-light capitalize">${category}</span>
                                <div class="text-right">
                                    <span class="text-primary font-semibold">$${data.cost.toFixed(0)}</span>
                                    <span class="text-light text-sm ml-2">(${sanitizeText(data.count)} items)</span>
                                </div>
                            </div>
                            <div class="w-full bg-broder rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: ${(data.cost / analysis.totalCost * 100)}%"></div>
                            </div>
                        `).join('')}
                </div>
            </div>

            <div class="bg-dark p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-primary mb-4">🌍 Environmental Impact</h3>
                <div class="space-y-4">
                    <div class="flex justify-between">
                        <span class="text-light">Waste Generated:</span>
                        <span class="text-primary font-semibold">${analysis.projectedWaste.toFixed(1)} kg</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">CO2 per Dollar:</span>
                        <span class="text-primary font-semibold">${(analysis.projectedCO2 / analysis.projectedCost).toFixed(2)} kg</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Secondhand Items:</span>
                        <span class="text-primary font-semibold">${shoppingItems.filter(item => item.purchaseType === 'secondhand').length}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Avg Item Lifespan:</span>
                        <span class="text-primary font-semibold">${(shoppingItems.reduce((sum, item) => sum + item.expectedLifespan, 0) / shoppingItems.length || 0).toFixed(1)} years</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Progress Tracking -->
        <div class="bg-dark p-6 rounded-lg">
            <h3 class="text-xl font-semibold text-primary mb-4">📈 Progress Tracking</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center">
                    <div class="text-3xl font-bold text-primary mb-2">${analysis.avgSustainabilityScore.toFixed(0)}%</div>
                    <div class="text-light text-sm">Sustainability Score</div>
                    <div class="text-xs text-light mt-1">Target: 70%+</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-primary mb-2">${((data.budgetGoal - analysis.projectedCost) / data.budgetGoal * 100).toFixed(0)}%</div>
                    <div class="text-light text-sm">Budget Efficiency</div>
                    <div class="text-xs text-light mt-1">${analysis.projectedCost <= data.budgetGoal ? 'On Track' : 'Over Budget'}</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-primary mb-2">${shoppingItems.filter(item => item.purchaseType !== 'new').length}</div>
                    <div class="text-light text-sm">Sustainable Purchases</div>
                    <div class="text-xs text-light mt-1">Secondhand/Refurbished</div>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Form submission handler
document.getElementById('shoppingTrackerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = collectFormData();
    
    // Validation
    if (!formData.itemName.trim()) {
        alert('Please enter an item name.');
        return;
    }
    
    if (formData.itemCost <= 0) {
        alert('Please enter a valid cost.');
        return;
    }
    
    // Add item to tracking
    shoppingItems.push(formData);
    
    // Display results
    displayResults(formData);
    
    // Reset form for next item
    document.getElementById('shoppingTrackerForm').reset();
    
    // Show success message
    const popup = document.createElement('div');
    popup.className = 'fixed top-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50';
    popup.innerHTML = `
        <div class="flex items-center">
            <span class="material-icons mr-2">check_circle</span>
            <span>Item added to tracking!</span>
        </div>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 3000);
});
