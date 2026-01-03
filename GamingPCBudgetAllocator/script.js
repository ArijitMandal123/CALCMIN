// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gaming-pc-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        const results = calculatePCBuild(formData);
        displayResults(results);
    });
});

function collectFormData() {
    const brands = Array.from(document.querySelectorAll('input[name="brands"]:checked')).map(cb => cb.value);
    
    return {
        totalBudget: parseInt(document.getElementById('totalBudget').value),
        targetResolution: document.getElementById('targetResolution').value,
        targetFPS: parseInt(document.getElementById('targetFPS').value),
        gameType: document.getElementById('gameType').value,
        brands: brands,
        existingComponents: document.getElementById('existingComponents').value,
        upgradeStrategy: document.getElementById('upgradeStrategy').value
    };
}

function calculatePCBuild(data) {
    // Base budget allocations by resolution and FPS
    const baseAllocations = {
        '1080p': {
            60: { gpu: 0.38, cpu: 0.22, ram: 0.12, storage: 0.10, motherboard: 0.10, psuCase: 0.08 },
            120: { gpu: 0.42, cpu: 0.25, ram: 0.10, storage: 0.09, motherboard: 0.09, psuCase: 0.05 },
            144: { gpu: 0.44, cpu: 0.26, ram: 0.10, storage: 0.08, motherboard: 0.08, psuCase: 0.04 },
            240: { gpu: 0.45, cpu: 0.28, ram: 0.10, storage: 0.07, motherboard: 0.07, psuCase: 0.03 }
        },
        '1440p': {
            60: { gpu: 0.45, cpu: 0.20, ram: 0.12, storage: 0.10, motherboard: 0.08, psuCase: 0.05 },
            120: { gpu: 0.48, cpu: 0.22, ram: 0.10, storage: 0.08, motherboard: 0.08, psuCase: 0.04 },
            144: { gpu: 0.50, cpu: 0.23, ram: 0.10, storage: 0.07, motherboard: 0.07, psuCase: 0.03 },
            240: { gpu: 0.52, cpu: 0.25, ram: 0.10, storage: 0.06, motherboard: 0.05, psuCase: 0.02 }
        },
        '4k': {
            60: { gpu: 0.52, cpu: 0.18, ram: 0.12, storage: 0.08, motherboard: 0.06, psuCase: 0.04 },
            120: { gpu: 0.55, cpu: 0.20, ram: 0.10, storage: 0.07, motherboard: 0.05, psuCase: 0.03 },
            144: { gpu: 0.58, cpu: 0.20, ram: 0.10, storage: 0.06, motherboard: 0.04, psuCase: 0.02 },
            240: { gpu: 0.60, cpu: 0.22, ram: 0.10, storage: 0.05, motherboard: 0.02, psuCase: 0.01 }
        }
    };

    // Get base allocation
    let allocation = baseAllocations[data.targetResolution][data.targetFPS] || 
                    baseAllocations[data.targetResolution][60];

    // Adjust for game type
    allocation = adjustForGameType(allocation, data.gameType);
    
    // Adjust for upgrade strategy
    allocation = adjustForUpgradeStrategy(allocation, data.upgradeStrategy);
    
    // Adjust for existing components
    allocation = adjustForExistingComponents(allocation, data.existingComponents);

    // Calculate component budgets
    const componentBudgets = {
        gpu: Math.round(data.totalBudget * allocation.gpu),
        cpu: Math.round(data.totalBudget * allocation.cpu),
        ram: Math.round(data.totalBudget * allocation.ram),
        storage: Math.round(data.totalBudget * allocation.storage),
        motherboard: Math.round(data.totalBudget * allocation.motherboard),
        psuCase: Math.round(data.totalBudget * allocation.psuCase)
    };

    // Generate component recommendations
    const recommendations = generateComponentRecommendations(componentBudgets, data);
    
    // Calculate performance expectations
    const performance = calculatePerformanceExpectations(data, componentBudgets);
    
    // Generate upgrade timeline
    const upgradeTimeline = generateUpgradeTimeline(data, componentBudgets);

    return {
        allocation: allocation,
        componentBudgets: componentBudgets,
        recommendations: recommendations,
        performance: performance,
        upgradeTimeline: upgradeTimeline,
        totalAllocated: Object.values(componentBudgets).reduce((sum, val) => sum + val, 0)
    };
}

