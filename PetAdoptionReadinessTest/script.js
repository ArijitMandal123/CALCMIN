document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pet-adoption-form');
    const petTypeSelect = document.getElementById('petType');
    const petSizeSelect = document.getElementById('petSize');
    
    // Show/hide pet size based on pet type
    petTypeSelect.addEventListener('change', function() {
        if (this.value === 'dog') {
            petSizeSelect.parentElement.style.display = 'block';
            petSizeSelect.required = true;
        } else {
            petSizeSelect.parentElement.style.display = 'none';
            petSizeSelect.required = false;
            petSizeSelect.value = '';
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        if (validateInputs(formData)) {
            const results = calculatePetReadiness(formData);
            displayResults(results);
        }
    });
});

function collectFormData() {
    return {
        petType: document.getElementById('petType').value,
        petSize: document.getElementById('petSize').value,
        petAge: document.getElementById('petAge').value,
        breedType: document.getElementById('breedType').value,
        annualIncome: parseFloat(document.getElementById('annualIncome').value) || 0,
        emergencySavings: parseFloat(document.getElementById('emergencySavings').value) || 0,
        monthlyDebt: parseFloat(document.getElementById('monthlyDebt').value) || 0,
        discretionaryIncome: parseFloat(document.getElementById('discretionaryIncome').value) || 0,
        housingType: document.getElementById('housingType').value,
        workSchedule: document.getElementById('workSchedule').value,
        experienceLevel: document.getElementById('experienceLevel').value,
        insurancePreference: document.getElementById('insurancePreference').value
    };
}

function validateInputs(data) {
    if (!data.petType) {
        showPopup('Please select a pet type');
        return false;
    }
    if (data.petType === 'dog' && !data.petSize) {
        showPopup('Please select a pet size for dogs');
        return false;
    }
    if (!data.petAge) {
        showPopup('Please select pet age');
        return false;
    }
    if (data.annualIncome <= 0) {
        showPopup('Please enter a valid annual income');
        return false;
    }
    if (data.emergencySavings < 0) {
        showPopup('Emergency savings cannot be negative');
        return false;
    }
    if (data.monthlyDebt < 0) {
        showPopup('Monthly debt cannot be negative');
        return false;
    }
    if (data.discretionaryIncome < 0) {
        showPopup('Discretionary income cannot be negative');
        return false;
    }
    return true;
}

