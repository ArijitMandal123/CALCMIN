document.getElementById('language-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nativeLanguage = document.getElementById('nativeLanguage').value;
  const targetLanguage = document.getElementById('targetLanguage').value;
  const targetLevel = document.getElementById('targetLevel').value;
  const dailyHours = parseFloat(document.getElementById('dailyHours').value);
  const studyDays = parseInt(document.getElementById('studyDays').value);
  const studyMethod = document.getElementById('studyMethod').value;
  const languageAptitude = document.getElementById('languageAptitude').value;
  const previousExperience = document.getElementById('previousExperience').value;
  const immersionAccess = document.getElementById('immersionAccess').value;

  // Base hours needed by level (FSI estimates)
  const levelHours = {
    a1: 150, a2: 300, b1: 600, b2: 900, c1: 1200, c2: 1500
  };

  // Language difficulty multipliers (from English perspective)
  const difficultyMultipliers = {
    spanish: 0.8, french: 0.9, german: 1.1, italian: 0.8, portuguese: 0.8,
    chinese: 2.2, japanese: 2.2, korean: 2.0, arabic: 2.2, russian: 1.8
  };

  let baseHours = levelHours[targetLevel];
  
  // Apply language difficulty
  if (nativeLanguage === 'english') {
    baseHours *= difficultyMultipliers[targetLanguage] || 1.0;
  }

  // Study method efficiency
  const methodMultipliers = {
    self: 1.3, online: 1.1, tutor: 0.8, class: 1.0, immersion: 0.6
  };
  baseHours *= methodMultipliers[studyMethod];

  // Aptitude adjustments
  const aptitudeMultipliers = {
    low: 1.4, average: 1.0, high: 0.8, exceptional: 0.6
  };
  baseHours *= aptitudeMultipliers[languageAptitude];

  // Previous experience bonus
  const experienceMultipliers = {
    none: 1.0, some: 0.9, fluent: 0.8, polyglot: 0.7
  };
  baseHours *= experienceMultipliers[previousExperience];

  // Immersion access bonus
  const immersionMultipliers = {
    none: 1.0, limited: 0.95, moderate: 0.85, high: 0.7
  };
  baseHours *= immersionMultipliers[immersionAccess];

  // Calculate time estimates
  const weeklyHours = dailyHours * studyDays;
  const weeksNeeded = Math.ceil(baseHours / weeklyHours);
  const monthsNeeded = Math.ceil(weeksNeeded / 4.33);
  const yearsNeeded = monthsNeeded / 12;

  displayResults(baseHours, weeksNeeded, monthsNeeded, yearsNeeded, weeklyHours, targetLevel);
});

function displayResults(hours, weeks, months, years, weeklyHours, level) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');

  const timeframe = years >= 2 ? `${years.toFixed(1)} years` : 
                   months >= 12 ? `${months} months` : 
                   `${weeks} weeks`;

  const levelDescriptions = {
    a1: 'Basic phrases and simple conversations',
    a2: 'Simple daily interactions and basic topics',
    b1: 'Comfortable conversations on familiar topics',
    b2: 'Fluent discussions on complex topics',
    c1: 'Advanced proficiency in most situations',
    c2: 'Near-native fluency and mastery'
  };

  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">schedule</span> Learning Time Estimate
      </h2>
      
      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-primary text-3xl font-bold">${Math.round(hours)}</div>
          <div class="text-light text-sm">Total Study Hours</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-accent text-3xl font-bold">${timeframe}</div>
          <div class="text-light text-sm">Time to Reach Goal</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-text text-2xl font-bold">${weeklyHours}</div>
          <div class="text-light text-sm">Hours per Week</div>
        </div>
      </div>

      <div class="bg-dark p-4 rounded mb-4">
        <h3 class="text-text font-medium mb-2">${level.toUpperCase()} Level Description</h3>
        <p class="text-light text-sm">${levelDescriptions[level]}</p>
      </div>

      <div class="bg-dark p-4 rounded mb-4">
        <h3 class="text-text font-medium mb-3">Milestone Timeline</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-light">A1 (Basic):</span><span class="text-text font-medium">${Math.ceil((hours * 0.1) / weeklyHours)} weeks</span></div>
          <div class="flex justify-between"><span class="text-light">A2 (Elementary):</span><span class="text-text font-medium">${Math.ceil((hours * 0.2) / weeklyHours)} weeks</span></div>
          <div class="flex justify-between"><span class="text-light">B1 (Intermediate):</span><span class="text-text font-medium">${Math.ceil((hours * 0.4) / weeklyHours)} weeks</span></div>
          <div class="flex justify-between"><span class="text-light">B2 (Upper Int.):</span><span class="text-text font-medium">${Math.ceil((hours * 0.6) / weeklyHours)} weeks</span></div>
        </div>
      </div>
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>📚 Learning Tips:</strong>
        <ul class="mt-2 space-y-1 text-light">
          <li>• Consistency is more important than intensity</li>
          <li>• Practice speaking from day one</li>
          <li>• Use spaced repetition for vocabulary</li>
          <li>• Immerse yourself in media (music, movies, podcasts)</li>
          <li>• Find conversation partners or language exchange</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}