function adjustForGameType(allocation, gameType) {
    const adjustments = {
        'esports': { gpu: -0.05, cpu: +0.08, ram: +0.02, storage: -0.02, motherboard: -0.02, psuCase: -0.01 },
        'aaa': { gpu: +0.05, cpu: -0.02, ram: +0.02, storage: +0.02, motherboard: -0.04, psuCase: -0.03 },
        'competitive': { gpu: +0.02, cpu: +0.05, ram: +0.03, storage: -0.03, motherboard: -0.04, psuCase: -0.03 },
        'simulation': { gpu: -0.08, cpu: +0.12, ram: +0.08, storage: +0.03, motherboard: -0.08, psuCase: -0.07 },
        'indie': { gpu: -0.10, cpu: -0.05, ram: -0.02, storage: +0.05, motherboard: +0.07, psuCase: +0.05 },
        'mixed': { gpu: 0, cpu: 0, ram: 0, storage: 0, motherboard: 0, psuCase: 0 }
    };

    const adj = adjustments[gameType] || adjustments['mixed'];
    const result = {};
    
    for (const component in allocation) {
        result[component] = Math.max(0.02, allocation[component] + adj[component]);
    }
    
    return result;
}

function adjustForUpgradeStrategy(allocation, strategy) {
    const adjustments = {
        'gpu-first': { gpu: +0.03, cpu: -0.02, ram: 0, storage: 0, motherboard: -0.01, psuCase: 0 },
        'cpu-first': { gpu: -0.03, cpu: +0.05, ram: 0, storage: 0, motherboard: +0.01, psuCase: -0.03 },
        'longevity': { gpu: +0.02, cpu: +0.02, ram: +0.02, storage: +0.02, motherboard: +0.02, psuCase: +0.02 },
        'balanced': { gpu: 0, cpu: 0, ram: 0, storage: 0, motherboard: 0, psuCase: 0 }
    };

    const adj = adjustments[strategy] || adjustments['balanced'];
    const result = {};
    
    for (const component in allocation) {
        result[component] = Math.max(0.02, allocation[component] + adj[component]);
    }
    
    return result;
}

function adjustForExistingComponents(allocation, existing) {
    if (existing === 'none') return allocation;
    
    const adjustments = {
        'monitor': { gpu: +0.05, cpu: +0.02, ram: +0.02, storage: +0.01, motherboard: 0, psuCase: 0 },
        'storage': { gpu: +0.04, cpu: +0.03, ram: +0.02, storage: -0.09, motherboard: 0, psuCase: 0 },
        'case': { gpu: +0.03, cpu: +0.02, ram: +0.01, storage: +0.01, motherboard: +0.01, psuCase: -0.08 },
        'partial': { gpu: +0.02, cpu: +0.01, ram: +0.01, storage: 0, motherboard: 0, psuCase: -0.04 }
    };

    const adj = adjustments[existing] || { gpu: 0, cpu: 0, ram: 0, storage: 0, motherboard: 0, psuCase: 0 };
    const result = {};
    
    for (const component in allocation) {
        result[component] = Math.max(0.01, allocation[component] + adj[component]);
    }
    
    return result;
}

function generateComponentRecommendations(budgets, data) {
    const gpuTiers = {
        150: "GTX 1650 / RX 5500 XT",
        250: "GTX 1660 Super / RX 6600",
        350: "RTX 3060 / RX 6600 XT",
        500: "RTX 3060 Ti / RX 6700 XT",
        700: "RTX 3070 / RX 6800",
        900: "RTX 3080 / RX 6800 XT",
        1200: "RTX 4070 Ti / RX 7800 XT",
        1500: "RTX 4080 / RX 7900 XTX",
        2000: "RTX 4090"
    };

    const cpuTiers = {
        100: "Ryzen 5 4500 / i3-12100F",
        150: "Ryzen 5 5600 / i5-12400F",
        200: "Ryzen 5 5600X / i5-12600K",
        300: "Ryzen 7 5700X / i5-13600K",
        400: "Ryzen 7 5800X3D / i7-13700K",
        500: "Ryzen 9 5900X / i7-13700KF",
        600: "Ryzen 9 7900X / i9-13900K"
    };

    const ramTiers = {
        60: "16GB DDR4-3200",
        80: "16GB DDR4-3600",
        120: "32GB DDR4-3200",
        150: "32GB DDR4-3600",
        200: "32GB DDR5-5600"
    };

    function getRecommendation(budget, tiers) {
        const budgetKeys = Object.keys(tiers).map(Number).sort((a, b) => a - b);
        for (let i = budgetKeys.length - 1; i >= 0; i--) {
            if (budget >= budgetKeys[i]) {
                return tiers[budgetKeys[i]];
            }
        }
        return "Budget insufficient";
    }

    return {
        gpu: getRecommendation(budgets.gpu, gpuTiers),
        cpu: getRecommendation(budgets.cpu, cpuTiers),
        ram: getRecommendation(budgets.ram, ramTiers),
        storage: budgets.storage >= 100 ? "1TB NVMe SSD" : "500GB SATA SSD",
        motherboard: budgets.motherboard >= 150 ? "B550/B660 Chipset" : "A520/H610 Chipset",
        psuCase: budgets.psuCase >= 100 ? "650W 80+ Gold PSU + Mid Tower" : "550W 80+ Bronze PSU + Budget Case"
    };
}

