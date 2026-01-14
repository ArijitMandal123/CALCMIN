// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

    const form = document.getElementById('design-feasibility-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        if (validateInputs(formData)) {
            const results = calculateDesignFeasibility(formData);
            displayResults(results);
        }
    });
});

function collectFormData() {
    const mustHaveItems = [];
    document.querySelectorAll('input[name="mustHave"]:checked').forEach(checkbox => {
        mustHaveItems.push(checkbox.value);
    });
    
    return {
        roomType: document.getElementById('roomType').value,
        roomSize: parseFloat(document.getElementById('roomSize').value) || 0,
        totalBudget: parseFloat(document.getElementById('totalBudget').value) || 0,
        budgetFlexibility: document.getElementById('budgetFlexibility').value,
        designStyle: document.getElementById('designStyle').value,
        qualityPreference: document.getElementById('qualityPreference').value,
        mustHaveItems: mustHaveItems,
        diyWillingness: document.getElementById('diyWillingness').value,
        timeline: document.getElementById('timeline').value,
        colorScheme: document.getElementById('colorScheme').value
    };
}

function validateInputs(data) {
    if (!data.roomType) {
        showPopup('Please select a room type');
        return false;
    }
    if (data.roomSize <= 0 || data.roomSize > 2000) {
        showPopup('Please enter a valid room size (50-2000 sq ft)');
        return false;
    }
    if (data.totalBudget <= 0) {
        showPopup('Please enter a valid budget amount');
        return false;
    }
    if (!data.designStyle) {
        showPopup('Please select a design style');
        return false;
    }
    if (!data.qualityPreference) {
        showPopup('Please select a quality preference');
        return false;
    }
    return true;
}

