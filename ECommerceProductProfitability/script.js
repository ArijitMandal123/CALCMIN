// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profitability-form');
    const platformSelect = document.getElementById('platform');
    const platformFeeInput = document.getElementById('platformFee');
    const paymentFeeInput = document.getElementById('paymentFee');
    
    // Platform fee presets
    const platformFees = {
        'amazon-fba': { platform: 15, payment: 0 },
        'amazon-fbm': { platform: 15, payment: 0 },
        'shopify': { platform: 0, payment: 2.9 },
        'ebay': { platform: 12, payment: 0 },
        'etsy': { platform: 6.5, payment: 3 },
        'walmart': { platform: 15, payment: 0 },
        'own-website': { platform: 0, payment: 2.9 }
    };
    
    platformSelect.addEventListener('change', function() {
        const platform = this.value;
        if (platformFees[platform]) {
            platformFeeInput.value = platformFees[platform].platform;
            paymentFeeInput.value = platformFees[platform].payment;
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateProfitability();
    });
});

function collectFormData() {
    return {
        productName: document.getElementById('productName').value,
        productCost: parseFloat(document.getElementById('productCost').value),
        sellingPrice: parseFloat(document.getElementById('sellingPrice').value),
        platform: document.getElementById('platform').value,
        platformFee: parseFloat(document.getElementById('platformFee').value),
        paymentFee: parseFloat(document.getElementById('paymentFee').value),
        shippingCost: parseFloat(document.getElementById('shippingCost').value),
        packagingCost: parseFloat(document.getElementById('packagingCost').value),
        advertisingCost: parseFloat(document.getElementById('advertisingCost').value),
        returnsRate: parseFloat(document.getElementById('returnsRate').value),
        storageCost: parseFloat(document.getElementById('storageCost').value) || 0,
        otherCosts: parseFloat(document.getElementById('otherCosts').value) || 0,
        monthlyVolume: parseInt(document.getElementById('monthlyVolume').value)
    };
}

function calculateProfitability() {
    const data = collectFormData();
    
    // Calculate all costs per unit
    const platformFeeAmount = (data.sellingPrice * data.platformFee) / 100;
    const paymentFeeAmount = (data.sellingPrice * data.paymentFee) / 100;
    const returnsImpact = (data.sellingPrice * data.returnsRate) / 100;
    
    const totalCosts = data.productCost + 
                      platformFeeAmount + 
                      paymentFeeAmount + 
                      data.shippingCost + 
                      data.packagingCost + 
                      data.advertisingCost + 
                      returnsImpact + 
                      data.storageCost + 
                      data.otherCosts;
    
    // Calculate profit metrics
    const grossProfit = data.sellingPrice - data.productCost;
    const netProfit = data.sellingPrice - totalCosts;
    const grossMargin = (grossProfit / data.sellingPrice) * 100;
    const netMargin = (netProfit / data.sellingPrice) * 100;
    
    // Monthly projections
    const monthlyRevenue = data.sellingPrice * data.monthlyVolume;
    const monthlyNetProfit = netProfit * data.monthlyVolume;
    const annualNetProfit = monthlyNetProfit * 12;
    
    // Break-even analysis
    const fixedCosts = (data.storageCost + data.otherCosts) * data.monthlyVolume;
    const variableCostPerUnit = totalCosts - data.storageCost - data.otherCosts;
    const contributionMargin = data.sellingPrice - variableCostPerUnit;
    const breakEvenUnits = fixedCosts / contributionMargin;
    
    // ROI calculations
    const investmentPerUnit = data.productCost + data.storageCost;
    const roi = (netProfit / investmentPerUnit) * 100;
    
    // ROAS calculation
    const roas = data.advertisingCost > 0 ? data.sellingPrice / data.advertisingCost : 0;
    
    // Profitability assessment
    const profitabilityLevel = assessProfitability(netMargin, roi, roas);
    
    // Cost breakdown
    const costBreakdown = {
        productCost: data.productCost,
        platformFee: platformFeeAmount,
        paymentFee: paymentFeeAmount,
        shipping: data.shippingCost,
        packaging: data.packagingCost,
        advertising: data.advertisingCost,
        returns: returnsImpact,
        storage: data.storageCost,
        other: data.otherCosts
    };
    
    // Optimization suggestions
    const suggestions = generateOptimizationSuggestions(data, netMargin, costBreakdown);
    
    displayResults({
        data,
        grossProfit,
        netProfit,
        grossMargin,
        netMargin,
        monthlyRevenue,
        monthlyNetProfit,
        annualNetProfit,
        breakEvenUnits,
        roi,
        roas,
        profitabilityLevel,
        costBreakdown,
        totalCosts,
        suggestions
    });
}