function calculatePerformanceExpectations(data, budgets) {
    const performanceMultipliers = {
        '1080p': { 60: 1.0, 120: 1.3, 144: 1.4, 240: 1.8 },
        '1440p': { 60: 1.5, 120: 2.0, 144: 2.2, 240: 3.0 },
        '4k': { 60: 2.5, 120: 4.0, 144: 4.5, 240: 6.0 }
    };

    const basePerformanceScore = budgets.gpu / 100;
    const resolutionMultiplier = performanceMultipliers[data.targetResolution][data.targetFPS];
    const performanceRatio = basePerformanceScore / resolutionMultiplier;

    let expectedFPS, qualitySettings, futureProofing;

    if (performanceRatio >= 1.2) {
        expectedFPS = `${sanitizeText(data.targetFPS)}+ FPS consistently`;
        qualitySettings = "Ultra/High settings";
        futureProofing = "3-4 years at target settings";
    } else if (performanceRatio >= 1.0) {
        expectedFPS = `${Math.round(data.targetFPS * 0.9)}-${sanitizeText(data.targetFPS)} FPS`;
        qualitySettings = "High/Medium settings";
        futureProofing = "2-3 years at target settings";
    } else if (performanceRatio >= 0.8) {
        expectedFPS = `${Math.round(data.targetFPS * 0.7)}-${Math.round(data.targetFPS * 0.9)} FPS`;
        qualitySettings = "Medium settings";
        futureProofing = "1-2 years at target settings";
    } else {
        expectedFPS = `${Math.round(data.targetFPS * 0.5)}-${Math.round(data.targetFPS * 0.7)} FPS`;
        qualitySettings = "Low/Medium settings";
        futureProofing = "Consider increasing budget";
    }

    return {
        expectedFPS,
        qualitySettings,
        futureProofing,
        performanceScore: Math.round(performanceRatio * 100)
    };
}

