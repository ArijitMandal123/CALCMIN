// Staycation vs Vacation Cost Comparison Calculator

// Cost data and multipliers
const costData = {
    transportation: {
        flight: { costPerMile: 0.15, baseCost: 200 },
        car: { costPerMile: 0.12, baseCost: 0 },
        train: { costPerMile: 0.08, baseCost: 50 },
        bus: { costPerMile: 0.05, baseCost: 25 }
    },
    accommodation: {
        budget: { vacation: 80, staycation: 60 },
        'mid-range': { vacation: 150, staycation: 100 },
        luxury: { vacation: 300, staycation: 180 },
        airbnb: { vacation: 120, staycation: 80 }
    },
    food: {
        budget: { vacation: 40, staycation: 25 },
        moderate: { vacation: 65, staycation: 40 },
        upscale: { vacation: 100, staycation: 60 },
        luxury: { vacation: 150, staycation: 80 }
    },
    staycationTransport: {
        'major-city': 25,
        suburban: 15,
        'small-town': 10
    }
};

// Value scoring factors
const valueFactors = {
    relaxation: { staycation: 8, vacation: 6 },
    adventure: { staycation: 4, vacation: 9 },
    cultural: { staycation: 3, vacation: 9 },
    convenience: { staycation: 9, vacation: 4 },
    flexibility: { staycation: 9, vacation: 5 },
    social: { staycation: 7, vacation: 6 }
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('vacation-comparison-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateComparison();
    });
});

function collectFormData() {
    return {
        duration: parseInt(document.getElementById('duration').value),
        groupSize: parseInt(document.getElementById('group-size').value),
        destination: document.getElementById('destination').value,
        distance: parseFloat(document.getElementById('distance').value) || 0,
        transportMode: document.getElementById('transport-mode').value,
        accommodationType: document.getElementById('accommodation-type').value,
        foodBudget: document.getElementById('food-budget').value,
        activityBudget: parseFloat(document.getElementById('activity-budget').value),
        locationType: document.getElementById('location-type').value
    };
}

function calculateComparison() {
    const data = collectFormData();
    
    if (!data.duration || !data.groupSize || !data.accommodationType || !data.foodBudget || !data.activityBudget || !data.locationType) {
        showModal('Error', 'Please fill in all required fields.');
        return;
    }
    
    const results = analyzeVacationOptions(data);
    displayResults(results, data);
}

function analyzeVacationOptions(data) {
    // Calculate vacation costs
    const vacationCosts = calculateVacationCosts(data);
    const staycationCosts = calculateStaycationCosts(data);
    
    // Calculate value scores
    const vacationValue = calculateValueScore('vacation', data);
    const staycationValue = calculateValueScore('staycation', data);
    
    // Calculate savings and ROI
    const totalSavings = vacationCosts.total - staycationCosts.total;
    const savingsPercentage = (totalSavings / vacationCosts.total) * 100;
    
    return {
        vacation: {
            costs: vacationCosts,
            value: vacationValue,
            costPerDay: vacationCosts.total / data.duration,
            costPerPerson: vacationCosts.total / data.groupSize
        },
        staycation: {
            costs: staycationCosts,
            value: staycationValue,
            costPerDay: staycationCosts.total / data.duration,
            costPerPerson: staycationCosts.total / data.groupSize
        },
        comparison: {
            totalSavings,
            savingsPercentage,
            valueRatio: staycationValue.total / vacationValue.total,
            recommendation: getRecommendation(totalSavings, savingsPercentage, vacationValue.total, staycationValue.total)
        }
    };
}

function calculateVacationCosts(data) {
    // Transportation costs
    let transportationCost = 0;
    if (data.distance > 0) {
        const transport = costData.transportation[data.transportMode];
        transportationCost = (transport.baseCost + (data.distance * transport.costPerMile * 2)) * data.groupSize; // Round trip
    }
    
    // Accommodation costs
    const accommodationPerNight = costData.accommodation[data.accommodationType].vacation;
    const accommodationCost = accommodationPerNight * data.duration;
    
    // Food costs
    const foodPerDay = costData.food[data.foodBudget].vacation * data.groupSize;
    const foodCost = foodPerDay * data.duration;
    
    // Activity costs
    const activityCost = data.activityBudget * data.groupSize * data.duration;
    
    // Miscellaneous (10% of other costs)
    const otherCosts = (transportationCost + accommodationCost + foodCost + activityCost) * 0.1;
    
    const total = transportationCost + accommodationCost + foodCost + activityCost + otherCosts;
    
    return {
        transportation: transportationCost,
        accommodation: accommodationCost,
        food: foodCost,
        activities: activityCost,
        miscellaneous: otherCosts,
        total
    };
}

