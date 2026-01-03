// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gacha-roi-form');
    const satisfactionInput = document.getElementById('satisfactionLevel');
    const satisfactionText = document.getElementById('satisfaction-text');
    const stars = document.querySelectorAll('.star');
    
    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            satisfactionInput.value = rating;
            updateStars(rating);
            updateSatisfactionText(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });
    
    document.getElementById('star-rating').addEventListener('mouseleave', function() {
        updateStars(parseInt(satisfactionInput.value));
    });
    
    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('text-gray-400');
                star.classList.add('text-yellow-400');
            } else {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-gray-400');
            }
        });
    }
    
    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('text-gray-400');
                star.classList.add('text-yellow-400');
            } else {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-gray-400');
            }
        });
    }
    
    function updateSatisfactionText(rating) {
        const labels = {
            1: 'Terrible (1/10)',
            2: 'Very Bad (2/10)',
            3: 'Bad (3/10)',
            4: 'Poor (4/10)',
            5: 'Average (5/10)',
            6: 'Good (6/10)',
            7: 'Very Good (7/10)',
            8: 'Great (8/10)',
            9: 'Excellent (9/10)',
            10: 'Perfect (10/10)'
        };
        satisfactionText.textContent = labels[rating] || 'Click stars to rate';
    }
    
    // Initialize with default rating
    updateStars(5);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        const results = calculateGachaROI(formData);
        displayResults(results);
    });
});

function collectFormData() {
    const motivations = Array.from(document.querySelectorAll('input[name="motivations"]:checked')).map(cb => cb.value);
    
    return {
        gameTitle: document.getElementById('gameTitle').value,
        totalSpent: parseFloat(document.getElementById('totalSpent').value),
        hoursPlayed: parseInt(document.getElementById('hoursPlayed').value),
        monthsPlaying: parseInt(document.getElementById('monthsPlaying').value),
        rareCharacters: parseInt(document.getElementById('rareCharacters').value),
        battlePasses: parseInt(document.getElementById('battlePasses').value) || 0,
        monthlySpending: parseFloat(document.getElementById('monthlySpending').value),
        satisfactionLevel: parseInt(document.getElementById('satisfactionLevel').value),
        motivations: motivations
    };
}

function calculateGachaROI(data) {
    // Game-specific data for analysis
    const gameData = {
        'genshin': { avgMonthly: 125, pitySystem: true, f2pFriendly: 8 },
        'honkai': { avgMonthly: 100, pitySystem: true, f2pFriendly: 7 },
        'fgo': { avgMonthly: 200, pitySystem: false, f2pFriendly: 6 },
        'azur': { avgMonthly: 50, pitySystem: true, f2pFriendly: 9 },
        'arknights': { avgMonthly: 75, pitySystem: true, f2pFriendly: 8 },
        'epic7': { avgMonthly: 90, pitySystem: true, f2pFriendly: 8 },
        'summoners': { avgMonthly: 150, pitySystem: false, f2pFriendly: 5 },
        'dragalia': { avgMonthly: 80, pitySystem: true, f2pFriendly: 7 },
        'granblue': { avgMonthly: 120, pitySystem: true, f2pFriendly: 6 },
        'other': { avgMonthly: 100, pitySystem: true, f2pFriendly: 7 }
    };

    const gameInfo = gameData[data.gameTitle] || gameData['other'];
    
    // Basic calculations
    const costPerHour = data.totalSpent / data.hoursPlayed;
    const avgMonthlySpent = data.totalSpent / data.monthsPlaying;
    const costPerCharacter = data.rareCharacters > 0 ? data.totalSpent / data.rareCharacters : 0;
    
    // Whale classification
    const whaleClass = getWhaleClassification(data.monthlySpending);
    
    // ROI Analysis
    const entertainmentValue = calculateEntertainmentValue(costPerHour, data.satisfactionLevel);
    const comparisonAnalysis = compareToAlternatives(costPerHour, data.hoursPlayed);
    const spendingEfficiency = calculateSpendingEfficiency(data, gameInfo);
    
    // Future projections
    const annualProjection = data.monthlySpending * 12;
    const fiveYearProjection = annualProjection * 5;
    
    // Recommendations
    const recommendations = generateRecommendations(data, whaleClass, spendingEfficiency);
    
    // Should quit analysis
    const quitAnalysis = shouldQuitAnalysis(data, costPerHour, whaleClass);

    return {
        basicMetrics: {
            costPerHour: costPerHour,
            avgMonthlySpent: avgMonthlySpent,
            costPerCharacter: costPerCharacter,
            totalInvestment: data.totalSpent
        },
        whaleClass: whaleClass,
        entertainmentValue: entertainmentValue,
        comparisonAnalysis: comparisonAnalysis,
        spendingEfficiency: spendingEfficiency,
        projections: {
            annual: annualProjection,
            fiveYear: fiveYearProjection
        },
        recommendations: recommendations,
        quitAnalysis: quitAnalysis,
        gameComparison: {
            yourSpending: avgMonthlySpent,
            gameAverage: gameInfo.avgMonthly,
            efficiency: (gameInfo.avgMonthly / avgMonthlySpent) * 100
        }
    };
}

