document.getElementById('pricing-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const courseLength = parseFloat(document.getElementById('courseLength').value);
  const courseType = document.getElementById('courseType').value;
  const niche = document.getElementById('niche').value;
  const contentQuality = document.getElementById('contentQuality').value;
  const audienceSize = document.getElementById('audienceSize').value;
  const audienceType = document.getElementById('audienceType').value;
  const competition = document.getElementById('competition').value;
  const expertise = document.getElementById('expertise').value;
  const following = document.getElementById('following').value;

  // Base price per hour by niche
  const nicheRates = {
    business: 25, technology: 30, design: 20, health: 18, lifestyle: 15, academic: 12
  };

  let basePrice = nicheRates[niche] * courseLength;

  // Course type multipliers
  const typeMultipliers = {
    beginner: 0.8, intermediate: 1.0, advanced: 1.3, masterclass: 1.6
  };
  basePrice *= typeMultipliers[courseType];

  // Content quality multipliers
  const qualityMultipliers = {
    basic: 0.7, good: 1.0, professional: 1.4, premium: 1.8
  };
  basePrice *= qualityMultipliers[contentQuality];

  // Audience type multipliers
  const audienceMultipliers = {
    hobbyist: 0.8, professional: 1.2, business: 1.5, student: 0.6
  };
  basePrice *= audienceMultipliers[audienceType];

  // Competition adjustments
  const competitionMultipliers = {
    low: 1.3, medium: 1.0, high: 0.8, saturated: 0.6
  };
  basePrice *= competitionMultipliers[competition];

  // Expertise multipliers
  const expertiseMultipliers = {
    beginner: 0.7, experienced: 1.0, expert: 1.4, authority: 1.8
  };
  basePrice *= expertiseMultipliers[expertise];

  // Following multipliers
  const followingMultipliers = {
    none: 0.8, small: 0.9, medium: 1.1, large: 1.3
  };
  basePrice *= followingMultipliers[following];

  // Audience size adjustments
  const sizeMultipliers = {
    small: 1.2, medium: 1.0, large: 0.8
  };
  basePrice *= sizeMultipliers[audienceSize];

  const minPrice = basePrice * 0.7;
  const maxPrice = basePrice * 1.4;
  const revenueProjection = basePrice * (audienceSize === 'small' ? 50 : audienceSize === 'medium' ? 300 : 1000);

  displayResults(basePrice, minPrice, maxPrice, revenueProjection, courseLength);
});

function displayResults(optimal, min, max, revenue, hours) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');

  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">attach_money</span> Pricing Recommendations
      </h2>
      
      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-red-400 text-2xl font-bold">$${min.toFixed(0)}</div>
          <div class="text-light text-sm">Minimum Price</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-primary text-3xl font-bold">$${optimal.toFixed(0)}</div>
          <div class="text-light text-sm">Optimal Price</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-green-400 text-2xl font-bold">$${max.toFixed(0)}</div>
          <div class="text-light text-sm">Premium Price</div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-accent text-2xl font-bold">$${(optimal/hours).toFixed(0)}</div>
          <div class="text-light text-sm">Price per Hour</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-text text-2xl font-bold">$${revenue.toLocaleString()}</div>
          <div class="text-light text-sm">Revenue Projection</div>
        </div>
      </div>
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>💡 Pricing Strategy Tips:</strong>
        <ul class="mt-2 space-y-1 text-light">
          <li>• Start with the optimal price and test market response</li>
          <li>• Offer early-bird discounts to build initial momentum</li>
          <li>• Consider payment plans for higher-priced courses</li>
          <li>• Bundle with bonuses to justify premium pricing</li>
          <li>• Monitor competitor pricing regularly</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}