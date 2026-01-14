// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

    const form = document.getElementById('streaming-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        const results = analyzeStreamingSetup(formData);
        displayResults(results);
    });
});

function collectFormData() {
    const equipment = Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(cb => cb.value);
    
    return {
        platform: document.getElementById('platform').value,
        contentType: document.getElementById('contentType').value,
        viewerGoal: document.getElementById('viewerGoal').value,
        budget: parseInt(document.getElementById('budget').value),
        cpu: document.getElementById('cpu').value,
        gpu: document.getElementById('gpu').value,
        ram: document.getElementById('ram').value,
        uploadSpeed: parseInt(document.getElementById('uploadSpeed').value),
        camera: document.getElementById('camera').value,
        microphone: document.getElementById('microphone').value,
        equipment: equipment
    };
}

function analyzeStreamingSetup(data) {
    // Equipment scoring system (0-100 for each component)
    const scores = {
        cpu: getCPUScore(data.cpu, data.contentType),
        gpu: getGPUScore(data.gpu, data.contentType),
        ram: getRAMScore(data.ram),
        internet: getInternetScore(data.uploadSpeed, data.platform),
        camera: getCameraScore(data.camera, data.viewerGoal),
        microphone: getMicrophoneScore(data.microphone),
        accessories: getAccessoryScore(data.equipment)
    };

    // Calculate overall setup score
    const overallScore = Math.round(
        (scores.cpu * 0.25) + 
        (scores.gpu * 0.20) + 
        (scores.ram * 0.10) + 
        (scores.internet * 0.15) + 
        (scores.camera * 0.15) + 
        (scores.microphone * 0.10) + 
        (scores.accessories * 0.05)
    );

    // Identify bottlenecks
    const bottlenecks = identifyBottlenecks(scores, data);
    
    // Generate upgrade recommendations
    const recommendations = generateRecommendations(scores, data, bottlenecks);
    
    // Calculate performance expectations
    const performance = calculatePerformance(scores, data);
    
    // Generate upgrade timeline
    const upgradeTimeline = generateUpgradeTimeline(recommendations, data.budget);

    return {
        scores: scores,
        overallScore: overallScore,
        bottlenecks: bottlenecks,
        recommendations: recommendations,
        performance: performance,
        upgradeTimeline: upgradeTimeline,
        setupRating: getSetupRating(overallScore)
    };
}

function getCPUScore(cpu, contentType) {
    const cpuScores = {
        'budget': 40,
        'mid-range': 70,
        'high-end': 90,
        'enthusiast': 100
    };
    
    let score = cpuScores[cpu] || 0;
    
    // Adjust for content type
    if (contentType === 'gaming') score *= 1.1;
    if (contentType === 'creative') score *= 1.2;
    
    return Math.min(100, score);
}

function getGPUScore(gpu, contentType) {
    const gpuScores = {
        'integrated': 20,
        'budget': 50,
        'mid-range': 75,
        'high-end': 90,
        'enthusiast': 100
    };
    
    let score = gpuScores[gpu] || 0;
    
    // Gaming content needs better GPU
    if (contentType === 'gaming') score *= 1.2;
    
    return Math.min(100, score);
}

function getRAMScore(ram) {
    const ramScores = {
        '8gb': 50,
        '16gb': 80,
        '32gb': 95,
        '64gb': 100
    };
    
    return ramScores[ram] || 0;
}

function getInternetScore(uploadSpeed, platform) {
    const requirements = {
        'twitch': 6,
        'youtube': 9,
        'facebook': 4,
        'tiktok': 2,
        'kick': 6,
        'multiple': 10
    };
    
    const required = requirements[platform] || 6;
    
    if (uploadSpeed >= required * 2) return 100;
    if (uploadSpeed >= required * 1.5) return 85;
    if (uploadSpeed >= required) return 70;
    if (uploadSpeed >= required * 0.8) return 50;
    return 25;
}

function getCameraScore(camera, viewerGoal) {
    const cameraScores = {
        'none': 0,
        'webcam-basic': 40,
        'webcam-good': 70,
        'dslr': 90,
        'professional': 100
    };
    
    let score = cameraScores[camera] || 0;
    
    // Higher viewer goals need better cameras
    const goalMultipliers = {
        'hobby': 1.0,
        'growing': 1.1,
        'established': 1.2,
        'partner': 1.3
    };
    
    score *= goalMultipliers[viewerGoal] || 1.0;
    
    return Math.min(100, score);
}

