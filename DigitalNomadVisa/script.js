// Digital Nomad Visa Feasibility Checker Calculator

// Visa data for different countries
const visaData = {
    // Europe
    portugal: { name: "Portugal", minIncome: 2800, duration: 12, region: "europe", costOfLiving: { budget: 1200, moderate: 1600, comfortable: 2000, luxury: 2800 } },
    estonia: { name: "Estonia", minIncome: 3500, duration: 12, region: "europe", costOfLiving: { budget: 1000, moderate: 1400, comfortable: 1800, luxury: 2500 } },
    spain: { name: "Spain", minIncome: 2400, duration: 12, region: "europe", costOfLiving: { budget: 1500, moderate: 2000, comfortable: 2500, luxury: 3500 } },
    croatia: { name: "Croatia", minIncome: 2300, duration: 12, region: "europe", costOfLiving: { budget: 1100, moderate: 1500, comfortable: 2000, luxury: 2800 } },
    czech: { name: "Czech Republic", minIncome: 2500, duration: 12, region: "europe", costOfLiving: { budget: 1000, moderate: 1400, comfortable: 1800, luxury: 2500 } },
    
    // Americas
    barbados: { name: "Barbados", minIncome: 5000, duration: 12, region: "caribbean", costOfLiving: { budget: 2000, moderate: 2800, comfortable: 3500, luxury: 5000 } },
    costarica: { name: "Costa Rica", minIncome: 3000, duration: 24, region: "americas", costOfLiving: { budget: 1200, moderate: 1700, comfortable: 2200, luxury: 3200 } },
    mexico: { name: "Mexico", minIncome: 2500, duration: 48, region: "americas", costOfLiving: { budget: 800, moderate: 1300, comfortable: 1800, luxury: 2800 } },
    bermuda: { name: "Bermuda", minIncome: 6000, duration: 12, region: "caribbean", costOfLiving: { budget: 3000, moderate: 4000, comfortable: 5000, luxury: 7000 } },
    
    // Asia
    dubai: { name: "Dubai, UAE", minIncome: 5000, duration: 12, region: "asia", costOfLiving: { budget: 2500, moderate: 3200, comfortable: 4000, luxury: 6000 } },
    malaysia: { name: "Malaysia", minIncome: 2400, duration: 12, region: "asia", costOfLiving: { budget: 800, moderate: 1200, comfortable: 1500, luxury: 2200 } },
    thailand: { name: "Thailand", minIncome: 2500, duration: 48, region: "asia", costOfLiving: { budget: 700, moderate: 1100, comfortable: 1400, luxury: 2000 } },
    singapore: { name: "Singapore", minIncome: 6000, duration: 24, region: "asia", costOfLiving: { budget: 2800, moderate: 3500, comfortable: 4500, luxury: 6500 } },
    
    // Africa
    capeverde: { name: "Cape Verde", minIncome: 1500, duration: 6, region: "africa", costOfLiving: { budget: 600, moderate: 900, comfortable: 1200, luxury: 1800 } },
    mauritius: { name: "Mauritius", minIncome: 1500, duration: 12, region: "africa", costOfLiving: { budget: 800, moderate: 1200, comfortable: 1600, luxury: 2400 } },
    
    // Oceania
    australia: { name: "Australia", minIncome: 4500, duration: 12, region: "oceania", costOfLiving: { budget: 2200, moderate: 2800, comfortable: 3500, luxury: 5000 } }
};

// Family size multipliers
const familyMultipliers = {
    1: 1.0,
    2: 1.6,
    3: 2.1,
    4: 2.5,
    5: 3.0
};

// Work type requirements
const workTypeRequirements = {
    employee: { multiplier: 1.0, description: "Remote employee for foreign company" },
    freelancer: { multiplier: 1.2, description: "Freelancer serving international clients" },
    entrepreneur: { multiplier: 1.5, description: "Entrepreneur with established business" },
    investor: { multiplier: 2.0, description: "Investor with passive income streams" }
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('nomad-visa-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateVisaFeasibility();
    });
});

function collectFormData() {
    const selectedRegions = Array.from(document.querySelectorAll('input[name="regions"]:checked')).map(cb => cb.value);
    
    return {
        monthlyIncome: parseInt(document.getElementById('monthly-income').value),
        currentLocation: document.getElementById('current-location').value,
        familySize: parseInt(document.getElementById('family-size').value),
        costPreference: document.getElementById('cost-preference').value,
        preferredRegions: selectedRegions,
        visaDuration: document.getElementById('visa-duration').value,
        workType: document.getElementById('work-type').value
    };
}

function calculateVisaFeasibility() {
    const data = collectFormData();
    
    if (!data.monthlyIncome || data.preferredRegions.length === 0) {
        showModal('Error', 'Please fill in all required fields and select at least one preferred region.');
        return;
    }
    
    const results = analyzeVisaOptions(data);
    displayResults(results, data);
}

