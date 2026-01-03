// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waterUsageForm');
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateWaterUsage();
    });

    function collectFormData() {
        return {
            familySize: parseInt(document.getElementById('familySize').value),
            waterRate: parseFloat(document.getElementById('waterRate').value),
            showersPerWeek: parseInt(document.getElementById('showersPerWeek').value),
            showerDuration: parseInt(document.getElementById('showerDuration').value),
            flushesPerDay: parseInt(document.getElementById('flushesPerDay').value),
            toiletType: document.getElementById('toiletType').value,
            laundryLoads: parseInt(document.getElementById('laundryLoads').value),
            dishMethod: document.getElementById('dishMethod').value,
            dishLoads: parseInt(document.getElementById('dishLoads').value),
            gardenWatering: parseInt(document.getElementById('gardenWatering').value),
            carWashing: parseInt(document.getElementById('carWashing').value)
        };
    }

    function calculateWaterUsage() {
        const data = collectFormData();
        
        // Calculate daily water usage by category
        const usage = calculateDailyUsage(data);
        const monthlyUsage = usage.total * 30;
        const annualUsage = usage.total * 365;
        
        // Calculate costs
        const monthlyCost = monthlyUsage * data.waterRate;
        const annualCost = annualUsage * data.waterRate;
        
        // Calculate environmental impact
        const environmental = calculateEnvironmentalImpact(annualUsage);
        
        // Generate conservation recommendations
        const recommendations = generateRecommendations(data, usage);
        
        // Calculate potential savings
        const savings = calculatePotentialSavings(data, usage);
        
        displayResults({
            usage,
            monthlyUsage,
            annualUsage,
            monthlyCost,
            annualCost,
            environmental,
            recommendations,
            savings,
            familySize: data.familySize
        });
    }

    function calculateDailyUsage(data) {
        // Shower usage (gallons per day)
        const showerGallonsPerMinute = 2.1; // Standard showerhead
        const showerUsage = (data.showersPerWeek * data.showerDuration * showerGallonsPerMinute * data.familySize) / 7;
        
        // Toilet usage (gallons per day)
        const toiletGallonsPerFlush = {
            'standard': 3.5,
            'lowflow': 1.6,
            'ultralow': 1.28,
            'dual': 1.35 // Average of dual flush
        };
        const toiletUsage = data.flushesPerDay * toiletGallonsPerFlush[data.toiletType] * data.familySize;
        
        // Laundry usage (gallons per day)
        const laundryGallonsPerLoad = 41; // Standard washing machine
        const laundryUsage = (data.laundryLoads * laundryGallonsPerLoad) / 7;
        
        // Dish usage (gallons per day)
        const dishGallonsPerLoad = {
            'dishwasher': 6,
            'handwash': 27,
            'efficient': 8
        };
        const dishUsage = (data.dishLoads * dishGallonsPerLoad[data.dishMethod]) / 7;
        
        // Garden watering (gallons per day)
        const gardenGallonsPerHour = 600; // Garden hose flow rate
        const gardenUsage = (data.gardenWatering * gardenGallonsPerHour) / 7;
        
        // Car washing (gallons per day)
        const carGallonsPerWash = 150; // Hose car washing
        const carUsage = (data.carWashing * carGallonsPerWash) / 30;
        
        // Other household usage (faucets, cooking, etc.)
        const otherUsage = data.familySize * 15; // Estimated 15 gallons per person per day
        
        const total = showerUsage + toiletUsage + laundryUsage + dishUsage + gardenUsage + carUsage + otherUsage;
        
        return {
            shower: showerUsage,
            toilet: toiletUsage,
            laundry: laundryUsage,
            dishes: dishUsage,
            garden: gardenUsage,
            car: carUsage,
            other: otherUsage,
            total: total
        };
    }

    function calculateEnvironmentalImpact(annualGallons) {
        // Water treatment and distribution energy consumption
        const kwhPerGallon = 0.0036; // Average energy per gallon
        const annualKwh = annualGallons * kwhPerGallon;
        
        // CO2 emissions from energy consumption
        const co2PerKwh = 0.92; // Pounds CO2 per kWh (US average)
        const annualCO2 = annualKwh * co2PerKwh;
        
        // Water treatment chemicals and infrastructure impact
        const chemicalImpact = annualGallons * 0.001; // Estimated chemical usage
        
        return {
            energyUsage: annualKwh,
            co2Emissions: annualCO2,
            chemicalImpact: chemicalImpact,
            ecosystemImpact: calculateEcosystemImpact(annualGallons)
        };
    }

    function calculateEcosystemImpact(annualGallons) {
        // Ecosystem impact scoring (1-10, where 10 is highest impact)
        let impact = 1;
        
        if (annualGallons > 150000) impact = 10; // Very high usage
        else if (annualGallons > 120000) impact = 8;
        else if (annualGallons > 100000) impact = 6;
        else if (annualGallons > 80000) impact = 4;
        else if (annualGallons > 60000) impact = 2;
        
        return {
            score: impact,
            description: getEcosystemDescription(impact)
        };
    }

    function getEcosystemDescription(score) {
        const descriptions = {
            1: "Minimal ecosystem impact - excellent water stewardship",
            2: "Low ecosystem impact - good conservation practices",
            4: "Moderate ecosystem impact - room for improvement",
            6: "Significant ecosystem impact - conservation needed",
            8: "High ecosystem impact - immediate action required",
            10: "Severe ecosystem impact - major conservation essential"
        };
        return descriptions[score] || descriptions[6];
    }

    function generateRecommendations(data, usage) {
        const recommendations = [];
        
        // Shower recommendations
        if (usage.shower > 50) {
            recommendations.push({
                category: "Showers",
                issue: "High shower water usage",
                solution: "Install low-flow showerheads and reduce shower time to 5 minutes",
                savings: Math.round(usage.shower * 0.3 * 365),
                cost: "$25-50",
                priority: "High"
            });
        }
        
        // Toilet recommendations
        if (data.toiletType === 'standard') {
            recommendations.push({
                category: "Toilets",
                issue: "Inefficient toilet system",
                solution: "Upgrade to WaterSense certified low-flow toilets",
                savings: Math.round((usage.toilet * 0.6) * 365),
                cost: "$200-400 per toilet",
                priority: "High"
            });
        }
        
        // Laundry recommendations
        if (usage.laundry > 25) {
            recommendations.push({
                category: "Laundry",
                issue: "High laundry water usage",
                solution: "Upgrade to ENERGY STAR washing machine and run full loads only",
                savings: Math.round(usage.laundry * 0.4 * 365),
                cost: "$500-1200",
                priority: "Medium"
            });
        }
        
        // Dish recommendations
        if (data.dishMethod === 'handwash') {
            recommendations.push({
                category: "Dishes",
                issue: "Inefficient dishwashing method",
                solution: "Use dishwasher for full loads or practice efficient hand washing",
                savings: Math.round(usage.dishes * 0.7 * 365),
                cost: "$0-800",
                priority: "Medium"
            });
        }
        
        // Garden recommendations
        if (usage.garden > 50) {
            recommendations.push({
                category: "Garden",
                issue: "High outdoor water usage",
                solution: "Install drip irrigation and choose drought-resistant plants",
                savings: Math.round(usage.garden * 0.5 * 365),
                cost: "$100-500",
                priority: "Medium"
            });
        }
        
        return recommendations;
    }

    function calculatePotentialSavings(data, usage) {
        let totalGallonSavings = 0;
        let totalCostSavings = 0;
        
        // Shower savings (30% with low-flow head + shorter showers)
        if (usage.shower > 30) {
            const showerSavings = usage.shower * 0.3 * 365;
            totalGallonSavings += showerSavings;
            totalCostSavings += showerSavings * data.waterRate;
        }
        
        // Toilet savings (60% with efficient toilets)
        if (data.toiletType === 'standard') {
            const toiletSavings = usage.toilet * 0.6 * 365;
            totalGallonSavings += toiletSavings;
            totalCostSavings += toiletSavings * data.waterRate;
        }
        
        // Laundry savings (40% with efficient machine)
        if (usage.laundry > 20) {
            const laundrySavings = usage.laundry * 0.4 * 365;
            totalGallonSavings += laundrySavings;
            totalCostSavings += laundrySavings * data.waterRate;
        }
        
        // Dish savings (70% switching from hand wash to dishwasher)
        if (data.dishMethod === 'handwash') {
            const dishSavings = usage.dishes * 0.7 * 365;
            totalGallonSavings += dishSavings;
            totalCostSavings += dishSavings * data.waterRate;
        }
        
        // Garden savings (50% with efficient irrigation)
        if (usage.garden > 30) {
            const gardenSavings = usage.garden * 0.5 * 365;
            totalGallonSavings += gardenSavings;
            totalCostSavings += gardenSavings * data.waterRate;
        }
        
        return {
            gallons: totalGallonSavings,
            cost: totalCostSavings,
            percentage: Math.round((totalGallonSavings / (usage.total * 365)) * 100)
        };
    }

    function displayResults(results) {
        const html = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-dark p-6 rounded-lg border border-accent">
                    <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                        <span class="material-icons mr-2">water_drop</span>
                        Daily Usage
                    </h3>
                    <div class="text-3xl font-bold text-primary mb-2">${Math.round(results.usage.total)} gallons</div>
                    <div class="text-light">${Math.round(results.usage.total / results.familySize)} gallons per person</div>
                </div>
                
                <div class="bg-dark p-6 rounded-lg border border-accent">
                    <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                        <span class="material-icons mr-2">attach_money</span>
                        Monthly Cost
                    </h3>
                    <div class="text-3xl font-bold text-primary mb-2">$${results.monthlyCost.toFixed(2)}</div>
                    <div class="text-light">$${results.annualCost.toFixed(2)} annually</div>
                </div>
                
                <div class="bg-dark p-6 rounded-lg border border-accent">
                    <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                        <span class="material-icons mr-2">eco</span>
                        CO2 Impact
                    </h3>
                    <div class="text-3xl font-bold text-primary mb-2">${Math.round(results.environmental.co2Emissions)} lbs</div>
                    <div class="text-light">CO2 per year</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div class="bg-dark p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-primary mb-4">Water Usage Breakdown</h3>
                    <div class="space-y-3">
                        ${generateUsageBreakdown(results.usage)}
                    </div>
                </div>
                
                <div class="bg-dark p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-primary mb-4">Environmental Impact</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-light">Annual Energy Usage:</span>
                            <span class="text-primary font-semibold">${Math.round(results.environmental.energyUsage)} kWh</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-light">Ecosystem Impact:</span>
                            <span class="text-primary font-semibold">${sanitizeText(results.environmental.ecosystemImpact.score)}/10</span>
                        </div>
                        <div class="text-light text-sm mt-2">
                            ${sanitizeText(results.environmental.ecosystemImpact.description)}
                        </div>
                    </div>
                </div>
            </div>

            ${results.savings.gallons > 0 ? `
            <div class="bg-primary bg-opacity-10 border border-primary p-6 rounded-lg mb-8">
                <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                    <span class="material-icons mr-2">savings</span>
                    Potential Savings
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">${Math.round(results.savings.gallons).toLocaleString()}</div>
                        <div class="text-light">Gallons/year</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">$${results.savings.cost.toFixed(2)}</div>
                        <div class="text-light">Annual savings</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">${sanitizeText(results.savings.percentage)}%</div>
                        <div class="text-light">Usage reduction</div>
                    </div>
                </div>
            </div>
            ` : ''}

            ${results.recommendations.length > 0 ? `
            <div class="bg-dark p-6 rounded-lg">
                <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                    <span class="material-icons mr-2">lightbulb</span>
                    Conservation Recommendations
                </h3>
                <div class="space-y-4">
                    ${results.recommendations.map(rec => `
                        <div class="border border-accent p-4 rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-semibold text-primary">${rec.category}</h4>
                                <span class="px-2 py-1 text-xs rounded ${rec.priority === 'High' ? 'bg-red-600' : 'bg-yellow-600'} text-white">
                                    ${sanitizeText(rec.priority)} Priority
                                </span>
                            </div>
                            <p class="text-light mb-2">${sanitizeText(rec.issue)}</p>
                            <p class="text-primary mb-2">${sanitizeText(rec.solution)}</p>
                            <div class="flex justify-between text-sm">
                                <span class="text-light">Potential savings: ${rec.savings.toLocaleString()} gallons/year</span>
                                <span class="text-light">Investment: ${sanitizeText(rec.cost)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        `;

        resultsContent.innerHTML = html;
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function generateUsageBreakdown(usage) {
        const categories = [
            { name: 'Showers', value: usage.shower, icon: 'shower' },
            { name: 'Toilets', value: usage.toilet, icon: 'wc' },
            { name: 'Laundry', value: usage.laundry, icon: 'local_laundry_service' },
            { name: 'Dishes', value: usage.dishes, icon: 'kitchen' },
            { name: 'Garden', value: usage.garden, icon: 'grass' },
            { name: 'Car Washing', value: usage.car, icon: 'local_car_wash' },
            { name: 'Other', value: usage.other, icon: 'home' }
        ];

        return categories.map(cat => {
            const percentage = Math.round((cat.value / usage.total) * 100);
            return `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <span class="material-icons text-primary mr-2">${sanitizeText(cat.icon)}</span>
                        <span class="text-light">${sanitizeText(cat.name)}</span>
                    </div>
                    <div class="text-right">
                        <div class="text-primary font-semibold">${Math.round(cat.value)} gal/day</div>
                        <div class="text-light text-sm">${sanitizeText(percentage)}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }
});