function getMicrophoneScore(microphone) {
    const micScores = {
        'headset': 30,
        'usb-basic': 50,
        'usb-good': 75,
        'xlr': 90,
        'professional': 100
    };
    
    return micScores[microphone] || 0;
}

function getAccessoryScore(equipment) {
    const accessoryValues = {
        'lighting': 25,
        'greenscreen': 15,
        'capturecard': 20,
        'streamdeck': 10
    };
    
    let score = 0;
    equipment.forEach(item => {
        score += accessoryValues[item] || 0;
    });
    
    return Math.min(100, score);
}

function identifyBottlenecks(scores, data) {
    const bottlenecks = [];
    const threshold = 60;
    
    if (scores.cpu < threshold) {
        bottlenecks.push({
            component: 'CPU',
            score: scores.cpu,
            impact: 'High',
            description: 'CPU may struggle with encoding, causing dropped frames'
        });
    }
    
    if (scores.gpu < threshold && data.contentType === 'gaming') {
        bottlenecks.push({
            component: 'GPU',
            score: scores.gpu,
            impact: 'High',
            description: 'GPU insufficient for gaming while streaming'
        });
    }
    
    if (scores.internet < threshold) {
        bottlenecks.push({
            component: 'Internet',
            score: scores.internet,
            impact: 'Critical',
            description: 'Upload speed too low for stable streaming'
        });
    }
    
    if (scores.microphone < threshold) {
        bottlenecks.push({
            component: 'Microphone',
            score: scores.microphone,
            impact: 'High',
            description: 'Poor audio quality will hurt viewer retention'
        });
    }
    
    if (scores.camera < 50 && data.viewerGoal !== 'hobby') {
        bottlenecks.push({
            component: 'Camera',
            score: scores.camera,
            impact: 'Medium',
            description: 'Video quality below expectations for target audience'
        });
    }
    
    return bottlenecks;
}

function generateRecommendations(scores, data, bottlenecks) {
    const recommendations = [];
    
    // Sort bottlenecks by priority
    const priorityOrder = ['Internet', 'Microphone', 'CPU', 'GPU', 'Camera'];
    bottlenecks.sort((a, b) => {
        return priorityOrder.indexOf(a.component) - priorityOrder.indexOf(b.component);
    });
    
    bottlenecks.forEach(bottleneck => {
        let recommendation = getUpgradeRecommendation(bottleneck.component, data);
        if (recommendation) {
            recommendations.push(recommendation);
        }
    });
    
    // Add general improvements if no major bottlenecks
    if (bottlenecks.length === 0) {
        recommendations.push({
            component: 'General',
            priority: 'Low',
            cost: '$50-200',
            suggestion: 'Consider lighting upgrades or Stream Deck for workflow improvement',
            impact: 'Quality of life improvements'
        });
    }
    
    return recommendations;
}

function getUpgradeRecommendation(component, data) {
    const recommendations = {
        'CPU': {
            component: 'CPU',
            priority: 'High',
            cost: '$200-500',
            suggestion: 'Upgrade to i5/Ryzen 5 or better for stable encoding',
            impact: 'Eliminates dropped frames and encoding lag'
        },
        'GPU': {
            component: 'GPU',
            priority: 'High',
            cost: '$300-700',
            suggestion: 'Upgrade to RTX 3060/RX 6600 or better for gaming streams',
            impact: 'Better game performance while streaming'
        },
        'Internet': {
            component: 'Internet',
            priority: 'Critical',
            cost: '$20-50/month',
            suggestion: 'Upgrade internet plan or switch to wired connection',
            impact: 'Prevents stream buffering and disconnections'
        },
        'Microphone': {
            component: 'Microphone',
            priority: 'High',
            cost: '$50-200',
            suggestion: 'Upgrade to USB microphone (Blue Yeti) or XLR setup',
            impact: 'Dramatically improves audio quality and viewer retention'
        },
        'Camera': {
            component: 'Camera',
            priority: 'Medium',
            cost: '$100-300',
            suggestion: 'Upgrade to 1080p webcam or DSLR with capture card',
            impact: 'Better video quality and professional appearance'
        }
    };
    
    return recommendations[component];
}