function analyzeVisaOptions(data) {
    const familyMultiplier = familyMultipliers[data.familySize];
    const workMultiplier = workTypeRequirements[data.workType].multiplier;
    const adjustedIncome = data.monthlyIncome / (familyMultiplier * workMultiplier);
    
    const eligibleVisas = [];
    const ineligibleVisas = [];
    
    Object.entries(visaData).forEach(([key, visa]) => {
        if (data.preferredRegions.includes(visa.region)) {
            const costOfLiving = visa.costOfLiving[data.costPreference];
            const incomeRatio = data.monthlyIncome / (costOfLiving * familyMultiplier);
            const meetsIncomeReq = adjustedIncome >= visa.minIncome;
            
            const visaAnalysis = {
                ...visa,
                key: key,
                meetsRequirement: meetsIncomeReq,
                incomeRatio: incomeRatio,
                requiredIncome: visa.minIncome * familyMultiplier * workMultiplier,
                estimatedCostOfLiving: costOfLiving * familyMultiplier,
                financialBuffer: incomeRatio - 1,
                riskLevel: getRiskLevel(incomeRatio),
                taxImplications: getTaxImplications(visa.name, data.currentLocation)
            };
            
            if (meetsIncomeReq) {
                eligibleVisas.push(visaAnalysis);
            } else {
                ineligibleVisas.push(visaAnalysis);
            }
        }
    });
    
    // Sort by financial buffer (higher is better)
    eligibleVisas.sort((a, b) => b.financialBuffer - a.financialBuffer);
    ineligibleVisas.sort((a, b) => (b.requiredIncome - data.monthlyIncome) - (a.requiredIncome - data.monthlyIncome));
    
    return {
        eligible: eligibleVisas,
        ineligible: ineligibleVisas.slice(0, 5), // Show top 5 close options
        totalAnalyzed: eligibleVisas.length + ineligibleVisas.length,
        recommendations: generateRecommendations(data, eligibleVisas)
    };
}

function getRiskLevel(incomeRatio) {
    if (incomeRatio >= 3.0) return { level: "Very Low", color: "text-green-400", description: "Excellent financial cushion" };
    if (incomeRatio >= 2.0) return { level: "Low", color: "text-green-300", description: "Good financial security" };
    if (incomeRatio >= 1.5) return { level: "Moderate", color: "text-yellow-400", description: "Adequate but tight budget" };
    if (incomeRatio >= 1.2) return { level: "High", color: "text-orange-400", description: "Limited financial flexibility" };
    return { level: "Very High", color: "text-red-400", description: "Insufficient financial buffer" };
}

function getTaxImplications(country, currentLocation) {
    const taxInfo = {
        "Portugal": "0% tax for first year, then progressive rates",
        "Estonia": "No tax on foreign-sourced income",
        "Spain": "24% tax rate for non-residents",
        "Dubai, UAE": "0% personal income tax",
        "Malaysia": "0% tax for first 6 months",
        "Thailand": "Progressive tax rates 5-35%",
        "Barbados": "2.5% tax on foreign income",
        "Costa Rica": "Territorial tax system",
        "Mexico": "Progressive tax rates 1.92-35%"
    };
    
    return taxInfo[country] || "Consult tax professional for specific rates";
}

function generateRecommendations(data, eligibleVisas) {
    const recommendations = [];
    
    if (eligibleVisas.length === 0) {
        recommendations.push({
            type: "income",
            title: "Increase Your Income",
            description: `Consider increasing your monthly income to at least $${Math.min(...Object.values(visaData).map(v => v.minIncome * familyMultipliers[data.familySize]))} to qualify for entry-level visas.`
        });
    }
    
    if (eligibleVisas.length > 0) {
        const bestOption = eligibleVisas[0];
        recommendations.push({
            type: "best",
            title: `${bestOption.name} - Top Recommendation`,
            description: `Best financial fit with ${(bestOption.financialBuffer * 100).toFixed(0)}% income buffer above living costs.`
        });
    }
    
    if (data.preferredRegions.length === 1) {
        recommendations.push({
            type: "diversify",
            title: "Consider Multiple Regions",
            description: "Selecting multiple regions increases your visa options and provides backup plans."
        });
    }
    
    return recommendations;
}

