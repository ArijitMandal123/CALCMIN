// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('moving-cost-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        if (validateInputs(formData)) {
            const results = calculateMovingCosts(formData);
            displayResults(results);
        }
    });
});

function collectFormData() {
    const specialItems = [];
    document.querySelectorAll('input[name="specialItems"]:checked').forEach(checkbox => {
        specialItems.push(checkbox.value);
    });
    
    const additionalServices = [];
    document.querySelectorAll('input[name="additionalServices"]:checked').forEach(checkbox => {
        additionalServices.push(checkbox.value);
    });
    
    return {
        currentState: document.getElementById('currentState').value,
        destinationState: document.getElementById('destinationState').value,
        distance: parseFloat(document.getElementById('distance').value) || 0,
        moveType: document.getElementById('moveType').value,
        homeSize: document.getElementById('homeSize').value,
        estimatedWeight: parseFloat(document.getElementById('estimatedWeight').value) || 0,
        movingDate: document.getElementById('movingDate').value,
        dateFlexibility: document.getElementById('dateFlexibility').value,
        specialItems: specialItems,
        serviceLevel: document.getElementById('serviceLevel').value,
        insuranceCoverage: document.getElementById('insuranceCoverage').value,
        additionalServices: additionalServices
    };
}

function validateInputs(data) {
    if (!data.currentState || !data.destinationState) {
        showPopup('Please select both current and destination locations');
        return false;
    }
    if (data.distance <= 0 || data.distance > 3000) {
        showPopup('Please enter a valid distance (1-3000 miles)');
        return false;
    }
    if (!data.moveType) {
        showPopup('Please select a move type');
        return false;
    }
    if (!data.homeSize) {
        showPopup('Please select home size');
        return false;
    }
    if (!data.movingDate) {
        showPopup('Please select a moving date');
        return false;
    }
    if (!data.serviceLevel) {
        showPopup('Please select a service level');
        return false;
    }
    return true;
}

