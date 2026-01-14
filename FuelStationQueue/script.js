// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

  const form = document.getElementById('queue-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const timeOfDay = document.getElementById('timeOfDay').value;
    const dayOfWeek = document.getElementById('dayOfWeek').value;
    const numPumps = parseInt(document.getElementById('numPumps').value);
    const carsInQueue = parseInt(document.getElementById('carsInQueue').value);
    const stationType = document.getElementById('stationType').value;
    const fuelPrice = document.getElementById('fuelPrice').value;
    const weather = document.getElementById('weather').value;
    
    const timeMultipliers = {
      early: 1.3, morning: 1.1, midday: 0.9, afternoon: 1.2, evening: 1.5, night: 0.7
    };
    const dayMultipliers = {
      weekday: 1.0, weekend: 1.3, holiday: 1.6
    };
    const stationMultipliers = {
      highway: 0.8, urban: 1.2, suburban: 1.0, rural: 0.9
    };
    const priceMultipliers = {
      low: 1.4, average: 1.0, high: 0.7
    };
    const weatherMultipliers = {
      clear: 1.0, rain: 1.2, snow: 1.5, extreme: 2.0
    };
    
    const avgServiceTime = 4;
    const baseWaitTime = (carsInQueue / numPumps) * avgServiceTime;
    
    const totalMultiplier = timeMultipliers[timeOfDay] * dayMultipliers[dayOfWeek] * 
                           stationMultipliers[stationType] * priceMultipliers[fuelPrice] * 
                           weatherMultipliers[weather];
    
    const predictedWait = Math.round(baseWaitTime * totalMultiplier);
    const minWait = Math.max(0, predictedWait - 3);
    const maxWait = predictedWait + 5;
    
    const congestionLevel = predictedWait < 5 ? 'Low' : predictedWait < 12 ? 'Moderate' : 'High';
    const congestionColor = predictedWait < 5 ? 'text-green-400' : predictedWait < 12 ? 'text-yellow-400' : 'text-red-400';
    
    const bestTimes = ['night', 'midday', 'morning'].filter(t => t !== timeOfDay).slice(0, 2);
    const bestTimeLabels = {
      night: 'Night (8 PM-5 AM)', midday: 'Midday (11 AM-2 PM)', 
      morning: 'Morning (8-11 AM)', afternoon: 'Afternoon (2-5 PM)',
      early: 'Early Morning (5-8 AM)', evening: 'Evening (5-8 PM)'
    };
    
    const resultHTML = `
      <div class="bg-broder p-4 md:p-6 rounded-lg border-l-4 border-primary">
        <h3 class="text-xl text-primary mb-4 flex items-center gap-2"><span class="material-icons">timer</span> Wait Time Prediction</h3>
        <div class="grid gap-4 text-text text-sm md:text-base">
          <div class="bg-dark p-4 rounded border-2 border-primary">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-primary">schedule</span><strong>Estimated Wait Time:</strong></div>
            <p class="text-3xl text-primary font-bold ml-8">${sanitizeText(predictedWait)} minutes</p>
            <p class="text-sm text-light ml-8">Range: ${sanitizeText(minWait)}-${sanitizeText(maxWait)} minutes</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">traffic</span><strong>Congestion Level:</strong></div>
            <p class="text-2xl ${sanitizeText(congestionColor)} font-bold ml-8">${sanitizeText(congestionLevel)}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">analytics</span><strong>Queue Analysis:</strong></div>
            <ul class="ml-8 space-y-1 text-sm">
              <li>Cars in queue: ${sanitizeText(carsInQueue)}</li>
              <li>Available pumps: ${sanitizeText(numPumps)}</li>
              <li>Avg service time: ${sanitizeText(avgServiceTime)} min/car</li>
              <li>Queue efficiency: ${((numPumps / Math.max(carsInQueue, 1)) * 100).toFixed(0)}%</li>
            </ul>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">lightbulb</span><strong>Best Times to Visit:</strong></div>
            <ul class="ml-8 space-y-1 text-sm list-disc list-inside">
              ${bestTimes.map(t => `<li>${bestTimeLabels[t]}</li>`).join('')}
            </ul>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">tips_and_updates</span><strong>Tips:</strong></div>
            <ul class="ml-8 space-y-2 list-disc list-inside text-sm">
              ${predictedWait > 10 ? '<li class="text-yellow-400">Consider visiting during off-peak hours</li>' : '<li class="text-green-400">Good time to refuel!</li>'}
              ${fuelPrice === 'low' ? '<li class="text-green-400">Great fuel prices - expect higher traffic</li>' : ''}
              ${weather !== 'clear' ? '<li class="text-yellow-400">Weather may increase wait times</li>' : ''}
              <li>Use mobile payment for faster service</li>
              <li>Avoid rush hours (7-9 AM, 5-7 PM)</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('result-content').innerHTML = resultHTML;
  });
});

