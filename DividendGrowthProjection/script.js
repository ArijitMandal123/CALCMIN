// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dividendForm').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateDividendProjection();
    });
});

function collectFormData() {
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) || 0;
    const growthRate = parseFloat(document.getElementById('growthRate').value) || 0;
    const dripEnabled = document.getElementById('dripEnabled').checked;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const inflationRate = parseFloat(document.getElementById('inflationRate').value) || 0;
    const targetExpenses = parseFloat(document.getElementById('targetExpenses').value) || 0;
    const projectionYears = parseInt(document.getElementById('projectionYears').value) || 20;
    
    return {
        initialInvestment,
        monthlyContribution,
        dividendYield: dividendYield / 100,
        growthRate: growthRate / 100,
        dripEnabled,
        taxRate: taxRate / 100,
        inflationRate: inflationRate / 100,
        targetExpenses,
        projectionYears
    };
}

function calculateDividendProjection() {
    const data = collectFormData();
    
    if (data.initialInvestment <= 0 && data.monthlyContribution <= 0) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                <div class="flex items-center gap-2 text-red-400">
                    <span class="material-icons">error</span>
                    <span class="font-medium">Please enter either an initial investment or monthly contribution amount.</span>
                </div>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    const projection = projectDividendGrowth(data);
    displayResults(projection, data);
}

function projectDividendGrowth(data) {
    const yearlyData = [];
    let totalInvested = data.initialInvestment;
    let portfolioValue = data.initialInvestment;
    let annualDividendIncome = data.initialInvestment * data.dividendYield;
    let expensesCoveredYear = null;
    
    for (let year = 1; year <= data.projectionYears; year++) {
        // Add monthly contributions
        const yearlyContributions = data.monthlyContribution * 12;
        totalInvested += yearlyContributions;
        portfolioValue += yearlyContributions;
        
        // Calculate dividend income for the year
        const grossDividendIncome = portfolioValue * data.dividendYield;
        const netDividendIncome = grossDividendIncome * (1 - data.taxRate);
        
        // Apply dividend growth
        const grownDividendIncome = grossDividendIncome * (1 + data.growthRate);
        const netGrownDividendIncome = grownDividendIncome * (1 - data.taxRate);
        
        // Handle DRIP reinvestment
        if (data.dripEnabled) {
            portfolioValue += netDividendIncome;
        }
        
        // Calculate real (inflation-adjusted) values
        const inflationFactor = Math.pow(1 + data.inflationRate, year);
        const realDividendIncome = netGrownDividendIncome / inflationFactor;
        const realTargetExpenses = data.targetExpenses / inflationFactor;
        
        // Check if expenses are covered
        if (!expensesCoveredYear && data.targetExpenses > 0 && netGrownDividendIncome >= data.targetExpenses) {
            expensesCoveredYear = year;
        }
        
        // Calculate yield on cost (dividend income / original investment)
        const yieldOnCost = data.initialInvestment > 0 ? (netGrownDividendIncome / data.initialInvestment) * 100 : 0;
        
        yearlyData.push({
            year,
            totalInvested,
            portfolioValue,
            grossDividendIncome: grownDividendIncome,
            netDividendIncome: netGrownDividendIncome,
            realDividendIncome,
            yieldOnCost,
            expensesCovered: data.targetExpenses > 0 ? (netGrownDividendIncome / data.targetExpenses) * 100 : 0
        });
        
        // Update dividend yield for next year (compound growth)
        annualDividendIncome = grownDividendIncome;
    }
    
    return {
        yearlyData,
        expensesCoveredYear,
        finalYear: yearlyData[yearlyData.length - 1],
        milestones: calculateMilestones(yearlyData, data)
    };
}

function calculateMilestones(yearlyData, data) {
    const milestones = [];
    
    // Find key milestones
    const milestone1000 = yearlyData.find(year => year.netDividendIncome >= 1000);
    const milestone5000 = yearlyData.find(year => year.netDividendIncome >= 5000);
    const milestone10000 = yearlyData.find(year => year.netDividendIncome >= 10000);
    const milestone25000 = yearlyData.find(year => year.netDividendIncome >= 25000);
    const milestone50000 = yearlyData.find(year => year.netDividendIncome >= 50000);
    
    if (milestone1000) milestones.push({ amount: 1000, year: milestone1000.year });
    if (milestone5000) milestones.push({ amount: 5000, year: milestone5000.year });
    if (milestone10000) milestones.push({ amount: 10000, year: milestone10000.year });
    if (milestone25000) milestones.push({ amount: 25000, year: milestone25000.year });
    if (milestone50000) milestones.push({ amount: 50000, year: milestone50000.year });
    
    return milestones;
}