function getWhaleClassification(monthlySpending) {
    if (monthlySpending === 0) {
        return {
            class: "F2P (Free-to-Play)",
            color: "text-green-400",
            description: "You play without spending money",
            percentile: 45
        };
    } else if (monthlySpending <= 15) {
        return {
            class: "Minnow",
            color: "text-blue-400", 
            description: "Light spender with occasional purchases",
            percentile: 25
        };
    } else if (monthlySpending <= 100) {
        return {
            class: "Dolphin",
            color: "text-yellow-400",
            description: "Regular spender with selective purchases", 
            percentile: 15
        };
    } else if (monthlySpending <= 500) {
        return {
            class: "Whale",
            color: "text-orange-400",
            description: "Heavy spender chasing meta content",
            percentile: 5
        };
    } else {
        return {
            class: "Kraken",
            color: "text-red-400",
            description: "Extreme spender with unlimited budget",
            percentile: 1
        };
    }
}

function calculateEntertainmentValue(costPerHour, satisfaction) {
    const benchmarks = {
        movie: 15, // $15/hour for movies
        console: 2, // $2/hour for console games
        streaming: 0.5, // $0.50/hour for streaming
        book: 1 // $1/hour for books
    };
    
    let valueRating;
    if (costPerHour <= benchmarks.streaming) {
        valueRating = "Excellent";
    } else if (costPerHour <= benchmarks.book) {
        valueRating = "Very Good";
    } else if (costPerHour <= benchmarks.console) {
        valueRating = "Good";
    } else if (costPerHour <= benchmarks.movie) {
        valueRating = "Fair";
    } else {
        valueRating = "Poor";
    }
    
    // Adjust for satisfaction
    const satisfactionMultiplier = satisfaction / 10;
    const adjustedValue = valueRating;
    
    return {
        costPerHour: costPerHour,
        valueRating: adjustedValue,
        benchmarks: benchmarks,
        satisfactionAdjusted: satisfactionMultiplier > 0.7
    };
}

function compareToAlternatives(costPerHour, hoursPlayed) {
    const alternatives = [
        { name: "Netflix Subscription", costPerHour: 0.5, description: "Streaming entertainment" },
        { name: "Console Gaming", costPerHour: 2, description: "AAA games with DLC" },
        { name: "Movie Theater", costPerHour: 15, description: "Cinema experience" },
        { name: "Gym Membership", costPerHour: 3, description: "Fitness and health" },
        { name: "Coffee Shop Visits", costPerHour: 8, description: "Social cafe time" }
    ];
    
    const betterValue = alternatives.filter(alt => alt.costPerHour < costPerHour);
    const worseValue = alternatives.filter(alt => alt.costPerHour > costPerHour);
    
    return {
        yourCostPerHour: costPerHour,
        betterAlternatives: betterValue,
        worseAlternatives: worseValue,
        ranking: alternatives.length - betterValue.length + 1
    };
}

