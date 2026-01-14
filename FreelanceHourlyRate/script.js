// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('freelance-rate-form');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateHourlyRate();
    });

    function calculateHourlyRate() {
        // Collect form data
        const incomeGoal = parseFloat(document.getElementById('income-goal').value);
        const billableHours = parseFloat(document.getElementById('billable-hours').value);
        const vacationWeeks = parseFloat(document.getElementById('vacation-weeks').value);
        const sickDays = parseFloat(document.getElementById('sick-days').value);
        const nonBillableHours = parseFloat(document.getElementById('non-billable-hours').value);
        const seTaxRate = parseFloat(document.getElementById('se-tax-rate').value) / 100;
        const incomeTaxRate = parseFloat(document.getElementById('income-tax-rate').value) / 100;
        const monthlyExpenses = parseFloat(document.getElementById('business-expenses').value);
        const emergencyMonths = parseFloat(document.getElementById('emergency-months').value);

        // Calculate working parameters
        const sickWeeks = sickDays / 5; // Convert sick days to weeks
        const workingWeeks = 52 - vacationWeeks - sickWeeks;
        const totalBillableHours = workingWeeks * billableHours;
        const totalNonBillableHours = workingWeeks * nonBillableHours;
        const totalWorkingHours = totalBillableHours + totalNonBillableHours;

        // Calculate business costs
        const annualBusinessExpenses = monthlyExpenses * 12;
        const emergencyFundContribution = (incomeGoal / 12 * emergencyMonths) / 3; // Spread over 3 years

        // Calculate tax burden
        const totalTaxRate = seTaxRate + incomeTaxRate;
        const grossIncomeNeeded = incomeGoal + annualBusinessExpenses + emergencyFundContribution;
        const taxBurden = grossIncomeNeeded * totalTaxRate;
        const totalIncomeNeeded = grossIncomeNeeded + taxBurden;

        // Calculate minimum hourly rate
        const minimumHourlyRate = totalIncomeNeeded / totalBillableHours;

        // Calculate rates with profit margins
        const rate10Percent = minimumHourlyRate * 1.10;
        const rate20Percent = minimumHourlyRate * 1.20;
        const rate30Percent = minimumHourlyRate * 1.30;

        // Calculate monthly and daily equivalents
        const monthlyRevenue = (minimumHourlyRate * billableHours * 4.33); // Average weeks per month
        const dailyRate = minimumHourlyRate * 8; // 8-hour day equivalent

        // Calculate project rate recommendations
        const smallProjectRate = minimumHourlyRate * 20; // 20-hour project
        const mediumProjectRate = minimumHourlyRate * 50; // 50-hour project
        const largeProjectRate = minimumHourlyRate * 100; // 100-hour project

        // Calculate efficiency metrics
        const utilizationRate = (totalBillableHours / totalWorkingHours) * 100;
        const effectiveHourlyRate = incomeGoal / totalWorkingHours;

        // Generate recommendations
        const recommendations = generateRecommendations(minimumHourlyRate, utilizationRate, totalTaxRate);

        // Display results
        displayResults({
            incomeGoal,
            minimumHourlyRate,
            rate10Percent,
            rate20Percent,
            rate30Percent,
            monthlyRevenue,
            dailyRate,
            smallProjectRate,
            mediumProjectRate,
            largeProjectRate,
            totalBillableHours,
            workingWeeks,
            annualBusinessExpenses,
            taxBurden,
            totalIncomeNeeded,
            utilizationRate,
            effectiveHourlyRate,
            recommendations,
            billableHours,
            nonBillableHours
        });
    }

    function generateRecommendations(hourlyRate, utilizationRate, taxRate) {
        const recommendations = [];

        if (hourlyRate < 25) {
            recommendations.push("Your calculated rate is quite low. Consider specializing in a niche or developing higher-value skills.");
        }

        if (utilizationRate < 60) {
            recommendations.push("Your utilization rate is low. Try to reduce non-billable time or increase billable hours.");
        } else if (utilizationRate > 80) {
            recommendations.push("High utilization rate detected. Consider raising rates or hiring help to avoid burnout.");
        }

        if (taxRate > 0.35) {
            recommendations.push("Your tax burden is high. Consult a tax professional about deductions and business structure optimization.");
        }

        if (hourlyRate > 100) {
            recommendations.push("Your rate is in the premium range. Focus on demonstrating exceptional value and results to clients.");
        }

        recommendations.push("Consider transitioning to project-based pricing as you gain experience and can better estimate project scope.");
        recommendations.push("Review and adjust your rates annually, or when you gain significant new skills or certifications.");

        return recommendations;
    }

    function displayResults(data) {
        const rateClass = data.minimumHourlyRate >= 50 ? 'text-green-400' : 
                         data.minimumHourlyRate >= 25 ? 'text-yellow-400' : 'text-red-400';

        resultContent.innerHTML = `
            <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
                <h3 class="text-2xl font-bold text-primary mb-4">Your Freelance Rate Analysis</h3>
                
                <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
                    <div class="text-center">
                        <div class="text-4xl font-bold ${sanitizeText(rateClass)} mb-2">$${data.minimumHourlyRate.toFixed(0)}/hour</div>
                        <div class="text-lg text-light">Minimum Sustainable Rate</div>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="text-lg font-semibold text-accent mb-3">Rate Recommendations</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Minimum Rate:</span>
                                <span class="text-text font-medium">$${data.minimumHourlyRate.toFixed(0)}/hr</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">With 10% Profit:</span>
                                <span class="text-green-400 font-medium">$${data.rate10Percent.toFixed(0)}/hr</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">With 20% Profit:</span>
                                <span class="text-green-400 font-medium">$${data.rate20Percent.toFixed(0)}/hr</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">With 30% Profit:</span>
                                <span class="text-green-400 font-medium">$${data.rate30Percent.toFixed(0)}/hr</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="text-lg font-semibold text-accent mb-3">Alternative Pricing</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Daily Rate (8hrs):</span>
                                <span class="text-text font-medium">$${data.dailyRate.toFixed(0)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Monthly Revenue:</span>
                                <span class="text-text font-medium">$${data.monthlyRevenue.toFixed(0)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Utilization Rate:</span>
                                <span class="text-text font-medium">${data.utilizationRate.toFixed(1)}%</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Effective Rate:</span>
                                <span class="text-text font-medium">$${data.effectiveHourlyRate.toFixed(0)}/hr</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">$${data.smallProjectRate.toFixed(0)}</div>
                        <div class="text-sm text-light">Small Project (20hrs)</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">$${data.mediumProjectRate.toFixed(0)}</div>
                        <div class="text-sm text-light">Medium Project (50hrs)</div>
                    </div>
                    <div class="bg-dark p-4 rounded border border-accent text-center">
                        <div class="text-2xl font-bold text-accent">$${data.largeProjectRate.toFixed(0)}</div>
                        <div class="text-sm text-light">Large Project (100hrs)</div>
                    </div>
                </div>

                <div class="bg-dark p-6 rounded border border-accent mb-6">
                    <h4 class="text-lg font-semibold text-accent mb-3">Financial Breakdown</h4>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Income Goal:</span>
                                <span class="text-text">$${data.incomeGoal.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Business Expenses:</span>
                                <span class="text-text">$${data.annualBusinessExpenses.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Tax Burden:</span>
                                <span class="text-text">$${data.taxBurden.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between border-t border-accent pt-2">
                                <span class="text-light font-semibold">Total Needed:</span>
                                <span class="text-primary font-semibold">$${data.totalIncomeNeeded.toLocaleString()}</span>
                            </div>
                        </div>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-light">Working Weeks:</span>
                                <span class="text-text">${data.workingWeeks.toFixed(1)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Billable Hours/Week:</span>
                                <span class="text-text">${sanitizeText(data.billableHours)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-light">Non-Billable Hours/Week:</span>
                                <span class="text-text">${sanitizeText(data.nonBillableHours)}</span>
                            </div>
                            <div class="flex justify-between border-t border-accent pt-2">
                                <span class="text-light font-semibold">Total Billable Hours:</span>
                                <span class="text-primary font-semibold">${data.totalBillableHours.toFixed(0)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-dark p-6 rounded border border-accent">
                    <h4 class="text-lg font-semibold text-accent mb-3">Recommendations</h4>
                    <ul class="text-sm text-light space-y-2">
                        ${data.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
                    </ul>
                    
                    <div class="mt-4 p-4 bg-broder rounded border border-accent">
                        <h5 class="font-semibold text-primary mb-2">Next Steps:</h5>
                        <ol class="text-sm text-light space-y-1">
                            <li>1. Start charging at least your minimum rate for all new clients</li>
                            <li>2. Gradually transition existing clients to new rates with 30-60 days notice</li>
                            <li>3. Track your actual billable vs. non-billable time to refine calculations</li>
                            <li>4. Review and adjust rates quarterly based on demand and skill growth</li>
                            <li>5. Consider value-based or project pricing for higher-value work</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
});
