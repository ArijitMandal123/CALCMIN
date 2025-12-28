// Cruise Ship ROI Calculator
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cruise-roi-form');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');

    // Cruise type multipliers for base calculations
    const cruiseMultipliers = {
        budget: { base: 1.0, quality: 0.7, entertainment: 0.8 },
        premium: { base: 1.3, quality: 0.9, entertainment: 1.0 },
        luxury: { base: 2.2, quality: 1.0, entertainment: 1.2 },
        expedition: { base: 1.8, quality: 0.8, entertainment: 0.6 },
        river: { base: 1.6, quality: 0.9, entertainment: 0.7 }
    };

    // Cabin type multipliers
    const cabinMultipliers = {
        interior: 1.0,
        oceanview: 1.2,
        balcony: 1.5,
        suite: 2.0
    };

    // Alternative vacation cost estimates (per person per day)
    const alternativeCosts = {
        resort: { accommodation: 200, meals: 80, entertainment: 40, transport: 20 },
        hotel: { accommodation: 150, meals: 100, entertainment: 60, transport: 30 },
        airbnb: { accommodation: 100, meals: 120, entertainment: 50, transport: 40 },
        roadtrip: { accommodation: 80, meals: 90, entertainment: 30, transport: 60 },
        staycation: { accommodation: 0, meals: 80, entertainment: 70, transport: 20 }
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCruiseROI();
    });

    function calculateCruiseROI() {
        // Collect form data
        const cruiseType = document.getElementById('cruise-type').value;
        const duration = parseInt(document.getElementById('duration').value);
        const cabinType = document.getElementById('cabin-type').value;
        const passengers = parseInt(document.getElementById('passengers').value);
        const cruiseCost = parseFloat(document.getElementById('cruise-cost').value);
        const onboardSpending = parseFloat(document.getElementById('onboard-spending').value) || 0;
        const portActivities = parseFloat(document.getElementById('port-activities').value) || 0;
        const gratuities = parseFloat(document.getElementById('gratuities').value) || 0;
        const alternativeType = document.getElementById('alternative-type').value;

        // Calculate total cruise cost
        const totalCruiseCost = cruiseCost + onboardSpending + portActivities + gratuities;
        const costPerPersonPerDay = totalCruiseCost / (passengers * duration);
        const costPerPerson = totalCruiseCost / passengers;

        // Calculate alternative vacation cost
        const altCosts = alternativeCosts[alternativeType];
        const altCostPerDay = altCosts.accommodation + altCosts.meals + altCosts.entertainment + altCosts.transport;
        const totalAltCost = altCostPerDay * duration * passengers;

        // Calculate value components
        const mealValue = calculateMealValue(cruiseType, duration, passengers);
        const entertainmentValue = calculateEntertainmentValue(cruiseType, duration, passengers);
        const accommodationValue = calculateAccommodationValue(cabinType, duration, passengers);

        // Calculate ROI metrics
        const costDifference = totalCruiseCost - totalAltCost;
        const costDifferencePerPerson = costDifference / passengers;
        const valueScore = calculateValueScore(cruiseType, cabinType, costPerPersonPerDay, altCostPerDay);
        const recommendation = generateRecommendation(valueScore, costDifference, cruiseType);

        // Display results
        displayResults({
            totalCruiseCost,
            costPerPersonPerDay,
            costPerPerson,
            totalAltCost,
            altCostPerDay,
            costDifference,
            costDifferencePerPerson,
            mealValue,
            entertainmentValue,
            accommodationValue,
            valueScore,
            recommendation,
            cruiseType,
            alternativeType,
            duration,
            passengers
        });
    }

    function calculateMealValue(cruiseType, duration, passengers) {
        const baseMealValue = {
            budget: 45,      // Per person per day
            premium: 65,
            luxury: 95,
            expedition: 55,
            river: 70
        };
        
        return baseMealValue[cruiseType] * duration * passengers;
    }

    function calculateEntertainmentValue(cruiseType, duration, passengers) {
        const baseEntertainmentValue = {
            budget: 25,      // Per person per day
            premium: 40,
            luxury: 60,
            expedition: 20,
            river: 30
        };
        
        return baseEntertainmentValue[cruiseType] * duration * passengers;
    }

    function calculateAccommodationValue(cabinType, duration, passengers) {
        const baseAccommodationValue = {
            interior: 80,    // Per night for the cabin
            oceanview: 120,
            balcony: 180,
            suite: 300
        };
        
        return baseAccommodationValue[cabinType] * duration;
    }

    function calculateValueScore(cruiseType, cabinType, cruiseCostPerDay, altCostPerDay) {
        const multiplier = cruiseMultipliers[cruiseType];
        const cabinMultiplier = cabinMultipliers[cabinType];
        
        // Base score calculation
        let score = 50; // Start with neutral score
        
        // Cost comparison factor (40% of score)
        const costRatio = cruiseCostPerDay / altCostPerDay;
        if (costRatio < 0.8) score += 20;
        else if (costRatio < 1.0) score += 10;
        else if (costRatio < 1.2) score -= 5;
        else if (costRatio < 1.5) score -= 15;
        else score -= 25;
        
        // Quality factor (30% of score)
        score += (multiplier.quality * 30) - 15;
        
        // Entertainment factor (20% of score)
        score += (multiplier.entertainment * 20) - 10;
        
        // Cabin factor (10% of score)
        score += (cabinMultiplier * 10) - 10;
        
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    function generateRecommendation(valueScore, costDifference, cruiseType) {
        let recommendation = {
            verdict: '',
            reasoning: '',
            tips: []
        };

        if (valueScore >= 80) {
            recommendation.verdict = 'Excellent Value';
            recommendation.reasoning = 'This cruise offers outstanding value compared to alternatives. The combination of included amenities, entertainment, and convenience provides significant savings.';
        } else if (valueScore >= 65) {
            recommendation.verdict = 'Good Value';
            recommendation.reasoning = 'This cruise provides good value for money. While not the cheapest option, the included services and convenience justify the cost.';
        } else if (valueScore >= 50) {
            recommendation.verdict = 'Fair Value';
            recommendation.reasoning = 'This cruise offers reasonable value, but you could potentially save money with alternative vacation types. Consider your priorities for convenience vs. cost.';
        } else if (valueScore >= 35) {
            recommendation.verdict = 'Poor Value';
            recommendation.reasoning = 'This cruise is expensive compared to alternatives. You might get better value from other vacation options unless cruise-specific amenities are very important to you.';
        } else {
            recommendation.verdict = 'Very Poor Value';
            recommendation.reasoning = 'This cruise is significantly overpriced compared to alternatives. Consider other vacation options or look for better cruise deals.';
        }

        // Add specific tips based on cruise type and score
        if (cruiseType === 'luxury' && valueScore < 60) {
            recommendation.tips.push('Consider premium cruises instead of luxury for better value');
        }
        if (costDifference > 1000) {
            recommendation.tips.push('Look for shoulder season deals or repositioning cruises');
        }
        if (valueScore < 50) {
            recommendation.tips.push('Consider booking shore excursions independently to reduce costs');
            recommendation.tips.push('Choose interior cabins if you plan to be out of the room frequently');
        }

        return recommendation;
    }

    function displayResults(data) {
        const costDifferenceClass = data.costDifference > 0 ? 'text-red-400' : 'text-green-400';
        const valueScoreClass = data.valueScore >= 70 ? 'text-green-400' : 
                               data.valueScore >= 50 ? 'text-yellow-400' : 'text-red-400';

        resultContent.innerHTML = `
            <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
                <h3 class="text-2xl font-bold text-primary mb-4">Cruise ROI Analysis Results</h3>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="text-lg font-semibold text-accent mb-3">Cruise Costs</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Total Cost:</span>
                                <span class="text-text font-medium">$${data.totalCruiseCost.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Cost per Person:</span>
                                <span class="text-text font-medium">$${data.costPerPerson.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Cost per Person per Day:</span>
                                <span class="text-text font-medium">$${data.costPerPersonPerDay.toFixed(0)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="text-lg font-semibold text-accent mb-3">Alternative Vacation</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Total Cost:</span>
                                <span class="text-text font-medium">$${data.totalAltCost.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Cost per Person per Day:</span>
                                <span class="text-text font-medium">$${data.altCostPerDay.toFixed(0)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Difference:</span>
                                <span class="${costDifferenceClass} font-medium">
                                    ${data.costDifference > 0 ? '+' : ''}$${data.costDifference.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-xl font-bold text-primary">Value Score</h4>
                        <div class="text-3xl font-bold ${valueScoreClass}">${data.valueScore}/100</div>
                    </div>
                    <div class="mb-4">
                        <div class="w-full bg-dark rounded-full h-3">
                            <div class="h-3 rounded-full transition-all duration-500 ${
                                data.valueScore >= 70 ? 'bg-green-400' : 
                                data.valueScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                            }" style="width: ${data.valueScore}%"></div>
                        </div>
                    </div>
                    <div class="text-center">
                        <span class="text-lg font-semibold ${valueScoreClass}">${data.recommendation.verdict}</span>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">$${data.mealValue.toLocaleString()}</div>
                        <div class="text-sm text-light">Estimated Meal Value</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">$${data.entertainmentValue.toLocaleString()}</div>
                        <div class="text-sm text-light">Entertainment Value</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">$${data.accommodationValue.toLocaleString()}</div>
                        <div class="text-sm text-light">Accommodation Value</div>
                    </div>
                </div>

                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-lg font-semibold text-accent mb-3">Recommendation</h4>
                    <p class="text-light mb-4">${data.recommendation.reasoning}</p>
                    
                    ${data.recommendation.tips.length > 0 ? `
                        <div class="mt-4">
                            <h5 class="font-semibold text-primary mb-2">Tips to Improve Value:</h5>
                            <ul class="text-sm text-light space-y-1">
                                ${data.recommendation.tips.map(tip => `<li>• ${tip}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
});