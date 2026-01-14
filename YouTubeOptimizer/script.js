// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

  const form = document.getElementById('youtube-form');
  
  const recommendations = {
    gaming: { short: '0:30-1:00', quick: '8-12', standard: '10-15', long: '20-30', extended: '30-60' },
    education: { short: '0:45-1:00', quick: '5-8', standard: '10-20', long: '20-40', extended: '40-90' },
    vlog: { short: '0:30-1:00', quick: '3-6', standard: '8-15', long: '15-25', extended: '25-45' },
    tech: { short: '0:45-1:00', quick: '5-10', standard: '10-18', long: '18-30', extended: '30-60' },
    entertainment: { short: '0:15-1:00', quick: '3-8', standard: '8-15', long: '15-25', extended: '25-40' },
    music: { short: '0:15-1:00', quick: '3-5', standard: '3-6', long: '6-15', extended: '15-60' },
    cooking: { short: '0:30-1:00', quick: '3-8', standard: '10-20', long: '20-40', extended: '40-90' },
    fitness: { short: '0:30-1:00', quick: '5-10', standard: '15-30', long: '30-60', extended: '60-120' },
    business: { short: '0:45-1:00', quick: '5-10', standard: '10-20', long: '20-45', extended: '45-90' }
  };
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const niche = document.getElementById('niche').value;
    const contentType = document.getElementById('contentType').value;
    const avgRetention = parseInt(document.getElementById('avgRetention').value) || 0;
    const goal = document.getElementById('goal').value;
    
    if (!niche) return;
    
    const optimalLength = recommendations[niche][contentType];
    
    let retentionAdvice = '';
    if (avgRetention > 0) {
      if (avgRetention < 30) retentionAdvice = '<span class="material-icons text-red-500">warning</span> Low retention - Consider shorter, more engaging content';
      else if (avgRetention < 50) retentionAdvice = '<span class="material-icons text-yellow-500">info</span> Average retention - Room for improvement with better hooks';
      else if (avgRetention < 70) retentionAdvice = '<span class="material-icons text-green-500">check_circle</span> Good retention - Keep current format';
      else retentionAdvice = '<span class="material-icons text-green-500">stars</span> Excellent retention - Consider longer content';
    }
    
    let goalAdvice = '';
    if (goal === 'views') goalAdvice = 'Focus on 8-12 minute videos for maximum algorithm push';
    else if (goal === 'watchtime') goalAdvice = 'Aim for 15-20+ minute videos with high retention';
    else if (goal === 'engagement') goalAdvice = 'Keep videos 10-15 minutes with strong CTAs';
    else goalAdvice = 'Create 8-15 minute videos with clear value proposition';
    
    const resultHTML = `
      <div class="bg-broder p-4 md:p-6 rounded-lg border-l-4 border-primary">
        <h3 class="text-xl text-primary mb-4 flex items-center gap-2"><span class="material-icons">lightbulb</span> Optimization Results</h3>
        <div class="grid gap-4 text-text text-sm md:text-base">
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">schedule</span><strong>Optimal Video Length:</strong></div>
            <p class="text-2xl text-primary font-bold ml-8">${sanitizeText(optimalLength)} minutes</p>
          </div>
          
          ${avgRetention > 0 ? `<div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><strong>Retention Analysis:</strong></div>
            <p class="flex items-center gap-2 ml-8">${retentionAdvice}</p>
          </div>` : ''}
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">flag</span><strong>Goal-Based Advice:</strong></div>
            <p class="ml-8">${sanitizeText(goalAdvice)}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">tips_and_updates</span><strong>Pro Tips:</strong></div>
            <ul class="ml-8 space-y-2 list-disc list-inside">
              <li>First 30 seconds are crucial - hook viewers immediately</li>
              <li>Maintain 50%+ retention for algorithm favor</li>
              <li>Add chapters for longer videos (10+ min)</li>
              <li>End screens work best on 8+ minute videos</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('result-content').innerHTML = resultHTML;
  });
});

