// Security utilities - Prevent XSS and code injection`nfunction sanitizeText(input) {`n    if (input === null ^|^| input === undefined) return '';`n    if (typeof input !== 'string') input = String(input);`n    const div = document.createElement('div');`n    div.textContent = input;`n    return div.innerHTML;`n}`n`n// Sustainable Travel Carbon Offset Calculator

// Emission factors (kg CO2 per passenger-mile)
const emissionFactors = {
    flight: {
        domestic: { economy: 0.18, 'premium-economy': 0.28, business: 0.54, first: 0.72 },
        'short-haul': { economy: 0.22, 'premium-economy': 0.33, business: 0.66, first: 0.88 },
        'long-haul': { economy: 0.15, 'premium-economy': 0.23, business: 0.45, first: 0.60 }
    },
    car: {
        small: 0.32, medium: 0.40, large: 0.48, suv: 0.55, hybrid: 0.22, electric: 0.12
    },
    train: 0.06,
    bus: 0.08,
    cruise: 0.35
};

// Accommodation emissions (kg CO2 per night)
const accommodationEmissions = {
    budget: 15, standard: 25, luxury: 45
};

// Offset providers and costs
const offsetProviders = {
    trees: [
        { name: "One Tree Planted", costPerTree: 1.00, co2PerTree: 22, timeframe: "10-20 years" },
        { name: "Trees for the Future", costPerTree: 0.10, co2PerTree: 16, timeframe: "5-15 years" },
        { name: "Eden Reforestation", costPerTree: 0.33, co2PerTree: 23, timeframe: "8-25 years" }
    ],
    credits: [
        { name: "Gold Standard", costPerTon: 20, type: "Renewable Energy", verification: "Third-party verified" },
        { name: "Verified Carbon Standard", costPerTon: 14, type: "Forest Conservation", verification: "VCS certified" },
        { name: "Climate Action Reserve", costPerTon: 15, type: "Methane Capture", verification: "CAR protocol" }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('carbon-calculator-form');
    const transportMode = document.getElementById('transport-mode');
    const flightOptions = document.getElementById('flight-options');
    const carOptions = document.getElementById('car-options');
    
    // Show/hide transport-specific options
    transportMode.addEventListener('change', function() {
        flightOptions.classList.add('hidden');
        carOptions.classList.add('hidden');
        
        if (this.value === 'flight') {
            flightOptions.classList.remove('hidden');
        } else if (this.value === 'car') {
            carOptions.classList.remove('hidden');
            setDefaultMPG();
        }
    });
    
    // Set default MPG based on vehicle type
    document.getElementById('vehicle-type').addEventListener('change', setDefaultMPG);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCarbonFootprint();
    });
});

function setDefaultMPG() {
    const vehicleType = document.getElementById('vehicle-type').value;
    const fuelEfficiencyInput = document.getElementById('fuel-efficiency');
    
    const defaultMPG = {
        small: 35, medium: 28, large: 22, suv: 20, hybrid: 50, electric: 120
    };
    
    if (defaultMPG[vehicleType]) {
        fuelEfficiencyInput.value = defaultMPG[vehicleType];
    }
}

function collectFormData() {
    return {
        transportMode: document.getElementById('transport-mode').value,
        tripType: document.getElementById('trip-type').value,
        distance: parseFloat(document.getElementById('distance').value),
        passengers: parseInt(document.getElementById('passengers').value),
        flightClass: document.getElementById('flight-class').value,
        flightType: document.getElementById('flight-type').value,
        vehicleType: document.getElementById('vehicle-type').value,
        fuelEfficiency: parseFloat(document.getElementById('fuel-efficiency').value) || 0,
        accommodationNights: parseInt(document.getElementById('accommodation-nights').value) || 0
    };
}

function calculateCarbonFootprint() {
    const data = collectFormData();
    
    if (!data.transportMode || !data.distance || !data.passengers) {
        showModal('Error', 'Please fill in all required fields.');
        return;
    }
    
    const results = calculateEmissions(data);
    displayResults(results, data);
}

