// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`ndocument.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('dosage-form');
  const easyModeBtn = document.getElementById('easyMode');
  const advancedModeBtn = document.getElementById('advancedMode');
  const easyFields = document.getElementById('easyFields');
  const advancedFields = document.getElementById('advancedFields');
  
  easyModeBtn.addEventListener('click', () => {
    easyModeBtn.classList.add('bg-primary', 'text-white', 'border-primary');
    easyModeBtn.classList.remove('bg-broder', 'text-text', 'border-accent');
    advancedModeBtn.classList.remove('bg-primary', 'text-white', 'border-primary');
    advancedModeBtn.classList.add('bg-broder', 'text-text', 'border-accent');
    easyFields.classList.remove('hidden');
    advancedFields.classList.add('hidden');
  });
  
  advancedModeBtn.addEventListener('click', () => {
    advancedModeBtn.classList.add('bg-primary', 'text-white', 'border-primary');
    advancedModeBtn.classList.remove('bg-broder', 'text-text', 'border-accent');
    easyModeBtn.classList.remove('bg-primary', 'text-white', 'border-primary');
    easyModeBtn.classList.add('bg-broder', 'text-text', 'border-accent');
    advancedFields.classList.remove('hidden');
    easyFields.classList.add('hidden');
  });
  
  const dosageData = {
    dog: {
      benadryl: { min: 0.9, max: 1.8, unit: 'mg', name: 'Benadryl (Diphenhydramine)', notes: 'For allergies, anxiety' },
      aspirin: { min: 5, max: 10, unit: 'mg', name: 'Aspirin', notes: 'For pain relief (use with caution)' },
      pepcid: { min: 0.25, max: 0.5, unit: 'mg', name: 'Pepcid (Famotidine)', notes: 'For stomach upset' },
      imodium: { min: 0.08, max: 0.08, unit: 'mg', name: 'Imodium (Loperamide)', notes: 'For diarrhea (avoid in some breeds)' },
      melatonin: { min: 1, max: 6, unit: 'mg', name: 'Melatonin', notes: 'For anxiety, sleep (dose varies by size)' }
    },
    cat: {
      benadryl: { min: 0.5, max: 1, unit: 'mg', name: 'Benadryl (Diphenhydramine)', notes: 'For allergies (use with caution)' },
      aspirin: { min: 0, max: 0, unit: 'mg', name: 'Aspirin', notes: 'NOT RECOMMENDED for cats - toxic' },
      pepcid: { min: 0.25, max: 0.5, unit: 'mg', name: 'Pepcid (Famotidine)', notes: 'For stomach upset' },
      imodium: { min: 0, max: 0, unit: 'mg', name: 'Imodium (Loperamide)', notes: 'NOT RECOMMENDED for cats' },
      melatonin: { min: 0.5, max: 1.5, unit: 'mg', name: 'Melatonin', notes: 'For anxiety (limited research)' }
    }
  };
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isEasyMode = !easyFields.classList.contains('hidden');
    const species = isEasyMode ? document.getElementById('species').value : document.getElementById('speciesAdv').value;
    const weight = isEasyMode ? parseFloat(document.getElementById('weight').value) : parseFloat(document.getElementById('weightAdv').value);
    const medication = isEasyMode ? document.getElementById('medication').value : document.getElementById('medicationAdv').value;
    const frequency = isEasyMode ? 'asneeded' : document.getElementById('frequencyAdv').value;
    
    if (!species || !weight || !medication) {
      const resultHTML = `
        <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div class="flex items-center gap-2 text-red-400">
            <span class="material-icons">error</span>
            <span class="font-medium">Please fill in all required fields</span>
          </div>
        </div>
      `;
      document.getElementById('results').classList.remove('hidden');
      document.getElementById('result-content').innerHTML = resultHTML;
      return;
    }
    
    const age = !isEasyMode ? parseFloat(document.getElementById('age').value) || 0 : 0;
    const healthStatus = !isEasyMode ? document.getElementById('healthStatus').value : 'healthy';
    const concentration = !isEasyMode ? parseFloat(document.getElementById('concentration').value) || 0 : 0;
    const formType = !isEasyMode ? document.getElementById('formType').value : 'tablet';
    const duration = !isEasyMode ? parseFloat(document.getElementById('duration').value) || 0 : 0;
    
    const medData = dosageData[species][medication];
    const minDose = (medData.min * weight).toFixed(2);
    const maxDose = (medData.max * weight).toFixed(2);
    
    const frequencyText = {
      once: 'Once daily',
      twice: 'Twice daily (every 12 hours)',
      three: 'Three times daily (every 8 hours)',
      asneeded: 'As needed (max frequency per vet)'
    };
    
    if (medData.max === 0) {
      const resultHTML = `
        <div class="bg-red-900/30 p-4 md:p-6 rounded-lg border-l-4 border-red-500">
          <h3 class="text-xl text-red-400 mb-4 flex items-center gap-2"><span class="material-icons">warning</span> âš ï¸ NOT SAFE</h3>
          <div class="text-text text-sm md:text-base">
            <p class="text-lg font-bold mb-3">${sanitizeText(medData.name)} is NOT RECOMMENDED for ${sanitizeText(species)}s</p>
            <p class="mb-3">${sanitizeText(medData.notes)}</p>
            <p class="text-red-400 font-bold">DO NOT administer this medication. Contact your veterinarian immediately for safe alternatives.</p>
          </div>
        </div>
      `;
      document.getElementById('results').classList.remove('hidden');
      document.getElementById('result-content').innerHTML = resultHTML;
      return;
    }
    
    const healthAdjustment = healthStatus === 'senior' ? 0.8 : healthStatus === 'kidney' || healthStatus === 'liver' ? 0.7 : 1.0;
    const adjustedMinDose = (parseFloat(minDose) * healthAdjustment).toFixed(2);
    const adjustedMaxDose = (parseFloat(maxDose) * healthAdjustment).toFixed(2);
    
    const tabletsNeeded = concentration > 0 ? (parseFloat(adjustedMaxDose) / concentration).toFixed(2) : 'N/A';
    const totalDoses = duration > 0 && frequency !== 'asneeded' ? duration * (frequency === 'once' ? 1 : frequency === 'twice' ? 2 : 3) : 'N/A';
    
    const resultHTML = `
      <div class="bg-broder p-4 md:p-6 rounded-lg border-l-4 border-primary">
        <h3 class="text-xl text-primary mb-4 flex items-center gap-2"><span class="material-icons">medication</span> Dosage Recommendation</h3>
        <div class="grid gap-4 text-text text-sm md:text-base">
          <div class="bg-dark p-4 rounded border-2 border-primary">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-primary">science</span><strong>Recommended Dose:</strong></div>
            <p class="text-3xl text-primary font-bold ml-8">${sanitizeText(adjustedMinDose)} - ${sanitizeText(adjustedMaxDose)} ${sanitizeText(medData.unit)}</p>
            <p class="text-sm text-light ml-8">Per dose for ${sanitizeText(weight)} lbs ${sanitizeText(species)}</p>
            ${!isEasyMode && healthStatus !== 'healthy' ? `<p class="text-sm text-yellow-400 ml-8">Adjusted for ${healthStatus} condition</p>` : ''}
          </div>
          
          ${!isEasyMode && frequency ? `<div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">schedule</span><strong>Frequency:</strong></div>
            <p class="text-xl text-accent ml-8">${frequencyText[frequency]}</p>
          </div>` : ''}
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">info</span><strong>Medication Info:</strong></div>
            <ul class="ml-8 space-y-1 text-sm">
              <li><strong>Medication:</strong> ${sanitizeText(medData.name)}</li>
              <li><strong>Purpose:</strong> ${sanitizeText(medData.notes)}</li>
              <li><strong>Species:</strong> ${species.charAt(0).toUpperCase() + species.slice(1)}</li>
              ${!isEasyMode && age > 0 ? `<li><strong>Age:</strong> ${age} years</li>` : ''}
              ${!isEasyMode && formType ? `<li><strong>Form:</strong> ${formType.charAt(0).toUpperCase() + formType.slice(1)}</li>` : ''}
            </ul>
          </div>
          
          ${!isEasyMode && concentration > 0 ? `<div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">calculate</span><strong>Dosing Calculation:</strong></div>
            <ul class="ml-8 space-y-1 text-sm">
              <li><strong>Tablet/Capsule strength:</strong> ${concentration} mg</li>
              <li><strong>Tablets needed per dose:</strong> ${sanitizeText(tabletsNeeded)}</li>
              ${totalDoses !== 'N/A' ? `<li><strong>Total doses for ${duration} days:</strong> ${sanitizeText(totalDoses)}</li>` : ''}
            </ul>
          </div>` : ''}
          
          <div class="bg-accent/20 border border-accent rounded p-4">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">warning</span><strong>âš ï¸ Important Safety Information:</strong></div>
            <ul class="ml-8 space-y-2 list-disc list-inside text-sm">
              <li><strong>Always consult your veterinarian</strong> before giving any medication</li>
              <li>Start with the lower dose and monitor your pet</li>
              <li>Never exceed the maximum recommended dose</li>
              <li>Watch for side effects: vomiting, diarrhea, lethargy, or unusual behavior</li>
              <li>Keep all medications out of reach of pets</li>
              <li>This is for informational purposes only - not veterinary advice</li>
            </ul>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">call</span><strong>When to Contact Your Vet:</strong></div>
            <ul class="ml-8 space-y-1 text-sm list-disc list-inside">
              <li>Symptoms persist or worsen after 24-48 hours</li>
              <li>Your pet shows adverse reactions</li>
              <li>You're unsure about the dosage or medication</li>
              <li>Your pet has pre-existing health conditions</li>
              <li>Emergency: Call immediately if overdose suspected</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('result-content').innerHTML = resultHTML;
  });
});

