document.getElementById('carbon-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const attendees = parseInt(document.getElementById('attendees').value);
  const eventDuration = parseFloat(document.getElementById('eventDuration').value);
  const eventType = document.getElementById('eventType').value;
  const localAttendees = parseFloat(document.getElementById('localAttendees').value) / 100;
  const domesticAttendees = parseFloat(document.getElementById('domesticAttendees').value) / 100;
  const internationalAttendees = parseFloat(document.getElementById('internationalAttendees').value) / 100;
  const mealType = document.getElementById('mealType').value;
  const foodType = document.getElementById('foodType').value;
  const localFood = parseFloat(document.getElementById('localFood').value) / 100;
  const venueSize = parseFloat(document.getElementById('venueSize').value);
  const energySource = document.getElementById('energySource').value;
  const materials = document.getElementById('materials').value;

  // Travel emissions (kg CO2 per person)
  const localTravel = 10;      // Local travel
  const domesticTravel = 200;  // Domestic flight average
  const internationalTravel = 1000; // International flight average

  const travelEmissions = attendees * (
    localAttendees * localTravel +
    domesticAttendees * domesticTravel +
    internationalAttendees * internationalTravel
  );

  // Food emissions (kg CO2 per person per meal)
  const mealMultipliers = {
    none: 0, snacks: 0.5, lunch: 1, dinner: 1.5, multiple: 3
  };
  
  const foodMultipliers = {
    vegan: 1.5, vegetarian: 2.5, mixed: 4, meat: 6
  };

  const foodEmissions = attendees * mealMultipliers[mealType] * foodMultipliers[foodType] * (1 - localFood * 0.3);

  // Energy emissions (kg CO2 per sq ft per hour)
  const energyMultipliers = {
    renewable: 0.1, mixed: 0.3, standard: 0.5, fossil: 0.8
  };
  
  const energyEmissions = venueSize * eventDuration * energyMultipliers[energySource];

  // Materials emissions (kg CO2 per person)
  const materialMultipliers = {
    minimal: 0.5, moderate: 2, standard: 5, extensive: 12
  };
  
  const materialEmissions = attendees * materialMultipliers[materials];

  // Event type multiplier
  const eventMultipliers = {
    conference: 1.0, wedding: 1.2, concert: 1.5, corporate: 0.8, trade: 1.3, sports: 1.4
  };

  const totalEmissions = (travelEmissions + foodEmissions + energyEmissions + materialEmissions) * eventMultipliers[eventType];
  const emissionsPerPerson = totalEmissions / attendees;
  const treesNeeded = Math.ceil(totalEmissions / 22); // 22kg CO2 per tree per year

  displayResults(totalEmissions, emissionsPerPerson, treesNeeded, travelEmissions, foodEmissions, energyEmissions, materialEmissions);
});

function displayResults(total, perPerson, trees, travel, food, energy, materials) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');

  const impactLevel = total > 10000 ? 'Very High' : total > 5000 ? 'High' : total > 2000 ? 'Moderate' : 'Low';
  const impactColor = total > 10000 ? 'text-red-400' : total > 5000 ? 'text-orange-400' : total > 2000 ? 'text-yellow-400' : 'text-green-400';

  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">eco</span> Carbon Footprint Results
      </h2>
      
      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-primary text-3xl font-bold">${total.toFixed(0)}</div>
          <div class="text-light text-sm">kg CO₂ Total</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-accent text-2xl font-bold">${perPerson.toFixed(1)}</div>
          <div class="text-light text-sm">kg CO₂ per Person</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="${impactColor} text-2xl font-bold">${impactLevel}</div>
          <div class="text-light text-sm">Impact Level</div>
        </div>
      </div>

      <div class="bg-dark p-4 rounded mb-4">
        <h3 class="text-text font-medium mb-3">Emissions Breakdown</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-light">Travel:</span><span class="text-text font-medium">${travel.toFixed(0)} kg CO₂ (${((travel/total)*100).toFixed(1)}%)</span></div>
          <div class="flex justify-between"><span class="text-light">Food & Catering:</span><span class="text-text font-medium">${food.toFixed(0)} kg CO₂ (${((food/total)*100).toFixed(1)}%)</span></div>
          <div class="flex justify-between"><span class="text-light">Energy Usage:</span><span class="text-text font-medium">${energy.toFixed(0)} kg CO₂ (${((energy/total)*100).toFixed(1)}%)</span></div>
          <div class="flex justify-between"><span class="text-light">Materials:</span><span class="text-text font-medium">${materials.toFixed(0)} kg CO₂ (${((materials/total)*100).toFixed(1)}%)</span></div>
        </div>
      </div>

      <div class="bg-dark p-4 rounded mb-4 text-center">
        <div class="text-green-400 text-2xl font-bold">${trees}</div>
        <div class="text-light text-sm">Trees needed to offset (1 year)</div>
      </div>
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>🌱 Reduction Strategies:</strong>
        <ul class="mt-2 space-y-1 text-light">
          <li>• Encourage virtual attendance options</li>
          <li>• Choose venues with renewable energy</li>
          <li>• Offer plant-based catering options</li>
          <li>• Use digital materials instead of printed</li>
          <li>• Partner with local suppliers</li>
          <li>• Purchase verified carbon offsets</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}