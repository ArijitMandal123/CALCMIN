// Business Breakeven Analysis Tool
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('breakeven-form');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateBreakeven();
    });

    function calculateBreakeven() {
        // Collect form data
        const fixedCosts = parseFloat(document.getElementById('fixed-costs').value);
        const variableCost = parseFloat(document.getElementById('variable-cost').value);
        const sellingPrice = parseFloat(document.getElementById('selling-price').value);
        const growthRate = parseFloat(document.getElementById('growth-rate').value) / 100;
        const initialUnits = parseFloat(document.getElementById('initial-units').value);
        const startupCosts = parseFloat(document.getElementById('startup-costs').value);
        const funding = parseFloat(document.getElementById('funding').value);
        const targetMargin = parseFloat(document.getElementById('target-margin').value) / 100;

        // Calculate contribution margin
        const contributionMargin = sellingPrice - variableCost;
        const contributionMarginPercent = (contributionMargin / sellingPrice) * 100;

        // Calculate breakeven point
        const breakevenUnits = Math.ceil(fixedCosts / contributionMargin);
        const breakevenRevenue = breakevenUnits * sellingPrice;

        // Calculate months to breakeven with growth
        const monthsToBreakeven = calculateMonthsToBreakeven(initialUnits, growthRate, breakevenUnits);

        // Calculate cash flow analysis
        const cashFlowAnalysis = calculateCashFlow(
            initialUnits, growthRate, sellingPrice, variableCost, 
            fixedCosts, startupCosts, funding, monthsToBreakeven
        );

        // Calculate target profit breakeven
        const targetProfitUnits = Math.ceil((fixedCosts + (fixedCosts * targetMargin)) / contributionMargin);
        const targetProfitRevenue = targetProfitUnits * sellingPrice;

        // Feasibility analysis
        const feasibilityScore = calculateFeasibilityScore(
            contributionMarginPercent, monthsToBreakeven, 
            cashFlowAnalysis.totalFundingNeeded, funding
        );

        // Generate recommendations
        const recommendations = generateRecommendations(
            contributionMarginPercent, monthsToBreakeven, 
            cashFlowAnalysis.totalFundingNeeded, funding, feasibilityScore
        );

        // Display results
        displayResults({
            fixedCosts,
            variableCost,
            sellingPrice,
            contributionMargin,
            contributionMarginPercent,
            breakevenUnits,
            breakevenRevenue,
            monthsToBreakeven,
            targetProfitUnits,
            targetProfitRevenue,
            cashFlowAnalysis,
            feasibilityScore,
            recommendations,
            funding,
            startupCosts
        });
    }

    function calculateMonthsToBreakeven(initialUnits, growthRate, breakevenUnits) {
        if (growthRate <= 0) {
            return initialUnits >= breakevenUnits ? 1 : Infinity;
        }

        let currentUnits = initialUnits;
        let months = 0;

        while (currentUnits < breakevenUnits && months < 60) { // Cap at 5 years
            months++;
            currentUnits = currentUnits * (1 + growthRate);
        }

        return currentUnits >= breakevenUnits ? months : Infinity;
    }

    function calculateCashFlow(initialUnits, growthRate, sellingPrice, variableCost, fixedCosts, startupCosts, funding, monthsToBreakeven) {
        let cumulativeCashFlow = funding - startupCosts;
        let currentUnits = initialUnits;
        let totalFundingNeeded = startupCosts;
        let monthlyBurnRate = fixedCosts;
        let cashRunway = 0;

        // Calculate cash flow for first 24 months or until breakeven
        const analysisMonths = Math.min(24, monthsToBreakeven + 6);
        
        for (let month = 1; month <= analysisMonths; month++) {
            const monthlyRevenue = currentUnits * sellingPrice;
            const monthlyVariableCosts = currentUnits * variableCost;
            const monthlyProfit = monthlyRevenue - monthlyVariableCosts - fixedCosts;
            
            cumulativeCashFlow += monthlyProfit;
            
            if (cumulativeCashFlow < 0 && Math.abs(cumulativeCashFlow) > totalFundingNeeded) {
                totalFundingNeeded = Math.abs(cumulativeCashFlow);
            }

            // Calculate cash runway (months until money runs out)
            if (monthlyProfit < 0 && cashRunway === 0) {
                cashRunway = Math.floor(cumulativeCashFlow / Math.abs(monthlyProfit));
            }

            currentUnits = currentUnits * (1 + growthRate);
        }

        return {
            totalFundingNeeded: Math.max(totalFundingNeeded, startupCosts),
            monthlyBurnRate: monthlyBurnRate,
            cashRunway: cashRunway > 0 ? cashRunway : Math.floor(funding / monthlyBurnRate),
            cumulativeCashFlow
        };
    }

    function calculateFeasibilityScore(contributionMarginPercent, monthsToBreakeven, fundingNeeded, availableFunding) {
        let score = 50; // Base score

        // Contribution margin factor (30% of score)
        if (contributionMarginPercent >= 70) score += 20;
        else if (contributionMarginPercent >= 50) score += 15;
        else if (contributionMarginPercent >= 30) score += 10;
        else if (contributionMarginPercent >= 20) score += 5;
        else score -= 10;

        // Time to breakeven factor (40% of score)
        if (monthsToBreakeven <= 6) score += 25;
        else if (monthsToBreakeven <= 12) score += 15;
        else if (monthsToBreakeven <= 18) score += 5;
        else if (monthsToBreakeven <= 24) score -= 5;
        else if (monthsToBreakeven <= 36) score -= 15;
        else score -= 25;

        // Funding adequacy factor (30% of score)
        const fundingRatio = availableFunding / fundingNeeded;
        if (fundingRatio >= 1.5) score += 15;
        else if (fundingRatio >= 1.2) score += 10;
        else if (fundingRatio >= 1.0) score += 5;
        else if (fundingRatio >= 0.8) score -= 5;
        else if (fundingRatio >= 0.6) score -= 10;
        else score -= 20;

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    function generateRecommendations(contributionMarginPercent, monthsToBreakeven, fundingNeeded, availableFunding, feasibilityScore) {
        const recommendations = [];

        if (contributionMarginPercent < 30) {
            recommendations.push("Low contribution margin detected. Consider increasing prices or reducing variable costs.");
        }

        if (monthsToBreakeven > 18) {
            recommendations.push("Long time to breakeven. Focus on faster customer acquisition or higher initial sales.");
        }

        if (fundingNeeded > availableFunding) {
            const shortfall = fundingNeeded - availableFunding;
            recommendations.push(`Additional funding of $${shortfall.toLocaleString()} needed to reach breakeven safely.`);
        }

        if (feasibilityScore < 50) {
            recommendations.push("Consider revising your business model, pricing strategy, or cost structure.");
        }

        if (contributionMarginPercent > 60 && monthsToBreakeven <= 12) {
            recommendations.push("Strong business model with good margins and reasonable breakeven timeline.");
        }

        // Add specific actionable recommendations
        recommendations.push("Monitor actual performance against projections and adjust assumptions monthly.");
        recommendations.push("Consider multiple scenarios (optimistic, realistic, pessimistic) for better planning.");

        return recommendations;
    }

    function displayResults(data) {
        const feasibilityClass = data.feasibilityScore >= 70 ? 'text-green-400' : 
                                data.feasibilityScore >= 50 ? 'text-yellow-400' : 'text-red-400';
        
        const monthsClass = data.monthsToBreakeven <= 12 ? 'text-green-400' : 
                           data.monthsToBreakeven <= 24 ? 'text-yellow-400' : 'text-red-400';

        const fundingGap = data.cashFlowAnalysis.totalFundingNeeded - data.funding;

        resultContent.innerHTML = `
            <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
                <h3 class="text-2xl font-bold text-primary mb-4">Breakeven Analysis Results</h3>
                
                <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-primary mb-2">${data.breakevenUnits.toLocaleString()}</div>
                            <div class="text-sm text-light">Units to Break Even</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold ${monthsClass} mb-2">${data.monthsToBreakeven === Infinity ? '∞' : data.monthsToBreakeven}</div>
                            <div class="text-sm text-light">Months to Break Even</div>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="text-lg font-semibold text-accent mb-3">Financial Metrics</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Contribution Margin:</span>
                                <span class="text-text font-medium">$${data.contributionMargin.toFixed(2)} (${data.contributionMarginPercent.toFixed(1)}%)</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Breakeven Revenue:</span>
                                <span class="text-text font-medium">$${data.breakevenRevenue.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Target Profit Units:</span>
                                <span class="text-text font-medium">${data.targetProfitUnits.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Target Profit Revenue:</span>
                                <span class="text-text font-medium">$${data.targetProfitRevenue.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="text-lg font-semibold text-accent mb-3">Cash Flow Analysis</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Available Funding:</span>
                                <span class="text-text font-medium">$${data.funding.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Total Funding Needed:</span>
                                <span class="text-text font-medium">$${data.cashFlowAnalysis.totalFundingNeeded.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Funding Gap:</span>
                                <span class="${fundingGap > 0 ? 'text-red-400' : 'text-green-400'} font-medium">
                                    ${fundingGap > 0 ? '+' : ''}$${fundingGap.toLocaleString()}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Cash Runway:</span>
                                <span class="text-text font-medium">${data.cashFlowAnalysis.cashRunway} months</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-xl font-bold text-primary">Business Feasibility Score</h4>
                        <div class="text-3xl font-bold ${feasibilityClass}">${data.feasibilityScore}/100</div>
                    </div>
                    <div class="mb-4">
                        <div class="w-full bg-dark rounded-full h-3">
                            <div class="h-3 rounded-full transition-all duration-500 ${
                                data.feasibilityScore >= 70 ? 'bg-green-400' : 
                                data.feasibilityScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                            }" style="width: ${data.feasibilityScore}%"></div>
                        </div>
                    </div>
                    <div class="text-center">
                        <span class="text-lg font-semibold ${feasibilityClass}">
                            ${data.feasibilityScore >= 80 ? 'Highly Viable' :
                              data.feasibilityScore >= 65 ? 'Viable' :
                              data.feasibilityScore >= 50 ? 'Moderately Viable' :
                              data.feasibilityScore >= 35 ? 'Challenging' : 'High Risk'}
                        </span>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">${data.contributionMarginPercent.toFixed(1)}%</div>
                        <div class="text-sm text-light">Contribution Margin</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">$${data.cashFlowAnalysis.monthlyBurnRate.toLocaleString()}</div>
                        <div class="text-sm text-light">Monthly Burn Rate</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">${data.cashFlowAnalysis.cashRunway}</div>
                        <div class="text-sm text-light">Cash Runway (Months)</div>
                    </div>
                </div>

                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-lg font-semibold text-accent mb-3">Recommendations & Next Steps</h4>
                    <ul class="text-sm text-light space-y-2 mb-4">
                        ${data.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
                    </ul>
                    
                    <div class="mt-4 p-4 bg-broder rounded border border-accent">
                        <h5 class="font-semibold text-primary mb-2">Key Insights:</h5>
                        <div class="grid md:grid-cols-2 gap-4 text-sm text-light">
                            <div>
                                <p><strong>Break-even Point:</strong> You need to sell ${data.breakevenUnits.toLocaleString()} units to cover all costs.</p>
                                <p><strong>Revenue Target:</strong> $${data.breakevenRevenue.toLocaleString()} in monthly revenue to break even.</p>
                            </div>
                            <div>
                                <p><strong>Timeline:</strong> ${data.monthsToBreakeven === Infinity ? 'Breakeven not achievable with current assumptions' : `Expected to break even in ${data.monthsToBreakeven} months`}.</p>
                                <p><strong>Funding:</strong> ${fundingGap > 0 ? `Need additional $${fundingGap.toLocaleString()} funding` : 'Current funding appears adequate'}.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
});