function calculateSpendingEfficiency(data, gameInfo) {
    let efficiencyScore = 50; // Base score
    
    // Battle pass efficiency (high value purchases)
    const battlePassRatio = data.battlePasses / data.monthsPlaying;
    if (battlePassRatio > 0.8) efficiencyScore += 15;
    else if (battlePassRatio > 0.5) efficiencyScore += 10;
    else if (battlePassRatio > 0.2) efficiencyScore += 5;
    
    // Character acquisition efficiency
    const charactersPerDollar = data.rareCharacters / (data.totalSpent || 1);
    if (charactersPerDollar > 0.1) efficiencyScore += 15;
    else if (charactersPerDollar > 0.05) efficiencyScore += 10;
    else if (charactersPerDollar > 0.02) efficiencyScore += 5;
    
    // Spending consistency (avoid impulse spikes)
    const spendingConsistency = Math.abs(data.monthlySpending - (data.totalSpent / data.monthsPlaying));
    if (spendingConsistency < 20) efficiencyScore += 10;
    else if (spendingConsistency < 50) efficiencyScore += 5;
    
    // Game-specific factors
    if (gameInfo.pitySystem) efficiencyScore += 5;
    if (gameInfo.f2pFriendly >= 7) efficiencyScore += 5;
    
    return Math.min(100, Math.max(0, efficiencyScore));
}

function generateRecommendations(data, whaleClass, efficiency) {
    const recommendations = [];
    
    // Spending level recommendations
    if (whaleClass.class === "Kraken" || whaleClass.class === "Whale") {
        recommendations.push({
            type: "warning",
            title: "Consider Spending Reduction",
            message: "Your spending level is in the top 5% of players. Consider setting monthly limits to avoid financial strain."
        });
    }
    
    // Efficiency recommendations
    if (efficiency < 60) {
        recommendations.push({
            type: "improvement",
            title: "Improve Spending Efficiency", 
            message: "Focus on battle passes and guaranteed banners. Avoid impulse purchases during limited events."
        });
    }
    
    // Value recommendations
    const costPerHour = data.totalSpent / data.hoursPlayed;
    if (costPerHour > 5) {
        recommendations.push({
            type: "value",
            title: "Entertainment Value Concern",
            message: "Your cost per hour is high compared to other entertainment. Consider if this spending aligns with your budget."
        });
    }
    
    // Satisfaction recommendations
    if (data.satisfactionLevel <= 5) {
        recommendations.push({
            type: "satisfaction",
            title: "Low Satisfaction Alert",
            message: "Your satisfaction level suggests the game may not be worth continued investment. Consider taking a break."
        });
    }
    
    // Positive reinforcement
    if (efficiency >= 80 && data.satisfactionLevel >= 8) {
        recommendations.push({
            type: "positive",
            title: "Healthy Gaming Habits",
            message: "You're spending efficiently and enjoying the game. Continue with your current approach."
        });
    }
    
    return recommendations;
}