function calculatePetReadiness(data) {
    // Pet cost data
    const petCosts = {
        dog: {
            small: { initial: 800, annual: 1500, emergency: 3000, lifespan: 14 },
            medium: { initial: 1000, annual: 2000, emergency: 4000, lifespan: 12 },
            large: { initial: 1200, annual: 2500, emergency: 5000, lifespan: 10 },
            giant: { initial: 1500, annual: 3000, emergency: 6000, lifespan: 9 }
        },
        cat: { initial: 600, annual: 1200, emergency: 2500, lifespan: 15 },
        bird: { initial: 400, annual: 800, emergency: 1500, lifespan: 15 },
        rabbit: { initial: 300, annual: 600, emergency: 1200, lifespan: 10 },
        reptile: { initial: 500, annual: 400, emergency: 800, lifespan: 12 },
        fish: { initial: 200, annual: 300, emergency: 500, lifespan: 5 }
    };
    
    // Get pet-specific costs
    let petCostData;
    if (data.petType === 'dog') {
        petCostData = petCosts.dog[data.petSize];
    } else {
        petCostData = petCosts[data.petType];
    }
    
    // Age multipliers
    const ageMultipliers = {
        puppy: { initial: 1.3, annual: 1.2 },
        young: { initial: 1.0, annual: 1.0 },
        adult: { initial: 0.8, annual: 1.1 },
        senior: { initial: 0.6, annual: 1.4 }
    };
    
    // Breed multipliers
    const breedMultipliers = {
        mixed: 1.0,
        purebred: 1.3,
        designer: 1.5
    };
    
    // Insurance costs
    const insuranceCosts = {
        none: 0,
        basic: 300,
        comprehensive: 600
    };
    
    const ageMultiplier = ageMultipliers[data.petAge] || ageMultipliers.young;
    const breedMultiplier = breedMultipliers[data.breedType] || 1.0;
    
    // Calculate costs
    const initialCost = Math.round(petCostData.initial * ageMultiplier.initial * breedMultiplier);
    const annualCost = Math.round((petCostData.annual * ageMultiplier.annual * breedMultiplier) + insuranceCosts[data.insurancePreference]);
    const monthlyCost = Math.round(annualCost / 12);
    const emergencyFundNeeded = petCostData.emergency;
    const lifetimeCost = Math.round(initialCost + (annualCost * petCostData.lifespan));
    
    // Financial analysis
    const monthlyIncome = data.annualIncome / 12;
    const debtToIncomeRatio = (data.monthlyDebt / monthlyIncome) * 100;
    const petCostPercentage = (monthlyCost / monthlyIncome) * 100;
    const emergencyFundRatio = (data.emergencySavings / emergencyFundNeeded) * 100;
    
    // Readiness scoring
    let readinessScore = 100;
    let issues = [];
    let recommendations = [];
    
    // Income adequacy (30 points)
    if (petCostPercentage > 15) {
        readinessScore -= 30;
        issues.push('Pet costs exceed 15% of monthly income');
        recommendations.push('Consider a less expensive pet type or increase income');
    } else if (petCostPercentage > 10) {
        readinessScore -= 15;
        issues.push('Pet costs are high relative to income');
        recommendations.push('Budget carefully for pet expenses');
    }
    
    // Emergency fund (25 points)
    if (emergencyFundRatio < 50) {
        readinessScore -= 25;
        issues.push('Insufficient emergency fund for pet care');
        recommendations.push(`Build emergency fund to at least $${emergencyFundNeeded.toLocaleString()}`);
    } else if (emergencyFundRatio < 100) {
        readinessScore -= 10;
        issues.push('Emergency fund could be higher');
        recommendations.push('Consider increasing emergency savings');
    }
    
    // Debt burden (20 points)
    if (debtToIncomeRatio > 50) {
        readinessScore -= 20;
        issues.push('High debt-to-income ratio');
        recommendations.push('Pay down debt before adopting a pet');
    } else if (debtToIncomeRatio > 30) {
        readinessScore -= 10;
        issues.push('Moderate debt burden');
        recommendations.push('Monitor debt levels carefully');
    }
    
    // Discretionary income (15 points)
    if (data.discretionaryIncome < monthlyCost * 2) {
        readinessScore -= 15;
        issues.push('Limited discretionary income for unexpected expenses');
        recommendations.push('Increase discretionary income buffer');
    } else if (data.discretionaryIncome < monthlyCost * 3) {
        readinessScore -= 5;
        issues.push('Tight discretionary income');
        recommendations.push('Build larger financial cushion');
    }
    
    // Experience and lifestyle factors (10 points)
    if (data.experienceLevel === 'first-time' && (data.petType === 'dog' || data.breedType === 'purebred')) {
        readinessScore -= 5;
        recommendations.push('Consider starting with an easier pet or gaining experience');
    }
    
    if (data.workSchedule === 'overtime' && data.petType === 'dog') {
        readinessScore -= 5;
        issues.push('Long work hours may not be suitable for dogs');
        recommendations.push('Consider pet care services or a more independent pet');
    }
    
    // Determine readiness level
    let readinessLevel, readinessColor, readinessMessage;
    if (readinessScore >= 85) {
        readinessLevel = 'Excellent';
        readinessColor = 'green';
        readinessMessage = 'You are financially well-prepared for pet adoption!';
    } else if (readinessScore >= 70) {
        readinessLevel = 'Good';
        readinessColor = 'blue';
        readinessMessage = 'You are generally ready for pet adoption with minor considerations.';
    } else if (readinessScore >= 55) {
        readinessLevel = 'Fair';
        readinessColor = 'yellow';
        readinessMessage = 'You may be ready for pet adoption but should address some financial concerns first.';
    } else {
        readinessLevel = 'Poor';
        readinessColor = 'red';
        readinessMessage = 'Consider improving your financial situation before adopting a pet.';
    }
    
    return {
        costs: {
            initial: initialCost,
            monthly: monthlyCost,
            annual: annualCost,
            lifetime: lifetimeCost,
            emergencyFund: emergencyFundNeeded,
            lifespan: petCostData.lifespan
        },
        financial: {
            monthlyIncome: monthlyIncome,
            debtToIncomeRatio: debtToIncomeRatio,
            petCostPercentage: petCostPercentage,
            emergencyFundRatio: emergencyFundRatio
        },
        readiness: {
            score: Math.max(0, readinessScore),
            level: readinessLevel,
            color: readinessColor,
            message: readinessMessage,
            issues: issues,
            recommendations: recommendations
        }
    };
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    const readiness = results.readiness;
    const costs = results.costs;
    const financial = results.financial;
    
    contentDiv.innerHTML = `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">Pet Adoption Readiness Assessment</h3>
            
            <div class="bg-${readiness.color}-900/20 border border-${readiness.color}-600 rounded p-6 mb-6">
                <div class="flex items-center mb-4">
                    <div class="text-6xl font-bold text-${readiness.color}-400 mr-4">${readiness.score}</div>
                    <div>
                        <h4 class="text-2xl font-bold text-${readiness.color}-400">${readiness.level} Readiness</h4>
                        <p class="text-light">${readiness.message}</p>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-xl font-bold text-primary mb-4">Cost Breakdown</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-light">Initial Costs:</span>
                            <span class="font-semibold">$${costs.initial.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Monthly Costs:</span>
                            <span class="font-semibold">$${costs.monthly.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Annual Costs:</span>
                            <span class="font-semibold">$${costs.annual.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Emergency Fund Needed:</span>
                            <span class="font-semibold">$${costs.emergencyFund.toLocaleString()}</span>
                        </div>
                        <hr class="border-accent">
                        <div class="flex justify-between text-lg font-bold">
                            <span>Lifetime Cost (${costs.lifespan} years):</span>
                            <span class="text-primary">$${costs.lifetime.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-xl font-bold text-primary mb-4">Financial Analysis</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-light">Monthly Income:</span>
                            <span class="font-semibold">$${financial.monthlyIncome.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Pet Cost % of Income:</span>
                            <span class="font-semibold ${financial.petCostPercentage > 15 ? 'text-red-400' : financial.petCostPercentage > 10 ? 'text-yellow-400' : 'text-green-400'}">${financial.petCostPercentage.toFixed(1)}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Debt-to-Income Ratio:</span>
                            <span class="font-semibold ${financial.debtToIncomeRatio > 50 ? 'text-red-400' : financial.debtToIncomeRatio > 30 ? 'text-yellow-400' : 'text-green-400'}">${financial.debtToIncomeRatio.toFixed(1)}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Emergency Fund Coverage:</span>
                            <span class="font-semibold ${financial.emergencyFundRatio < 50 ? 'text-red-400' : financial.emergencyFundRatio < 100 ? 'text-yellow-400' : 'text-green-400'}">${financial.emergencyFundRatio.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${readiness.issues.length > 0 ? `
            <div class="bg-red-900/20 border border-red-600 rounded p-4 mb-6">
                <h5 class="font-semibold text-red-400 mb-2">Areas of Concern</h5>
                <ul class="text-sm text-light space-y-1">
                    ${readiness.issues.map(issue => `<li>• ${issue}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${readiness.recommendations.length > 0 ? `
            <div class="bg-blue-900/20 border border-blue-600 rounded p-4 mb-6">
                <h5 class="font-semibold text-blue-400 mb-2">Recommendations</h5>
                <ul class="text-sm text-light space-y-1">
                    ${readiness.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            <div class="bg-yellow-900/20 border border-yellow-600 rounded p-4">
                <h5 class="font-semibold text-yellow-400 mb-2">Important Notes</h5>
                <ul class="text-sm text-light space-y-1">
                    <li>• These estimates are based on average costs and may vary by location</li>
                    <li>• Consider pet insurance to help manage unexpected veterinary costs</li>
                    <li>• Senior pets may have higher medical expenses</li>
                    <li>• Factor in potential lifestyle changes and their financial impact</li>
                    <li>• Consult with local veterinarians for more accurate cost estimates</li>
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
        <p class="text-light mb-4">${message}</p>
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