function calculateMovingCosts(data) {
    // Base weight estimates by home size
    const weightEstimates = {
        'studio': 2500,
        '1-bedroom': 4000,
        '2-bedroom': 6000,
        '3-bedroom': 8000,
        '4-bedroom': 10000,
        '5-bedroom': 12000
    };
    
    const weight = data.estimatedWeight || weightEstimates[data.homeSize];
    
    // Base rates by service level and move type
    const serviceRates = {
        'diy': {
            local: { base: 150, perMile: 1.2 },
            'long-distance': { base: 800, perMile: 1.8 },
            interstate: { base: 1000, perMile: 2.0 },
            international: { base: 3000, perMile: 3.0 }
        },
        'labor-only': {
            local: { base: 400, perMile: 2.0 },
            'long-distance': { base: 1200, perMile: 2.5 },
            interstate: { base: 1500, perMile: 3.0 },
            international: { base: 4000, perMile: 4.0 }
        },
        'full-service': {
            local: { base: 800, perMile: 3.5 },
            'long-distance': { base: 2500, perMile: 4.0 },
            interstate: { base: 3000, perMile: 4.5 },
            international: { base: 6000, perMile: 6.0 }
        },
        'white-glove': {
            local: { base: 2000, perMile: 6.0 },
            'long-distance': { base: 5000, perMile: 8.0 },
            interstate: { base: 6000, perMile: 10.0 },
            international: { base: 10000, perMile: 15.0 }
        }
    };
    
    const baseRate = serviceRates[data.serviceLevel][data.moveType];
    let baseCost = baseRate.base + (data.distance * baseRate.perMile);
    
    // Weight adjustment (for moves over average weight)
    const averageWeight = weightEstimates[data.homeSize];
    if (weight > averageWeight) {
        const weightMultiplier = 1 + ((weight - averageWeight) / averageWeight) * 0.3;
        baseCost *= weightMultiplier;
    }
    
    // Seasonal and timing adjustments
    const movingDate = new Date(data.movingDate);
    const month = movingDate.getMonth();
    const isPeakSeason = month >= 4 && month <= 8; // May to September
    
    let seasonalMultiplier = 1.0;
    if (isPeakSeason) {
        seasonalMultiplier = 1.25;
    }
    
    // Date flexibility discount
    const flexibilityDiscounts = {
        'fixed': 1.0,
        'flexible': 0.9,
        'very-flexible': 0.85
    };
    
    const flexibilityMultiplier = flexibilityDiscounts[data.dateFlexibility];
    
    // Special items costs
    const specialItemCosts = {
        piano: 500,
        artwork: 300,
        wine: 200,
        safe: 400,
        plants: 150,
        electronics: 250
    };
    
    let specialItemsCost = 0;
    data.specialItems.forEach(item => {
        specialItemsCost += specialItemCosts[item] || 0;
    });
    
    // Additional services costs
    const additionalServiceCosts = {
        packing: weight * 0.5,
        unpacking: weight * 0.3,
        storage: 200,
        disassembly: 300,
        cleaning: 400,
        appliance: 250
    };
    
    let additionalServicesCost = 0;
    data.additionalServices.forEach(service => {
        additionalServicesCost += additionalServiceCosts[service] || 0;
    });
    
    // Insurance costs
    const insuranceCosts = {
        basic: 0,
        'declared-value': weight * 0.6,
        'full-replacement': weight * 1.2
    };
    
    const insuranceCost = insuranceCosts[data.insuranceCoverage] || 0;
    
    // Calculate total costs
    const adjustedBaseCost = baseCost * seasonalMultiplier * flexibilityMultiplier;
    const totalCost = Math.round(adjustedBaseCost + specialItemsCost + additionalServicesCost + insuranceCost);
    
    // Generate cost ranges for different companies
    const costRanges = {
        budget: {
            name: 'Budget Companies',
            cost: Math.round(totalCost * 0.8),
            pros: ['Lowest cost', 'Basic service'],
            cons: ['Limited insurance', 'Potential hidden fees', 'Less experienced crews']
        },
        standard: {
            name: 'Standard Companies',
            cost: totalCost,
            pros: ['Good value', 'Reliable service', 'Proper licensing'],
            cons: ['Mid-range pricing', 'Standard insurance options']
        },
        premium: {
            name: 'Premium Companies',
            cost: Math.round(totalCost * 1.3),
            pros: ['Excellent service', 'Comprehensive insurance', 'Experienced crews'],
            cons: ['Higher cost', 'May be overkill for simple moves']
        }
    };
    
    // Hidden fees to watch for
    const hiddenFees = [
        { name: 'Long Carry Fee', cost: '50-200', description: 'If truck can\'t park close to door' },
        { name: 'Stair Fee', cost: '25-50/flight', description: 'For each flight of stairs' },
        { name: 'Elevator Fee', cost: '75-150', description: 'Using elevators for loading' },
        { name: 'Fuel Surcharge', cost: '5-15%', description: 'Additional fuel costs' },
        { name: 'Shuttle Fee', cost: '500-1500', description: 'If large truck can\'t access location' }
    ];
    
    // Money-saving tips
    const savingsTips = [
        { tip: 'Move during off-peak season', savings: Math.round(totalCost * 0.2) },
        { tip: 'Pack yourself', savings: Math.round(weight * 0.5) },
        { tip: 'Be flexible with dates', savings: Math.round(totalCost * 0.1) },
        { tip: 'Declutter before moving', savings: Math.round(totalCost * 0.15) },
        { tip: 'Get multiple quotes', savings: Math.round(totalCost * 0.1) }
    ];
    
    // Negotiation tips
    const negotiationTips = [
        'Use competitor quotes to negotiate better rates',
        'Ask about discounts for military, seniors, or students',
        'Request binding estimates to avoid surprise costs',
        'Negotiate waiver of small fees like stair charges',
        'Consider package deals for multiple services',
        'Ask about off-peak discounts for flexible dates'
    ];
    
    return {
        totalCost: totalCost,
        weight: weight,
        baseCost: Math.round(adjustedBaseCost),
        specialItemsCost: specialItemsCost,
        additionalServicesCost: additionalServicesCost,
        insuranceCost: insuranceCost,
        costRanges: costRanges,
        hiddenFees: hiddenFees,
        savingsTips: savingsTips,
        negotiationTips: negotiationTips,
        isPeakSeason: isPeakSeason,
        seasonalMultiplier: seasonalMultiplier,
        flexibilityDiscount: (1 - flexibilityMultiplier) * 100
    };
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    const totalSavingsPotential = results.savingsTips.reduce((sum, tip) => sum + tip.savings, 0);
    
    contentDiv.innerHTML = `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">Moving Cost Estimate</h3>
            
            <div class="bg-blue-900/20 border border-blue-600 rounded p-6 mb-6">
                <div class="flex items-center mb-4">
                    <div class="text-6xl font-bold text-blue-400 mr-4">$${results.totalCost.toLocaleString()}</div>
                    <div>
                        <h4 class="text-2xl font-bold text-blue-400">Estimated Total Cost</h4>
                        <p class="text-light">Based on ${results.weight.toLocaleString()} lbs estimated weight</p>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-xl font-bold text-primary mb-4">Cost Breakdown</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-light">Base Moving Cost:</span>
                            <span class="font-semibold">$${results.baseCost.toLocaleString()}</span>
                        </div>
                        ${results.specialItemsCost > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-light">Special Items:</span>
                            <span class="font-semibold">$${results.specialItemsCost.toLocaleString()}</span>
                        </div>
                        ` : ''}
                        ${results.additionalServicesCost > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-light">Additional Services:</span>
                            <span class="font-semibold">$${results.additionalServicesCost.toLocaleString()}</span>
                        </div>
                        ` : ''}
                        ${results.insuranceCost > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-light">Insurance:</span>
                            <span class="font-semibold">$${results.insuranceCost.toLocaleString()}</span>
                        </div>
                        ` : ''}
                        ${results.isPeakSeason ? `
                        <div class="flex justify-between">
                            <span class="text-light">Peak Season Surcharge:</span>
                            <span class="font-semibold text-red-400">+${((results.seasonalMultiplier - 1) * 100).toFixed(0)}%</span>
                        </div>
                        ` : ''}
                        ${results.flexibilityDiscount > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-light">Flexibility Discount:</span>
                            <span class="font-semibold text-green-400">-${results.flexibilityDiscount.toFixed(0)}%</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-xl font-bold text-primary mb-4">Company Comparison</h4>
                    <div class="space-y-4">
                        ${Object.values(results.costRanges).map(company => `
                            <div class="border border-accent rounded p-3">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-semibold text-accent">${company.name}</span>
                                    <span class="text-lg font-bold text-primary">$${company.cost.toLocaleString()}</span>
                                </div>
                                <div class="text-xs text-light">
                                    <span class="text-green-400">Pros:</span> ${company.pros.join(', ')}
                                </div>
                                <div class="text-xs text-light">
                                    <span class="text-red-400">Cons:</span> ${company.cons.join(', ')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="bg-dark p-6 rounded border border-accent mb-6">
                <h4 class="text-xl font-bold text-primary mb-4">Hidden Fees to Watch For</h4>
                <div class="grid md:grid-cols-2 gap-4">
                    ${results.hiddenFees.map(fee => `
                        <div class="bg-broder p-3 rounded">
                            <div class="flex justify-between items-center mb-1">
                                <span class="font-semibold text-red-400">${fee.name}</span>
                                <span class="text-sm font-bold">$${sanitizeText(fee.cost)}</span>
                            </div>
                            <p class="text-xs text-light">${sanitizeText(fee.description)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-dark p-6 rounded border border-accent mb-6">
                <h4 class="text-xl font-bold text-primary mb-4">Money-Saving Opportunities</h4>
                <p class="text-light mb-4">Potential savings: <span class="text-green-400 font-bold">$${totalSavingsPotential.toLocaleString()}</span></p>
                <div class="grid md:grid-cols-2 gap-4">
                    ${results.savingsTips.map(tip => `
                        <div class="bg-broder p-3 rounded">
                            <div class="flex justify-between items-center">
                                <span class="text-light">${tip.tip}</span>
                                <span class="font-semibold text-green-400">-$${tip.savings.toLocaleString()}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-green-900/20 border border-green-600 rounded p-4 mb-6">
                <h5 class="font-semibold text-green-400 mb-2">Negotiation Tips</h5>
                <ul class="text-sm text-light space-y-1">
                    ${results.negotiationTips.map(tip => `<li>• ${tip}</li>`).join('')}
                </ul>
            </div>
            
            <div class="bg-yellow-900/20 border border-yellow-600 rounded p-4">
                <h5 class="font-semibold text-yellow-400 mb-2">Important Reminders</h5>
                <ul class="text-sm text-light space-y-1">
                    <li>• Get at least 3 written estimates from licensed companies</li>
                    <li>• Verify insurance coverage and understand your liability</li>
                    <li>• Read all contracts carefully before signing</li>
                    <li>• Take inventory and photos of valuable items</li>
                    <li>• Keep important documents with you during the move</li>
                    <li>• Confirm pickup and delivery dates in writing</li>
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
    popup.innerHTML = `
        <div class="flex items-center mb-4">
            <span class="material-icons text-primary mr-2">info</span>
            <h3 class="text-lg font-semibold text-primary">Input Validation</h3>
        </div>
        <p class="text-light mb-4">${sanitizeText(message)}</p>
        <button onclick="this.closest('.fixed').remove()" 
                class="w-full bg-primary hover:bg-accent text-white font-medium py-2 px-4 rounded transition duration-200">
            OK
        </button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 5000);
}
