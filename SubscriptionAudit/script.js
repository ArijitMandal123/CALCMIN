// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

  const addSubscriptionBtn = document.getElementById('add-subscription');
  const subscriptionsList = document.getElementById('subscriptions-list');
  const analyzeBtn = document.getElementById('analyze-subscriptions');
  const resultsDiv = document.getElementById('results');
  const resultContent = document.getElementById('result-content');

  let subscriptions = [];
  let subscriptionCounter = 0;

  addSubscriptionBtn.addEventListener('click', addSubscriptionRow);
  analyzeBtn.addEventListener('click', analyzeSubscriptions);

  // Add initial subscription row
  addSubscriptionRow();

  function addSubscriptionRow() {
    subscriptionCounter++;
    const subscriptionRow = document.createElement('div');
    subscriptionRow.className = 'subscription-row bg-broder p-4 rounded border border-accent';
    subscriptionRow.innerHTML = `
      <div class="grid gap-3">
        <div class="grid md:grid-cols-4 gap-3">
          <div>
            <label class="block text-xs text-light mb-1">Service Name</label>
            <input type="text" class="sub-name w-full px-3 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Netflix">
          </div>
          <div>
            <label class="block text-xs text-light mb-1">Monthly Cost ($)</label>
            <input type="number" class="sub-cost w-full px-3 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="15.99" step="0.01" min="0">
          </div>
          <div>
            <label class="block text-xs text-light mb-1">Category</label>
            <select class="sub-category w-full px-3 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select Category</option>
              <option value="streaming">Streaming Video</option>
              <option value="music">Music Streaming</option>
              <option value="software">Software/Apps</option>
              <option value="fitness">Fitness/Health</option>
              <option value="news">News/Media</option>
              <option value="gaming">Gaming</option>
              <option value="cloud">Cloud Storage</option>
              <option value="productivity">Productivity</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-light mb-1">Usage Frequency</label>
            <select class="sub-usage w-full px-3 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select Usage</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="rarely">Rarely</option>
              <option value="never">Never Used</option>
            </select>
          </div>
        </div>
        <div class="grid md:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs text-light mb-1">Importance</label>
            <select class="sub-importance w-full px-3 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select Importance</option>
              <option value="essential">Essential</option>
              <option value="important">Important</option>
              <option value="nice-to-have">Nice to Have</option>
              <option value="unnecessary">Unnecessary</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-light mb-1">Seasonal Usage</label>
            <select class="sub-seasonal w-full px-3 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="year-round">Year-round</option>
              <option value="winter">Winter only</option>
              <option value="summer">Summer only</option>
              <option value="holiday">Holiday season</option>
              <option value="school">School year</option>
            </select>
          </div>
          <div class="flex items-end">
            <button type="button" class="remove-subscription w-full bg-red-600 text-white px-3 py-2 text-sm rounded hover:bg-red-700 transition flex items-center justify-center gap-1">
              <span class="material-icons text-sm">remove</span> Remove
            </button>
          </div>
        </div>
      </div>
    `;

    subscriptionRow.querySelector('.remove-subscription').addEventListener('click', function() {
      subscriptionRow.remove();
    });

    subscriptionsList.appendChild(subscriptionRow);
  }

  function collectSubscriptions() {
    const rows = document.querySelectorAll('.subscription-row');
    const subs = [];

    rows.forEach(row => {
      const name = row.querySelector('.sub-name').value;
      const cost = parseFloat(row.querySelector('.sub-cost').value) || 0;
      const category = row.querySelector('.sub-category').value;
      const usage = row.querySelector('.sub-usage').value;
      const importance = row.querySelector('.sub-importance').value;
      const seasonal = row.querySelector('.sub-seasonal').value;

      if (name && cost > 0) {
        subs.push({ name, cost, category, usage, importance, seasonal });
      }
    });

    return subs;
  }

  function analyzeSubscriptions() {
    const subscriptions = collectSubscriptions();
    
    if (subscriptions.length === 0) {
      resultContent.innerHTML = `
        <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div class="flex items-center gap-2 text-red-400">
            <span class="material-icons">error</span>
            <span class="font-medium">Please add at least one subscription to analyze.</span>
          </div>
        </div>
      `;
      resultsDiv.classList.remove('hidden');
      return;
    }

    const preferences = {
      budgetGoal: parseFloat(document.getElementById('budgetGoal').value) || 0,
      optimizationLevel: document.getElementById('optimizationLevel').value,
      allowDowngrade: document.getElementById('allowDowngrade').checked,
      allowPause: document.getElementById('allowPause').checked,
      allowFree: document.getElementById('allowFree').checked,
      allowBundle: document.getElementById('allowBundle').checked
    };

    const analysis = performSubscriptionAnalysis(subscriptions, preferences);
    displayResults(analysis, subscriptions, preferences);
  }

  function performSubscriptionAnalysis(subscriptions, preferences) {
    const totalCost = subscriptions.reduce((sum, sub) => sum + sub.cost, 0);
    const recommendations = [];
    let potentialSavings = 0;

    subscriptions.forEach(sub => {
      const subRecommendations = analyzeSubscription(sub, preferences);
      recommendations.push(...subRecommendations);
      potentialSavings += subRecommendations.reduce((sum, rec) => sum + rec.savings, 0);
    });

    // Sort recommendations by savings potential
    recommendations.sort((a, b) => b.savings - a.savings);

    // Category analysis
    const categorySpending = {};
    subscriptions.forEach(sub => {
      categorySpending[sub.category] = (categorySpending[sub.category] || 0) + sub.cost;
    });

    // Bundle opportunities
    const bundleOpportunities = identifyBundleOpportunities(subscriptions);

    return {
      totalCost,
      potentialSavings,
      recommendations,
      categorySpending,
      bundleOpportunities,
      optimizedCost: totalCost - potentialSavings
    };
  }

  function analyzeSubscription(sub, preferences) {
    const recommendations = [];
    const subscriptionData = getSubscriptionData(sub.name, sub.category);

    // Never used subscriptions
    if (sub.usage === 'never') {
      recommendations.push({
        type: 'cancel',
        subscription: sub.name,
        action: 'Cancel immediately',
        reason: 'Never used - complete waste of money',
        savings: sub.cost,
        priority: 'high'
      });
      return recommendations;
    }

    // Rarely used subscriptions
    if (sub.usage === 'rarely' && sub.importance !== 'essential') {
      recommendations.push({
        type: 'cancel',
        subscription: sub.name,
        action: 'Cancel subscription',
        reason: 'Rarely used and not essential',
        savings: sub.cost,
        priority: 'medium'
      });
    }

    // Seasonal optimization
    if (preferences.allowPause && sub.seasonal !== 'year-round') {
      const monthsToCancel = getSeasonalMonths(sub.seasonal);
      const seasonalSavings = (sub.cost * monthsToCancel) / 12;
      recommendations.push({
        type: 'seasonal',
        subscription: sub.name,
        action: `Pause during off-season (${sanitizeText(monthsToCancel)} months)`,
        reason: `Only used during ${sanitizeText(sub.seasonal)}`,
        savings: seasonalSavings,
        priority: 'medium'
      });
    }

    // Downgrade opportunities
    if (preferences.allowDowngrade && subscriptionData.downgrades) {
      subscriptionData.downgrades.forEach(downgrade => {
        if (sub.cost > downgrade.cost) {
          recommendations.push({
            type: 'downgrade',
            subscription: sub.name,
            action: `Downgrade to ${sanitizeText(downgrade.plan)}`,
            reason: downgrade.reason,
            savings: sub.cost - downgrade.cost,
            priority: 'low'
          });
        }
      });
    }

    // Free alternatives
    if (preferences.allowFree && subscriptionData.freeAlternatives && sub.importance !== 'essential') {
      subscriptionData.freeAlternatives.forEach(alternative => {
        recommendations.push({
          type: 'replace',
          subscription: sub.name,
          action: `Replace with ${sanitizeText(alternative.name)}`,
          reason: alternative.reason,
          savings: sub.cost,
          priority: sub.usage === 'monthly' || sub.usage === 'rarely' ? 'medium' : 'low'
        });
      });
    }

    return recommendations;
  }

  function getSubscriptionData(name, category) {
    const data = {
      streaming: {
        downgrades: [
          { plan: 'Basic plan', cost: 8.99, reason: 'Lower resolution, limited screens' },
          { plan: 'Ad-supported tier', cost: 6.99, reason: 'Same content with ads' }
        ],
        freeAlternatives: [
          { name: 'Tubi, Crackle', reason: 'Free with ads, limited content' },
          { name: 'YouTube', reason: 'Free content, user-generated videos' }
        ]
      },
      music: {
        downgrades: [
          { plan: 'Student plan', cost: 4.99, reason: 'If eligible for student discount' }
        ],
        freeAlternatives: [
          { name: 'Spotify Free', reason: 'Free with ads and limitations' },
          { name: 'YouTube Music Free', reason: 'Free tier available' }
        ]
      },
      software: {
        freeAlternatives: [
          { name: 'Open source alternatives', reason: 'Many free equivalents available' },
          { name: 'Google Workspace (free)', reason: 'Basic productivity tools' }
        ]
      },
      fitness: {
        freeAlternatives: [
          { name: 'YouTube fitness channels', reason: 'Free workout videos' },
          { name: 'Nike Training Club', reason: 'Free fitness app' }
        ]
      },
      news: {
        freeAlternatives: [
          { name: 'Library access', reason: 'Many libraries offer free digital access' },
          { name: 'Free news websites', reason: 'Basic news available free' }
        ]
      }
    };

    return data[category] || {};
  }

  function getSeasonalMonths(seasonal) {
    const seasonalMonths = {
      'winter': 6,
      'summer': 6,
      'holiday': 10,
      'school': 3
    };
    return seasonalMonths[seasonal] || 0;
  }

  function identifyBundleOpportunities(subscriptions) {
    const opportunities = [];
    
    // Check for streaming bundles
    const streamingServices = subscriptions.filter(sub => sub.category === 'streaming');
    if (streamingServices.length >= 2) {
      opportunities.push({
        type: 'bundle',
        services: streamingServices.map(s => s.name).join(', '),
        suggestion: 'Consider Disney+/Hulu/ESPN+ bundle or similar packages',
        potentialSavings: 5
      });
    }

    // Check for cloud storage consolidation
    const cloudServices = subscriptions.filter(sub => sub.category === 'cloud');
    if (cloudServices.length >= 2) {
      opportunities.push({
        type: 'consolidate',
        services: cloudServices.map(s => s.name).join(', '),
        suggestion: 'Consolidate to one cloud storage provider',
        potentialSavings: cloudServices.slice(1).reduce((sum, s) => sum + s.cost, 0)
      });
    }

    return opportunities;
  }

  function displayResults(analysis, subscriptions, preferences) {
    const savingsPercentage = (analysis.potentialSavings / analysis.totalCost) * 100;
    
    resultContent.innerHTML = `
      <div class="bg-broder p-6 rounded-lg border border-accent">
        <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
          <span class="material-icons text-primary">analytics</span> 
          Subscription Audit Results
        </h3>
        
        <div class="grid md:grid-cols-3 gap-4 mb-6">
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold text-red-400">$${analysis.totalCost.toFixed(2)}</div>
            <div class="text-sm text-light">Current Monthly Cost</div>
          </div>
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold text-green-400">$${analysis.potentialSavings.toFixed(2)}</div>
            <div class="text-sm text-light">Potential Savings</div>
          </div>
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold text-primary">$${analysis.optimizedCost.toFixed(2)}</div>
            <div class="text-sm text-light">Optimized Cost</div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Optimization Recommendations</h4>
          <div class="space-y-3">
            ${analysis.recommendations.slice(0, 10).map(rec => `
              <div class="p-3 bg-dark rounded border border-accent">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex-grow">
                    <div class="font-medium text-text">${rec.subscription}</div>
                    <div class="text-sm text-light">${sanitizeText(rec.action)}</div>
                    <div class="text-xs text-light mt-1">${sanitizeText(rec.reason)}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-green-400">$${rec.savings.toFixed(2)}/mo</div>
                    <div class="text-xs px-2 py-1 rounded ${
                      rec.priority === 'high' ? 'bg-red-600' : 
                      rec.priority === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                    } text-white">${sanitizeText(rec.priority)}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-lg font-medium mb-3 text-text">Spending by Category</h4>
            <div class="space-y-2">
              ${Object.entries(analysis.categorySpending).map(([category, amount]) => `
                <div class="flex justify-between text-sm">
                  <span class="text-light capitalize">${category.replace('-', ' ')}:</span>
                  <span class="text-text">$${amount.toFixed(2)}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-medium mb-3 text-text">Quick Wins</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-light">Annual Savings:</span>
                <span class="text-green-400">$${(analysis.potentialSavings * 12).toFixed(0)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Savings Percentage:</span>
                <span class="text-green-400">${savingsPercentage.toFixed(1)}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">High Priority Actions:</span>
                <span class="text-text">${analysis.recommendations.filter(r => r.priority === 'high').length}</span>
              </div>
            </div>
          </div>
        </div>

        ${analysis.bundleOpportunities.length > 0 ? `
        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Bundle Opportunities</h4>
          <div class="space-y-2">
            ${analysis.bundleOpportunities.map(opp => `
              <div class="p-3 bg-dark rounded border border-accent text-sm">
                <div class="font-medium text-text">${opp.services}</div>
                <div class="text-light">${sanitizeText(opp.suggestion)}</div>
                <div class="text-green-400 mt-1">Potential savings: $${opp.potentialSavings.toFixed(2)}/month</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="bg-dark p-4 rounded border border-accent">
          <h4 class="text-lg font-medium mb-3 text-text">Action Plan</h4>
          <ol class="space-y-2 text-sm text-light">
            <li class="flex items-start gap-2">
              <span class="text-primary font-bold">1.</span>
              Cancel unused subscriptions immediately (highest savings)
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary font-bold">2.</span>
              Set calendar reminders to pause seasonal subscriptions
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary font-bold">3.</span>
              Research and test free alternatives for non-essential services
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary font-bold">4.</span>
              Negotiate or downgrade plans for frequently used services
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary font-bold">5.</span>
              Review and audit subscriptions quarterly to prevent subscription creep
            </li>
          </ol>
        </div>
      </div>
    `;

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }
});
