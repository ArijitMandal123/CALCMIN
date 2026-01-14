// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('renewableEnergyForm');
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        analyzeRenewableEnergy();
    });

    function collectFormData() {
        return {
            location: document.getElementById('location').value,
            homeSize: parseInt(document.getElementById('homeSize').value),
            monthlyBill: parseFloat(document.getElementById('monthlyBill').value),
            monthlyKwh: parseInt(document.getElementById('monthlyKwh').value),
            roofCondition: document.getElementById('roofCondition').value,
            roofOrientation: document.getElementById('roofOrientation').value,
            shadingLevel: document.getElementById('shadingLevel').value,
            budget: parseFloat(document.getElementById('budget').value),
            independenceGoal: document.getElementById('independenceGoal').value,
            systemType: document.getElementById('systemType').value,
            timeline: document.getElementById('timeline').value
        };
    }

    function analyzeRenewableEnergy() {
        const data = collectFormData();
        
        // Calculate feasibility scores
        const solarFeasibility = calculateSolarFeasibility(data);
        const windFeasibility = calculateWindFeasibility(data);
        
        // Determine best system recommendation
        const recommendation = determineRecommendation(data, solarFeasibility, windFeasibility);
        
        // Calculate financial projections
        const financials = calculateFinancials(data, recommendation);
        
        // Calculate environmental impact
        const environmental = calculateEnvironmentalImpact(data, recommendation);
        
        displayResults({
            data,
            solarFeasibility,
            windFeasibility,
            recommendation,
            financials,
            environmental
        });
    }

    function calculateSolarFeasibility(data) {
        let score = 5; // Base score
        
        // Location factor (solar irradiance)
        const locationMultipliers = {
            'california': 1.3, 'arizona': 1.3, 'nevada': 1.2, 'texas': 1.1,
            'florida': 1.1, 'colorado': 1.0, 'north_carolina': 0.9,
            'new_york': 0.8, 'massachusetts': 0.8, 'other': 0.9
        };
        score *= locationMultipliers[data.location] || 0.9;
        
        // Roof orientation factor
        const orientationFactors = {
            'south': 1.0, 'southwest': 0.95, 'southeast': 0.95,
            'east_west': 0.85, 'north': 0.6, 'flat': 0.9
        };
        score *= orientationFactors[data.roofOrientation];
        
        // Shading factor
        const shadingFactors = {
            'none': 1.0, 'minimal': 0.9, 'moderate': 0.7, 'heavy': 0.4
        };
        score *= shadingFactors[data.shadingLevel];
        
        // Roof condition factor
        const roofFactors = {
            'excellent': 1.0, 'good': 0.95, 'fair': 0.8, 'poor': 0.5
        };
        score *= roofFactors[data.roofCondition];
        
        // Budget adequacy
        const estimatedCost = calculateSystemCost(data, 'solar');
        const budgetRatio = data.budget / estimatedCost;
        if (budgetRatio >= 1.0) score *= 1.1;
        else if (budgetRatio >= 0.8) score *= 1.0;
        else if (budgetRatio >= 0.6) score *= 0.9;
        else score *= 0.7;
        
        return Math.min(Math.max(score, 1), 10);
    }

    function calculateWindFeasibility(data) {
        let score = 3; // Lower base score for residential wind
        
        // Location factor (wind resources)
        const windLocationFactors = {
            'texas': 1.4, 'colorado': 1.3, 'california': 1.1, 'arizona': 0.8,
            'nevada': 1.0, 'florida': 0.7, 'north_carolina': 0.9,
            'new_york': 1.0, 'massachusetts': 1.1, 'other': 0.9
        };
        score *= windLocationFactors[data.location] || 0.9;
        
        // Home size factor (space for turbine)
        if (data.homeSize > 3000) score *= 1.2;
        else if (data.homeSize > 2000) score *= 1.0;
        else score *= 0.8;
        
        // Budget factor
        const windCost = calculateSystemCost(data, 'wind');
        const budgetRatio = data.budget / windCost;
        if (budgetRatio >= 1.0) score *= 1.1;
        else if (budgetRatio >= 0.8) score *= 1.0;
        else score *= 0.8;
        
        return Math.min(Math.max(score, 1), 10);
    }

    function calculateSystemCost(data, systemType) {
        const annualKwh = data.monthlyKwh * 12;
        
        if (systemType === 'solar') {
            // Solar cost: $2.50-4.00 per watt installed
            const systemSizeKw = annualKwh / 1200; // Rough sizing
            return systemSizeKw * 1000 * 3.25; // $3.25/watt average
        } else if (systemType === 'wind') {
            // Wind cost: $3,000-8,000 per kW installed
            const systemSizeKw = Math.min(annualKwh / 2000, 10); // Max 10kW residential
            return systemSizeKw * 5500; // $5.50/watt average
        } else if (systemType === 'hybrid') {
            const solarCost = calculateSystemCost(data, 'solar') * 0.7;
            const windCost = calculateSystemCost(data, 'wind') * 0.3;
            return solarCost + windCost;
        }
        
        return 0;
    }

    function determineRecommendation(data, solarScore, windScore) {
        let recommendedSystem = 'solar';
        let feasibilityScore = solarScore;
        
        if (data.systemType === 'wind' && windScore > 6) {
            recommendedSystem = 'wind';
            feasibilityScore = windScore;
        } else if (data.systemType === 'hybrid' && (solarScore + windScore) / 2 > 6) {
            recommendedSystem = 'hybrid';
            feasibilityScore = (solarScore + windScore) / 2;
        } else if (data.systemType === 'best') {
            if (windScore > solarScore && windScore > 6) {
                recommendedSystem = 'wind';
                feasibilityScore = windScore;
            } else if (solarScore > 7 && windScore > 5) {
                recommendedSystem = 'hybrid';
                feasibilityScore = (solarScore + windScore) / 2;
            }
        }
        
        const systemSize = calculateRecommendedSize(data, recommendedSystem);
        const estimatedCost = calculateSystemCost(data, recommendedSystem);
        
        return {
            system: recommendedSystem,
            score: feasibilityScore,
            size: systemSize,
            cost: estimatedCost,
            recommendation: getFeasibilityRecommendation(feasibilityScore)
        };
    }

    function calculateRecommendedSize(data, systemType) {
        const annualKwh = data.monthlyKwh * 12;
        
        // Adjust for independence goal
        const goalMultipliers = {
            'partial': 0.4, 'substantial': 0.65, 'complete': 1.0, 'surplus': 1.2
        };
        const targetKwh = annualKwh * goalMultipliers[data.independenceGoal];
        
        if (systemType === 'solar') {
            return {
                kw: Math.round(targetKwh / 1200 * 10) / 10,
                panels: Math.ceil(targetKwh / 1200 * 3.33), // ~300W panels
                roofArea: Math.ceil(targetKwh / 1200 * 100) // sq ft
            };
        } else if (systemType === 'wind') {
            return {
                kw: Math.min(Math.round(targetKwh / 2000 * 10) / 10, 10),
                turbines: 1,
                towerHeight: targetKwh > 8000 ? 80 : 60 // feet
            };
        } else if (systemType === 'hybrid') {
            const solarKw = Math.round(targetKwh * 0.7 / 1200 * 10) / 10;
            const windKw = Math.min(Math.round(targetKwh * 0.3 / 2000 * 10) / 10, 5);
            return {
                solarKw: solarKw,
                windKw: windKw,
                totalKw: solarKw + windKw
            };
        }
    }

    function calculateFinancials(data, recommendation) {
        const systemCost = recommendation.cost;
        const annualKwh = data.monthlyKwh * 12;
        const currentRate = data.monthlyBill / data.monthlyKwh;
        
        // Calculate incentives
        const federalTaxCredit = systemCost * 0.30; // 30% federal credit
        const stateIncentives = getStateIncentives(data.location, systemCost);
        const totalIncentives = federalTaxCredit + stateIncentives;
        const netCost = systemCost - totalIncentives;
        
        // Calculate energy production and savings
        const goalMultipliers = {
            'partial': 0.4, 'substantial': 0.65, 'complete': 1.0, 'surplus': 1.2
        };
        const annualProduction = annualKwh * goalMultipliers[data.independenceGoal];
        const annualSavings = annualProduction * currentRate;
        
        // Calculate payback period
        const paybackYears = netCost / annualSavings;
        
        // Calculate 25-year savings
        const inflationRate = 0.025; // 2.5% annual electricity rate increase
        let totalSavings = 0;
        for (let year = 1; year <= 25; year++) {
            const yearlyRate = currentRate * Math.pow(1 + inflationRate, year);
            totalSavings += annualProduction * yearlyRate;
        }
        const netProfit = totalSavings - systemCost;
        
        return {
            systemCost,
            federalTaxCredit,
            stateIncentives,
            totalIncentives,
            netCost,
            annualProduction,
            annualSavings,
            paybackYears,
            totalSavings,
            netProfit,
            roi: (netProfit / systemCost) * 100
        };
    }

    function getStateIncentives(location, systemCost) {
        const stateIncentives = {
            'california': systemCost * 0.15, // Additional state credits
            'massachusetts': Math.min(systemCost * 0.20, 6000),
            'new_york': Math.min(systemCost * 0.25, 5000),
            'colorado': Math.min(systemCost * 0.10, 2500),
            'texas': systemCost * 0.05,
            'florida': 0, // No state income tax
            'arizona': systemCost * 0.08,
            'nevada': systemCost * 0.06,
            'north_carolina': systemCost * 0.07,
            'other': systemCost * 0.05
        };
        
        return stateIncentives[location] || 0;
    }

    function calculateEnvironmentalImpact(data, recommendation) {
        const annualProduction = recommendation.size.kw ? recommendation.size.kw * 1200 : 
                                recommendation.size.solarKw ? (recommendation.size.solarKw * 1200 + recommendation.size.windKw * 2000) : 0;
        
        // CO2 reduction (0.92 lbs CO2 per kWh from grid)
        const annualCO2Reduction = annualProduction * 0.92; // pounds
        const lifetimeCO2Reduction = annualCO2Reduction * 25; // 25-year system life
        
        // Equivalent environmental benefits
        const treesEquivalent = Math.round(annualCO2Reduction / 48); // 48 lbs CO2 per tree per year
        const carMilesEquivalent = Math.round(annualCO2Reduction / 0.89); // 0.89 lbs CO2 per mile
        
        return {
            annualCO2Reduction,
            lifetimeCO2Reduction,
            treesEquivalent,
            carMilesEquivalent,
            annualProduction
        };
    }

    function getFeasibilityRecommendation(score) {
        if (score >= 8) return 'Excellent - Highly recommended';
        if (score >= 7) return 'Very Good - Recommended';
        if (score >= 6) return 'Good - Worth considering';
        if (score >= 5) return 'Fair - May be viable with improvements';
        if (score >= 4) return 'Poor - Significant challenges';
        return 'Not Recommended - Major obstacles';
    }

    function displayResults(results) {
        const { data, solarFeasibility, windFeasibility, recommendation, financials, environmental } = results;
        
        const html = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-dark p-6 rounded-lg border border-accent">
                    <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                        <span class="material-icons mr-2">star</span>
                        Feasibility Score
                    </h3>
                    <div class="text-3xl font-bold text-primary mb-2">${recommendation.score.toFixed(1)}/10</div>
                    <div class="text-light">${sanitizeText(recommendation.recommendation)}</div>
                </div>
                
                <div class="bg-dark p-6 rounded-lg border border-accent">
                    <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                        <span class="material-icons mr-2">attach_money</span>
                        Payback Period
                    </h3>
                    <div class="text-3xl font-bold text-primary mb-2">${financials.paybackYears.toFixed(1)} years</div>
                    <div class="text-light">Break-even timeline</div>
                </div>
                
                <div class="bg-dark p-6 rounded-lg border border-accent">
                    <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                        <span class="material-icons mr-2">eco</span>
                        CO2 Reduction
                    </h3>
                    <div class="text-3xl font-bold text-primary mb-2">${Math.round(environmental.annualCO2Reduction).toLocaleString()} lbs</div>
                    <div class="text-light">CO2 saved annually</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div class="bg-dark p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-primary mb-4">System Recommendation</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-light">Recommended System:</span>
                            <span class="text-primary font-semibold capitalize">${sanitizeText(recommendation.system)}</span>
                        </div>
                        ${generateSystemDetails(recommendation)}
                        <div class="flex justify-between items-center">
                            <span class="text-light">Estimated Cost:</span>
                            <span class="text-primary font-semibold">$${recommendation.cost.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-dark p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-primary mb-4">Financial Analysis</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-light">Federal Tax Credit (30%):</span>
                            <span class="text-primary font-semibold">$${financials.federalTaxCredit.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-light">State Incentives:</span>
                            <span class="text-primary font-semibold">$${financials.stateIncentives.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-light">Net Cost After Incentives:</span>
                            <span class="text-primary font-semibold">$${financials.netCost.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-light">Annual Energy Savings:</span>
                            <span class="text-primary font-semibold">$${financials.annualSavings.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            ${financials.paybackYears <= 12 ? `
            <div class="bg-primary bg-opacity-10 border border-primary p-6 rounded-lg mb-8">
                <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
                    <span class="material-icons mr-2">trending_up</span>
                    25-Year Financial Projection
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">$${financials.totalSavings.toLocaleString()}</div>
                        <div class="text-light">Total savings</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">$${financials.netProfit.toLocaleString()}</div>
                        <div class="text-light">Net profit</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">${financials.roi.toFixed(0)}%</div>
                        <div class="text-light">Return on investment</div>
                    </div>
                </div>
            </div>
            ` : ''}

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div class="bg-dark p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-primary mb-4">System Feasibility Breakdown</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-light">Solar Feasibility:</span>
                            <div class="flex items-center">
                                <span class="text-primary font-semibold mr-2">${solarFeasibility.toFixed(1)}/10</span>
                                <div class="w-20 bg-broder rounded-full h-2">
                                    <div class="bg-primary h-2 rounded-full" style="width: ${solarFeasibility * 10}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-light">Wind Feasibility:</span>
                            <div class="flex items-center">
                                <span class="text-primary font-semibold mr-2">${windFeasibility.toFixed(1)}/10</span>
                                <div class="w-20 bg-broder rounded-full h-2">
                                    <div class="bg-primary h-2 rounded-full" style="width: ${windFeasibility * 10}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-dark p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-primary mb-4">Environmental Impact</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-light">Trees Planted Equivalent:</span>
                            <span class="text-primary font-semibold">${sanitizeText(environmental.treesEquivalent)} trees/year</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-light">Car Miles Offset:</span>
                            <span class="text-primary font-semibold">${environmental.carMilesEquivalent.toLocaleString()} miles/year</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-light">25-Year CO2 Reduction:</span>
                            <span class="text-primary font-semibold">${Math.round(environmental.lifetimeCO2Reduction / 2000)} tons</span>
                        </div>
                    </div>
                </div>
            </div>

            ${generateRecommendations(results)}
        `;

        resultsContent.innerHTML = html;
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function generateSystemDetails(recommendation) {
        if (recommendation.system === 'solar') {
            return `
                <div class="flex justify-between items-center">
                    <span class="text-light">System Size:</span>
                    <span class="text-primary font-semibold">${sanitizeText(recommendation.size.kw)} kW</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-light">Number of Panels:</span>
                    <span class="text-primary font-semibold">${sanitizeText(recommendation.size.panels)} panels</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-light">Roof Area Needed:</span>
                    <span class="text-primary font-semibold">${sanitizeText(recommendation.size.roofArea)} sq ft</span>
                </div>
            `;
        } else if (recommendation.system === 'wind') {
            return `
                <div class="flex justify-between items-center">
                    <span class="text-light">Turbine Size:</span>
                    <span class="text-primary font-semibold">${sanitizeText(recommendation.size.kw)} kW</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-light">Tower Height:</span>
                    <span class="text-primary font-semibold">${sanitizeText(recommendation.size.towerHeight)} feet</span>
                </div>
            `;
        } else if (recommendation.system === 'hybrid') {
            return `
                <div class="flex justify-between items-center">
                    <span class="text-light">Solar Component:</span>
                    <span class="text-primary font-semibold">${sanitizeText(recommendation.size.solarKw)} kW</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-light">Wind Component:</span>
                    <span class="text-primary font-semibold">${sanitizeText(recommendation.size.windKw)} kW</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-light">Total System:</span>
                    <span class="text-primary font-semibold">${sanitizeText(recommendation.size.totalKw)} kW</span>
                </div>
            `;
        }
    }

    function generateRecommendations(results) {
        const { recommendation, financials } = results;
        
        if (recommendation.score < 5) {
            return `
                <div class="bg-red-900 bg-opacity-20 border border-red-500 p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-red-400 mb-4 flex items-center">
                        <span class="material-icons mr-2">warning</span>
                        Challenges Identified
                    </h3>
                    <div class="text-light">
                        <p class="mb-4">Based on your current situation, renewable energy may face significant challenges:</p>
                        <ul class="list-disc list-inside space-y-2">
                            <li>Consider improving roof condition or reducing shading</li>
                            <li>Explore community solar programs as an alternative</li>
                            <li>Wait for technology improvements or cost reductions</li>
                            <li>Focus on energy efficiency improvements first</li>
                        </ul>
                    </div>
                </div>
            `;
        } else if (recommendation.score >= 7) {
            return `
                <div class="bg-green-900 bg-opacity-20 border border-green-500 p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-green-400 mb-4 flex items-center">
                        <span class="material-icons mr-2">check_circle</span>
                        Excellent Opportunity
                    </h3>
                    <div class="text-light">
                        <p class="mb-4">Your property is well-suited for renewable energy. Next steps:</p>
                        <ul class="list-disc list-inside space-y-2">
                            <li>Get quotes from 3+ certified installers</li>
                            <li>Apply for permits and utility interconnection</li>
                            <li>Research financing options (loans, leases, PPAs)</li>
                            <li>Consider battery storage for energy independence</li>
                            <li>Plan installation during optimal weather months</li>
                        </ul>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="bg-yellow-900 bg-opacity-20 border border-yellow-500 p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                        <span class="material-icons mr-2">info</span>
                        Moderate Potential
                    </h3>
                    <div class="text-light">
                        <p class="mb-4">Renewable energy is viable but may require optimization:</p>
                        <ul class="list-disc list-inside space-y-2">
                            <li>Address shading issues through tree trimming</li>
                            <li>Consider roof improvements if needed</li>
                            <li>Explore smaller system sizes to fit budget</li>
                            <li>Look into additional state and local incentives</li>
                            <li>Consider phased installation approach</li>
                        </ul>
                    </div>
                </div>
            `;
        }
    }
});
