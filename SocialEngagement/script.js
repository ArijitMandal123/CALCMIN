document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('social-form');
  const platformSelect = document.getElementById('platform');
  const savesField = document.getElementById('savesField');
  
  platformSelect.addEventListener('change', () => {
    if (platformSelect.value === 'instagram') {
      savesField.classList.remove('hidden');
    } else {
      savesField.classList.add('hidden');
    }
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const platform = platformSelect.value;
    const followers = parseInt(document.getElementById('followers').value);
    const likes = parseInt(document.getElementById('likes').value);
    const comments = parseInt(document.getElementById('comments').value);
    const shares = parseInt(document.getElementById('shares').value) || 0;
    const saves = parseInt(document.getElementById('saves').value) || 0;
    
    let engagementRate, totalEngagements, weightedScore;
    let benchmark, rating, advice;
    
    if (platform === 'instagram') {
      totalEngagements = likes + comments + shares + saves;
      engagementRate = (totalEngagements / followers) * 100;
      weightedScore = (likes * 1) + (comments * 3) + (shares * 5) + (saves * 7);
      benchmark = { poor: 1, average: 3, good: 6, excellent: 10 };
    } else if (platform === 'tiktok') {
      totalEngagements = likes + comments + shares;
      engagementRate = (totalEngagements / followers) * 100;
      weightedScore = (likes * 1) + (comments * 4) + (shares * 6);
      benchmark = { poor: 5, average: 9, good: 15, excellent: 25 };
    } else if (platform === 'youtube') {
      totalEngagements = likes + comments + shares;
      engagementRate = (totalEngagements / followers) * 100;
      weightedScore = (likes * 1) + (comments * 5) + (shares * 3);
      benchmark = { poor: 2, average: 4, good: 7, excellent: 12 };
    } else if (platform === 'facebook') {
      totalEngagements = likes + comments + shares;
      engagementRate = (totalEngagements / followers) * 100;
      weightedScore = (likes * 1) + (comments * 3) + (shares * 5);
      benchmark = { poor: 0.5, average: 1, good: 3, excellent: 6 };
    } else if (platform === 'twitter') {
      totalEngagements = likes + comments + shares;
      engagementRate = (totalEngagements / followers) * 100;
      weightedScore = (likes * 1) + (comments * 4) + (shares * 6);
      benchmark = { poor: 0.5, average: 1.5, good: 3, excellent: 6 };
    } else if (platform === 'linkedin') {
      totalEngagements = likes + comments + shares;
      engagementRate = (totalEngagements / followers) * 100;
      weightedScore = (likes * 1) + (comments * 5) + (shares * 4);
      benchmark = { poor: 1, average: 2, good: 4, excellent: 8 };
    }
    
    if (engagementRate < benchmark.poor) {
      rating = 'Poor';
      advice = 'Focus on creating more engaging content and posting consistently';
    } else if (engagementRate < benchmark.average) {
      rating = 'Below Average';
      advice = 'Improve content quality and engage more with your audience';
    } else if (engagementRate < benchmark.good) {
      rating = 'Average';
      advice = 'Good foundation - optimize posting times and content format';
    } else if (engagementRate < benchmark.excellent) {
      rating = 'Good';
      advice = 'Strong engagement - maintain consistency and experiment with trends';
    } else {
      rating = 'Excellent';
      advice = 'Outstanding engagement - you\'re doing great! Keep it up';
    }
    
    const resultHTML = `
      <div class="bg-broder p-4 md:p-6 rounded-lg border-l-4 border-primary">
        <h3 class="text-xl text-primary mb-4 flex items-center gap-2"><span class="material-icons">insights</span> Engagement Analysis</h3>
        <div class="grid gap-4 text-text text-sm md:text-base">
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">percent</span><strong>Engagement Rate:</strong></div>
            <p class="text-3xl text-primary font-bold ml-8">${engagementRate.toFixed(2)}%</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">star</span><strong>Rating:</strong></div>
            <p class="text-2xl text-accent font-bold ml-8">${rating}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">functions</span><strong>Total Engagements:</strong></div>
            <p class="text-xl ml-8">${totalEngagements.toLocaleString()}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">speed</span><strong>Weighted Score:</strong></div>
            <p class="text-xl ml-8">${weightedScore.toLocaleString()}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">lightbulb</span><strong>Recommendation:</strong></div>
            <p class="ml-8">${advice}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">bar_chart</span><strong>Platform Benchmarks:</strong></div>
            <ul class="ml-8 space-y-1 text-sm">
              <li>Poor: < ${benchmark.poor}%</li>
              <li>Average: ${benchmark.average}%</li>
              <li>Good: ${benchmark.good}%</li>
              <li>Excellent: ${benchmark.excellent}%+</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('result-content').innerHTML = resultHTML;
  });
});
