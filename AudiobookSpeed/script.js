// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function sanitizeAttribute(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    return input.replace(/[<>"'&]/g, (match) => {
        const entities = {'<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;'};
        return entities[match];
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('audiobook-form');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const customSpeedInput = document.getElementById('custom-speed');
    const speedButtons = document.querySelectorAll('.speed-btn');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');
    
    let selectedSpeed = null;
    
    // Handle speed button clicks
    speedButtons.forEach(button => {
        button.addEventListener('click', function() {
            speedButtons.forEach(btn => btn.classList.remove('!bg-primary', '!text-white', '!border-primary'));
            this.classList.add('!bg-primary', '!text-white', '!border-primary');
            selectedSpeed = parseFloat(this.dataset.speed);
            customSpeedInput.value = '';
        });
    });
    
    // Handle custom speed input
    customSpeedInput.addEventListener('input', function() {
        if (this.value) {
            speedButtons.forEach(btn => btn.classList.remove('!bg-primary', '!text-white', '!border-primary'));
            selectedSpeed = parseFloat(this.value);
        }
    });
    
    // Handle form submission with security validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // CSRF Protection
        if (typeof window.Security !== 'undefined') {
            const formData = new FormData(this);
            if (!window.Security.validateCSRF(formData)) {
                alert('Security token invalid. Please refresh the page.');
                return;
            }
        }
        
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        const speed = selectedSpeed || parseFloat(customSpeedInput.value);
        
        // Input validation
        if ((hours === 0 && minutes === 0 && seconds === 0) || !speed || speed <= 0 || speed > 10) {
            resultContent.innerHTML = `
                <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <div class="flex items-center gap-2 text-red-400">
                        <span class="material-icons">error</span>
                        <span class="font-medium">Please enter valid duration and speed (0.1x - 10x)</span>
                    </div>
                </div>
            `;
            resultsDiv.classList.remove('hidden');
            return;
        }
        
        const totalMinutes = (hours * 60) + minutes + (seconds / 60);
        const newTimeMinutes = totalMinutes / speed;
        const newHours = Math.floor(newTimeMinutes / 60);
        const newMins = Math.round(newTimeMinutes % 60);
        const timeSaved = totalMinutes - newTimeMinutes;
        const timeSavedHours = Math.floor(timeSaved / 60);
        const timeSavedMins = Math.round(timeSaved % 60);
        
        resultContent.innerHTML = `
            <div class="bg-broder p-6 rounded-lg border-l-4 border-primary">
                <h3 class="text-xl text-primary mb-4 flex items-center gap-2">
                    <span class="material-icons">calculate</span>
                    Calculation Results
                </h3>
                <div class="grid gap-4 text-text">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="text-light text-sm mb-1">Original Duration</div>
                        <div class="text-lg font-semibold">${sanitizeText(hours)}h ${sanitizeText(minutes)}m ${sanitizeText(seconds)}s</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="text-light text-sm mb-1">At ${sanitizeText(speed)}x Speed</div>
                        <div class="text-lg font-semibold text-primary">${sanitizeText(newHours)}h ${sanitizeText(newMins)}m</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="text-light text-sm mb-1">Time Saved</div>
                        <div class="text-lg font-semibold text-accent">${sanitizeText(timeSavedHours)}h ${sanitizeText(timeSavedMins)}m</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="text-light text-sm mb-1">Efficiency Gain</div>
                        <div class="text-lg font-semibold text-accent">${sanitizeText(Math.round(((speed - 1) * 100)))}% faster</div>
                    </div>
                </div>
            </div>
        `;
        
        resultsDiv.classList.remove('hidden');
    });
});