function calculateDesignFeasibility(data) {
    // Base cost per square foot by design style and quality
    const styleCosts = {
        minimalist: { budget: 15, 'mid-range': 25, 'high-end': 40, luxury: 60 },
        scandinavian: { budget: 20, 'mid-range': 35, 'high-end': 50, luxury: 75 },
        modern: { budget: 25, 'mid-range': 40, 'high-end': 60, luxury: 100 },
        bohemian: { budget: 10, 'mid-range': 25, 'high-end': 45, luxury: 70 },
        industrial: { budget: 18, 'mid-range': 30, 'high-end': 50, luxury: 80 },
        farmhouse: { budget: 22, 'mid-range': 35, 'high-end': 55, luxury: 85 },
        traditional: { budget: 28, 'mid-range': 45, 'high-end': 70, luxury: 110 },
        luxury: { budget: 50, 'mid-range': 80, 'high-end': 120, luxury: 200 }
    };
    
    // Room type multipliers
    const roomMultipliers = {
        'living-room': 1.0,
        'bedroom': 0.8,
        'kitchen': 1.5,
        'dining-room': 0.9,
        'bathroom': 1.3,
        'home-office': 0.7,
        'nursery': 0.9
    };
    
    // Item costs by quality level
    const itemCosts = {
        sofa: { budget: 800, 'mid-range': 1500, 'high-end': 3000, luxury: 6000 },
        bed: { budget: 600, 'mid-range': 1200, 'high-end': 2500, luxury: 5000 },
        'dining-table': { budget: 400, 'mid-range': 800, 'high-end': 1800, luxury: 4000 },
        'coffee-table': { budget: 200, 'mid-range': 400, 'high-end': 800, luxury: 1500 },
        storage: { budget: 300, 'mid-range': 600, 'high-end': 1200, luxury: 2500 },
        lighting: { budget: 150, 'mid-range': 300, 'high-end': 600, luxury: 1200 },
        artwork: { budget: 100, 'mid-range': 300, 'high-end': 800, luxury: 2000 },
        rugs: { budget: 200, 'mid-range': 500, 'high-end': 1000, luxury: 2500 },
        curtains: { budget: 150, 'mid-range': 350, 'high-end': 700, luxury: 1500 }
    };
    
    // Calculate base estimated cost
    const baseCostPerSqFt = styleCosts[data.designStyle][data.qualityPreference];
    const roomMultiplier = roomMultipliers[data.roomType];
    const estimatedBaseCost = data.roomSize * baseCostPerSqFt * roomMultiplier;
    
    // Calculate must-have items cost
    let mustHaveItemsCost = 0;
    data.mustHaveItems.forEach(item => {
        if (itemCosts[item]) {
            mustHaveItemsCost += itemCosts[item][data.qualityPreference];
        }
    });
    
    // DIY savings
    const diySavings = {
        none: 0,
        minimal: 0.05,
        moderate: 0.15,
        high: 0.25
    };
    
    const diySavingsAmount = estimatedBaseCost * diySavings[data.diyWillingness];
    
    // Timeline impact on costs
    const timelineMultipliers = {
        immediate: 1.2, // Rush fees
        '3-months': 1.1,
        '6-months': 1.0,
        '1-year': 0.95,
        phased: 0.9
    };
    
    const timelineMultiplier = timelineMultipliers[data.timeline];
    
    // Calculate total estimated cost
    const totalEstimatedCost = Math.round((estimatedBaseCost + mustHaveItemsCost) * timelineMultiplier - diySavingsAmount);
    
    // Budget flexibility
    const flexibilityMultipliers = {
        strict: 1.0,
        moderate: 1.1,
        flexible: 1.2
    };
    
    const maxBudget = data.totalBudget * flexibilityMultipliers[data.budgetFlexibility];
    
    // Calculate feasibility score
    let feasibilityScore = 10;
    const budgetRatio = totalEstimatedCost / maxBudget;
    
    if (budgetRatio <= 0.8) {
        feasibilityScore = 10;
    } else if (budgetRatio <= 1.0) {
        feasibilityScore = 8;
    } else if (budgetRatio <= 1.2) {
        feasibilityScore = 6;
    } else if (budgetRatio <= 1.5) {
        feasibilityScore = 4;
    } else {
        feasibilityScore = 2;
    }
    
    // Generate recommendations
    const recommendations = [];
    const alternatives = [];
    
    if (budgetRatio > 1.0) {
        recommendations.push('Consider reducing quality level or choosing fewer must-have items');
        alternatives.push('Mix high and low-end pieces strategically');
    }
    
    if (data.diyWillingness === 'none') {
        recommendations.push('Consider some DIY projects to reduce costs');
        alternatives.push('Learn basic DIY skills like painting and assembly');
    }
    
    if (data.timeline === 'immediate') {
        recommendations.push('Allow more time to avoid rush fees and find better deals');
        alternatives.push('Implement design in phases over 6-12 months');
    }
    
    if (data.mustHaveItems.length > 5) {
        recommendations.push('Prioritize essential items and add others later');
        alternatives.push('Start with 3-4 key pieces and build over time');
    }
    
    // Budget breakdown
    const budgetBreakdown = {
        furniture: Math.round(totalEstimatedCost * 0.6),
        lighting: Math.round(totalEstimatedCost * 0.15),
        textiles: Math.round(totalEstimatedCost * 0.12),
        decor: Math.round(totalEstimatedCost * 0.08),
        miscellaneous: Math.round(totalEstimatedCost * 0.05)
    };
    
    // Phased implementation plan
    const phasedPlan = {
        phase1: {
            name: 'Foundation',
            percentage: 40,
            cost: Math.round(totalEstimatedCost * 0.4),
            items: ['Major furniture pieces', 'Paint', 'Basic lighting', 'Window treatments']
        },
        phase2: {
            name: 'Function',
            percentage: 35,
            cost: Math.round(totalEstimatedCost * 0.35),
            items: ['Storage solutions', 'Additional seating', 'Task lighting', 'Rugs']
        },
        phase3: {
            name: 'Style',
            percentage: 25,
            cost: Math.round(totalEstimatedCost * 0.25),
            items: ['Artwork', 'Decorative accessories', 'Plants', 'Throw pillows']
        }
    };
    
    return {
        feasibilityScore: feasibilityScore,
        totalEstimatedCost: totalEstimatedCost,
        budgetRatio: budgetRatio,
        maxBudget: maxBudget,
        budgetShortfall: Math.max(0, totalEstimatedCost - maxBudget),
        diySavingsAmount: Math.round(diySavingsAmount),
        budgetBreakdown: budgetBreakdown,
        recommendations: recommendations,
        alternatives: alternatives,
        phasedPlan: phasedPlan,
        costPerSqFt: Math.round(totalEstimatedCost / data.roomSize)
    };
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    const feasibilityLevel = results.feasibilityScore >= 8 ? 'Excellent' : 
                           results.feasibilityScore >= 6 ? 'Good' : 
                           results.feasibilityScore >= 4 ? 'Challenging' : 'Difficult';
    
    const feasibilityColor = results.feasibilityScore >= 8 ? 'green' : 
                           results.feasibilityScore >= 6 ? 'blue' : 
                           results.feasibilityScore >= 4 ? 'yellow' : 'red';
    
    contentDiv.innerHTML = `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">Design Feasibility Assessment</h3>
            
            <div class="bg-${sanitizeText(feasibilityColor)}-900/20 border border-${sanitizeText(feasibilityColor)}-600 rounded p-6 mb-6">
                <div class="flex items-center mb-4">
                    <div class="text-6xl font-bold text-${sanitizeText(feasibilityColor)}-400 mr-4">${sanitizeText(results.feasibilityScore)}/10</div>
                    <div>
                        <h4 class="text-2xl font-bold text-${sanitizeText(feasibilityColor)}-400">${escapeHtml(feasibilityLevel)} Feasibility</h4>
                        <p class="text-light">
                            ${results.feasibilityScore >= 8 ? 'Your design concept is highly feasible within your budget!' : 
                              results.feasibilityScore >= 6 ? 'Your design concept is achievable with some adjustments.' : 
                              results.feasibilityScore >= 4 ? 'Your design concept needs significant modifications to fit budget.' : 
                              'Your design concept requires major changes or increased budget.'}
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-xl font-bold text-primary mb-4">Cost Analysis</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-light">Estimated Total Cost:</span>
                            <span class="font-semibold">$${results.totalEstimatedCost.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Your Budget:</span>
                            <span class="font-semibold">$${results.maxBudget.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Cost per Sq Ft:</span>
                            <span class="font-semibold">$${sanitizeText(results.costPerSqFt)}</span>
                        </div>
                        ${results.diySavingsAmount > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-light">DIY Savings:</span>
                            <span class="font-semibold text-green-400">-$${results.diySavingsAmount.toLocaleString()}</span>
                        </div>
                        ` : ''}
                        <hr class="border-accent">
                        <div class="flex justify-between text-lg font-bold">
                            <span>${results.budgetShortfall > 0 ? 'Budget Shortfall:' : 'Budget Remaining:'}</span>
                            <span class="text-${results.budgetShortfall > 0 ? 'red' : 'green'}-400">
                                ${results.budgetShortfall > 0 ? '-' : '+'}$${Math.abs(results.maxBudget - results.totalEstimatedCost).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-xl font-bold text-primary mb-4">Budget Breakdown</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-light">Furniture (60%):</span>
                            <span class="font-semibold">$${results.budgetBreakdown.furniture.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Lighting (15%):</span>
                            <span class="font-semibold">$${results.budgetBreakdown.lighting.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Textiles (12%):</span>
                            <span class="font-semibold">$${results.budgetBreakdown.textiles.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Decor (8%):</span>
                            <span class="font-semibold">$${results.budgetBreakdown.decor.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Miscellaneous (5%):</span>
                            <span class="font-semibold">$${results.budgetBreakdown.miscellaneous.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-dark p-6 rounded border border-accent mb-6">
                <h4 class="text-xl font-bold text-primary mb-4">Phased Implementation Plan</h4>
                <div class="grid md:grid-cols-3 gap-4">
                    ${Object.values(results.phasedPlan).map(phase => `
                        <div class="bg-broder p-4 rounded">
                            <h5 class="font-semibold text-accent mb-2">${phase.name} (${sanitizeText(phase.percentage)}%)</h5>
                            <p class="text-lg font-bold text-primary mb-2">$${phase.cost.toLocaleString()}</p>
                            <ul class="text-sm text-light space-y-1">
                                ${phase.items.map(item => `<li>• ${escapeHtml(item)}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${results.recommendations.length > 0 ? `
            <div class="bg-blue-900/20 border border-blue-600 rounded p-4 mb-6">
                <h5 class="font-semibold text-blue-400 mb-2">Recommendations</h5>
                <ul class="text-sm text-light space-y-1">
                    ${results.recommendations.map(rec => `<li>• ${escapeHtml(rec)}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${results.alternatives.length > 0 ? `
            <div class="bg-green-900/20 border border-green-600 rounded p-4 mb-6">
                <h5 class="font-semibold text-green-400 mb-2">Alternative Approaches</h5>
                <ul class="text-sm text-light space-y-1">
                    ${results.alternatives.map(alt => `<li>• ${escapeHtml(alt)}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            <div class="bg-yellow-900/20 border border-yellow-600 rounded p-4">
                <h5 class="font-semibold text-yellow-400 mb-2">Important Notes</h5>
                <ul class="text-sm text-light space-y-1">
                    <li>• Costs are estimates and may vary by location and specific items chosen</li>
                    <li>• Consider shopping sales, clearance, and secondhand for better deals</li>
                    <li>• Factor in delivery, assembly, and installation costs</li>
                    <li>• Allow 10-20% buffer for unexpected expenses</li>
                    <li>• Consult with interior designers for professional guidance</li>
                </ul>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function showPopup(message) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    const popup = document.createElement('div');
    popup.className = 'bg-broder border border-accent rounded-lg p-6 max-w-md mx-4';
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    popup.innerHTML = `
        <div class="flex items-center mb-4">
            <span class="material-icons text-primary mr-2">info</span>
            <h3 class="text-lg font-semibold text-primary">Input Validation</h3>
        </div>
        <p class="text-light mb-4">${escapeHtml(message)}</p>
        <button class="w-full bg-primary hover:bg-accent text-white font-medium py-2 px-4 rounded transition duration-200 close-btn">
            OK
        </button>
    `;
    
    const closeBtn = popup.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        overlay.remove();
    });
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 5000);
}
