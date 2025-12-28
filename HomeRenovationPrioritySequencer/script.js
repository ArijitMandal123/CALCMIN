// Home Renovation Priority Sequencer Logic

let projects = [];
let projectIdCounter = 0;

// Project type data with default ROI and characteristics
const projectTypeData = {
    'kitchen': { defaultROI: 85, urgencyMultiplier: 1.2, comfortMultiplier: 1.5 },
    'bathroom': { defaultROI: 70, urgencyMultiplier: 1.1, comfortMultiplier: 1.3 },
    'flooring': { defaultROI: 75, urgencyMultiplier: 0.8, comfortMultiplier: 1.2 },
    'roofing': { defaultROI: 60, urgencyMultiplier: 2.0, comfortMultiplier: 0.8 },
    'hvac': { defaultROI: 65, urgencyMultiplier: 1.8, comfortMultiplier: 1.4 },
    'windows': { defaultROI: 65, urgencyMultiplier: 1.3, comfortMultiplier: 1.1 },
    'painting': { defaultROI: 50, urgencyMultiplier: 0.5, comfortMultiplier: 0.9 },
    'electrical': { defaultROI: 55, urgencyMultiplier: 1.7, comfortMultiplier: 0.7 },
    'plumbing': { defaultROI: 60, urgencyMultiplier: 1.6, comfortMultiplier: 0.8 },
    'insulation': { defaultROI: 70, urgencyMultiplier: 1.4, comfortMultiplier: 1.0 },
    'landscaping': { defaultROI: 40, urgencyMultiplier: 0.3, comfortMultiplier: 0.6 },
    'deck-patio': { defaultROI: 55, urgencyMultiplier: 0.4, comfortMultiplier: 0.8 },
    'basement': { defaultROI: 65, urgencyMultiplier: 0.6, comfortMultiplier: 1.1 },
    'attic': { defaultROI: 60, urgencyMultiplier: 0.5, comfortMultiplier: 0.9 },
    'other': { defaultROI: 50, urgencyMultiplier: 1.0, comfortMultiplier: 1.0 }
};

// Dependency relationships
const dependencyMap = {
    'electrical': ['hvac', 'kitchen', 'bathroom', 'basement', 'attic'],
    'plumbing': ['kitchen', 'bathroom', 'hvac'],
    'structural': ['flooring', 'kitchen', 'bathroom', 'windows'],
    'roofing': ['insulation', 'electrical', 'hvac'],
    'hvac': ['insulation', 'flooring']
};

// Form elements
const projectForm = document.getElementById('project-form');
const projectsList = document.getElementById('projects-list');
const projectsContainer = document.getElementById('projects-container');
const calculateBtn = document.getElementById('calculate-sequence');
const resultsDiv = document.getElementById('results');

// Range input updates
document.getElementById('project-urgency').addEventListener('input', function() {
    document.getElementById('urgency-value').textContent = this.value;
});

document.getElementById('comfort-impact').addEventListener('input', function() {
    document.getElementById('comfort-value').textContent = this.value;
});

// Form submission
projectForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addProject();
});

// Calculate sequence button
calculateBtn.addEventListener('click', function() {
    if (projects.length > 0) {
        const sequence = calculateOptimalSequence();
        displayResults(sequence);
    }
});

// Add project function
function addProject() {
    const projectData = {
        id: ++projectIdCounter,
        name: document.getElementById('project-name').value,
        type: document.getElementById('project-type').value,
        budget: parseFloat(document.getElementById('project-budget').value),
        urgency: parseInt(document.getElementById('project-urgency').value),
        comfortImpact: parseInt(document.getElementById('comfort-impact').value),
        roi: parseFloat(document.getElementById('project-roi').value),
        dependencies: document.getElementById('project-dependencies').value
    };

    if (validateProject(projectData)) {
        projects.push(projectData);
        updateProjectsList();
        projectForm.reset();
        document.getElementById('urgency-value').textContent = '5';
        document.getElementById('comfort-value').textContent = '5';
    }
}