function displayResults(results, data) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    let html = `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">
                <span class="material-icons align-middle mr-2">assessment</span>
                Your Visa Feasibility Analysis
            </h3>
            <div class="grid md:grid-cols-3 gap-4 mb-6">
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-primary">${results.eligible.length}</div>
                    <div class="text-sm text-light">Eligible Visas</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-accent">${results.totalAnalyzed}</div>
                    <div class="text-sm text-light">Total Analyzed</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-light">$${data.monthlyIncome.toLocaleString()}</div>
                    <div class="text-sm text-light">Your Income</div>
                </div>
            </div>
        </div>
    `;
    
    // Recommendations
    if (results.recommendations.length > 0) {
        html += `
            <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
                <h4 class="text-xl font-semibold text-primary mb-4">Key Recommendations</h4>
                <div class="space-y-3">
                    ${results.recommendations.map(rec => `
                        <div class="flex items-start gap-3">
                            <span class="material-icons text-primary mt-1">lightbulb</span>
                            <div>
                                <div class="font-medium text-text">${rec.title}</div>
                                <div class="text-sm text-light">${rec.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Eligible visas
    if (results.eligible.length > 0) {
        html += `
            <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
                <h4 class="text-xl font-semibold text-primary mb-4">
                    <span class="material-icons align-middle mr-2">check_circle</span>
                    Visas You Qualify For
                </h4>
                <div class="space-y-4">
                    ${results.eligible.map(visa => `
                        <div class="bg-dark p-4 rounded border border-accent">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <h5 class="font-semibold text-accent text-lg">${visa.name}</h5>
                                    <div class="text-sm text-light">${visa.duration} month visa • ${visa.region}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm ${visa.riskLevel.color}">${visa.riskLevel.level} Risk</div>
                                    <div class="text-xs text-light">${visa.riskLevel.description}</div>
                                </div>
                            </div>
                            <div class="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div class="text-light">Required Income: <span class="text-text">$${visa.requiredIncome.toLocaleString()}/month</span></div>
                                    <div class="text-light">Est. Living Cost: <span class="text-text">$${visa.estimatedCostOfLiving.toLocaleString()}/month</span></div>
                                </div>
                                <div>
                                    <div class="text-light">Financial Buffer: <span class="text-green-400">${(visa.financialBuffer * 100).toFixed(0)}%</span></div>
                                    <div class="text-light">Tax Info: <span class="text-text">${visa.taxImplications}</span></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Close options (ineligible but close)
    if (results.ineligible.length > 0) {
        html += `
            <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
                <h4 class="text-xl font-semibold text-accent mb-4">
                    <span class="material-icons align-middle mr-2">trending_up</span>
                    Close Options (Increase Income)
                </h4>
                <div class="space-y-4">
                    ${results.ineligible.map(visa => `
                        <div class="bg-dark p-4 rounded border border-accent opacity-75">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <h5 class="font-semibold text-light text-lg">${visa.name}</h5>
                                    <div class="text-sm text-light">${visa.duration} month visa • ${visa.region}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm text-red-400">Need +$${(visa.requiredIncome - data.monthlyIncome).toLocaleString()}</div>
                                    <div class="text-xs text-light">Additional monthly income</div>
                                </div>
                            </div>
                            <div class="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div class="text-light">Required Income: <span class="text-text">$${visa.requiredIncome.toLocaleString()}/month</span></div>
                                    <div class="text-light">Est. Living Cost: <span class="text-text">$${visa.estimatedCostOfLiving.toLocaleString()}/month</span></div>
                                </div>
                                <div>
                                    <div class="text-light">Your Income: <span class="text-red-400">$${data.monthlyIncome.toLocaleString()}/month</span></div>
                                    <div class="text-light">Tax Info: <span class="text-text">${visa.taxImplications}</span></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Next steps
    html += `
        <div class="bg-broder rounded-lg p-6 border border-accent">
            <h4 class="text-xl font-semibold text-primary mb-4">
                <span class="material-icons align-middle mr-2">map</span>
                Next Steps
            </h4>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-3">
                    <div class="flex items-start gap-3">
                        <span class="material-icons text-primary mt-1">description</span>
                        <div>
                            <div class="font-medium text-text">Gather Documentation</div>
                            <div class="text-sm text-light">Bank statements, income proof, health insurance, criminal background check</div>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <span class="material-icons text-primary mt-1">health_and_safety</span>
                        <div>
                            <div class="font-medium text-text">Secure Health Insurance</div>
                            <div class="text-sm text-light">Comprehensive coverage meeting visa requirements</div>
                        </div>
                    </div>
                </div>
                <div class="space-y-3">
                    <div class="flex items-start gap-3">
                        <span class="material-icons text-primary mt-1">account_balance</span>
                        <div>
                            <div class="font-medium text-text">Consult Tax Professional</div>
                            <div class="text-sm text-light">Understand tax obligations in both countries</div>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <span class="material-icons text-primary mt-1">schedule</span>
                        <div>
                            <div class="font-medium text-text">Apply Early</div>
                            <div class="text-sm text-light">Start application 2-3 months before intended travel</div>
                        </div>
                    </div>
                </div>
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