function calculateEmissions(data) {
    let transportEmissions = 0;
    let totalDistance = data.tripType === 'round-trip' ? data.distance * 2 : data.distance;
    
    // Calculate transport emissions
    switch (data.transportMode) {
        case 'flight':
            const flightFactor = emissionFactors.flight[data.flightType][data.flightClass];
            transportEmissions = totalDistance * flightFactor * 1.9; // Radiative forcing multiplier
            break;
        case 'car':
            if (data.fuelEfficiency > 0) {
                // Custom MPG calculation
                const gallonsUsed = totalDistance / data.fuelEfficiency;
                transportEmissions = gallonsUsed * 8.89; // kg CO2 per gallon of gasoline
            } else {
                transportEmissions = totalDistance * emissionFactors.car[data.vehicleType];
            }
            transportEmissions = transportEmissions / data.passengers; // Split among passengers
            break;
        case 'train':
            transportEmissions = totalDistance * emissionFactors.train;
            break;
        case 'bus':
            transportEmissions = totalDistance * emissionFactors.bus;
            break;
        case 'cruise':
            transportEmissions = totalDistance * emissionFactors.cruise;
            break;
    }
    
    // Calculate accommodation emissions
    const accommodationEmissions = data.accommodationNights * 25; // Average hotel emissions
    
    // Total emissions
    const totalEmissions = transportEmissions + accommodationEmissions;
    const totalEmissionsTons = totalEmissions / 1000;
    
    // Calculate offset options
    const treeOffsets = offsetProviders.trees.map(provider => ({
        ...provider,
        treesNeeded: Math.ceil(totalEmissions / provider.co2PerTree),
        totalCost: Math.ceil(totalEmissions / provider.co2PerTree) * provider.costPerTree
    }));
    
    const creditOffsets = offsetProviders.credits.map(provider => ({
        ...provider,
        totalCost: totalEmissionsTons * provider.costPerTon
    }));
    
    return {
        transportEmissions,
        accommodationEmissions,
        totalEmissions,
        totalEmissionsTons,
        treeOffsets,
        creditOffsets,
        equivalents: calculateEquivalents(totalEmissions)
    };
}

function calculateEquivalents(totalEmissions) {
    return {
        carMiles: Math.round(totalEmissions / 0.4),
        gasoline: Math.round(totalEmissions / 8.89),
        coalPounds: Math.round(totalEmissions * 2.2 / 0.9),
        treesNeeded: Math.ceil(totalEmissions / 20),
        homeEnergyDays: Math.round(totalEmissions / 30)
    };
}