function generateUpgradeTimeline(data, budgets) {
    const timeline = [];
    
    // GPU upgrade timeline
    if (budgets.gpu < 400) {
        timeline.push({
            component: "Graphics Card",
            timeframe: "12-18 months",
            reason: "To maintain high settings in new games",
            estimatedCost: "$300-500"
        });
    } else if (budgets.gpu < 800) {
        timeline.push({
            component: "Graphics Card",
            timeframe: "2-3 years",
            reason: "For next-gen gaming requirements",
            estimatedCost: "$400-700"
        });
    }

    // CPU upgrade timeline
    if (budgets.cpu < 200) {
        timeline.push({
            component: "CPU",
            timeframe: "18-24 months",
            reason: "To prevent bottlenecking future GPUs",
            estimatedCost: "$200-300"
        });
    }

    // RAM upgrade
    if (budgets.ram < 120) {
        timeline.push({
            component: "RAM",
            timeframe: "6-12 months",
            reason: "32GB becoming standard for gaming",
            estimatedCost: "$100-150"
        });
    }

    // Storage upgrade
    if (budgets.storage < 150) {
        timeline.push({
            component: "Storage",
            timeframe: "12-18 months",
            reason: "Faster NVMe SSD for game loading",
            estimatedCost: "$100-200"
        });
    }

    return timeline;
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    const html = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-2">Your Optimal Gaming PC Build</h3>
            <p class="text-light">Budget allocated: $${results.totalAllocated.toLocaleString()} of $${results.componentBudgets.gpu + results.componentBudgets.cpu + results.componentBudgets.ram + results.componentBudgets.storage + results.componentBudgets.motherboard + results.componentBudgets.psuCase}</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Budget Allocation</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-light">Graphics Card (GPU)</span>
                        <span class="text-primary font-semibold">$${results.componentBudgets.gpu.toLocaleString()} (${Math.round(results.allocation.gpu * 100)}%)</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Processor (CPU)</span>
                        <span class="text-primary font-semibold">$${results.componentBudgets.cpu.toLocaleString()} (${Math.round(results.allocation.cpu * 100)}%)</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Memory (RAM)</span>
                        <span class="text-primary font-semibold">$${results.componentBudgets.ram.toLocaleString()} (${Math.round(results.allocation.ram * 100)}%)</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Storage</span>
                        <span class="text-primary font-semibold">$${results.componentBudgets.storage.toLocaleString()} (${Math.round(results.allocation.storage * 100)}%)</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Motherboard</span>
                        <span class="text-primary font-semibold">$${results.componentBudgets.motherboard.toLocaleString()} (${Math.round(results.allocation.motherboard * 100)}%)</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">PSU & Case</span>
                        <span class="text-primary font-semibold">$${results.componentBudgets.psuCase.toLocaleString()} (${Math.round(results.allocation.psuCase * 100)}%)</span>
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Component Recommendations</h4>
                <div class="space-y-3">
                    <div>
                        <span class="text-light block">Graphics Card:</span>
                        <span class="text-primary font-semibold">${escapeHtml(results.recommendations.gpu)}</span>
                    </div>
                    <div>
                        <span class="text-light block">Processor:</span>
                        <span class="text-primary font-semibold">${escapeHtml(results.recommendations.cpu)}</span>
                    </div>
                    <div>
                        <span class="text-light block">Memory:</span>
                        <span class="text-primary font-semibold">${escapeHtml(results.recommendations.ram)}</span>
                    </div>
                    <div>
                        <span class="text-light block">Storage:</span>
                        <span class="text-primary font-semibold">${escapeHtml(results.recommendations.storage)}</span>
                    </div>
                    <div>
                        <span class="text-light block">Motherboard:</span>
                        <span class="text-primary font-semibold">${escapeHtml(results.recommendations.motherboard)}</span>
                    </div>
                    <div>
                        <span class="text-light block">PSU & Case:</span>
                        <span class="text-primary font-semibold">${escapeHtml(results.recommendations.psuCase)}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-broder p-6 rounded-lg border border-accent mb-6">
            <h4 class="text-xl font-bold text-accent mb-4">Performance Expectations</h4>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-primary mb-2">${sanitizeText(results.performance.performanceScore)}%</div>
                    <div class="text-sm text-light">Performance Score</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent">
                    <div class="text-sm text-light mb-1">Expected FPS:</div>
                    <div class="text-primary font-semibold">${escapeHtml(results.performance.expectedFPS)}</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent">
                    <div class="text-sm text-light mb-1">Quality Settings:</div>
                    <div class="text-primary font-semibold">${escapeHtml(results.performance.qualitySettings)}</div>
                </div>
            </div>
            <div class="mt-4 p-4 bg-dark rounded border border-accent">
                <div class="text-sm text-light mb-1">Future-Proofing:</div>
                <div class="text-accent">${escapeHtml(results.performance.futureProofing)}</div>
            </div>
        </div>

        ${results.upgradeTimeline.length > 0 ? `
        <div class="bg-broder p-6 rounded-lg border border-accent">
            <h4 class="text-xl font-bold text-accent mb-4">Upgrade Timeline</h4>
            <div class="space-y-4">
                ${results.upgradeTimeline.map(upgrade => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-primary font-semibold">${escapeHtml(upgrade.component)}</span>
                            <span class="text-accent text-sm">${escapeHtml(upgrade.timeframe)}</span>
                        </div>
                        <div class="text-light text-sm mb-1">${escapeHtml(upgrade.reason)}</div>
                        <div class="text-light text-xs">Estimated cost: ${escapeHtml(upgrade.estimatedCost)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;

    contentDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
