// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('timeline-form');
  const resultsDiv = document.getElementById('results');
  const resultContent = document.getElementById('result-content');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    createTimeline();
  });

  function createTimeline() {
    const incomeStream = document.getElementById('incomeStream').value;
    const incomeGoal = parseFloat(document.getElementById('incomeGoal').value) || 1000;
    const startingCapital = parseFloat(document.getElementById('startingCapital').value) || 0;
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) || 0;
    const hoursPerWeek = parseFloat(document.getElementById('hoursPerWeek').value) || 10;
    const experienceLevel = document.getElementById('experienceLevel').value;
    const skillLevel = document.getElementById('skillLevel').value;
    const riskTolerance = document.getElementById('riskTolerance').value;

    const streamData = getStreamData(incomeStream);
    const timeline = calculateTimeline(streamData, incomeGoal, startingCapital, monthlyInvestment, hoursPerWeek, experienceLevel, skillLevel, riskTolerance);
    
    displayTimeline(timeline, streamData, incomeGoal);
  }

  function getStreamData(stream) {
    const streams = {
      'dividend-stocks': {
        name: 'Dividend Stocks',
        baseTimeToGoal: 36,
        capitalRequired: true,
        skillIntensive: false,
        avgReturn: 4,
        riskLevel: 'low',
        upfrontWork: 'low',
        scalability: 'high'
      },
      'rental-property': {
        name: 'Rental Property',
        baseTimeToGoal: 24,
        capitalRequired: true,
        skillIntensive: false,
        avgReturn: 8,
        riskLevel: 'medium',
        upfrontWork: 'medium',
        scalability: 'medium'
      },
      'online-course': {
        name: 'Online Course',
        baseTimeToGoal: 12,
        capitalRequired: false,
        skillIntensive: true,
        avgReturn: 0,
        riskLevel: 'medium',
        upfrontWork: 'high',
        scalability: 'high'
      },
      'affiliate-marketing': {
        name: 'Affiliate Marketing',
        baseTimeToGoal: 18,
        capitalRequired: false,
        skillIntensive: true,
        avgReturn: 0,
        riskLevel: 'high',
        upfrontWork: 'high',
        scalability: 'high'
      },
      'youtube-channel': {
        name: 'YouTube Channel',
        baseTimeToGoal: 24,
        capitalRequired: false,
        skillIntensive: true,
        avgReturn: 0,
        riskLevel: 'high',
        upfrontWork: 'high',
        scalability: 'high'
      },
      'blog-monetization': {
        name: 'Blog Monetization',
        baseTimeToGoal: 18,
        capitalRequired: false,
        skillIntensive: true,
        avgReturn: 0,
        riskLevel: 'medium',
        upfrontWork: 'high',
        scalability: 'high'
      },
      'dropshipping': {
        name: 'Dropshipping',
        baseTimeToGoal: 9,
        capitalRequired: false,
        skillIntensive: true,
        avgReturn: 0,
        riskLevel: 'high',
        upfrontWork: 'medium',
        scalability: 'high'
      },
      'print-on-demand': {
        name: 'Print on Demand',
        baseTimeToGoal: 15,
        capitalRequired: false,
        skillIntensive: true,
        avgReturn: 0,
        riskLevel: 'medium',
        upfrontWork: 'medium',
        scalability: 'high'
      },
      'app-development': {
        name: 'Mobile App',
        baseTimeToGoal: 18,
        capitalRequired: false,
        skillIntensive: true,
        avgReturn: 0,
        riskLevel: 'high',
        upfrontWork: 'high',
        scalability: 'high'
      },
      'etsy-shop': {
        name: 'Etsy Digital Products',
        baseTimeToGoal: 12,
        capitalRequired: false,
        skillIntensive: true,
        avgReturn: 0,
        riskLevel: 'medium',
        upfrontWork: 'medium',
        scalability: 'medium'
      },
      'stock-photography': {
        name: 'Stock Photography',
        baseTimeToGoal: 24,
        capitalRequired: false,
        skillIntensive: true,
        avgReturn: 0,
        riskLevel: 'medium',
        upfrontWork: 'high',
        scalability: 'medium'
      },
      'peer-to-peer-lending': {
        name: 'P2P Lending',
        baseTimeToGoal: 18,
        capitalRequired: true,
        skillIntensive: false,
        avgReturn: 6,
        riskLevel: 'medium',
        upfrontWork: 'low',
        scalability: 'high'
      }
    };
    return streams[stream] || streams['online-course'];
  }

  function calculateTimeline(streamData, incomeGoal, startingCapital, monthlyInvestment, hoursPerWeek, experienceLevel, skillLevel, riskTolerance) {
    let timeToGoal = streamData.baseTimeToGoal;

    // Experience adjustments
    const expMultipliers = { beginner: 1.5, some: 1.2, intermediate: 1.0, advanced: 0.8 };
    timeToGoal *= expMultipliers[experienceLevel] || 1.2;

    // Skill adjustments
    const skillMultipliers = { none: 1.4, basic: 1.2, good: 1.0, expert: 0.7 };
    timeToGoal *= skillMultipliers[skillLevel] || 1.2;

    // Time commitment adjustments
    if (hoursPerWeek < 10) timeToGoal *= 1.3;
    else if (hoursPerWeek >= 20) timeToGoal *= 0.8;

    // Capital-based streams
    if (streamData.capitalRequired) {
      const requiredCapital = (incomeGoal * 12) / (streamData.avgReturn / 100);
      const totalCapital = startingCapital + (monthlyInvestment * timeToGoal);
      
      if (totalCapital < requiredCapital) {
        timeToGoal = Math.max(timeToGoal, (requiredCapital - startingCapital) / monthlyInvestment);
      }
    }

    // Risk tolerance adjustments
    const riskMultipliers = { low: 1.2, medium: 1.0, high: 0.9 };
    if (streamData.riskLevel !== riskTolerance) {
      timeToGoal *= riskMultipliers[riskTolerance] || 1.0;
    }

    return {
      timeToGoal: Math.round(timeToGoal),
      milestones: generateMilestones(streamData, Math.round(timeToGoal), incomeGoal),
      challenges: generateChallenges(streamData, experienceLevel, skillLevel),
      recommendations: generateRecommendations(streamData, hoursPerWeek, startingCapital, monthlyInvestment)
    };
  }

  function generateMilestones(streamData, totalMonths, incomeGoal) {
    const milestones = [];
    const phases = Math.ceil(totalMonths / 4);
    
    for (let i = 1; i <= 4; i++) {
      const month = Math.round((totalMonths / 4) * i);
      const incomePercent = Math.pow(i / 4, 1.5); // Non-linear growth
      const expectedIncome = Math.round(incomeGoal * incomePercent);
      
      let description = '';
      switch(i) {
        case 1:
          description = streamData.capitalRequired ? 
            'Initial setup and first investments made' : 
            'Foundation built, first content created';
          break;
        case 2:
          description = streamData.capitalRequired ? 
            'Portfolio growing, some returns visible' : 
            'Audience building, initial monetization';
          break;
        case 3:
          description = streamData.capitalRequired ? 
            'Steady returns, reinvestment strategy' : 
            'Consistent income, optimization phase';
          break;
        case 4:
          description = 'Target income achieved, scaling phase';
          break;
      }
      
      milestones.push({
        month,
        income: expectedIncome,
        description,
        percentage: Math.round(incomePercent * 100)
      });
    }
    
    return milestones;
  }

  function generateChallenges(streamData, experienceLevel, skillLevel) {
    const challenges = [];
    
    if (experienceLevel === 'beginner') {
      challenges.push('Learning curve will be steep initially');
    }
    
    if (skillLevel === 'none' || skillLevel === 'basic') {
      challenges.push('Significant skill development required');
    }
    
    if (streamData.riskLevel === 'high') {
      challenges.push('High competition and market volatility');
    }
    
    if (streamData.upfrontWork === 'high') {
      challenges.push('Substantial upfront work before seeing returns');
    }
    
    if (streamData.capitalRequired) {
      challenges.push('Requires significant capital investment');
    }
    
    challenges.push('Consistency and patience are crucial for success');
    
    return challenges;
  }

  function generateRecommendations(streamData, hoursPerWeek, startingCapital, monthlyInvestment) {
    const recommendations = [];
    
    if (hoursPerWeek < 10) {
      recommendations.push('Consider increasing time commitment for faster results');
    }
    
    if (streamData.capitalRequired && startingCapital < 10000) {
      recommendations.push('Build up more starting capital before beginning');
    }
    
    if (streamData.skillIntensive) {
      recommendations.push('Invest in learning and skill development first');
    }
    
    recommendations.push('Start with one income stream and master it before diversifying');
    recommendations.push('Track progress monthly and adjust strategy as needed');
    recommendations.push('Network with others in your chosen field for faster learning');
    
    return recommendations;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function displayTimeline(timeline, streamData, incomeGoal) {
    const years = Math.floor(timeline.timeToGoal / 12);
    const months = timeline.timeToGoal % 12;
    const timeString = years > 0 ? `${sanitizeText(years)} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}` : `${sanitizeText(months)} month${months > 1 ? 's' : ''}`;

    resultContent.innerHTML = `
      <div class="bg-broder p-6 rounded-lg border border-accent">
        <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
          <span class="material-icons text-primary">timeline</span> 
          ${sanitizeText(streamData.name)} Timeline
        </h3>
        
        <div class="bg-dark p-4 rounded border border-accent mb-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-primary mb-2">${sanitizeText(timeString)}</div>
            <div class="text-light">Estimated time to reach $${incomeGoal.toLocaleString()}/month</div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Timeline Milestones</h4>
          <div class="space-y-3">
            ${timeline.milestones.map((milestone, index) => `
              <div class="flex items-center gap-4 p-3 bg-dark rounded border border-accent">
                <div class="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  ${milestone.month}M
                </div>
                <div class="flex-grow">
                  <div class="font-medium text-text">${escapeHtml(milestone.description)}</div>
                  <div class="text-sm text-light">Expected income: $${milestone.income.toLocaleString()}/month (${sanitizeText(milestone.percentage)}% of goal)</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-lg font-medium mb-3 text-text">Key Challenges</h4>
            <ul class="space-y-2 text-sm">
              ${timeline.challenges.map(challenge => `
                <li class="flex items-start gap-2 text-light">
                  <span class="material-icons text-xs text-orange-400 mt-0.5">warning</span>
                  ${escapeHtml(challenge)}
                </li>
              `).join('')}
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-medium mb-3 text-text">Success Recommendations</h4>
            <ul class="space-y-2 text-sm">
              ${timeline.recommendations.map(rec => `
                <li class="flex items-start gap-2 text-light">
                  <span class="material-icons text-xs text-green-400 mt-0.5">check_circle</span>
                  ${escapeHtml(rec)}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <div class="bg-dark p-4 rounded border border-accent">
          <h4 class="text-lg font-medium mb-3 text-text">Stream Characteristics</h4>
          <div class="grid md:grid-cols-3 gap-4 text-sm">
            <div class="text-center">
              <div class="text-accent font-medium">Risk Level</div>
              <div class="text-text capitalize">${sanitizeText(streamData.riskLevel)}</div>
            </div>
            <div class="text-center">
              <div class="text-accent font-medium">Upfront Work</div>
              <div class="text-text capitalize">${sanitizeText(streamData.upfrontWork)}</div>
            </div>
            <div class="text-center">
              <div class="text-accent font-medium">Scalability</div>
              <div class="text-text capitalize">${sanitizeText(streamData.scalability)}</div>
            </div>
          </div>
        </div>

        <div class="mt-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded text-sm text-yellow-200">
          <strong>Reality Check:</strong> This timeline assumes consistent effort and typical market conditions. 
          Results may vary significantly based on market changes, personal circumstances, and execution quality.
        </div>
      </div>
    `;

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }
});
