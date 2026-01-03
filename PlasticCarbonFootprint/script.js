// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('plastic-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculatePlasticImpact();
    });
});

function collectFormData() {
    return {
        waterBottles: parseInt(document.getElementById('waterBottles').value) || 0,
        shoppingBags: parseInt(document.getElementById('shoppingBags').value) || 0,
        foodPackaging: parseInt(document.getElementById('foodPackaging').value) || 0,
        disposableCups: parseInt(document.getElementById('disposableCups').value) || 0,
        plasticUtensils: parseInt(document.getElementById('plasticUtensils').value) || 0,
        otherPlastic: parseInt(document.getElementById('otherPlastic').value) || 0,
        reusableBottles: parseInt(document.getElementById('reusableBottles').value) || 0,
        reusableBags: parseInt(document.getElementById('reusableBags').value) || 0,
        recyclingRate: parseFloat(document.getElementById('recyclingRate').value) || 0,
        householdSize: parseInt(document.getElementById('householdSize').value) || 1,
        bulkBuying: document.getElementById('bulkBuying').checked,
        localShopping: document.getElementById('localShopping').checked,
        avoidPackaging: document.getElementById('avoidPackaging').checked,
        refillStations: document.getElementById('refillStations').checked
    };
}

function calculatePlasticImpact() {
    const data = collectFormData();
    
    // Carbon footprint per item (kg CO2)
    const carbonFactors = {
        waterBottles: 0.082,
        shoppingBags: 0.040,
        foodPackaging: 0.065,
        disposableCups: 0.025,
        plasticUtensils: 0.015,
        otherPlastic: 0.050
    };
    
    // Weight per item (kg)
    const weightFactors = {
        waterBottles: 0.014,
        shoppingBags: 0.006,
        foodPackaging: 0.020,
        disposableCups: 0.003,
        plasticUtensils: 0.002,
        otherPlastic: 0.010
    };
    
    // Cost per item ($)
    const costFactors = {
        waterBottles: 1.50,
        shoppingBags: 0.10,
        foodPackaging: 0.50,
        disposableCups: 0.25,
        plasticUtensils: 0.05,
        otherPlastic: 0.30
    };
    
    // Calculate weekly totals
    const weeklyCarbon = Object.keys(carbonFactors).reduce((total, item) => {
        return total + (data[item] * carbonFactors[item]);
    }, 0);
    
    const weeklyWeight = Object.keys(weightFactors).reduce((total, item) => {
        return total + (data[item] * weightFactors[item]);
    }, 0);
    
    const weeklyCost = Object.keys(costFactors).reduce((total, item) => {
        return total + (data[item] * costFactors[item]);
    }, 0);
    
    // Annual projections
    const annualCarbon = weeklyCarbon * 52;
    const annualWeight = weeklyWeight * 52;
    const annualCost = weeklyCost * 52;
    
    // Recycling impact
    const recyclingReduction = (data.recyclingRate / 100) * 0.3; // 30% carbon reduction from recycling
    const effectiveCarbon = annualCarbon * (1 - recyclingReduction);
    
    // Environmental equivalents
    const treesNeeded = effectiveCarbon / 21; // 21kg CO2 absorbed per tree per year
    const carMiles = effectiveCarbon / 0.404; // 0.404kg CO2 per mile average car
    
    // Sustainability score (0-100)
    const sustainabilityScore = calculateSustainabilityScore(data, weeklyCarbon);
    
    // Reduction potential
    const reductionPotential = calculateReductionPotential(data);
    
    // Cost savings from alternatives
    const alternativeSavings = calculateAlternativeSavings(data, annualCost);
    
    // Recommendations
    const recommendations = generateRecommendations(data, sustainabilityScore);
    
    displayResults({
        data,
        weeklyCarbon,
        weeklyWeight,
        weeklyCost,
        annualCarbon: effectiveCarbon,
        annualWeight,
        annualCost,
        treesNeeded,
        carMiles,
        sustainabilityScore,
        reductionPotential,
        alternativeSavings,
        recommendations
    });
}