function calculateStaycationCosts(data) {
    // Local transportation
    const transportationCost = costData.staycationTransport[data.locationType] * data.duration * data.groupSize;
    
    // Accommodation (optional, but often booked for staycation experience)
    const accommodationPerNight = costData.accommodation[data.accommodationType].staycation;
    const accommodationCost = accommodationPerNight * data.duration;
    
    // Food costs (local dining)
    const foodPerDay = costData.food[data.foodBudget].staycation * data.groupSize;
    const foodCost = foodPerDay * data.duration;
    
    // Activity costs (often lower locally)
    const activityCost = data.activityBudget * data.groupSize * data.duration * 0.8; // 20% discount for local activities
    
    // Miscellaneous (5% of other costs - lower than vacation)
    const otherCosts = (transportationCost + accommodationCost + foodCost + activityCost) * 0.05;
    
    const total = transportationCost + accommodationCost + foodCost + activityCost + otherCosts;
    
    return {
        transportation: transportationCost,
        accommodation: accommodationCost,
        food: foodCost,
        activities: activityCost,
        miscellaneous: otherCosts,
        total
    };
}

function calculateValueScore(type, data) {
    const scores = {};
    let total = 0;
    
    Object.entries(valueFactors).forEach(([factor, values]) => {
        let score = values[type];
        
        // Adjust scores based on context
        if (factor === 'adventure' && data.distance > 1000) {
            score = type === 'vacation' ? Math.min(10, score + 1) : score;
        }
        if (factor === 'relaxation' && data.duration <= 3) {
            score = type === 'staycation' ? Math.min(10, score + 1) : score;
        }
        if (factor === 'cultural' && data.destination && data.destination.toLowerCase().includes('international')) {
            score = type === 'vacation' ? Math.min(10, score + 1) : score;
        }
        
        scores[factor] = score;
        total += score;
    });
    
    return { ...scores, total, average: total / Object.keys(valueFactors).length };
}

function getRecommendation(savings, savingsPercentage, vacationValue, staycationValue) {
    if (savingsPercentage > 50 && staycationValue >= vacationValue * 0.8) {
        return {
            choice: 'staycation',
            reason: 'Excellent value with significant savings and comparable experience quality.',
            confidence: 'High'
        };
    } else if (savingsPercentage > 30 && staycationValue >= vacationValue * 0.7) {
        return {
            choice: 'staycation',
            reason: 'Good savings with reasonable experience trade-offs.',
            confidence: 'Medium'
        };
    } else if (vacationValue > staycationValue * 1.3) {
        return {
            choice: 'vacation',
            reason: 'Significantly higher experience value justifies the additional cost.',
            confidence: 'High'
        };
    } else if (savings < 200) {
        return {
            choice: 'vacation',
            reason: 'Small cost difference makes travel vacation worthwhile.',
            confidence: 'Medium'
        };
    } else {
        return {
            choice: 'depends',
            reason: 'Both options offer good value. Consider personal priorities and current financial situation.',
            confidence: 'Low'
        };
    }
}

