document.addEventListener('DOMContentLoaded', function() {
    // Add holding functionality
    document.getElementById('addHolding').addEventListener('click', addHolding);
    
    // Remove holding functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-holding')) {
            removeHolding(e.target);
        }
    });

    // Form submission
    document.getElementById('cryptoTaxForm').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateTaxLossHarvesting();
    });
});

function addHolding() {
    const container = document.getElementById('holdingsContainer');
    const newHolding = document.createElement('div');
    newHolding.className = 'holding-entry bg-dark p-4 rounded border border-accent mb-3';
    newHolding.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
                <label class="block text-sm text-light mb-1">Cryptocurrency</label>
                <select class="crypto-name w-full px-2 py-1 bg-broder border border-accent rounded text-text">
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="ADA">Cardano (ADA)</option>
                    <option value="SOL">Solana (SOL)</option>
                    <option value="DOT">Polkadot (DOT)</option>
                    <option value="MATIC">Polygon (MATIC)</option>
                    <option value="AVAX">Avalanche (AVAX)</option>
                    <option value="LINK">Chainlink (LINK)</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>
            <div>
                <label class="block text-sm text-light mb-1">Purchase Price ($)</label>
                <input type="number" class="purchase-price w-full px-2 py-1 bg-broder border border-accent rounded text-text" step="0.01" placeholder="Enter price">
            </div>
            <div>
                <label class="block text-sm text-light mb-1">Current Price ($)</label>
                <input type="number" class="current-price w-full px-2 py-1 bg-broder border border-accent rounded text-text" step="0.01" placeholder="Enter price">
            </div>
            <div>
                <label class="block text-sm text-light mb-1">Amount Held</label>
                <input type="number" class="amount-held w-full px-2 py-1 bg-broder border border-accent rounded text-text" step="0.00001" placeholder="Enter amount">
            </div>
        </div>
        <button type="button" class="remove-holding mt-2 text-red-400 hover:text-red-300 text-sm">Remove</button>
    `;
    container.appendChild(newHolding);
}

function removeHolding(button) {
    const holdingEntry = button.closest('.holding-entry');
    const container = document.getElementById('holdingsContainer');
    if (container.children.length > 1) {
        holdingEntry.remove();
    }
}

function collectFormData() {
    const annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;
    const country = document.getElementById('country').value;
    const filingStatus = document.getElementById('filingStatus').value;
    const otherCapitalGains = parseFloat(document.getElementById('otherCapitalGains').value) || 0;
    
    const holdings = [];
    const holdingEntries = document.querySelectorAll('.holding-entry');
    
    holdingEntries.forEach(entry => {
        const cryptoName = entry.querySelector('.crypto-name').value;
        const purchasePrice = parseFloat(entry.querySelector('.purchase-price').value) || 0;
        const currentPrice = parseFloat(entry.querySelector('.current-price').value) || 0;
        const amountHeld = parseFloat(entry.querySelector('.amount-held').value) || 0;
        
        if (purchasePrice > 0 && currentPrice > 0 && amountHeld > 0) {
            holdings.push({
                crypto: cryptoName,
                purchasePrice,
                currentPrice,
                amountHeld,
                totalValue: currentPrice * amountHeld,
                gainLoss: (currentPrice - purchasePrice) * amountHeld,
                gainLossPercent: ((currentPrice - purchasePrice) / purchasePrice) * 100
            });
        }
    });
    
    return {
        annualIncome,
        country,
        filingStatus,
        otherCapitalGains,
        holdings
    };
}

function calculateTaxBracket(income, country, filingStatus) {
    if (country === 'US') {
        // 2025 US tax brackets (estimated)
        const brackets = {
            single: [
                { min: 0, max: 11000, rate: 0.10 },
                { min: 11000, max: 44725, rate: 0.12 },
                { min: 44725, max: 95375, rate: 0.22 },
                { min: 95375, max: 182050, rate: 0.24 },
                { min: 182050, max: 231250, rate: 0.32 },
                { min: 231250, max: 578125, rate: 0.35 },
                { min: 578125, max: Infinity, rate: 0.37 }
            ],
            married: [
                { min: 0, max: 22000, rate: 0.10 },
                { min: 22000, max: 89450, rate: 0.12 },
                { min: 89450, max: 190750, rate: 0.22 },
                { min: 190750, max: 364200, rate: 0.24 },
                { min: 364200, max: 462500, rate: 0.32 },
                { min: 462500, max: 693750, rate: 0.35 },
                { min: 693750, max: Infinity, rate: 0.37 }
            ]
        };
        
        const applicableBrackets = brackets[filingStatus] || brackets.single;
        
        for (let bracket of applicableBrackets) {
            if (income >= bracket.min && income < bracket.max) {
                return {
                    marginalRate: bracket.rate,
                    capitalGainsRate: income > 44725 ? (income > 492300 ? 0.20 : 0.15) : 0
                };
            }
        }
    }
    
    // Default rates for other countries
    const countryRates = {
        UK: { marginalRate: 0.20, capitalGainsRate: 0.20 },
        Canada: { marginalRate: 0.26, capitalGainsRate: 0.13 }, // 50% inclusion rate
        India: { marginalRate: 0.30, capitalGainsRate: 0.20 }
    };
    
    return countryRates[country] || { marginalRate: 0.25, capitalGainsRate: 0.15 };
}

function optimizeTaxLossHarvesting(data) {
    const taxRates = calculateTaxBracket(data.annualIncome, data.country, data.filingStatus);
    
    // Separate gains and losses
    const gains = data.holdings.filter(h => h.gainLoss > 0);
    const losses = data.holdings.filter(h => h.gainLoss < 0);
    
    // Calculate total gains and losses
    const totalGains = gains.reduce((sum, h) => sum + h.gainLoss, 0) + data.otherCapitalGains;
    const totalLosses = Math.abs(losses.reduce((sum, h) => sum + h.gainLoss, 0));
    
    // Calculate net position
    const netGains = totalGains - totalLosses;
    
    // Calculate tax implications
    const currentTaxLiability = Math.max(0, totalGains * taxRates.capitalGainsRate);
    const optimizedTaxLiability = Math.max(0, netGains * taxRates.capitalGainsRate);
    const taxSavings = currentTaxLiability - optimizedTaxLiability;
    
    // Generate recommendations
    const recommendations = [];
    
    if (losses.length > 0) {
        // Sort losses by tax efficiency (largest losses first)
        const sortedLosses = losses.sort((a, b) => a.gainLoss - b.gainLoss);
        
        let remainingGains = totalGains;
        
        sortedLosses.forEach(loss => {
            if (remainingGains > 0) {
                const lossAmount = Math.abs(loss.gainLoss);
                const offsetAmount = Math.min(lossAmount, remainingGains);
                const taxSaved = offsetAmount * taxRates.capitalGainsRate;
                
                recommendations.push({
                    action: 'SELL',
                    crypto: loss.crypto,
                    amount: loss.amountHeld,
                    currentValue: loss.totalValue,
                    loss: loss.gainLoss,
                    taxSavings: taxSaved,
                    reason: `Realize ${formatCurrency(Math.abs(loss.gainLoss))} loss to offset gains`
                });
                
                remainingGains -= offsetAmount;
            }
        });
    }
    
    // Add rebalancing suggestions
    if (gains.length > 0 && losses.length > 0) {
        recommendations.push({
            action: 'REBALANCE',
            suggestion: 'Consider selling profitable positions and immediately repurchasing to reset cost basis',
            benefit: 'No wash sale rules apply to crypto in most jurisdictions'
        });
    }
    
    return {
        currentTaxLiability,
        optimizedTaxLiability,
        taxSavings,
        totalGains,
        totalLosses,
        netGains,
        recommendations,
        taxRates
    };
}

function calculateTaxLossHarvesting() {
    const data = collectFormData();
    
    if (data.holdings.length === 0) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                <div class="flex items-center gap-2 text-red-400">
                    <span class="material-icons">error</span>
                    <span class="font-medium">Please add at least one crypto holding to analyze.</span>
                </div>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    const analysis = optimizeTaxLossHarvesting(data);
    displayResults(analysis, data);
}

function displayResults(analysis, data) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    const html = `
        <!-- Tax Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold text-primary">${formatCurrency(analysis.taxSavings)}</div>
                <div class="text-light text-sm">Potential Tax Savings</div>
            </div>
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold ${analysis.netGains >= 0 ? 'text-red-400' : 'text-green-400'}">
                    ${formatCurrency(analysis.netGains)}
                </div>
                <div class="text-light text-sm">Net Capital ${analysis.netGains >= 0 ? 'Gains' : 'Losses'}</div>
            </div>
            <div class="bg-dark p-4 rounded border border-accent text-center">
                <div class="text-2xl font-bold text-accent">${(analysis.taxRates.capitalGainsRate * 100).toFixed(1)}%</div>
                <div class="text-light text-sm">Capital Gains Tax Rate</div>
            </div>
        </div>

        <!-- Tax Liability Comparison -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Tax Liability Comparison</h3>
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-light">Current Tax Liability:</span>
                    <span class="text-red-400 font-semibold">${formatCurrency(analysis.currentTaxLiability)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-light">Optimized Tax Liability:</span>
                    <span class="text-green-400 font-semibold">${formatCurrency(analysis.optimizedTaxLiability)}</span>
                </div>
                <div class="border-t border-accent pt-2 flex justify-between">
                    <span class="text-light font-semibold">Tax Savings:</span>
                    <span class="text-primary font-bold">${formatCurrency(analysis.taxSavings)}</span>
                </div>
            </div>
        </div>

        <!-- Portfolio Analysis -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Portfolio Analysis</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div class="text-light mb-2">Total Unrealized Gains:</div>
                    <div class="text-green-400 font-semibold">${formatCurrency(analysis.totalGains - data.otherCapitalGains)}</div>
                </div>
                <div>
                    <div class="text-light mb-2">Total Unrealized Losses:</div>
                    <div class="text-red-400 font-semibold">${formatCurrency(analysis.totalLosses)}</div>
                </div>
                <div>
                    <div class="text-light mb-2">Other Capital Gains:</div>
                    <div class="text-accent font-semibold">${formatCurrency(data.otherCapitalGains)}</div>
                </div>
                <div>
                    <div class="text-light mb-2">Holdings Analyzed:</div>
                    <div class="text-text font-semibold">${data.holdings.length} positions</div>
                </div>
            </div>
        </div>

        <!-- Recommendations -->
        <div class="bg-dark p-6 rounded border border-accent mb-6">
            <h3 class="text-xl font-semibold text-primary mb-4">Tax Loss Harvesting Recommendations</h3>
            ${analysis.recommendations.length > 0 ? 
                analysis.recommendations.map(rec => `
                    <div class="bg-broder p-4 rounded border border-accent mb-3">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-semibold text-accent">${rec.action}</span>
                            ${rec.taxSavings ? `<span class="text-green-400">Save ${formatCurrency(rec.taxSavings)}</span>` : ''}
                        </div>
                        ${rec.crypto ? `
                            <div class="text-light mb-2">
                                <strong>${rec.crypto}:</strong> ${rec.reason}
                            </div>
                            <div class="text-sm text-light">
                                Amount: ${rec.amount} ${rec.crypto} | 
                                Current Value: ${formatCurrency(rec.currentValue)} | 
                                Loss: ${formatCurrency(rec.loss)}
                            </div>
                        ` : `
                            <div class="text-light mb-2">${rec.suggestion}</div>
                            <div class="text-sm text-accent">${rec.benefit}</div>
                        `}
                    </div>
                `).join('') : 
                '<div class="text-light">No specific recommendations at this time. Your portfolio appears optimally positioned.</div>'
            }
        </div>

        <!-- Holdings Breakdown -->
        <div class="bg-dark p-6 rounded border border-accent">
            <h3 class="text-xl font-semibold text-primary mb-4">Holdings Breakdown</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-accent">
                            <th class="text-left text-light p-2">Asset</th>
                            <th class="text-right text-light p-2">Amount</th>
                            <th class="text-right text-light p-2">Purchase Price</th>
                            <th class="text-right text-light p-2">Current Price</th>
                            <th class="text-right text-light p-2">Gain/Loss</th>
                            <th class="text-right text-light p-2">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.holdings.map(holding => `
                            <tr class="border-b border-broder">
                                <td class="text-text p-2">${holding.crypto}</td>
                                <td class="text-right text-text p-2">${holding.amountHeld}</td>
                                <td class="text-right text-text p-2">${formatCurrency(holding.purchasePrice)}</td>
                                <td class="text-right text-text p-2">${formatCurrency(holding.currentPrice)}</td>
                                <td class="text-right p-2 ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}">
                                    ${formatCurrency(holding.gainLoss)}
                                </td>
                                <td class="text-right p-2 ${holding.gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}">
                                    ${holding.gainLossPercent.toFixed(1)}%
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Important Notes -->
        <div class="bg-yellow-900 bg-opacity-20 border border-yellow-600 p-4 rounded mt-6">
            <h4 class="text-yellow-400 font-semibold mb-2">Important Considerations</h4>
            <ul class="text-yellow-200 text-sm space-y-1">
                <li>• Tax laws vary by jurisdiction and change frequently</li>
                <li>• Consider transaction costs when implementing recommendations</li>
                <li>• Consult with a tax professional for personalized advice</li>
                <li>• Keep detailed records of all transactions</li>
                <li>• Be aware of potential wash sale rules in your jurisdiction</li>
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