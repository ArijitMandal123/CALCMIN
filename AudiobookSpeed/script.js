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
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        const speed = selectedSpeed || parseFloat(customSpeedInput.value);
        
        if ((hours === 0 && minutes === 0 && seconds === 0) || !speed || speed <= 0) {
            resultContent.innerHTML = `
                <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <div class="flex items-center gap-2 text-red-400">
                        <span class="material-icons">error</span>
                        <span class="font-medium">Please enter duration and select a valid speed</span>
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
            <div class="bg-card p-6 rounded-lg border-l-4 border-primary">
                <h3 class="text-xl text-primary mb-4">Results</h3>
                <div class="grid gap-3 text-text">
                    <div><strong>Original Duration:</strong> ${hours}h ${minutes}m ${seconds}s</div>
                    <div><strong>At ${speed}x Speed:</strong> ${newHours}h ${newMins}m</div>
                    <div class="text-accent"><strong>Time Saved:</strong> ${timeSavedHours}h ${timeSavedMins}m</div>
                </div>
            </div>
        `;
        
        resultsDiv.classList.remove('hidden');
    });
});