function displayResults(results, data) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    let html = `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">
                <span class="material-icons align-middle mr-2">eco</span>
                Your Carbon Footprint Analysis
            </h3>
            <div class="grid md:grid-cols-3 gap-4 mb-6">
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-primary">${results.totalEmissions.toFixed(1)} kg</div>
                    <div class="text-sm text-light">Total CO2 Emissions</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-accent">${results.totalEmissionsTons.toFixed(2)} tons</div>
                    <div class="text-sm text-light">CO2 Equivalent</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-light">${sanitizeText(data.passengers)}</div>
                    <div class="text-sm text-light">Passenger${data.passengers > 1 ? 's' : ''}</div>
                </div>
            </div>
        </div>
    `;
    
    // Emissions breakdown
    html += `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h4 class="text-xl font-semibold text-primary mb-4">Emissions Breakdown</h4>
            <div class="space-y-3">
                <div class="flex justify-between items-center">
                    <span class="text-light">Transportation (${sanitizeText(data.transportMode)})</span>
                    <span class="text-text font-medium">${results.transportEmissions.toFixed(1)} kg CO2</span>
                </div>
                ${results.accommodationEmissions > 0 ? `
                    <div class="flex justify-between items-center">
                        <span class="text-light">Accommodation (${data.accommodationNights} nights)</span>
                        <span class="text-text font-medium">${results.accommodationEmissions.toFixed(1)} kg CO2</span>
                    </div>
                ` : ''}
                <div class="border-t border-accent pt-2 flex justify-between items-center font-semibold">
                    <span class="text-primary">Total Emissions</span>
                    <span class="text-primary">${results.totalEmissions.toFixed(1)} kg CO2</span>
                </div>
            </div>
        </div>
    `;
    
    // Environmental equivalents
    html += `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h4 class="text-xl font-semibold text-primary mb-4">Environmental Impact Equivalents</h4>
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-dark p-3 rounded border border-accent">
                    <div class="text-accent font-medium">ðŸš— ${results.equivalents.carMiles.toLocaleString()} miles</div>
                    <div class="text-sm text-light">Driving an average car</div>
                </div>
                <div class="bg-dark p-3 rounded border border-accent">
                    <div class="text-accent font-medium">â›½ ${sanitizeText(results.equivalents.gasoline)} gallons</div>
                    <div class="text-sm text-light">Gasoline consumed</div>
                </div>
                <div class="bg-dark p-3 rounded border border-accent">
                    <div class="text-accent font-medium">ðŸŒ³ ${sanitizeText(results.equivalents.treesNeeded)} trees</div>
                    <div class="text-sm text-light">Needed to absorb this CO2</div>
                </div>
                <div class="bg-dark p-3 rounded border border-accent">
                    <div class="text-accent font-medium">ðŸ  ${sanitizeText(results.equivalents.homeEnergyDays)} days</div>
                    <div class="text-sm text-light">Average home energy use</div>
                </div>
            </div>
        </div>
    `;
    
    // Tree planting offsets
    html += `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h4 class="text-xl font-semibold text-primary mb-4">
                <span class="material-icons align-middle mr-2">park</span>
                Tree Planting Offset Options
            </h4>
            <div class="space-y-4">
                ${results.treeOffsets.map(offset => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h5 class="font-semibold text-accent">${offset.name}</h5>
                                <div class="text-sm text-light">${sanitizeText(offset.timeframe)} to maturity</div>
                            </div>
                            <div class="text-right">
                                <div class="text-lg font-bold text-primary">$${offset.totalCost.toFixed(2)}</div>
                                <div class="text-sm text-light">${sanitizeText(offset.treesNeeded)} trees</div>
                            </div>
                        </div>
                        <div class="text-sm text-light">
                            ${sanitizeText(offset.co2PerTree)} kg CO2 absorbed per tree annually â€¢ $${offset.costPerTree.toFixed(2)} per tree
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Carbon credit offsets
    html += `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h4 class="text-xl font-semibold text-primary mb-4">
                <span class="material-icons align-middle mr-2">verified</span>
                Carbon Credit Offset Options
            </h4>
            <div class="space-y-4">
                ${results.creditOffsets.map(offset => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h5 class="font-semibold text-accent">${offset.name}</h5>
                                <div class="text-sm text-light">${sanitizeText(offset.type)} â€¢ ${sanitizeText(offset.verification)}</div>
                            </div>
                            <div class="text-right">
                                <div class="text-lg font-bold text-primary">$${offset.totalCost.toFixed(2)}</div>
                                <div class="text-sm text-light">${results.totalEmissionsTons.toFixed(2)} tons CO2</div>
                            </div>
                        </div>
                        <div class="text-sm text-light">
                            $${sanitizeText(offset.costPerTon)}/ton CO2 â€¢ Immediate offset effect
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Recommendations
    function sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    html += `
        <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
            <h4 class="text-xl font-semibold text-primary mb-4">Sustainability Recommendations</h4>
            <div class="space-y-3">
                ${generateRecommendations(data, results).map(rec => `
                    <div class="flex items-start gap-3">
                        <span class="material-icons text-primary mt-1">lightbulb</span>
                        <div>
                            <div class="font-medium text-text">${sanitizeHtml(rec.title)}</div>
                            <div class="text-sm text-light">${sanitizeHtml(rec.description)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    contentDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateRecommendations(data, results) {
    const recommendations = [];
    
    if (data.transportMode === 'flight' && data.distance < 500) {
        recommendations.push({
            title: "Consider Ground Transport",
            description: `For distances under 500 miles, trains or buses produce 70-80% fewer emissions than flights.`
        });
    }
    
    if (data.transportMode === 'flight' && data.flightClass !== 'economy') {
        recommendations.push({
            title: "Choose Economy Class",
            description: `Economy class has 2-4x lower emissions per passenger than business or first class due to higher passenger density.`
        });
    }
    
    if (data.transportMode === 'car' && data.passengers === 1) {
        recommendations.push({
            title: "Share the Ride",
            description: `Carpooling with just one additional passenger cuts your per-person emissions in half.`
        });
    }
    
    if (results.totalEmissions > 1000) {
        recommendations.push({
            title: "Extend Your Stay",
            description: `Longer trips have better emissions-per-day ratios. Consider staying longer to maximize the value of your travel emissions.`
        });
    }
    
    recommendations.push({
        title: "Offset Responsibly",
        description: `Choose verified offset programs with clear additionality. Tree planting takes time to absorb CO2, while carbon credits provide immediate offset.`
    });
    
    return recommendations;
}

function showModal(title, message) {
    function sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-broder p-6 rounded-lg border border-accent max-w-md mx-4">
            <h3 class="text-xl font-bold text-primary mb-4">${sanitizeHtml(title)}</h3>
            <p class="text-light mb-6">${sanitizeHtml(message)}</p>
            <button onclick="this.closest('.fixed').remove()" class="bg-primary hover:bg-accent text-white px-4 py-2 rounded">
                OK
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}