function calculatePerformance(scores, data) {
    const overallScore = Math.round(
        (scores.cpu * 0.25) + (scores.gpu * 0.20) + (scores.ram * 0.10) + 
        (scores.internet * 0.15) + (scores.camera * 0.15) + 
        (scores.microphone * 0.10) + (scores.accessories * 0.05)
    );
    
    let streamQuality, reliability, viewerExperience;
    
    if (overallScore >= 85) {
        streamQuality = "Excellent (1080p60)";
        reliability = "Very High";
        viewerExperience = "Professional quality";
    } else if (overallScore >= 70) {
        streamQuality = "Good (1080p30-60)";
        reliability = "High";
        viewerExperience = "Good quality with minor issues";
    } else if (overallScore >= 55) {
        streamQuality = "Fair (720p-1080p30)";
        reliability = "Moderate";
        viewerExperience = "Acceptable but noticeable limitations";
    } else {
        streamQuality = "Poor (720p30 or lower)";
        reliability = "Low";
        viewerExperience = "Significant quality issues";
    }
    
    return {
        streamQuality,
        reliability,
        viewerExperience,
        overallScore
    };
}

function generateUpgradeTimeline(recommendations, budget) {
    const timeline = [];
    let remainingBudget = budget;
    
    // Sort recommendations by priority
    const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    recommendations.forEach((rec, index) => {
        const estimatedCost = getEstimatedCost(rec.cost);
        
        if (remainingBudget >= estimatedCost) {
            timeline.push({
                phase: `Phase ${index + 1}`,
                component: rec.component,
                cost: rec.cost,
                suggestion: rec.suggestion,
                timeframe: index === 0 ? 'Immediate' : `Month ${index + 1}`
            });
            remainingBudget -= estimatedCost;
        } else {
            timeline.push({
                phase: `Future Upgrade`,
                component: rec.component,
                cost: rec.cost,
                suggestion: rec.suggestion,
                timeframe: 'When budget allows'
            });
        }
    });
    
    return timeline;
}

function getEstimatedCost(costRange) {
    // Extract average cost from range like "$200-500"
    const matches = costRange.match(/\$(\d+)-(\d+)/);
    if (matches) {
        return (parseInt(matches[1]) + parseInt(matches[2])) / 2;
    }
    return 100; // Default fallback
}

