// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function sanitizeAttribute(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    return input.replace(/[<>"'&]/g, (match) => {
        const entities = {'<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;'};
        return entities[match];
    });
}

function validateNumber(input, min = -Infinity, max = Infinity) {
    const num = parseFloat(input);
    if (isNaN(num)) return null;
    if (num < min || num > max) return null;
    return num;
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('bid-form');
  const resultsDiv = document.getElementById('results');
  const resultContent = document.getElementById('result-content');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // CSRF Protection
    if (typeof window.Security !== 'undefined') {
      const formData = new FormData(this);
      if (!window.Security.validateCSRF(formData)) {
        alert('Security token invalid. Please refresh the page.');
        return;
      }
    }
    
    optimizeBid();
  });

  function optimizeBid() {
    const formData = {
      platform: document.getElementById('platform').value,
      projectCategory: document.getElementById('projectCategory').value,
      projectBudget: parseFloat(document.getElementById('projectBudget').value) || 0,
      estimatedHours: parseFloat(document.getElementById('estimatedHours').value) || 0,
      competitionLevel: document.getElementById('competitionLevel').value,
      experienceLevel: document.getElementById('experienceLevel').value,
      platformRating: document.getElementById('platformRating').value,
      completedProjects: document.getElementById('completedProjects').value,
      desiredHourlyRate: parseFloat(document.getElementById('desiredHourlyRate').value) || 0,
      projectComplexity: document.getElementById('projectComplexity').value,
      clientHistory: document.getElementById('clientHistory').value,
      urgency: document.getElementById('urgency').value
    };

    const optimization = calculateOptimization(formData);
    displayResults(optimization, formData);
  }

  function calculateOptimization(data) {
    // Base rates by category
    const categoryRates = {
      'web-development': { min: 15, avg: 35, max: 80 },
      'mobile-development': { min: 20, avg: 45, max: 100 },
      'graphic-design': { min: 10, avg: 25, max: 60 },
      'content-writing': { min: 8, avg: 20, max: 50 },
      'digital-marketing': { min: 12, avg: 30, max: 75 },
      'data-entry': { min: 5, avg: 12, max: 25 },
      'translation': { min: 10, avg: 22, max: 45 },
      'video-editing': { min: 15, avg: 35, max: 70 },
      'virtual-assistant': { min: 8, avg: 18, max: 35 },
      'consulting': { min: 25, avg: 60, max: 150 }
    };

    const baseRates = categoryRates[data.projectCategory] || { min: 10, avg: 25, max: 60 };
    
    // Experience multipliers
    const expMultipliers = {
      'beginner': 0.7,
      'intermediate': 1.0,
      'advanced': 1.4,
      'expert': 1.8
    };

    // Rating multipliers
    const ratingMultipliers = {
      'new': 0.6,
      '4.0-4.5': 0.8,
      '4.5-4.8': 1.0,
      '4.8-5.0': 1.2
    };

    // Competition adjustments
    const competitionAdjustments = {
      'low': 1.1,
      'medium': 1.0,
      'high': 0.9,
      'very-high': 0.8
    };

    // Calculate optimal rate
    let optimalRate = baseRates.avg;
    optimalRate *= expMultipliers[data.experienceLevel] || 1.0;
    optimalRate *= ratingMultipliers[data.platformRating] || 0.8;
    optimalRate *= competitionAdjustments[data.competitionLevel] || 1.0;

    // Complexity adjustments
    const complexityMultipliers = {
      'simple': 0.9,
      'moderate': 1.0,
      'complex': 1.2,
      'very-complex': 1.4
    };
    optimalRate *= complexityMultipliers[data.projectComplexity] || 1.0;

    // Urgency adjustments
    const urgencyMultipliers = {
      'flexible': 0.95,
      'normal': 1.0,
      'urgent': 1.15,
      'rush': 1.3
    };
    optimalRate *= urgencyMultipliers[data.urgency] || 1.0;

    // Calculate bid strategy
    const clientBudgetPerHour = data.projectBudget / data.estimatedHours;
    const totalProjectCost = optimalRate * data.estimatedHours;
    
    // Win probability calculation
    let winProbability = 50; // Base 50%
    
    if (data.platformRating === 'new') winProbability -= 20;
    else if (data.platformRating === '4.8-5.0') winProbability += 15;
    
    if (data.competitionLevel === 'low') winProbability += 20;
    else if (data.competitionLevel === 'very-high') winProbability -= 25;
    
    if (totalProjectCost <= data.projectBudget * 0.8) winProbability += 15;
    else if (totalProjectCost > data.projectBudget * 1.2) winProbability -= 20;

    // Proposal strategy
    const strategy = generateStrategy(data, optimalRate, winProbability);

    return {
      optimalRate: Math.round(optimalRate),
      totalProjectCost: Math.round(totalProjectCost),
      winProbability: Math.max(5, Math.min(95, winProbability)),
      clientBudgetPerHour: Math.round(clientBudgetPerHour),
      strategy,
      priceRange: {
        conservative: Math.round(optimalRate * 0.85),
        optimal: Math.round(optimalRate),
        aggressive: Math.round(optimalRate * 1.15)
      }
    };
  }

  function generateStrategy(data, optimalRate, winProbability) {
    const strategies = [];
    
    // Pricing strategy
    if (winProbability < 30) {
      strategies.push({
        type: 'pricing',
        title: 'Consider Lower Pricing',
        description: 'Your current positioning may be too high for this competition level',
        priority: 'high'
      });
    }
    
    // Profile optimization
    if (data.platformRating === 'new') {
      strategies.push({
        type: 'profile',
        title: 'Build Profile Credibility',
        description: 'Focus on smaller projects first to build ratings and portfolio',
        priority: 'high'
      });
    }
    
    // Proposal tactics
    if (data.competitionLevel === 'very-high') {
      strategies.push({
        type: 'proposal',
        title: 'Stand Out Strategy',
        description: 'Include portfolio samples, detailed timeline, and unique value proposition',
        priority: 'medium'
      });
    }
    
    // Timeline advantage
    if (data.urgency === 'urgent' || data.urgency === 'rush') {
      strategies.push({
        type: 'timing',
        title: 'Leverage Quick Turnaround',
        description: 'Emphasize your availability and fast delivery capability',
        priority: 'medium'
      });
    }
    
    // Client type strategy
    if (data.clientHistory === 'enterprise') {
      strategies.push({
        type: 'client',
        title: 'Professional Approach',
        description: 'Use formal language, detailed project breakdown, and emphasize reliability',
        priority: 'medium'
      });
    }
    
    return strategies;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function displayResults(optimization, formData) {
    const winColor = optimization.winProbability >= 60 ? 'text-green-400' : 
                     optimization.winProbability >= 40 ? 'text-yellow-400' : 'text-red-400';

    resultContent.innerHTML = `
      <div class="bg-broder p-6 rounded-lg border border-accent">
        <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
          <span class="material-icons text-primary">trending_up</span> 
          Bid Optimization Results
        </h3>
        
        <div class="grid md:grid-cols-3 gap-4 mb-6">
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold text-primary">$${sanitizeText(optimization.optimalRate)}</div>
            <div class="text-sm text-light">Optimal Hourly Rate</div>
          </div>
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold text-accent">$${sanitizeText(optimization.totalProjectCost.toLocaleString())}</div>
            <div class="text-sm text-light">Total Project Cost</div>
          </div>
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold ${sanitizeText(winColor)}">${sanitizeText(optimization.winProbability)}%</div>
            <div class="text-sm text-light">Win Probability</div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Pricing Strategy</h4>
          <div class="grid md:grid-cols-3 gap-3">
            <div class="p-3 bg-dark rounded border border-accent">
              <div class="font-medium text-green-400">Conservative</div>
              <div class="text-xl font-bold text-text">$${sanitizeText(optimization.priceRange.conservative)}</div>
              <div class="text-xs text-light">Higher win rate</div>
            </div>
            <div class="p-3 bg-dark rounded border border-primary">
              <div class="font-medium text-primary">Optimal</div>
              <div class="text-xl font-bold text-text">$${sanitizeText(optimization.priceRange.optimal)}</div>
              <div class="text-xs text-light">Recommended</div>
            </div>
            <div class="p-3 bg-dark rounded border border-accent">
              <div class="font-medium text-orange-400">Aggressive</div>
              <div class="text-xl font-bold text-text">$${sanitizeText(optimization.priceRange.aggressive)}</div>
              <div class="text-xs text-light">Higher profit</div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Market Analysis</h4>
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-light">Client Budget/Hour:</span>
                <span class="text-text">$${sanitizeText(optimization.clientBudgetPerHour)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Your Rate vs Budget:</span>
                <span class="text-text ${optimization.optimalRate <= optimization.clientBudgetPerHour ? 'text-green-400' : 'text-orange-400'}">
                  ${optimization.optimalRate <= optimization.clientBudgetPerHour ? 'Within Budget' : 'Above Budget'}
                </span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-light">Competition Level:</span>
                <span class="text-text capitalize">${escapeHtml(formData.competitionLevel.replace('-', ' '))}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Project Complexity:</span>
                <span class="text-text capitalize">${formData.projectComplexity.replace('-', ' ')}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Strategy Recommendations</h4>
          <div class="space-y-3">
            ${optimization.strategy.map(item => `
              <div class="p-3 bg-dark rounded border border-accent">
                <div class="flex items-center gap-2 mb-2">
                  <span class="material-icons text-xs ${item.priority === 'high' ? 'text-red-400' : 'text-yellow-400'}">
                    ${item.priority === 'high' ? 'priority_high' : 'info'}
                  </span>
                  <span class="font-medium text-text">${sanitizeText(item.title)}</span>
                </div>
                <div class="text-sm text-light">${sanitizeText(item.description)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-dark p-4 rounded border border-accent">
          <h4 class="text-lg font-medium mb-3 text-text">Proposal Tips</h4>
          <ul class="space-y-2 text-sm text-light">
            <li class="flex items-start gap-2">
              <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
              Address the client's specific needs in the first paragraph
            </li>
            <li class="flex items-start gap-2">
              <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
              Include 2-3 relevant portfolio samples
            </li>
            <li class="flex items-start gap-2">
              <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
              Provide a clear timeline with milestones
            </li>
            <li class="flex items-start gap-2">
              <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
              Ask 1-2 clarifying questions to show engagement
            </li>
            <li class="flex items-start gap-2">
              <span class="material-icons text-xs text-accent mt-0.5">check_circle</span>
              Keep proposal length between 150-300 words
            </li>
          </ul>
        </div>
      </div>
    `;

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }
});