function assessProfitability(netMargin, roi, roas) {
    if (netMargin >= 20 && roi >= 50 && roas >= 4) {
        return { level: 'Excellent', color: 'text-green-400', description: 'Highly profitable product' };
    } else if (netMargin >= 15 && roi >= 30 && roas >= 3) {
        return { level: 'Good', color: 'text-yellow-400', description: 'Solid profitability' };
    } else if (netMargin >= 10 && roi >= 20 && roas >= 2) {
        return { level: 'Fair', color: 'text-orange-400', description: 'Marginal profitability' };
    } else if (netMargin >= 5) {
        return { level: 'Poor', color: 'text-red-400', description: 'Low profitability' };
    } else {
        return { level: 'Unprofitable', color: 'text-red-400', description: 'Losing money' };
    }
}

function generateOptimizationSuggestions(data, netMargin, costs) {
    const suggestions = [];
    
    // Cost optimization suggestions
    const costPercentages = {
        productCost: (costs.productCost / data.sellingPrice) * 100,
        platformFee: (costs.platformFee / data.sellingPrice) * 100,
        advertising: (costs.advertising / data.sellingPrice) * 100,
        shipping: (costs.shipping / data.sellingPrice) * 100
    };
    
    if (costPercentages.productCost > 40) {
        suggestions.push({
            type: 'cost',
            title: 'Reduce Product Costs',
            description: 'Product cost is high at ' + costPercentages.productCost.toFixed(1) + '%. Negotiate with suppliers or find alternative sourcing.'
        });
    }
    
    if (costPercentages.advertising > 15) {
        suggestions.push({
            type: 'marketing',
            title: 'Optimize Advertising Spend',
            description: 'Ad spend is ' + costPercentages.advertising.toFixed(1) + '% of revenue. Improve targeting and conversion rates.'
        });
    }
    
    if (data.roas < 3) {
        suggestions.push({
            type: 'marketing',
            title: 'Improve ROAS',
            description: 'Current ROAS is ' + data.roas.toFixed(1) + ':1. Target minimum 3:1 for sustainable advertising.'
        });
    }
    
    if (costPercentages.shipping > 8) {
        suggestions.push({
            type: 'logistics',
            title: 'Reduce Shipping Costs',
            description: 'Shipping costs are high. Consider bulk shipping, regional fulfillment, or negotiate better rates.'
        });
    }
    
    if (netMargin < 15) {
        suggestions.push({
            type: 'pricing',
            title: 'Consider Price Increase',
            description: 'Net margin is below 15%. Test price increases to improve profitability.'
        });
    }
    
    if (data.returnsRate > 10) {
        suggestions.push({
            type: 'quality',
            title: 'Reduce Return Rate',
            description: 'Return rate of ' + data.returnsRate + '% is high. Improve product quality and descriptions.'
        });
    }
    
    return suggestions;
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    const getMarginColor = (margin) => {
        if (margin >= 20) return 'text-green-400';
        if (margin >= 15) return 'text-yellow-400';
        if (margin >= 10) return 'text-orange-400';
        return 'text-red-400';
    };
    
    contentDiv.innerHTML = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">Profitability Analysis for "${escapeHtml(results.data.productName)}"</h3>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-3xl font-bold ${getMarginColor(results.netMargin)}">${results.netMargin.toFixed(1)}%</div>
                    <div class="text-light">Net Profit Margin</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-accent">$${results.netProfit.toFixed(2)}</div>
                    <div class="text-light">Profit per Unit</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold ${sanitizeText(results.profitabilityLevel.color)}">${sanitizeText(results.profitabilityLevel.level)}</div>
                    <div class="text-light">${sanitizeText(results.profitabilityLevel.description)}</div>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Cost Breakdown</h4>
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-light">Product Cost:</span>
                        <span class="text-accent">$${results.costBreakdown.productCost.toFixed(2)} (${((results.costBreakdown.productCost/results.data.sellingPrice)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-light">Platform Fee:</span>
                        <span class="text-accent">$${results.costBreakdown.platformFee.toFixed(2)} (${((results.costBreakdown.platformFee/results.data.sellingPrice)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-light">Payment Fee:</span>
                        <span class="text-accent">$${results.costBreakdown.paymentFee.toFixed(2)} (${((results.costBreakdown.paymentFee/results.data.sellingPrice)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-light">Shipping:</span>
                        <span class="text-accent">$${results.costBreakdown.shipping.toFixed(2)} (${((results.costBreakdown.shipping/results.data.sellingPrice)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-light">Advertising:</span>
                        <span class="text-accent">$${results.costBreakdown.advertising.toFixed(2)} (${((results.costBreakdown.advertising/results.data.sellingPrice)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-light">Returns Impact:</span>
                        <span class="text-accent">$${results.costBreakdown.returns.toFixed(2)} (${((results.costBreakdown.returns/results.data.sellingPrice)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="flex justify-between text-sm border-t border-accent pt-2">
                        <span class="text-light font-bold">Total Costs:</span>
                        <span class="text-primary font-bold">$${results.totalCosts.toFixed(2)} (${((results.totalCosts/results.data.sellingPrice)*100).toFixed(1)}%)</span>
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Key Metrics</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-light">Gross Margin:</span>
                        <span class="text-accent">${results.grossMargin.toFixed(1)}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Net Margin:</span>
                        <span class="text-accent">${results.netMargin.toFixed(1)}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">ROI:</span>
                        <span class="text-accent">${results.roi.toFixed(1)}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">ROAS:</span>
                        <span class="text-accent">${results.roas.toFixed(1)}:1</span>
                    </div>
                    <div class="flex justify-between border-t border-accent pt-2">
                        <span class="text-light font-bold">Break-even Units:</span>
                        <span class="text-primary font-bold">${Math.ceil(results.breakEvenUnits)}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Revenue Projections</h4>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-light">Monthly Revenue:</span>
                        <span class="text-accent">$${results.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Monthly Net Profit:</span>
                        <span class="text-accent">$${results.monthlyNetProfit.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between border-t border-accent pt-2">
                        <span class="text-light font-bold">Annual Net Profit:</span>
                        <span class="text-primary font-bold">$${results.annualNetProfit.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded border border-accent">
                <h4 class="text-xl font-bold text-primary mb-4">Volume Analysis</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-light">Current Volume:</span>
                        <span class="text-accent">${sanitizeText(results.data.monthlyVolume)} units/month</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Break-even Volume:</span>
                        <span class="text-accent">${Math.ceil(results.breakEvenUnits)} units</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Profit at 2x Volume:</span>
                        <span class="text-accent">$${(results.monthlyNetProfit * 2).toLocaleString()}/month</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Profit at 5x Volume:</span>
                        <span class="text-accent">$${(results.monthlyNetProfit * 5).toLocaleString()}/month</span>
                    </div>
                </div>
            </div>
        </div>

        ${results.suggestions.length > 0 ? `
        <div class="bg-broder p-6 rounded border border-accent">
            <h4 class="text-xl font-bold text-primary mb-4">Optimization Recommendations</h4>
            <div class="space-y-4">
                ${results.suggestions.map(suggestion => `
                    <div class="flex items-start space-x-3">
                        <span class="material-icons ${suggestion.type === 'cost' ? 'text-yellow-400' : suggestion.type === 'pricing' ? 'text-green-400' : 'text-blue-400'} mt-1">
                            ${suggestion.type === 'cost' ? 'trending_down' : suggestion.type === 'pricing' ? 'trending_up' : 'lightbulb'}
                        </span>
                        <div>
                            <div class="font-semibold text-accent">${escapeHtml(suggestion.title)}</div>
                            <div class="text-light text-sm">${escapeHtml(suggestion.description)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