function displayResults(results, data) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    let html = `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">
                <span class="material-icons align-middle mr-2">compare</span>
                Cost Comparison Results
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-dark p-4 rounded border border-accent">
                    <h4 class="text-xl font-semibold text-accent mb-3">Travel Vacation</h4>
                    <div class="text-2xl font-bold text-primary mb-2">$${results.vacation.costs.total.toFixed(0)}</div>
                    <div class="text-sm text-light mb-3">Total Cost</div>
                    <div class="space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span class="text-light">Per Day:</span>
                            <span class="text-text">$${results.vacation.costPerDay.toFixed(0)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Per Person:</span>
                            <span class="text-text">$${results.vacation.costPerPerson.toFixed(0)}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent">
                    <h4 class="text-xl font-semibold text-accent mb-3">Staycation</h4>
                    <div class="text-2xl font-bold text-primary mb-2">$${results.staycation.costs.total.toFixed(0)}</div>
                    <div class="text-sm text-light mb-3">Total Cost</div>
                    <div class="space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span class="text-light">Per Day:</span>
                            <span class="text-text">$${results.staycation.costPerDay.toFixed(0)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Per Person:</span>
                            <span class="text-text">$${results.staycation.costPerPerson.toFixed(0)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Savings analysis
    const savingsColor = results.comparison.totalSavings > 0 ? 'text-green-400' : 'text-red-400';
    html += `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h4 class="text-xl font-semibold text-primary mb-4">Savings Analysis</h4>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-2xl font-bold ${savingsColor}">$${Math.abs(results.comparison.totalSavings).toFixed(0)}</div>
                    <div class="text-sm text-light">${results.comparison.totalSavings > 0 ? 'Savings' : 'Extra Cost'} with Staycation</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold ${savingsColor}">${Math.abs(results.comparison.savingsPercentage).toFixed(1)}%</div>
                    <div class="text-sm text-light">${results.comparison.totalSavings > 0 ? 'Cost Reduction' : 'Cost Increase'}</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-accent">${results.comparison.valueRatio.toFixed(2)}x</div>
                    <div class="text-sm text-light">Value Ratio (Staycation/Vacation)</div>
                </div>
            </div>
        </div>
    `;
    
    // Detailed cost breakdown
    html += `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h4 class="text-xl font-semibold text-primary mb-4">Detailed Cost Breakdown</h4>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-accent">
                            <th class="text-left p-2 text-accent">Category</th>
                            <th class="text-right p-2 text-accent">Travel Vacation</th>
                            <th class="text-right p-2 text-accent">Staycation</th>
                            <th class="text-right p-2 text-accent">Difference</th>
                        </tr>
                    </thead>
                    <tbody class="text-light">
                        ${Object.keys(results.vacation.costs).filter(key => key !== 'total').map(category => {
                            const vacationCost = results.vacation.costs[category];
                            const staycationCost = results.staycation.costs[category];
                            const difference = vacationCost - staycationCost;
                            const diffColor = difference > 0 ? 'text-green-400' : 'text-red-400';
                            return `
                                <tr class="border-b border-accent/30">
                                    <td class="p-2 capitalize">${category}</td>
                                    <td class="p-2 text-right">$${vacationCost.toFixed(0)}</td>
                                    <td class="p-2 text-right">$${staycationCost.toFixed(0)}</td>
                                    <td class="p-2 text-right ${diffColor}">${difference > 0 ? '+' : ''}$${difference.toFixed(0)}</td>
                                </tr>
                            `;
                        }).join('')}
                        <tr class="border-t-2 border-accent font-semibold">
                            <td class="p-2 text-primary">Total</td>
                            <td class="p-2 text-right text-primary">$${results.vacation.costs.total.toFixed(0)}</td>
                            <td class="p-2 text-right text-primary">$${results.staycation.costs.total.toFixed(0)}</td>
                            <td class="p-2 text-right ${savingsColor}">${results.comparison.totalSavings > 0 ? '+' : ''}$${results.comparison.totalSavings.toFixed(0)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Value comparison
    html += `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h4 class="text-xl font-semibold text-primary mb-4">Experience Value Comparison</h4>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h5 class="font-semibold text-accent mb-3">Travel Vacation Scores</h5>
                    <div class="space-y-2">
                        ${Object.entries(results.vacation.value).filter(([key]) => key !== 'total' && key !== 'average').map(([factor, score]) => `
                            <div class="flex justify-between items-center">
                                <span class="text-light capitalize">${factor}</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-20 bg-dark rounded-full h-2">
                                        <div class="bg-primary h-2 rounded-full" style="width: ${score * 10}%"></div>
                                    </div>
                                    <span class="text-text w-8">${score}/10</span>
                                </div>
                            </div>
                        `).join('')}
                        <div class="border-t border-accent pt-2 flex justify-between font-semibold">
                            <span class="text-primary">Average</span>
                            <span class="text-primary">${results.vacation.value.average.toFixed(1)}/10</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h5 class="font-semibold text-accent mb-3">Staycation Scores</h5>
                    <div class="space-y-2">
                        ${Object.entries(results.staycation.value).filter(([key]) => key !== 'total' && key !== 'average').map(([factor, score]) => `
                            <div class="flex justify-between items-center">
                                <span class="text-light capitalize">${factor}</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-20 bg-dark rounded-full h-2">
                                        <div class="bg-accent h-2 rounded-full" style="width: ${score * 10}%"></div>
                                    </div>
                                    <span class="text-text w-8">${score}/10</span>
                                </div>
                            </div>
                        `).join('')}
                        <div class="border-t border-accent pt-2 flex justify-between font-semibold">
                            <span class="text-primary">Average</span>
                            <span class="text-primary">${results.staycation.value.average.toFixed(1)}/10</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Recommendation
    const recColor = results.comparison.recommendation.choice === 'staycation' ? 'text-green-400' : 
                     results.comparison.recommendation.choice === 'vacation' ? 'text-blue-400' : 'text-yellow-400';
    html += `
        <div class="bg-broder rounded-lg p-6 border border-accent">
            <h4 class="text-xl font-semibold text-primary mb-4">
                <span class="material-icons align-middle mr-2">recommend</span>
                Our Recommendation
            </h4>
            <div class="bg-dark p-4 rounded border border-accent">
                <div class="flex items-center gap-3 mb-3">
                    <div class="text-2xl font-bold ${recColor} capitalize">${results.comparison.recommendation.choice}</div>
                    <div class="text-sm text-light">Confidence: ${results.comparison.recommendation.confidence}</div>
                </div>
                <p class="text-light">${results.comparison.recommendation.reason}</p>
            </div>
        </div>
    `;
    
    contentDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function showModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-broder p-6 rounded-lg border border-accent max-w-md mx-4">
            <h3 class="text-xl font-bold text-primary mb-4">${title}</h3>
            <p class="text-light mb-6">${message}</p>
            <button onclick="this.closest('.fixed').remove()" class="bg-primary hover:bg-accent text-white px-4 py-2 rounded">
                OK
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}