function calculateSustainabilityScore(data, weeklyCarbon) {
    let score = 100;
    
    // Penalize high plastic usage
    const totalItems = data.waterBottles + data.shoppingBags + data.foodPackaging + 
                      data.disposableCups + data.plasticUtensils + data.otherPlastic;
    
    if (totalItems > 50) score -= 40;
    else if (totalItems > 30) score -= 25;
    else if (totalItems > 15) score -= 10;
    
    // Reward reusable items
    if (data.reusableBottles >= 2) score += 10;
    if (data.reusableBags >= 3) score += 10;
    
    // Reward good recycling
    if (data.recyclingRate >= 80) score += 15;
    else if (data.recyclingRate >= 60) score += 10;
    else if (data.recyclingRate >= 40) score += 5;
    
    // Reward sustainable habits
    if (data.bulkBuying) score += 5;
    if (data.localShopping) score += 5;
    if (data.avoidPackaging) score += 10;
    if (data.refillStations) score += 5;
    
    return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateReductionPotential(data) {
    const reductions = [];
    
    if (data.waterBottles > 3) {
        const reduction = (data.waterBottles - 1) * 0.082 * 52;
        reductions.push({
            item: 'Water Bottles',
            current: data.waterBottles,
            target: 1,
            carbonSaved: reduction,
            costSaved: (data.waterBottles - 1) * 1.50 * 52
        });
    }
    
    if (data.shoppingBags > 2) {
        const reduction = (data.shoppingBags - 1) * 0.040 * 52;
        reductions.push({
            item: 'Shopping Bags',
            current: data.shoppingBags,
            target: 1,
            carbonSaved: reduction,
            costSaved: (data.shoppingBags - 1) * 0.10 * 52
        });
    }
    
    if (data.disposableCups > 2) {
        const reduction = (data.disposableCups - 1) * 0.025 * 52;
        reductions.push({
            item: 'Disposable Cups',
            current: data.disposableCups,
            target: 1,
            carbonSaved: reduction,
            costSaved: (data.disposableCups - 1) * 0.25 * 52
        });
    }
    
    return reductions;
}

function calculateAlternativeSavings(data, annualCost) {
    const alternatives = [
        {
            item: 'Reusable Water Bottle',
            cost: 25,
            annualSavings: Math.max(0, (data.waterBottles * 1.50 * 52) - 25),
            carbonSaved: data.waterBottles * 0.082 * 52 * 0.9
        },
        {
            item: 'Reusable Shopping Bags (3-pack)',
            cost: 15,
            annualSavings: Math.max(0, (data.shoppingBags * 0.10 * 52) - 15),
            carbonSaved: data.shoppingBags * 0.040 * 52 * 0.9
        },
        {
            item: 'Reusable Coffee Cup',
            cost: 20,
            annualSavings: Math.max(0, (data.disposableCups * 0.25 * 52) - 20),
            carbonSaved: data.disposableCups * 0.025 * 52 * 0.9
        }
    ];
    
    return alternatives.filter(alt => alt.annualSavings > 0);
}

function generateRecommendations(data, score) {
    const recommendations = [];
    
    if (score < 40) {
        recommendations.push({
            priority: 'high',
            title: 'Critical: Reduce Single-Use Plastics',
            description: 'Your plastic usage is very high. Start by replacing your most-used items with reusable alternatives.'
        });
    } else if (score < 70) {
        recommendations.push({
            priority: 'medium',
            title: 'Good Progress: Focus on Remaining Items',
            description: 'You\'re on the right track. Target your highest-usage plastic items for replacement.'
        });
    } else {
        recommendations.push({
            priority: 'low',
            title: 'Excellent: Maintain and Inspire Others',
            description: 'Your plastic usage is exemplary. Share your strategies with others to multiply your impact.'
        });
    }
    
    if (data.waterBottles > 5) {
        recommendations.push({
            priority: 'high',
            title: 'Replace Water Bottles',
            description: 'Invest in a quality reusable water bottle. You\'ll save money and significantly reduce plastic waste.'
        });
    }
    
    if (data.recyclingRate < 60) {
        recommendations.push({
            priority: 'medium',
            title: 'Improve Recycling Habits',
            description: 'Learn your local recycling guidelines and aim for 80%+ recycling rate to maximize environmental benefit.'
        });
    }
    
    if (!data.bulkBuying && !data.avoidPackaging) {
        recommendations.push({
            priority: 'medium',
            title: 'Optimize Shopping Habits',
            description: 'Buy in bulk and choose products with minimal packaging to reduce plastic consumption at the source.'
        });
    }
    
    return recommendations;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    };
    
    const getScoreLevel = (score) => {
        if (score >= 80) return 'Eco Champion';
        if (score >= 60) return 'Environmentally Conscious';
        if (score >= 40) return 'Making Progress';
        return 'High Impact';
    };
    
    contentDiv.innerHTML = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">Your Plastic Environmental Impact</h3>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-3xl font-bold text-accent">${results.annualCarbon.toFixed(1)} kg</div>
                    <div class="text-light">Annual CO2 Emissions</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-accent">${results.annualWeight.toFixed(1)} kg</div>
                    <div class="text-light">Annual Plastic Waste</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold ${getScoreColor(results.sustainabilityScore)}">${sanitizeText(results.sustainabilityScore)}/100</div>
                    <div class="text-light">${getScoreLevel(results.sustainabilityScore)}</div>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Environmental Equivalents</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-light">Trees needed to offset:</span>
                        <span class="text-accent font-bold">${Math.ceil(results.treesNeeded)} trees</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Equivalent car miles:</span>
                        <span class="text-accent font-bold">${Math.round(results.carMiles)} miles</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Weekly plastic items:</span>
                        <span class="text-accent font-bold">${Object.values(results.data).slice(0, 6).reduce((a, b) => a + b, 0)} items</span>
                    </div>
                    <div class="flex justify-between items-center border-t border-accent pt-2">
                        <span class="text-light font-bold">Annual cost:</span>
                        <span class="text-primary font-bold">$${results.annualCost.toFixed(0)}</span>
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Weekly Breakdown</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-light">Water Bottles:</span>
                        <span class="text-accent">${sanitizeText(results.data.waterBottles)} (${(results.data.waterBottles * 0.082).toFixed(2)} kg CO2)</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Shopping Bags:</span>
                        <span class="text-accent">${sanitizeText(results.data.shoppingBags)} (${(results.data.shoppingBags * 0.040).toFixed(2)} kg CO2)</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Food Packaging:</span>
                        <span class="text-accent">${sanitizeText(results.data.foodPackaging)} (${(results.data.foodPackaging * 0.065).toFixed(2)} kg CO2)</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Disposable Cups:</span>
                        <span class="text-accent">${sanitizeText(results.data.disposableCups)} (${(results.data.disposableCups * 0.025).toFixed(2)} kg CO2)</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Plastic Utensils:</span>
                        <span class="text-accent">${sanitizeText(results.data.plasticUtensils)} (${(results.data.plasticUtensils * 0.015).toFixed(2)} kg CO2)</span>
                    </div>
                    <div class="flex justify-between border-t border-accent pt-2">
                        <span class="text-light font-bold">Weekly Total:</span>
                        <span class="text-primary font-bold">${results.weeklyCarbon.toFixed(2)} kg CO2</span>
                    </div>
                </div>
            </div>
        </div>

        ${results.alternativeSavings.length > 0 ? `
        <div class="bg-broder p-6 rounded border border-accent mb-6">
            <h4 class="text-xl font-bold text-primary mb-4">Reusable Alternative Savings</h4>
            <div class="grid md:grid-cols-3 gap-4">
                ${results.alternativeSavings.map(alt => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h5 class="font-semibold text-accent mb-2">${escapeHtml(alt.item)}</h5>
                        <div class="text-sm space-y-1">
                            <div class="flex justify-between">
                                <span class="text-light">Initial Cost:</span>
                                <span class="text-accent">$${sanitizeText(alt.cost)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Annual Savings:</span>
                                <span class="text-green-400">$${alt.annualSavings.toFixed(0)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">CO2 Saved:</span>
                                <span class="text-green-400">${alt.carbonSaved.toFixed(1)} kg</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${results.reductionPotential.length > 0 ? `
        <div class="bg-broder p-6 rounded border border-accent mb-6">
            <h4 class="text-xl font-bold text-primary mb-4">Reduction Opportunities</h4>
            <div class="space-y-3">
                ${results.reductionPotential.map(reduction => `
                    <div class="flex justify-between items-center p-3 bg-dark rounded">
                        <div>
                            <span class="text-light">${escapeHtml(reduction.item)}: ${sanitizeText(reduction.current)} â†’ ${sanitizeText(reduction.target)} per week</span>
                        </div>
                        <div class="text-right">
                            <div class="text-green-400 font-bold">${reduction.carbonSaved.toFixed(1)} kg CO2 saved</div>
                            <div class="text-green-400 text-sm">$${reduction.costSaved.toFixed(0)} saved annually</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <div class="bg-broder p-6 rounded border border-accent">
            <h4 class="text-xl font-bold text-primary mb-4">Personalized Recommendations</h4>
            <div class="space-y-4">
                ${results.recommendations.map(rec => `
                    <div class="flex items-start space-x-3">
                        <span class="material-icons ${rec.priority === 'high' ? 'text-red-400' : rec.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'} mt-1">
                            ${rec.priority === 'high' ? 'priority_high' : rec.priority === 'medium' ? 'warning' : 'eco'}
                        </span>
                        <div>
                            <div class="font-semibold ${rec.priority === 'high' ? 'text-red-400' : rec.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'}">${escapeHtml(rec.title)}</div>
                            <div class="text-light text-sm">${escapeHtml(rec.description)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
