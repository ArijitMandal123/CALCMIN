// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`n// Tax Bracket Optimization Calculator Script

// Popup functionality
function showPopup(message) {
    document.getElementById('popupMessage').textContent = message;
    document.getElementById('customPopup').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('customPopup').classList.add('hidden');
}

// Close popup when clicking outside
document.getElementById('customPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// ===== TAX BRACKETS AND RATES =====
const TAX_BRACKETS_2024 = {
    single: [
        { min: 0, max: 11000, rate: 0.10 },
        { min: 11000, max: 44725, rate: 0.12 },
        { min: 44725, max: 95375, rate: 0.22 },
        { min: 95375, max: 182050, rate: 0.24 },
        { min: 182050, max: 231250, rate: 0.32 },
        { min: 231250, max: 578125, rate: 0.35 },
        { min: 578125, max: Infinity, rate: 0.37 }
    ],
    'married-joint': [
        { min: 0, max: 22000, rate: 0.10 },
        { min: 22000, max: 89450, rate: 0.12 },
        { min: 89450, max: 190750, rate: 0.22 },
        { min: 190750, max: 364200, rate: 0.24 },
        { min: 364200, max: 462500, rate: 0.32 },
        { min: 462500, max: 693750, rate: 0.35 },
        { min: 693750, max: Infinity, rate: 0.37 }
    ],
    'married-separate': [
        { min: 0, max: 11000, rate: 0.10 },
        { min: 11000, max: 44725, rate: 0.12 },
        { min: 44725, max: 95375, rate: 0.22 },
        { min: 95375, max: 182100, rate: 0.24 },
        { min: 182100, max: 231250, rate: 0.32 },
        { min: 231250, max: 346875, rate: 0.35 },
        { min: 346875, max: Infinity, rate: 0.37 }
    ],
    'head-household': [
        { min: 0, max: 15700, rate: 0.10 },
        { min: 15700, max: 59850, rate: 0.12 },
        { min: 59850, max: 95350, rate: 0.22 },
        { min: 95350, max: 182050, rate: 0.24 },
        { min: 182050, max: 231250, rate: 0.32 },
        { min: 231250, max: 578100, rate: 0.35 },
        { min: 578100, max: Infinity, rate: 0.37 }
    ]
};

const CAPITAL_GAINS_BRACKETS = {
    single: [
        { min: 0, max: 44625, rate: 0.00 },
        { min: 44625, max: 492300, rate: 0.15 },
        { min: 492300, max: Infinity, rate: 0.20 }
    ],
    'married-joint': [
        { min: 0, max: 89250, rate: 0.00 },
        { min: 89250, max: 553850, rate: 0.15 },
        { min: 553850, max: Infinity, rate: 0.20 }
    ]
};

const STATE_TAX_RATES = {
    'no-tax': 0,
    'low-tax': 0.04,
    'medium-tax': 0.07,
    'high-tax': 0.11,
    'ca': 0.133,
    'ny': 0.109
};

const STANDARD_DEDUCTIONS = {
    single: 14600,
    'married-joint': 29200,
    'married-separate': 14600,
    'head-household': 21900
};

// ===== DATA COLLECTION =====
function collectTaxData() {
    return {
        totalIncome: parseFloat(document.getElementById('totalIncome').value) || 0,
        state: document.getElementById('state').value,
        currentSalary: parseFloat(document.getElementById('currentSalary').value) || 0,
        currentDividends: parseFloat(document.getElementById('currentDividends').value) || 0,
        currentCapitalGains: parseFloat(document.getElementById('currentCapitalGains').value) || 0,
        deductions: parseFloat(document.getElementById('deductions').value) || 0,
        currentStructure: document.getElementById('currentStructure').value,
        filingStatus: document.getElementById('filingStatus').value,
        dependents: parseInt(document.getElementById('dependents').value) || 0,
        selfEmploymentIncome: parseFloat(document.getElementById('selfEmploymentIncome').value) || 0,
        businessExpenses: parseFloat(document.getElementById('businessExpenses').value) || 0
    };
}

// ===== TAX CALCULATION FUNCTIONS =====
function calculateFederalTax(income, filingStatus) {
    const brackets = TAX_BRACKETS_2024[filingStatus] || TAX_BRACKETS_2024.single;
    let tax = 0;
    let remainingIncome = income;

    for (const bracket of brackets) {
        if (remainingIncome <= 0) break;
        
        const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
        tax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
    }

    return tax;
}

function calculateCapitalGainsTax(gains, otherIncome, filingStatus) {
    const brackets = CAPITAL_GAINS_BRACKETS[filingStatus] || CAPITAL_GAINS_BRACKETS.single;
    const totalIncome = gains + otherIncome;
    let tax = 0;
    let remainingGains = gains;

    for (const bracket of brackets) {
        if (remainingGains <= 0) break;
        
        const applicableIncome = Math.max(0, Math.min(totalIncome, bracket.max) - Math.max(otherIncome, bracket.min));
        const taxableGains = Math.min(remainingGains, applicableIncome);
        
        tax += taxableGains * bracket.rate;
        remainingGains -= taxableGains;
    }

    return tax;
}

function calculateSelfEmploymentTax(income) {
    const seRate = 0.1413; // 14.13% (reduced by deduction)
    const maxWages = 160200; // 2024 Social Security wage base
    
    const socialSecurityTax = Math.min(income, maxWages) * 0.124;
    const medicareTax = income * 0.029;
    
    return socialSecurityTax + medicareTax;
}

function calculateStateTax(income, state) {
    const rate = STATE_TAX_RATES[state] || 0;
    return income * rate;
}

// ===== OPTIMIZATION LOGIC =====
function optimizeTaxStrategy(data) {
    const standardDeduction = STANDARD_DEDUCTIONS[data.filingStatus] || STANDARD_DEDUCTIONS.single;
    const totalDeductions = Math.max(standardDeduction, data.deductions);
    
    // Current tax calculation
    const currentTaxable = Math.max(0, data.totalIncome - totalDeductions);
    const currentFederal = calculateFederalTax(currentTaxable, data.filingStatus);
    const currentSE = calculateSelfEmploymentTax(data.selfEmploymentIncome);
    const currentState = calculateStateTax(currentTaxable, data.state);
    const currentTotal = currentFederal + currentSE + currentState;

    // Optimization scenarios
    const scenarios = [];

    // Scenario 1: S-Corp Election
    if (data.totalIncome > 60000) {
        const reasonableSalary = Math.min(data.totalIncome * 0.6, data.totalIncome - 50000);
        const distributions = data.totalIncome - reasonableSalary;
        
        const sCorpTaxable = Math.max(0, reasonableSalary - totalDeductions);
        const sCorpFederal = calculateFederalTax(sCorpTaxable, data.filingStatus);
        const sCorpPayroll = reasonableSalary * 0.153; // Full FICA on salary only
        const sCorpState = calculateStateTax(sCorpTaxable, data.state);
        const sCorpTotal = sCorpFederal + sCorpPayroll + sCorpState;
        
        scenarios.push({
            name: 'S-Corporation Election',
            structure: 's-corp',
            salary: reasonableSalary,
            distributions: distributions,
            federalTax: sCorpFederal,
            payrollTax: sCorpPayroll,
            stateTax: sCorpState,
            totalTax: sCorpTotal,
            savings: currentTotal - sCorpTotal,
            description: 'Split income between salary and tax-free distributions'
        });
    }

    // Scenario 2: Income Splitting with Capital Gains
    if (data.totalIncome > 100000) {
        const salaryIncome = data.totalIncome * 0.7;
        const capitalGains = data.totalIncome * 0.3;
        
        const splitTaxable = Math.max(0, salaryIncome - totalDeductions);
        const splitFederal = calculateFederalTax(splitTaxable, data.filingStatus);
        const splitCapGains = calculateCapitalGainsTax(capitalGains, splitTaxable, data.filingStatus);
        const splitSE = calculateSelfEmploymentTax(salaryIncome);
        const splitState = calculateStateTax(splitTaxable + capitalGains, data.state);
        const splitTotal = splitFederal + splitCapGains + splitSE + splitState;
        
        scenarios.push({
            name: 'Income Splitting Strategy',
            structure: 'income-split',
            salary: salaryIncome,
            capitalGains: capitalGains,
            federalTax: splitFederal,
            capitalGainsTax: splitCapGains,
            payrollTax: splitSE,
            stateTax: splitState,
            totalTax: splitTotal,
            savings: currentTotal - splitTotal,
            description: 'Convert ordinary income to capital gains where possible'
        });
    }

    // Scenario 3: Maximized Deductions
    const maxRetirement = Math.min(69000, data.totalIncome * 0.25); // Solo 401k limit
    const enhancedDeductions = totalDeductions + maxRetirement;
    const maxDeductTaxable = Math.max(0, data.totalIncome - enhancedDeductions);
    const maxDeductFederal = calculateFederalTax(maxDeductTaxable, data.filingStatus);
    const maxDeductSE = calculateSelfEmploymentTax(data.selfEmploymentIncome);
    const maxDeductState = calculateStateTax(maxDeductTaxable, data.state);
    const maxDeductTotal = maxDeductFederal + maxDeductSE + maxDeductState;
    
    scenarios.push({
        name: 'Maximized Deductions',
        structure: 'max-deductions',
        retirementContrib: maxRetirement,
        federalTax: maxDeductFederal,
        payrollTax: maxDeductSE,
        stateTax: maxDeductState,
        totalTax: maxDeductTotal,
        savings: currentTotal - maxDeductTotal,
        description: 'Maximize retirement contributions and business deductions'
    });

    // Sort scenarios by savings
    scenarios.sort((a, b) => b.savings - a.savings);

    return {
        current: {
            structure: data.currentStructure,
            federalTax: currentFederal,
            payrollTax: currentSE,
            stateTax: currentState,
            totalTax: currentTotal,
            effectiveRate: (currentTotal / data.totalIncome) * 100
        },
        optimized: scenarios,
        bestSavings: scenarios[0]?.savings || 0,
        recommendations: generateTaxRecommendations(data, scenarios)
    };
}

function generateTaxRecommendations(data, scenarios) {
    const recommendations = [];
    
    // Business structure recommendation
    if (data.totalIncome > 60000 && data.currentStructure === 'sole-prop') {
        recommendations.push({
            category: 'Business Structure',
            priority: 'High',
            action: 'Consider S-Corporation election to reduce self-employment taxes',
            impact: `Potential savings: $${Math.round(scenarios.find(s => s.structure === 's-corp')?.savings || 0).toLocaleString()}`
        });
    }

    // Retirement contributions
    if (data.deductions < 50000) {
        recommendations.push({
            category: 'Retirement Planning',
            priority: 'High',
            action: 'Maximize Solo 401(k) or SEP-IRA contributions',
            impact: 'Reduce taxable income by up to $69,000 annually'
        });
    }

    // State tax optimization
    if (STATE_TAX_RATES[data.state] > 0.08) {
        recommendations.push({
            category: 'State Tax Planning',
            priority: 'Medium',
            action: 'Consider tax-advantaged state strategies or relocation',
            impact: 'High state tax rate may justify additional optimization'
        });
    }

    // Income timing
    if (data.totalIncome > 200000) {
        recommendations.push({
            category: 'Income Timing',
            priority: 'Medium',
            action: 'Consider income smoothing across multiple years',
            impact: 'Avoid higher tax brackets through strategic timing'
        });
    }

    // Quarterly payments
    recommendations.push({
        category: 'Estimated Taxes',
        priority: 'Medium',
        action: 'Optimize quarterly estimated tax payments',
        impact: 'Avoid penalties and optimize cash flow'
    });

    return recommendations;
}

// ===== RESULTS DISPLAY =====
function displayResults(results) {
    const resultsDiv = document.getElementById('result-content');
    
    resultsDiv.innerHTML = `
        <!-- Current vs Optimized Comparison -->
        <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div class="bg-dark/50 rounded-lg p-6 border border-red-500/30">
                <h3 class="text-xl font-bold text-red-400 mb-4">Current Tax Situation</h3>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-light">Federal Tax:</span>
                        <span class="text-text font-semibold">$${Math.round(results.current.federalTax).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Payroll/SE Tax:</span>
                        <span class="text-text font-semibold">$${Math.round(results.current.payrollTax).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">State Tax:</span>
                        <span class="text-text font-semibold">$${Math.round(results.current.stateTax).toLocaleString()}</span>
                    </div>
                    <hr class="border-accent/30">
                    <div class="flex justify-between text-lg">
                        <span class="text-light font-semibold">Total Tax:</span>
                        <span class="text-red-400 font-bold">$${Math.round(results.current.totalTax).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Effective Rate:</span>
                        <span class="text-red-400 font-semibold">${results.current.effectiveRate.toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            <div class="bg-dark/50 rounded-lg p-6 border border-green-500/30">
                <h3 class="text-xl font-bold text-green-400 mb-4">Optimized Strategy</h3>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-light">Strategy:</span>
                        <span class="text-text font-semibold">${results.optimized[0]?.name || 'Current Optimal'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Federal Tax:</span>
                        <span class="text-text font-semibold">$${Math.round(results.optimized[0]?.federalTax || results.current.federalTax).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Payroll Tax:</span>
                        <span class="text-text font-semibold">$${Math.round(results.optimized[0]?.payrollTax || results.current.payrollTax).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">State Tax:</span>
                        <span class="text-text font-semibold">$${Math.round(results.optimized[0]?.stateTax || results.current.stateTax).toLocaleString()}</span>
                    </div>
                    <hr class="border-accent/30">
                    <div class="flex justify-between text-lg">
                        <span class="text-light font-semibold">Total Tax:</span>
                        <span class="text-green-400 font-bold">$${Math.round(results.optimized[0]?.totalTax || results.current.totalTax).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-light">Annual Savings:</span>
                        <span class="text-green-400 font-bold">$${Math.round(results.bestSavings).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Optimization Scenarios -->
        <div class="mb-8">
            <h3 class="text-xl font-bold text-primary mb-6">Optimization Scenarios</h3>
            <div class="space-y-4">
                ${results.optimized.map(scenario => `
                    <div class="bg-dark/50 rounded-lg p-6 border border-accent/20">
                        <div class="flex justify-between items-start mb-3">
                            <h4 class="font-semibold text-accent">${scenario.name}</h4>
                            <span class="px-3 py-1 text-sm rounded ${scenario.savings > 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}">
                                ${scenario.savings > 0 ? '+' : ''}$${Math.round(scenario.savings).toLocaleString()} savings
                            </span>
                        </div>
                        <p class="text-light text-sm mb-3">${sanitizeText(scenario.description)}</p>
                        <div class="grid md:grid-cols-3 gap-4 text-sm">
                            ${scenario.salary ? `<div><span class="text-light">Salary:</span> <span class="text-primary">$${Math.round(scenario.salary).toLocaleString()}</span></div>` : ''}
                            ${scenario.distributions ? `<div><span class="text-light">Distributions:</span> <span class="text-primary">$${Math.round(scenario.distributions).toLocaleString()}</span></div>` : ''}
                            ${scenario.capitalGains ? `<div><span class="text-light">Capital Gains:</span> <span class="text-primary">$${Math.round(scenario.capitalGains).toLocaleString()}</span></div>` : ''}
                            ${scenario.retirementContrib ? `<div><span class="text-light">Retirement:</span> <span class="text-primary">$${Math.round(scenario.retirementContrib).toLocaleString()}</span></div>` : ''}
                            <div><span class="text-light">Total Tax:</span> <span class="text-accent">$${Math.round(scenario.totalTax).toLocaleString()}</span></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Quarterly Payment Estimate -->
        <div class="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-8 border border-primary/20">
            <h3 class="text-xl font-bold text-primary mb-4">Quarterly Payment Estimate</h3>
            <div class="grid md:grid-cols-4 gap-4">
                <div class="text-center">
                    <p class="text-2xl font-bold text-accent">$${Math.round((results.optimized[0]?.totalTax || results.current.totalTax) / 4).toLocaleString()}</p>
                    <p class="text-sm text-light">Per Quarter</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-primary">$${Math.round((results.optimized[0]?.totalTax || results.current.totalTax) / 12).toLocaleString()}</p>
                    <p class="text-sm text-light">Per Month</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-green-400">${((results.optimized[0]?.totalTax || results.current.totalTax) / (parseFloat(document.getElementById('totalIncome').value) || 1) * 100).toFixed(1)}%</p>
                    <p class="text-sm text-light">Effective Rate</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold text-yellow-400">$${Math.round(results.bestSavings * 5).toLocaleString()}</p>
                    <p class="text-sm text-light">5-Year Savings</p>
                </div>
            </div>
        </div>

        <!-- Recommendations -->
        <div class="mb-8">
            <h3 class="text-xl font-bold text-primary mb-6">Personalized Recommendations</h3>
            <div class="space-y-4">
                ${results.recommendations.map(rec => `
                    <div class="bg-dark/50 rounded-lg p-6 border border-accent/20">
                        <div class="flex justify-between items-start mb-3">
                            <h4 class="font-semibold text-accent">${rec.category}</h4>
                            <span class="px-2 py-1 text-xs rounded ${rec.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}">${sanitizeText(rec.priority)}</span>
                        </div>
                        <p class="text-light mb-2">${sanitizeText(rec.action)}</p>
                        <p class="text-sm text-primary font-medium">Expected Impact: ${sanitizeText(rec.impact)}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Important Disclaimer -->
        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                <span class="material-icons mr-2">warning</span>
                Important Disclaimer
            </h3>
            <p class="text-light text-sm leading-relaxed">
                This calculator provides estimates based on 2024 tax brackets and general assumptions. Tax optimization strategies can be complex and may have unintended consequences. Always consult with a qualified tax professional or CPA before implementing any tax strategy. Individual circumstances vary, and professional advice is essential for optimal results.
            </p>
        </div>
    `;

    // Show results section
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ===== EVENT HANDLERS =====
document.getElementById('taxOptimizerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = collectTaxData();
    
    // Validation
    if (data.totalIncome <= 0) {
        showPopup('Please enter a valid total annual income.');
        return;
    }
    
    if (data.totalIncome > 10000000) {
        showPopup('This calculator is designed for incomes up to $10 million. Please consult a tax professional for higher income levels.');
        return;
    }
    
    const results = optimizeTaxStrategy(data);
    displayResults(results);
});

// Auto-update current income fields when total income changes
document.getElementById('totalIncome').addEventListener('input', function() {
    const totalIncome = parseFloat(this.value) || 0;
    const currentSalary = document.getElementById('currentSalary');
    
    // Auto-populate salary if it's currently equal to or greater than total income
    if (parseFloat(currentSalary.value) >= totalIncome || parseFloat(currentSalary.value) === 0) {
        currentSalary.value = totalIncome;
    }
});


