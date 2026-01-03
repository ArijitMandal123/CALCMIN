// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.getElementById('habit-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const habitType = document.getElementById('habitType').value;
  const currentStreak = parseInt(document.getElementById('currentStreak').value);
  const targetStreak = parseInt(document.getElementById('targetStreak').value);
  const motivation = document.getElementById('motivation').value;
  const environment = document.getElementById('environment').value;
  const timeCommitment = parseInt(document.getElementById('timeCommitment').value);
  const previousAttempts = document.getElementById('previousAttempts').value;
  const accountability = document.getElementById('accountability').value;
  const flexibility = document.getElementById('flexibility').value;

  // Base probability calculation
  let baseProbability = 50;
  
  // Adjust for current streak (momentum effect)
  if (currentStreak > 0) baseProbability += Math.min(currentStreak * 0.5, 15);
  
  // Motivation factor
  const motivationBonus = {low: -10, medium: 0, high: 10, extreme: 20};
  baseProbability += motivationBonus[motivation];
  
  // Environment factor
  const envBonus = {poor: -15, fair: -5, good: 5, excellent: 15};
  baseProbability += envBonus[environment];
  
  // Time commitment (sweet spot is 15-30 min)
  if (timeCommitment >= 15 && timeCommitment <= 30) baseProbability += 10;
  else if (timeCommitment < 5) baseProbability -= 10;
  else if (timeCommitment > 60) baseProbability -= 5;
  
  // Previous attempts
  const attemptBonus = {none: -5, failed: 0, partial: 5, success: 15};
  baseProbability += attemptBonus[previousAttempts];
  
  // Accountability
  const accountBonus = {none: -10, app: 0, friend: 10, group: 15, coach: 20};
  baseProbability += accountBonus[accountability];
  
  // Flexibility
  const flexBonus = {rigid: -5, moderate: 5, flexible: 10};
  baseProbability += flexBonus[flexibility];
  
  // Habit type difficulty
  const habitDifficulty = {
    exercise: -5, meditation: 0, reading: 5, writing: 0,
    learning: -5, diet: -10, sleep: -5, productivity: 0
  };
  baseProbability += habitDifficulty[habitType];
  
  // Adjust for target streak length
  const daysToTarget = targetStreak - currentStreak;
  if (daysToTarget > 90) baseProbability -= 15;
  else if (daysToTarget > 60) baseProbability -= 10;
  else if (daysToTarget > 30) baseProbability -= 5;
  
  // Clamp between 5-95%
  const finalProbability = Math.max(5, Math.min(95, baseProbability));
  
  // Calculate milestones
  const day7 = Math.max(5, finalProbability + 5);
  const day21 = Math.max(5, finalProbability);
  const day66 = Math.max(5, finalProbability - 10);
  const day100 = Math.max(5, finalProbability - 15);
  
  displayResults(finalProbability, daysToTarget, day7, day21, day66, day100);
});

function displayResults(probability, daysToTarget, day7, day21, day66, day100) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  const level = probability >= 70 ? 'High' : probability >= 50 ? 'Moderate' : probability >= 30 ? 'Fair' : 'Low';
  const color = probability >= 70 ? 'text-green-400' : probability >= 50 ? 'text-yellow-400' : probability >= 30 ? 'text-orange-400' : 'text-red-400';
  
  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">analytics</span> Probability Results
      </h2>
      
      <div class="bg-dark p-4 rounded mb-4">
        <div class="text-center">
          <div class="${sanitizeText(color)} text-4xl md:text-5xl font-bold mb-2">${probability.toFixed(1)}%</div>
          <div class="text-light text-sm">Success Probability (${escapeHtml(level)})</div>
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="bg-dark p-3 rounded">
          <div class="text-accent text-sm mb-1">Days to Target</div>
          <div class="text-text text-xl font-medium">${sanitizeText(daysToTarget)} days</div>
        </div>
        <div class="bg-dark p-3 rounded">
          <div class="text-accent text-sm mb-1">Estimated Success Rate</div>
          <div class="text-text text-xl font-medium">${escapeHtml(level)}</div>
        </div>
      </div>
      
      <div class="bg-dark p-4 rounded mb-4">
        <h3 class="text-text font-medium mb-3">Milestone Probabilities</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-light">Day 7 (Habit Formation):</span><span class="text-text font-medium">${day7.toFixed(1)}%</span></div>
          <div class="flex justify-between"><span class="text-light">Day 21 (Routine Building):</span><span class="text-text font-medium">${day21.toFixed(1)}%</span></div>
          <div class="flex justify-between"><span class="text-light">Day 66 (Automaticity):</span><span class="text-text font-medium">${day66.toFixed(1)}%</span></div>
          <div class="flex justify-between"><span class="text-light">Day 100 (Mastery):</span><span class="text-text font-medium">${day100.toFixed(1)}%</span></div>
        </div>
      </div>
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>ðŸ’¡ Tips to Improve:</strong>
        <ul class="mt-2 space-y-1 text-light">
          ${probability < 50 ? '<li>â€¢ Consider starting with a smaller target streak</li>' : ''}
          ${probability < 60 ? '<li>â€¢ Add an accountability partner or join a community</li>' : ''}
          ${probability < 70 ? '<li>â€¢ Optimize your environment to reduce friction</li>' : ''}
          <li>â€¢ Track your progress daily to maintain momentum</li>
          <li>â€¢ Prepare for obstacles and have backup plans</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