function displayResults(projection, data) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    const finalYear = projection.finalYear;
    const totalReturn = ((finalYear.portfolioValue - finalYear.totalInvested) / finalYear.totalInvested) * 100;
    
    const html = `
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold text-primary">${formatCurrency(finalYear.netDividendIncome)}</div>
                <div class="text-light text-sm">Annual Dividend Income</div>
                <div class="text-accent text-xs">(Year ${sanitizeText(data.projectionYears)})</div>
            </div>
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold text-green-400">${formatCurrency(finalYear.portfolioValue)}</div>
                <div class="text-light text-sm">Portfolio Value</div>
                <div class="text-accent text-xs">(Year ${sanitizeText(data.projectionYears)})</div>
            </div>
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold text-accent">${finalYear.yieldOnCost.toFixed(1)}%</div>
                <div class="text-light text-sm">Yield on Cost</div>
                <div class="text-accent text-xs">(vs. initial investment)</div>
            </div>
        </div>

        <!-- Expense Coverage Analysis -->
        ${data.targetExpenses > 0 ? `
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Expense Coverage Analysis</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div class="text-light mb-2">Target Annual Expenses:</div>
                    <div class="text-accent font-semibold">${formatCurrency(data.targetExpenses)}</div>
                </div>
                <div>
                    <div class="text-light mb-2">Expenses Covered:</div>
                    <div class="font-semibold ${projection.expensesCoveredYear ? 'text-green-400' : 'text-yellow-400'}">
                        ${projection.expensesCoveredYear ? `Year ${projection.expensesCoveredYear}` : 'Not within projection period'}
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <div class="text-light mb-2">Current Coverage:</div>
                <div class="w-full bg-broder rounded-full h-3">
                    <div class="bg-primary h-3 rounded-full transition-all" style="width: ${Math.min(finalYear.expensesCovered, 100)}%"></div>
                </div>
                <div class="text-sm text-accent mt-1">${finalYear.expensesCovered.toFixed(1)}% of target expenses covered</div>
            </div>
        </div>
        ` : ''}

        <!-- Investment Summary -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Investment Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div class="text-light mb-2">Total Invested:</div>
                    <div class="text-accent font-semibold">${formatCurrency(finalYear.totalInvested)}</div>
                </div>
                <div>
                    <div class="text-light mb-2">Total Return:</div>
                    <div class="text-green-400 font-semibold">${totalReturn.toFixed(1)}%</div>
                </div>
                <div>
                    <div class="text-light mb-2">DRIP Status:</div>
                    <div class="font-semibold ${data.dripEnabled ? 'text-green-400' : 'text-yellow-400'}">
                        ${data.dripEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                </div>
                <div>
                    <div class="text-light mb-2">Tax Rate:</div>
                    <div class="text-accent font-semibold">${(data.taxRate * 100).toFixed(1)}%</div>
                </div>
            </div>
        </div>

        <!-- Milestones -->
        ${projection.milestones.length > 0 ? `
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Dividend Income Milestones</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                ${projection.milestones.map(milestone => `
                    <div class="bg-broder p-3 rounded border border-accent text-center">
                        <div class="text-lg font-bold text-primary">${formatCurrency(milestone.amount)}</div>
                        <div class="text-light text-sm">Year ${sanitizeText(milestone.year)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Year-by-Year Breakdown -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Year-by-Year Projection</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-accent">
                            <th class="text-left text-light p-2">Year</th>
                            <th class="text-right text-light p-2">Portfolio Value</th>
                            <th class="text-right text-light p-2">Annual Dividends</th>
                            <th class="text-right text-light p-2">Real Dividends</th>
                            <th class="text-right text-light p-2">Yield on Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${projection.yearlyData.filter((_, index) => index % Math.max(1, Math.floor(data.projectionYears / 10)) === 0 || index === projection.yearlyData.length - 1).map(year => `
                            <tr class="border-b border-broder">
                                <td class="text-text p-2">${year.year}</td>
                                <td class="text-right text-green-400 p-2">${formatCurrency(year.portfolioValue)}</td>
                                <td class="text-right text-primary p-2">${formatCurrency(year.netDividendIncome)}</td>
                                <td class="text-right text-accent p-2">${formatCurrency(year.realDividendIncome)}</td>
                                <td class="text-right text-text p-2">${year.yieldOnCost.toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Strategy Recommendations -->
        <div class="bg-dark p-6 rounded border border-accent">
            <h3 class="text-xl font-semibold text-primary mb-4">Strategy Recommendations</h3>
            <div class="space-y-3">
                ${!data.dripEnabled ? `
                    <div class="bg-yellow-900 bg-opacity-20 border border-yellow-600 p-3 rounded">
                        <div class="text-yellow-400 font-semibold">Consider Enabling DRIP</div>
                        <div class="text-yellow-200 text-sm">Dividend reinvestment could significantly accelerate your wealth building through compounding.</div>
                    </div>
                ` : ''}
                
                ${data.dividendYield < 0.02 ? `
                    <div class="bg-blue-900 bg-opacity-20 border border-blue-600 p-3 rounded">
                        <div class="text-blue-400 font-semibold">Low Dividend Yield</div>
                        <div class="text-blue-200 text-sm">Consider increasing your dividend yield target to 2-4% for better income generation.</div>
                    </div>
                ` : ''}
                
                ${data.growthRate > 0.08 ? `
                    <div class="bg-orange-900 bg-opacity-20 border border-orange-600 p-3 rounded">
                        <div class="text-orange-400 font-semibold">High Growth Rate Assumption</div>
                        <div class="text-orange-200 text-sm">Your ${(data.growthRate * 100).toFixed(1)}% growth rate may be optimistic. Consider more conservative assumptions.</div>
                    </div>
                ` : ''}
                
                <div class="bg-green-900 bg-opacity-20 border border-green-600 p-3 rounded">
                    <div class="text-green-400 font-semibold">Diversification Tip</div>
                    <div class="text-green-200 text-sm">Consider dividend ETFs or a mix of individual dividend-paying stocks across different sectors for better diversification.</div>
                </div>
            </div>
        </div>

        <!-- Important Notes -->
        <div class="bg-yellow-900 bg-opacity-20 border border-yellow-600 p-4 rounded mt-6">
            <h4 class="text-yellow-400 font-semibold mb-2">Important Considerations</h4>
            <ul class="text-yellow-200 text-sm space-y-1">
                <li>â€¢ Projections are based on assumptions and may not reflect actual results</li>
                <li>â€¢ Dividend payments can be reduced or eliminated by companies</li>
                <li>â€¢ Consider inflation impact on purchasing power over time</li>
                <li>â€¢ Diversification across sectors and companies reduces risk</li>
                <li>â€¢ Regular portfolio review and rebalancing is recommended</li>
            </ul>
        </div>
    `;
    
    resultsContent.innerHTML = html;
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