function shouldQuitAnalysis(data, costPerHour, whaleClass) {
    let quitScore = 0;
    const factors = [];
    
    // High spending concern
    if (whaleClass.class === "Kraken") {
        quitScore += 30;
        factors.push("Extreme spending level (top 1% of players)");
    } else if (whaleClass.class === "Whale") {
        quitScore += 20;
        factors.push("Heavy spending level (top 5% of players)");
    }
    
    // Poor value
    if (costPerHour > 10) {
        quitScore += 25;
        factors.push("Very high cost per hour of entertainment");
    } else if (costPerHour > 5) {
        quitScore += 15;
        factors.push("High cost per hour compared to alternatives");
    }
    
    // Low satisfaction
    if (data.satisfactionLevel <= 3) {
        quitScore += 35;
        factors.push("Very low satisfaction with current spending");
    } else if (data.satisfactionLevel <= 5) {
        quitScore += 20;
        factors.push("Below average satisfaction level");
    }
    
    // Spending trend
    const avgMonthly = data.totalSpent / data.monthsPlaying;
    if (data.monthlySpending > avgMonthly * 1.5) {
        quitScore += 15;
        factors.push("Spending is increasing over time");
    }
    
    let recommendation;
    if (quitScore >= 70) {
        recommendation = "Strongly Consider Quitting";
    } else if (quitScore >= 50) {
        recommendation = "Take a Break";
    } else if (quitScore >= 30) {
        recommendation = "Reduce Spending";
    } else {
        recommendation = "Continue Playing";
    }
    
    return {
        score: quitScore,
        recommendation: recommendation,
        factors: factors
    };
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');

    const html = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-2">Your Gacha Game ROI Analysis</h3>
            <p class="text-light">Classification: <span class="${sanitizeText(results.whaleClass.color)} font-semibold">${sanitizeText(results.whaleClass.class)}</span> (Top ${sanitizeText(results.whaleClass.percentile)}% of players)</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Basic Metrics</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-light">Cost per Hour</span>
                        <span class="text-primary font-semibold">$${results.basicMetrics.costPerHour.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Average Monthly Spending</span>
                        <span class="text-primary font-semibold">$${results.basicMetrics.avgMonthlySpent.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Cost per Rare Character</span>
                        <span class="text-primary font-semibold">$${results.basicMetrics.costPerCharacter.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Total Investment</span>
                        <span class="text-primary font-semibold">$${results.basicMetrics.totalInvestment.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Entertainment Value</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-light">Value Rating</span>
                        <span class="text-primary font-semibold">${sanitizeText(results.entertainmentValue.valueRating)}</span>
                    </div>
                    <div class="text-sm text-light">
                        <div class="mb-2">Compared to other entertainment:</div>
                        <div class="space-y-1">
                            <div>Netflix: $${results.entertainmentValue.benchmarks.streaming.toFixed(2)}/hour</div>
                            <div>Console Games: $${results.entertainmentValue.benchmarks.console.toFixed(2)}/hour</div>
                            <div>Movies: $${results.entertainmentValue.benchmarks.movie.toFixed(2)}/hour</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Spending Efficiency</h4>
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-light">Efficiency Score</span>
                        <span class="text-primary font-semibold">${sanitizeText(results.spendingEfficiency)}/100</span>
                    </div>
                    <div class="w-full bg-dark rounded-full h-2">
                        <div class="bg-primary h-2 rounded-full" style="width: ${sanitizeText(results.spendingEfficiency)}%"></div>
                    </div>
                </div>
                <div class="text-sm text-light">
                    ${results.spendingEfficiency >= 80 ? 'Excellent spending efficiency!' : 
                      results.spendingEfficiency >= 60 ? 'Good spending habits with room for improvement.' :
                      'Consider optimizing your spending strategy.'}
                </div>
            </div>

            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Future Projections</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-light">Annual Spending</span>
                        <span class="text-primary font-semibold">$${results.projections.annual.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">5-Year Projection</span>
                        <span class="text-primary font-semibold">$${results.projections.fiveYear.toFixed(2)}</span>
                    </div>
                    <div class="text-sm text-light mt-3">
                        At current spending rate, you'll invest $${(results.projections.fiveYear / 1000).toFixed(1)}k over 5 years.
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-broder p-6 rounded-lg border border-accent mb-6">
            <h4 class="text-xl font-bold text-accent mb-4">Should I Quit Analysis</h4>
            <div class="grid md:grid-cols-3 gap-4 mb-4">
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-primary mb-2">${sanitizeText(results.quitAnalysis.score)}/100</div>
                    <div class="text-sm text-light">Quit Score</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-lg font-bold text-accent mb-2">${sanitizeText(results.quitAnalysis.recommendation)}</div>
                    <div class="text-sm text-light">Recommendation</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-lg font-bold ${results.gameComparison.efficiency > 100 ? 'text-green-400' : 'text-red-400'} mb-2">
                        ${results.gameComparison.efficiency.toFixed(0)}%
                    </div>
                    <div class="text-sm text-light">vs Game Average</div>
                </div>
            </div>
            ${results.quitAnalysis.factors.length > 0 ? `
                <div class="text-sm text-light">
                    <div class="mb-2">Factors considered:</div>
                    <ul class="list-disc list-inside space-y-1">
                        ${results.quitAnalysis.factors.map(factor => `<li>${factor}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>

        ${results.recommendations.length > 0 ? `
        <div class="bg-broder p-6 rounded-lg border border-accent">
            <h4 class="text-xl font-bold text-accent mb-4">Personalized Recommendations</h4>
            <div class="space-y-4">
                ${results.recommendations.map(rec => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex items-start gap-3">
                            <span class="material-icons text-${rec.type === 'warning' ? 'red' : rec.type === 'positive' ? 'green' : 'yellow'}-400 mt-1">
                                ${rec.type === 'warning' ? 'warning' : rec.type === 'positive' ? 'check_circle' : 'lightbulb'}
                            </span>
                            <div>
                                <h5 class="font-semibold text-accent mb-1">${sanitizeText(rec.title)}</h5>
                                <p class="text-sm text-light">${sanitizeText(rec.message)}</p>
                            </div>
                        </div>
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
