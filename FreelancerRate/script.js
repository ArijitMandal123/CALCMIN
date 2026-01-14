// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

document.getElementById('rate-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const skillCategory = document.getElementById('skillCategory').value;
  const experienceLevel = document.getElementById('experienceLevel').value;
  const location = document.getElementById('location').value;
  const targetMarket = document.getElementById('targetMarket').value;
  const platform = document.getElementById('platform').value;
  const projectType = document.getElementById('projectType').value;
  const currentRate = parseFloat(document.getElementById('currentRate').value) || 0;

  // Base rates by skill category (USD/hour)
  const baseRates = {
    webdev: {beginner: 25, intermediate: 45, advanced: 75, expert: 120},
    design: {beginner: 20, intermediate: 35, advanced: 60, expert: 100},
    writing: {beginner: 15, intermediate: 25, advanced: 45, expert: 80},
    marketing: {beginner: 20, intermediate: 40, advanced: 70, expert: 110},
    dataentry: {beginner: 8, intermediate: 12, advanced: 18, expert: 25},
    translation: {beginner: 12, intermediate: 20, advanced: 35, expert: 60},
    video: {beginner: 18, intermediate: 30, advanced: 55, expert: 90},
    consulting: {beginner: 40, intermediate: 75, advanced: 125, expert: 200}
  };

  let suggestedRate = baseRates[skillCategory][experienceLevel];

  // Location multipliers
  const locationMultipliers = {
    us: 1.0, uk: 0.9, canada: 0.85, australia: 0.8,
    germany: 0.75, india: 0.3, philippines: 0.25, other: 0.6
  };
  
  // Target market adjustments
  const marketMultipliers = {
    local: 0.8, national: 1.0, international: 1.2, mixed: 1.0
  };

  // Platform adjustments
  const platformMultipliers = {
    upwork: 0.8, fiverr: 0.7, freelancer: 0.75,
    direct: 1.3, agencies: 1.1, referrals: 1.2
  };

  suggestedRate *= locationMultipliers[location];
  suggestedRate *= marketMultipliers[targetMarket];
  suggestedRate *= platformMultipliers[platform];

  // Project type adjustments
  if (projectType === 'retainer') suggestedRate *= 0.9;
  if (projectType === 'fixed') suggestedRate *= 1.1;

  const minRate = suggestedRate * 0.8;
  const maxRate = suggestedRate * 1.3;

  displayResults(suggestedRate, minRate, maxRate, currentRate, skillCategory, experienceLevel);
});

function displayResults(suggested, min, max, current, skill, experience) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');
  
  const comparison = current > 0 ? 
    (current < min ? 'Below Market' : current > max ? 'Above Market' : 'Market Rate') : '';
  
  const comparisonColor = current > 0 ? 
    (current < min ? 'text-red-400' : current > max ? 'text-green-400' : 'text-yellow-400') : '';

  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">trending_up</span> Rate Comparison Results
      </h2>
      
      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-red-400 text-2xl font-bold">$${min.toFixed(2)}</div>
          <div class="text-light text-sm">Minimum Rate</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-primary text-3xl font-bold">$${suggested.toFixed(2)}</div>
          <div class="text-light text-sm">Suggested Rate</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-green-400 text-2xl font-bold">$${max.toFixed(2)}</div>
          <div class="text-light text-sm">Premium Rate</div>
        </div>
      </div>

      ${current > 0 ? `
      <div class="bg-dark p-4 rounded mb-4 text-center">
        <div class="text-light text-sm mb-1">Your Current Rate</div>
        <div class="text-text text-2xl font-bold">$${current.toFixed(2)}</div>
        <div class="${sanitizeText(comparisonColor)} text-sm font-medium">${sanitizeText(comparison)}</div>
      </div>
      ` : ''}
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>💡 Rate Optimization Tips:</strong>
        <ul class="mt-2 space-y-1 text-light">
          <li>• Build a strong portfolio showcasing your best work</li>
          <li>• Collect client testimonials and case studies</li>
          <li>• Specialize in high-demand niches</li>
          <li>• Consider value-based pricing for complex projects</li>
          <li>• Regularly review and adjust your rates</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
