// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

    const form = document.getElementById('foodImpactForm');
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    const addFoodItemBtn = document.getElementById('addFoodItem');
    const foodItemsContainer = document.getElementById('foodItems');

    // Food database with environmental and health data
    const foodDatabase = {
        'strawberries': { category: 'dirty_dozen', pesticideReduction: 70, carbonSaving: 0.3, costMultiplier: 1.8, priority: 1 },
        'spinach': { category: 'dirty_dozen', pesticideReduction: 60, carbonSaving: 0.2, costMultiplier: 1.6, priority: 2 },
        'kale': { category: 'dirty_dozen', pesticideReduction: 55, carbonSaving: 0.25, costMultiplier: 1.7, priority: 3 },
        'peaches': { category: 'dirty_dozen', pesticideReduction: 50, carbonSaving: 0.4, costMultiplier: 1.9, priority: 4 },
        'pears': { category: 'dirty_dozen', pesticideReduction: 45, carbonSaving: 0.35, costMultiplier: 1.8, priority: 5 },
        'nectarines': { category: 'dirty_dozen', pesticideReduction: 48, carbonSaving: 0.4, costMultiplier: 2.0, priority: 6 },
        'apples': { category: 'dirty_dozen', pesticideReduction: 50, carbonSaving: 0.3, costMultiplier: 1.5, priority: 7 },
        'grapes': { category: 'dirty_dozen', pesticideReduction: 45, carbonSaving: 0.5, costMultiplier: 1.9, priority: 8 },
        'bell_peppers': { category: 'dirty_dozen', pesticideReduction: 40, carbonSaving: 0.3, costMultiplier: 1.7, priority: 9 },
        'cherries': { category: 'dirty_dozen', pesticideReduction: 42, carbonSaving: 0.4, costMultiplier: 2.2, priority: 10 },
        'blueberries': { category: 'dirty_dozen', pesticideReduction: 38, carbonSaving: 0.3, costMultiplier: 1.8, priority: 11 },
        'green_beans': { category: 'dirty_dozen', pesticideReduction: 35, carbonSaving: 0.2, costMultiplier: 1.6, priority: 12 },
        'avocados': { category: 'clean_fifteen', pesticideReduction: 5, carbonSaving: 0.1, costMultiplier: 1.3, priority: 15 },
        'sweet_corn': { category: 'clean_fifteen', pesticideReduction: 8, carbonSaving: 0.15, costMultiplier: 1.4, priority: 14 },
        'pineapple': { category: 'clean_fifteen', pesticideReduction: 3, carbonSaving: 0.6, costMultiplier: 1.5, priority: 16 },
        'onions': { category: 'clean_fifteen', pesticideReduction: 10, carbonSaving: 0.1, costMultiplier: 1.2, priority: 13 },
        'papaya': { category: 'clean_fifteen', pesticideReduction: 6, carbonSaving: 0.4, costMultiplier: 1.6, priority: 17 },
        'asparagus': { category: 'clean_fifteen', pesticideReduction: 7, carbonSaving: 0.2, costMultiplier: 1.8, priority: 18 },
        'cabbage': { category: 'clean_fifteen', pesticideReduction: 12, carbonSaving: 0.15, costMultiplier: 1.3, priority: 19 },
        'broccoli': { category: 'medium', pesticideReduction: 25, carbonSaving: 0.2, costMultiplier: 1.5, priority: 20 },
        'carrots': { category: 'medium', pesticideReduction: 30, carbonSaving: 0.15, costMultiplier: 1.4, priority: 21 },
        'tomatoes': { category: 'medium', pesticideReduction: 35, carbonSaving: 0.3, costMultiplier: 1.6, priority: 22 },
        'potatoes': { category: 'medium', pesticideReduction: 40, carbonSaving: 0.25, costMultiplier: 1.3, priority: 23 },
        'lettuce': { category: 'medium', pesticideReduction: 28, carbonSaving: 0.2, costMultiplier: 1.5, priority: 24 }
    };

    let foodItemCount = 0;

    // Add initial food item
    addFoodItem();

    addFoodItemBtn.addEventListener('click', addFoodItem);
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        analyzeFoodImpact();
    });

    function addFoodItem() {
        foodItemCount++;
        const foodItemDiv = document.createElement('div');
        foodItemDiv.className = 'food-item bg-broder p-4 rounded border border-accent';
        foodItemDiv.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <h4 class="text-primary font-semibold">Food Item ${sanitizeText(foodItemCount)}</h4>
                ${foodItemCount > 1 ? '<button type="button" class="remove-food-item text-red-400 hover:text-red-300"><span class="material-icons">close</span></button>' : ''}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-light mb-2">Food Type</label>
                    <select class="food-type w-full p-2 bg-dark border border-accent rounded text-text" required>
                        <option value="">Select food...</option>
                        <optgroup label="🍓 Dirty Dozen (High Priority)">
                            <option value="strawberries">Strawberries</option>
                            <option value="spinach">Spinach</option>
                            <option value="kale">Kale</option>
                            <option value="peaches">Peaches</option>
                            <option value="pears">Pears</option>
                            <option value="nectarines">Nectarines</option>
                            <option value="apples">Apples</option>
                            <option value="grapes">Grapes</option>
                            <option value="bell_peppers">Bell Peppers</option>
                            <option value="cherries">Cherries</option>
                            <option value="blueberries">Blueberries</option>
                            <option value="green_beans">Green Beans</option>
                        </optgroup>
                        <optgroup label="🥕 Medium Priority">
                            <option value="broccoli">Broccoli</option>
                            <option value="carrots">Carrots</option>
                            <option value="tomatoes">Tomatoes</option>
                            <option value="potatoes">Potatoes</option>
                            <option value="lettuce">Lettuce</option>
                        </optgroup>
                        <optgroup label="✅ Clean Fifteen (Low Priority)">
                            <option value="avocados">Avocados</option>
                            <option value="sweet_corn">Sweet Corn</option>
                            <option value="pineapple">Pineapple</option>
                            <option value="onions">Onions</option>
                            <option value="papaya">Papaya</option>
                            <option value="asparagus">Asparagus</option>
                            <option value="cabbage">Cabbage</option>
                        </optgroup>
                    </select>
                </div>
                <div>
                    <label class="block text-light mb-2">Weekly Consumption (lbs)</label>
                    <input type="number" class="weekly-consumption w-full p-2 bg-dark border border-accent rounded text-text" 
                           min="0.1" max="20" step="0.1" value="1" required>
                </div>
                <div>
                    <label class="block text-light mb-2">Current Choice</label>
                    <select class="current-choice w-full p-2 bg-dark border border-accent rounded text-text" required>
                        <option value="conventional">Conventional</option>
                        <option value="organic">Organic</option>
                        <option value="mixed">Mixed (50/50)</option>
                    </select>
                </div>
            </div>
        `;

        foodItemsContainer.appendChild(foodItemDiv);

        // Add remove functionality
        const removeBtn = foodItemDiv.querySelector('.remove-food-item');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                foodItemDiv.remove();
            });
        }
    }

    function collectFormData() {
        const foodItems = [];
        document.querySelectorAll('.food-item').forEach(item => {
            const foodType = item.querySelector('.food-type').value;
            const weeklyConsumption = parseFloat(item.querySelector('.weekly-consumption').value);
            const currentChoice = item.querySelector('.current-choice').value;
            
            if (foodType && weeklyConsumption) {
                foodItems.push({
                    type: foodType,
                    weeklyConsumption,
                    currentChoice,
                    data: foodDatabase[foodType]
                });
            }
        });

        return {
            foodItems,
            monthlyBudget: parseFloat(document.getElementById('monthlyBudget').value),
            priorityFactor: document.getElementById('priorityFactor').value,
            sourcingPreference: document.getElementById('sourcingPreference').value,
            householdSize: parseInt(document.getElementById('householdSize').value)
        };
    }

    function analyzeFoodImpact() {
        const data = collectFormData();
        
        if (data.foodItems.length === 0) {
            alert('Please add at least one food item.');
            return;
        }

        // Calculate current impact
        const currentImpact = calculateCurrentImpact(data);
        
        // Generate recommendations
        const recommendations = generateRecommendations(data);
        
        // Calculate potential improvements
        const improvements = calculateImprovements(data, recommendations);
        
        displayResults({
            currentImpact,
            recommendations,
            improvements,
            data
        });
    }

    function calculateCurrentImpact(data) {
        let totalCost = 0;
        let totalPesticideExposure = 0;
        let totalCarbonFootprint = 0;
        let organicPercentage = 0;

        data.foodItems.forEach(item => {
            const annualConsumption = item.weeklyConsumption * 52;
            const basePrice = getBasePrice(item.type);
            
            let itemCost = basePrice * annualConsumption;
            let pesticideExposure = 100; // Base conventional exposure
            let carbonFootprint = getCarbonFootprint(item.type, data.sourcingPreference);

            if (item.currentChoice === 'organic') {
                itemCost *= item.data.costMultiplier;
                pesticideExposure *= (1 - item.data.pesticideReduction / 100);
                carbonFootprint *= (1 - item.data.carbonSaving);
                organicPercentage += annualConsumption;
            } else if (item.currentChoice === 'mixed') {
                itemCost *= (1 + item.data.costMultiplier) / 2;
                pesticideExposure *= (1 - item.data.pesticideReduction / 200);
                carbonFootprint *= (1 - item.data.carbonSaving / 2);
                organicPercentage += annualConsumption * 0.5;
            }

            totalCost += itemCost;
            totalPesticideExposure += pesticideExposure * annualConsumption;
            totalCarbonFootprint += carbonFootprint * annualConsumption;
        });

        const totalConsumption = data.foodItems.reduce((sum, item) => sum + (item.weeklyConsumption * 52), 0);
        organicPercentage = (organicPercentage / totalConsumption) * 100;

        return {
            annualCost: totalCost,
            monthlyCost: totalCost / 12,
            pesticideExposure: totalPesticideExposure / totalConsumption,
            carbonFootprint: totalCarbonFootprint,
            organicPercentage: Math.round(organicPercentage)
        };
    }

    function generateRecommendations(data) {
        const recommendations = [];
        
        // Sort foods by priority based on user preference
        const sortedFoods = [...data.foodItems].sort((a, b) => {
            if (data.priorityFactor === 'health') {
                return b.data.pesticideReduction - a.data.pesticideReduction;
            } else if (data.priorityFactor === 'environment') {
                return b.data.carbonSaving - a.data.carbonSaving;
            } else if (data.priorityFactor === 'cost') {
                return a.data.costMultiplier - b.data.costMultiplier;
            } else { // balanced
                return a.data.priority - b.data.priority;
            }
        });

        sortedFoods.forEach((item, index) => {
            const currentlyOrganic = item.currentChoice === 'organic';
            const priority = getPriorityLevel(item.data.category, item.data.pesticideReduction);
            
            let recommendation = 'maintain';
            let reason = '';
            
            if (!currentlyOrganic && item.data.category === 'dirty_dozen') {
                recommendation = 'switch_to_organic';
                reason = `High pesticide reduction (${sanitizeText(item.data.pesticideReduction)}%) and significant health benefits`;
            } else if (!currentlyOrganic && item.data.category === 'clean_fifteen') {
                recommendation = 'stay_conventional';
                reason = `Low pesticide residues make organic less cost-effective`;
            } else if (!currentlyOrganic && item.data.category === 'medium') {
                recommendation = index < 3 ? 'consider_organic' : 'stay_conventional';
                reason = index < 3 ? 'Moderate benefits within budget priority' : 'Lower priority for organic upgrade';
            }

            recommendations.push({
                food: item.type,
                currentChoice: item.currentChoice,
                recommendation,
                reason,
                priority,
                pesticideReduction: item.data.pesticideReduction,
                costIncrease: (item.data.costMultiplier - 1) * 100,
                weeklyConsumption: item.weeklyConsumption
            });
        });

        return recommendations;
    }

    function calculateImprovements(data, recommendations) {
        let potentialCostIncrease = 0;
        let potentialPesticideReduction = 0;
        let potentialCarbonReduction = 0;
        let organicSwitches = 0;

        recommendations.forEach(rec => {
            if (rec.recommendation === 'switch_to_organic' || rec.recommendation === 'consider_organic') {
                const item = data.foodItems.find(f => f.type === rec.food);
                const annualConsumption = rec.weeklyConsumption * 52;
                const basePrice = getBasePrice(rec.food);
                
                potentialCostIncrease += basePrice * annualConsumption * (item.data.costMultiplier - 1);
                potentialPesticideReduction += rec.pesticideReduction * annualConsumption;
                potentialCarbonReduction += item.data.carbonSaving * getCarbonFootprint(rec.food, data.sourcingPreference) * annualConsumption;
                organicSwitches++;
            }
        });

        return {
            costIncrease: potentialCostIncrease,
            monthlyCostIncrease: potentialCostIncrease / 12,
            pesticideReduction: potentialPesticideReduction,
            carbonReduction: potentialCarbonReduction,
            organicSwitches,
            budgetFit: potentialCostIncrease / 12 <= data.monthlyBudget * 0.3 // Within 30% of budget
        };
    }

    function getBasePrice(foodType) {
        // Base prices per pound (conventional)
        const prices = {
            'strawberries': 4.50, 'spinach': 3.00, 'kale': 2.50, 'peaches': 2.80, 'pears': 2.20,
            'nectarines': 3.20, 'apples': 1.80, 'grapes': 3.50, 'bell_peppers': 2.90, 'cherries': 5.50,
            'blueberries': 4.20, 'green_beans': 2.40, 'avocados': 2.00, 'sweet_corn': 1.50,
            'pineapple': 2.80, 'onions': 1.20, 'papaya': 2.50, 'asparagus': 4.00, 'cabbage': 1.00,
            'broccoli': 2.20, 'carrots': 1.30, 'tomatoes': 2.50, 'potatoes': 1.50, 'lettuce': 2.00
        };
        return prices[foodType] || 2.00;
    }

    function getCarbonFootprint(foodType, sourcingPreference) {
        // Base carbon footprint per pound (kg CO2)
        const baseCO2 = {
            'strawberries': 1.2, 'spinach': 0.8, 'kale': 0.9, 'peaches': 1.1, 'pears': 1.0,
            'nectarines': 1.1, 'apples': 0.7, 'grapes': 1.5, 'bell_peppers': 1.3, 'cherries': 1.4,
            'blueberries': 1.6, 'green_beans': 1.0, 'avocados': 2.5, 'sweet_corn': 0.6,
            'pineapple': 2.0, 'onions': 0.5, 'papaya': 1.8, 'asparagus': 2.2, 'cabbage': 0.4,
            'broccoli': 0.9, 'carrots': 0.3, 'tomatoes': 1.1, 'potatoes': 0.4, 'lettuce': 0.8
        };

        const multipliers = {
            'local': 1.0,
            'regional': 1.2,
            'national': 1.5,
            'international': 2.0
        };

        return (baseCO2[foodType] || 1.0) * (multipliers[sourcingPreference] || 1.0);
    }

    function getPriorityLevel(category, pesticideReduction) {
        if (category === 'dirty_dozen' || pesticideReduction > 40) return 'High';
        if (category === 'medium' || pesticideReduction > 20) return 'Medium';
        return 'Low';
    }

    function displayResults(results) {
        const html = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-dark p-6 rounded-lg border border-accent">
                    <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                        <span class="material-icons mr-2">attach_money</span>
                        Current Annual Cost
                    </h3>
                    <div class="text-3xl font-bold text-primary mb-2">$${results.currentImpact.annualCost.toFixed(0)}</div>
                    <div class="text-light">$${results.currentImpact.monthlyCost.toFixed(0)} per month</div>
                </div>
                
                <div class="bg-dark p-6 rounded-lg border border-accent">
                    <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                        <span class="material-icons mr-2">eco</span>
                        Organic Percentage
                    </h3>
                    <div class="text-3xl font-bold text-primary mb-2">${sanitizeText(results.currentImpact.organicPercentage)}%</div>
                    <div class="text-light">of your food purchases</div>
                </div>
                
                <div class="bg-dark p-6 rounded-lg border border-accent">
                    <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                        <span class="material-icons mr-2">warning</span>
                        Pesticide Exposure
                    </h3>
                    <div class="text-3xl font-bold text-primary mb-2">${Math.round(results.currentImpact.pesticideExposure)}</div>
                    <div class="text-light">relative exposure index</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div class="bg-dark p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-primary mb-4">Environmental Impact</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-light">Annual Carbon Footprint:</span>
                            <span class="text-primary font-semibold">${results.currentImpact.carbonFootprint.toFixed(1)} kg CO2</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-light">Potential CO2 Reduction:</span>
                            <span class="text-primary font-semibold">${results.improvements.carbonReduction.toFixed(1)} kg CO2</span>
                        </div>
                        <div class="text-light text-sm mt-2">
                            Equivalent to ${Math.round(results.improvements.carbonReduction * 2.2)} miles of driving saved
                        </div>
                    </div>
                </div>
                
                <div class="bg-dark p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-primary mb-4">Budget Analysis</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-light">Monthly Budget:</span>
                            <span class="text-primary font-semibold">$${sanitizeText(results.data.monthlyBudget)}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-light">Current Monthly Cost:</span>
                            <span class="text-primary font-semibold">$${results.currentImpact.monthlyCost.toFixed(0)}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-light">Potential Increase:</span>
                            <span class="text-primary font-semibold">$${results.improvements.monthlyCostIncrease.toFixed(0)}</span>
                        </div>
                        <div class="text-light text-sm mt-2">
                            ${results.improvements.budgetFit ? '✅ Within recommended budget' : '⚠️ May exceed budget - prioritize high-impact foods'}
                        </div>
                    </div>
                </div>
            </div>

            ${results.improvements.organicSwitches > 0 ? `
            <div class="bg-primary bg-opacity-10 border border-primary p-6 rounded-lg mb-8">
                <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                    <span class="material-icons mr-2">trending_up</span>
                    Potential Improvements
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">${results.improvements.organicSwitches}</div>
                        <div class="text-light">Foods to switch</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">${Math.round(results.improvements.pesticideReduction)}%</div>
                        <div class="text-light">Pesticide reduction</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">$${results.improvements.monthlyCostIncrease.toFixed(0)}</div>
                        <div class="text-light">Monthly increase</div>
                    </div>
                </div>
            </div>
            ` : ''}

            <div class="bg-dark p-6 rounded-lg">
                <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                    <span class="material-icons mr-2">recommend</span>
                    Personalized Recommendations
                </h3>
                <div class="space-y-4">
                    ${results.recommendations.map(rec => `
                        <div class="border border-accent p-4 rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-semibold text-primary capitalize">${rec.food.replace('_', ' ')}</h4>
                                <span class="px-2 py-1 text-xs rounded ${rec.priority === 'High' ? 'bg-red-600' : rec.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'} text-white">
                                    ${sanitizeText(rec.priority)} Priority
                                </span>
                            </div>
                            <p class="text-light mb-2">${getRecommendationText(rec.recommendation)}</p>
                            <p class="text-primary text-sm mb-2">${sanitizeText(rec.reason)}</p>
                            <div class="flex justify-between text-sm">
                                <span class="text-light">Pesticide reduction: ${sanitizeText(rec.pesticideReduction)}%</span>
                                <span class="text-light">Cost increase: ${rec.costIncrease.toFixed(0)}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        resultsContent.innerHTML = html;
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function getRecommendationText(recommendation) {
        const texts = {
            'switch_to_organic': '🔄 Switch to organic for maximum health and environmental benefits',
            'consider_organic': '🤔 Consider switching to organic when budget allows',
            'stay_conventional': '✅ Conventional is fine - focus organic budget elsewhere',
            'maintain': '👍 Continue current approach'
        };
        return texts[recommendation] || 'No specific recommendation';
    }
});