function getSetupRating(score) {
    if (score >= 85) return { level: "Professional", color: "text-green-400" };
    if (score >= 70) return { level: "Good", color: "text-blue-400" };
    if (score >= 55) return { level: "Adequate", color: "text-yellow-400" };
    if (score >= 40) return { level: "Needs Improvement", color: "text-orange-400" };
    return { level: "Poor", color: "text-red-400" };
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');

    const html = `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h3 class="text-2xl font-bold text-primary mb-2">Streaming Setup Analysis</h3>
            <p class="text-light">Overall Score: <span class="${sanitizeText(results.setupRating.color)} font-semibold">${sanitizeText(results.overallScore)}/100 (${sanitizeText(results.setupRating.level)})</span></p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="bg-broder p-6 rounded-lg border border-accent text-center">
                <div class="text-3xl font-bold text-primary mb-2">${sanitizeText(results.overallScore)}</div>
                <div class="text-sm text-light mb-1">Setup Score</div>
                <div class="text-xs ${sanitizeText(results.setupRating.color)}">${sanitizeText(results.setupRating.level)}</div>
            </div>
            <div class="bg-broder p-6 rounded-lg border border-accent text-center">
                <div class="text-2xl font-bold text-accent mb-2">${sanitizeText(results.performance.streamQuality)}</div>
                <div class="text-sm text-light">Expected Quality</div>
            </div>
            <div class="bg-broder p-6 rounded-lg border border-accent text-center">
                <div class="text-2xl font-bold text-yellow-400 mb-2">${sanitizeText(results.performance.reliability)}</div>
                <div class="text-sm text-light">Reliability</div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Component Scores</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-light">CPU</span>
                        <div class="flex items-center gap-2">
                            <div class="w-20 bg-dark rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: ${sanitizeText(results.scores.cpu)}%"></div>
                            </div>
                            <span class="text-primary font-semibold w-8">${sanitizeText(results.scores.cpu)}</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">GPU</span>
                        <div class="flex items-center gap-2">
                            <div class="w-20 bg-dark rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: ${sanitizeText(results.scores.gpu)}%"></div>
                            </div>
                            <span class="text-primary font-semibold w-8">${sanitizeText(results.scores.gpu)}</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">RAM</span>
                        <div class="flex items-center gap-2">
                            <div class="w-20 bg-dark rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: ${sanitizeText(results.scores.ram)}%"></div>
                            </div>
                            <span class="text-primary font-semibold w-8">${sanitizeText(results.scores.ram)}</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Internet</span>
                        <div class="flex items-center gap-2">
                            <div class="w-20 bg-dark rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: ${sanitizeText(results.scores.internet)}%"></div>
                            </div>
                            <span class="text-primary font-semibold w-8">${sanitizeText(results.scores.internet)}</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Camera</span>
                        <div class="flex items-center gap-2">
                            <div class="w-20 bg-dark rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: ${sanitizeText(results.scores.camera)}%"></div>
                            </div>
                            <span class="text-primary font-semibold w-8">${sanitizeText(results.scores.camera)}</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-light">Microphone</span>
                        <div class="flex items-center gap-2">
                            <div class="w-20 bg-dark rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: ${sanitizeText(results.scores.microphone)}%"></div>
                            </div>
                            <span class="text-primary font-semibold w-8">${sanitizeText(results.scores.microphone)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h4 class="text-xl font-bold text-accent mb-4">Performance Expectations</h4>
                <div class="space-y-3">
                    <div>
                        <span class="text-light block text-sm">Stream Quality:</span>
                        <span class="text-primary font-semibold">${sanitizeText(results.performance.streamQuality)}</span>
                    </div>
                    <div>
                        <span class="text-light block text-sm">Reliability:</span>
                        <span class="text-primary font-semibold">${sanitizeText(results.performance.reliability)}</span>
                    </div>
                    <div>
                        <span class="text-light block text-sm">Viewer Experience:</span>
                        <span class="text-primary font-semibold">${sanitizeText(results.performance.viewerExperience)}</span>
                    </div>
                </div>
            </div>
        </div>

        ${results.bottlenecks.length > 0 ? `
        <div class="bg-broder p-6 rounded-lg border border-accent mb-6">
            <h4 class="text-xl font-bold text-accent mb-4">Identified Bottlenecks</h4>
            <div class="space-y-4">
                ${results.bottlenecks.map(bottleneck => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-primary font-semibold">${bottleneck.component}</span>
                            <span class="text-xs px-2 py-1 rounded ${bottleneck.impact === 'Critical' ? 'bg-red-900 text-red-300' : bottleneck.impact === 'High' ? 'bg-orange-900 text-orange-300' : 'bg-yellow-900 text-yellow-300'}">${sanitizeText(bottleneck.impact)} Impact</span>
                        </div>
                        <div class="text-sm text-light">${sanitizeText(bottleneck.description)}</div>
                        <div class="text-xs text-accent mt-1">Score: ${sanitizeText(bottleneck.score)}/100</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${results.recommendations.length > 0 ? `
        <div class="bg-broder p-6 rounded-lg border border-accent mb-6">
            <h4 class="text-xl font-bold text-accent mb-4">Upgrade Recommendations</h4>
            <div class="space-y-4">
                ${results.recommendations.map(rec => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-primary font-semibold">${rec.component}</span>
                            <div class="text-right">
                                <div class="text-xs px-2 py-1 rounded ${rec.priority === 'Critical' ? 'bg-red-900 text-red-300' : rec.priority === 'High' ? 'bg-orange-900 text-orange-300' : 'bg-yellow-900 text-yellow-300'}">${sanitizeText(rec.priority)} Priority</div>
                                <div class="text-xs text-accent mt-1">${sanitizeText(rec.cost)}</div>
                            </div>
                        </div>
                        <div class="text-sm text-light mb-2">${sanitizeText(rec.suggestion)}</div>
                        <div class="text-xs text-accent">${sanitizeText(rec.impact)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${results.upgradeTimeline.length > 0 ? `
        <div class="bg-broder p-6 rounded-lg border border-accent">
            <h4 class="text-xl font-bold text-accent mb-4">Upgrade Timeline</h4>
            <div class="space-y-4">
                ${results.upgradeTimeline.map(phase => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-primary font-semibold">${phase.phase}: ${sanitizeText(phase.component)}</span>
                            <span class="text-accent text-sm">${sanitizeText(phase.timeframe)}</span>
                        </div>
                        <div class="text-sm text-light mb-1">${sanitizeText(phase.suggestion)}</div>
                        <div class="text-xs text-accent">Estimated cost: ${sanitizeText(phase.cost)}</div>
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
