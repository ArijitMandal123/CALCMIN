// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

  const form = document.getElementById('light-form');
  
  const lightRequirements = {
    leafy: { seedling: 200, vegetative: 300, flowering: 300 },
    herbs: { seedling: 200, vegetative: 350, flowering: 400 },
    fruiting: { seedling: 250, vegetative: 400, flowering: 600 },
    flowering: { seedling: 200, vegetative: 350, flowering: 500 },
    cannabis: { seedling: 200, vegetative: 400, flowering: 800 },
    succulents: { seedling: 150, vegetative: 250, flowering: 300 }
  };
  
  const lightEfficiency = {
    led: 2.5,
    hps: 1.3,
    mh: 1.5,
    fluorescent: 1.0
  };
  
  const spectrumRecommendations = {
    seedling: { blue: '60%', red: '30%', white: '10%' },
    vegetative: { blue: '50%', red: '40%', white: '10%' },
    flowering: { blue: '30%', red: '60%', white: '10%' }
  };
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const plantType = document.getElementById('plantType').value;
    const growthStage = document.getElementById('growthStage').value;
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const lightType = document.getElementById('lightType').value;
    const ceilingHeight = parseFloat(document.getElementById('ceilingHeight').value) || 8;
    
    const area = length * width;
    const ppfdRequired = lightRequirements[plantType][growthStage];
    const efficiency = lightEfficiency[lightType];
    const wattsPerSqFt = ppfdRequired / efficiency;
    const totalWatts = Math.round(wattsPerSqFt * area);
    
    const minDistance = growthStage === 'seedling' ? 24 : growthStage === 'vegetative' ? 18 : 12;
    const maxDistance = growthStage === 'seedling' ? 36 : growthStage === 'vegetative' ? 24 : 18;
    
    const dailyHours = growthStage === 'flowering' ? 12 : 18;
    const monthlyKwh = (totalWatts / 1000) * dailyHours * 30;
    const monthlyCost = (monthlyKwh * 0.13).toFixed(2);
    
    const spectrum = spectrumRecommendations[growthStage];
    
    const resultHTML = `
      <div class="bg-broder p-4 md:p-6 rounded-lg border-l-4 border-primary">
        <h3 class="text-xl text-primary mb-4 flex items-center gap-2"><span class="material-icons">wb_sunny</span> Light Requirements</h3>
        <div class="grid gap-4 text-text text-sm md:text-base">
          <div class="bg-dark p-4 rounded border-2 border-primary">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-primary">power</span><strong>Total Wattage Needed:</strong></div>
            <p class="text-3xl text-primary font-bold ml-8">${sanitizeText(totalWatts)}W</p>
            <p class="text-sm text-light ml-8">${wattsPerSqFt.toFixed(1)}W per sq ft for ${area.toFixed(1)} sq ft</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">straighten</span><strong>Light Distance:</strong></div>
            <p class="text-2xl text-accent font-bold ml-8">${sanitizeText(minDistance)}-${sanitizeText(maxDistance)} inches</p>
            <p class="text-sm text-light ml-8">From canopy to light source</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">schedule</span><strong>Daily Light Schedule:</strong></div>
            <p class="text-2xl text-accent ml-8">${sanitizeText(dailyHours)} hours/day</p>
            <p class="text-sm text-light ml-8">${growthStage === 'flowering' ? '12/12 light/dark cycle' : '18/6 light/dark cycle'}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">palette</span><strong>Spectrum Recommendation:</strong></div>
            <ul class="ml-8 space-y-1 text-sm">
              <li><strong>Blue (400-500nm):</strong> ${sanitizeText(spectrum.blue)}</li>
              <li><strong>Red (600-700nm):</strong> ${sanitizeText(spectrum.red)}</li>
              <li><strong>White/Full Spectrum:</strong> ${sanitizeText(spectrum.white)}</li>
            </ul>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">science</span><strong>PPFD Target:</strong></div>
            <p class="text-xl text-accent ml-8">${sanitizeText(ppfdRequired)} μmol/m²/s</p>
            <p class="text-sm text-light ml-8">Photosynthetic Photon Flux Density</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">attach_money</span><strong>Energy Cost:</strong></div>
            <ul class="ml-8 space-y-1 text-sm">
              <li><strong>Monthly usage:</strong> ${monthlyKwh.toFixed(1)} kWh</li>
              <li><strong>Estimated monthly cost:</strong> $${sanitizeText(monthlyCost)}</li>
              <li class="text-light">(Based on $0.13/kWh average)</li>
            </ul>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">tips_and_updates</span><strong>Setup Tips:</strong></div>
            <ul class="ml-8 space-y-2 list-disc list-inside text-sm">
              <li>Use adjustable hangers to maintain proper distance as plants grow</li>
              <li>Install reflective material on walls to maximize light efficiency</li>
              <li>Monitor leaf temperature - should be 75-85°F under lights</li>
              <li>Ensure adequate ventilation to prevent heat buildup</li>
              <li>Use a timer for consistent light cycles</li>
              ${lightType === 'led' ? '<li class="text-green-400">LED lights are most energy-efficient and produce less heat</li>' : ''}
              ${ceilingHeight < 6 ? '<li class="text-yellow-400">Low ceiling - consider lower wattage lights to prevent heat stress</li>' : ''}
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('result-content').innerHTML = resultHTML;
  });
});