// Validate project data
function validateProject(project) {
    if (!project.name || !project.type || !project.budget || !project.roi) {
        showPopup('Please fill in all required fields.');
        return false;
    }
    
    if (project.budget < 100 || project.budget > 500000) {
        showPopup('Please enter a realistic budget between $100 and $500,000.');
        return false;
    }
    
    if (project.roi < 0 || project.roi > 200) {
        showPopup('Please enter a realistic ROI between 0% and 200%.');
        return false;
    }
    
    return true;
}

// Show popup modal
function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.innerHTML = `
        <div class="bg-broder p-6 rounded-lg border border-accent max-w-md mx-4">
            <p class="text-light mb-4">${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="bg-primary hover:bg-accent text-white px-4 py-2 rounded">
                OK
            </button>
        </div>
    `;
    document.body.appendChild(popup);
}

// Update projects list display
function updateProjectsList() {
    if (projects.length === 0) {
        projectsList.classList.add('hidden');
        return;
    }
    
    projectsList.classList.remove('hidden');
    projectsContainer.innerHTML = projects.map(project => `
        <div class="bg-dark p-4 rounded border border-accent mb-3">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-semibold text-primary">${project.name}</h4>
                    <p class="text-sm text-light">Type: ${project.type} | Budget: $${project.budget.toLocaleString()} | ROI: ${project.roi}%</p>
                    <p class="text-xs text-light">Urgency: ${project.urgency}/10 | Comfort Impact: ${project.comfortImpact}/10</p>
                    ${project.dependencies ? `<p class="text-xs text-accent">Depends on: ${project.dependencies}</p>` : ''}
                </div>
                <button onclick="removeProject(${project.id})" class="text-red-400 hover:text-red-300 ml-4">
                    <span class="material-icons text-sm">delete</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Remove project
function removeProject(id) {
    projects = projects.filter(p => p.id !== id);
    updateProjectsList();
}

// Calculate optimal sequence
function calculateOptimalSequence() {
    // Calculate priority scores for each project
    const scoredProjects = projects.map(project => {
        const typeData = projectTypeData[project.type] || projectTypeData['other'];
        
        // Priority score calculation (weighted)
        const roiScore = (project.roi / 100) * 30; // 30% weight
        const urgencyScore = (project.urgency / 10) * 25; // 25% weight
        const comfortScore = (project.comfortImpact / 10) * 20; // 20% weight
        const budgetScore = (1 - Math.min(project.budget / 100000, 1)) * 15; // 15% weight (lower cost = higher score)
        const typeScore = (typeData.urgencyMultiplier + typeData.comfortMultiplier) * 5; // 10% weight
        
        const priorityScore = roiScore + urgencyScore + comfortScore + budgetScore + typeScore;
        
        return {
            ...project,
            priorityScore: priorityScore,
            roiValue: (project.budget * project.roi / 100)
        };
    });

    // Sort by dependencies first, then by priority score
    const sequencedProjects = resolveDependencies(scoredProjects);
    
    // Create timeline and budget analysis
    const timeline = createTimeline(sequencedProjects);
    const budgetAnalysis = createBudgetAnalysis(sequencedProjects);
    
    return {
        projects: sequencedProjects,
        timeline: timeline,
        budgetAnalysis: budgetAnalysis,
        totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
        totalROIValue: scoredProjects.reduce((sum, p) => sum + p.roiValue, 0)
    };
}

// Resolve project dependencies
function resolveDependencies(projects) {
    const resolved = [];
    const remaining = [...projects];
    
    while (remaining.length > 0) {
        let foundIndependent = false;
        
        for (let i = 0; i < remaining.length; i++) {
            const project = remaining[i];
            const canStart = !project.dependencies || 
                            resolved.some(r => r.type === project.dependencies);
            
            if (canStart) {
                resolved.push(project);
                remaining.splice(i, 1);
                foundIndependent = true;
                break;
            }
        }
        
        // If no independent project found, add highest priority remaining
        if (!foundIndependent && remaining.length > 0) {
            remaining.sort((a, b) => b.priorityScore - a.priorityScore);
            resolved.push(remaining.shift());
        }
    }
    
    return resolved;
}

// Create timeline
function createTimeline(projects) {
    const timeline = [];
    let currentYear = new Date().getFullYear();
    let currentBudget = 0;
    const annualBudgetLimit = 50000; // Assume $50k annual renovation budget
    
    projects.forEach((project, index) => {
        if (currentBudget + project.budget > annualBudgetLimit && index > 0) {
            currentYear++;
            currentBudget = 0;
        }
        
        timeline.push({
            year: currentYear,
            quarter: Math.floor((currentBudget / annualBudgetLimit) * 4) + 1,
            project: project
        });
        
        currentBudget += project.budget;
    });
    
    return timeline;
}

// Create budget analysis
function createBudgetAnalysis(projects) {
    const yearlyBudgets = {};
    
    projects.forEach(project => {
        const timelineItem = createTimeline(projects).find(t => t.project.id === project.id);
        const year = timelineItem.year;
        
        if (!yearlyBudgets[year]) {
            yearlyBudgets[year] = {
                totalCost: 0,
                totalROIValue: 0,
                projects: []
            };
        }
        
        yearlyBudgets[year].totalCost += project.budget;
        yearlyBudgets[year].totalROIValue += project.roiValue;
        yearlyBudgets[year].projects.push(project);
    });
    
    return yearlyBudgets;
}

// Display results
function displayResults(sequence) {
    const contentDiv = document.getElementById('result-content');
    
    contentDiv.innerHTML = `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">Optimal Renovation Sequence</h3>
            
            <!-- Summary Stats -->
            <div class="grid md:grid-cols-3 gap-6 mb-6">
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-primary">$${sequence.totalBudget.toLocaleString()}</div>
                    <div class="text-sm text-light">Total Investment</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-green-400">$${Math.round(sequence.totalROIValue).toLocaleString()}</div>
                    <div class="text-sm text-light">Expected Return Value</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-accent">${sequence.projects.length}</div>
                    <div class="text-sm text-light">Total Projects</div>
                </div>
            </div>
            
            <!-- Priority Sequence -->
            <div class="mb-6">
                <h4 class="text-xl font-bold text-accent mb-4">Recommended Project Order</h4>
                <div class="space-y-3">
                    ${sequence.projects.map((project, index) => `
                        <div class="bg-dark p-4 rounded border border-accent">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                                        ${index + 1}
                                    </div>
                                    <div>
                                        <h5 class="font-semibold text-primary">${project.name}</h5>
                                        <p class="text-sm text-light">Priority Score: ${project.priorityScore.toFixed(1)}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-bold text-accent">$${project.budget.toLocaleString()}</div>
                                    <div class="text-sm text-green-400">${project.roi}% ROI</div>
                                </div>
                            </div>
                            ${project.dependencies ? `
                                <div class="mt-2 text-xs text-yellow-400">
                                    ⚠ Requires ${project.dependencies} work first
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Timeline -->
            <div class="mb-6">
                <h4 class="text-xl font-bold text-accent mb-4">Year-by-Year Timeline</h4>
                <div class="space-y-4">
                    ${Object.entries(sequence.budgetAnalysis).map(([year, data]) => `
                        <div class="bg-dark p-4 rounded border border-accent">
                            <div class="flex justify-between items-center mb-3">
                                <h5 class="font-semibold text-primary">Year ${year}</h5>
                                <div class="text-right">
                                    <div class="text-lg font-bold text-accent">$${data.totalCost.toLocaleString()}</div>
                                    <div class="text-sm text-green-400">+$${Math.round(data.totalROIValue).toLocaleString()} value</div>
                                </div>
                            </div>
                            <div class="grid md:grid-cols-2 gap-4">
                                ${data.projects.map(project => `
                                    <div class="text-sm text-light">
                                        • ${project.name} - $${project.budget.toLocaleString()}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Recommendations -->
            <div class="bg-primary/10 border-l-4 border-primary p-6">
                <h4 class="font-semibold text-primary mb-2">Key Recommendations</h4>
                <ul class="text-sm text-light space-y-1">
                    <li>• Start with highest urgency projects (roofing, HVAC, electrical)</li>
                    <li>• Complete infrastructure work before cosmetic improvements</li>
                    <li>• Budget 20% extra for unexpected costs and delays</li>
                    <li>• Consider seasonal timing for exterior projects</li>
                    <li>• Plan temporary living arrangements for major kitchen/bathroom work</li>
                </ul>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Load footer component
fetch('../src/components/Footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    })
    .catch(error => console.log('Footer loading failed:', error));