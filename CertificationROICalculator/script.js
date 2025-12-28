// Certification ROI Calculator Logic

// Certification data with salary multipliers and market demand
const certificationData = {
    'aws-solutions-architect': {
        name: 'AWS Solutions Architect',
        salaryMultiplier: 1.25,
        demandScore: 9.5,
        averageCost: 2500,
        studyHours: 200,
        industryBonus: { technology: 1.3, finance: 1.2, healthcare: 1.15, consulting: 1.25 }
    },
    'aws-developer': {
        name: 'AWS Developer',
        salaryMultiplier: 1.20,
        demandScore: 9.0,
        averageCost: 2000,
        studyHours: 150,
        industryBonus: { technology: 1.25, finance: 1.15, healthcare: 1.1, consulting: 1.2 }
    },
    'aws-sysops': {
        name: 'AWS SysOps Administrator',
        salaryMultiplier: 1.18,
        demandScore: 8.5,
        averageCost: 1800,
        studyHours: 140,
        industryBonus: { technology: 1.2, finance: 1.1, healthcare: 1.05, consulting: 1.15 }
    },
    'pmp': {
        name: 'Project Management Professional (PMP)',
        salaryMultiplier: 1.15,
        demandScore: 8.8,
        averageCost: 3000,
        studyHours: 250,
        industryBonus: { technology: 1.15, finance: 1.2, healthcare: 1.18, consulting: 1.25, manufacturing: 1.2 }
    },
    'cpa': {
        name: 'Certified Public Accountant (CPA)',
        salaryMultiplier: 1.30,
        demandScore: 9.2,
        averageCost: 4000,
        studyHours: 400,
        industryBonus: { finance: 1.4, technology: 1.1, healthcare: 1.15, government: 1.25 }
    },
    'google-cloud-architect': {
        name: 'Google Cloud Architect',
        salaryMultiplier: 1.22,
        demandScore: 8.8,
        averageCost: 2200,
        studyHours: 180,
        industryBonus: { technology: 1.28, finance: 1.18, healthcare: 1.12, consulting: 1.22 }
    },
    'azure-solutions-architect': {
        name: 'Azure Solutions Architect',
        salaryMultiplier: 1.24,
        demandScore: 9.0,
        averageCost: 2400,
        studyHours: 190,
        industryBonus: { technology: 1.27, finance: 1.2, healthcare: 1.15, consulting: 1.23 }
    },
    'cissp': {
        name: 'CISSP Security',
        salaryMultiplier: 1.28,
        demandScore: 9.3,
        averageCost: 3500,
        studyHours: 300,
        industryBonus: { technology: 1.3, finance: 1.35, healthcare: 1.25, government: 1.4 }
    },
    'scrum-master': {
        name: 'Certified Scrum Master',
        salaryMultiplier: 1.12,
        demandScore: 8.0,
        averageCost: 1500,
        studyHours: 80,
        industryBonus: { technology: 1.18, finance: 1.1, healthcare: 1.08, consulting: 1.15 }
    },
    'six-sigma': {
        name: 'Six Sigma Black Belt',
        salaryMultiplier: 1.20,
        demandScore: 7.8,
        averageCost: 3200,
        studyHours: 220,
        industryBonus: { manufacturing: 1.35, healthcare: 1.25, finance: 1.15, technology: 1.1 }
    },
    'cfa': {
        name: 'Chartered Financial Analyst (CFA)',
        salaryMultiplier: 1.35,
        demandScore: 9.0,
        averageCost: 5000,
        studyHours: 500,
        industryBonus: { finance: 1.5, technology: 1.1, consulting: 1.2 }
    },
    'frm': {
        name: 'Financial Risk Manager (FRM)',
        salaryMultiplier: 1.25,
        demandScore: 8.5,
        averageCost: 3800,
        studyHours: 350,
        industryBonus: { finance: 1.4, technology: 1.15, consulting: 1.18 }
    },
    'other': {
        name: 'Other Certification',
        salaryMultiplier: 1.10,
        demandScore: 7.0,
        averageCost: 2000,
        studyHours: 150,
        industryBonus: { technology: 1.1, finance: 1.1, healthcare: 1.1, consulting: 1.1 }
    }
};

// Geographic location multipliers
const locationMultipliers = {
    'san-francisco': 1.45,
    'new-york': 1.35,
    'seattle': 1.30,
    'boston': 1.25,
    'washington-dc': 1.22,
    'chicago': 1.15,
    'austin': 1.18,
    'denver': 1.12,
    'atlanta': 1.10,
    'other-major': 1.05,
    'mid-tier': 0.95,
    'small-city': 0.85
};

// Experience level multipliers
const experienceMultipliers = {
    '0-2': 0.9,
    '3-5': 1.0,
    '6-10': 1.15,
    '11-15': 1.25,
    '16+': 1.30
};

// Company size multipliers
const companySizeMultipliers = {
    'startup': 0.95,
    'small': 1.0,
    'medium': 1.08,
    'large': 1.15,
    'enterprise': 1.25
};

// Form submission handler
document.getElementById('certification-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = collectFormData();
    if (validateFormData(formData)) {
        const results = calculateCertificationROI(formData);
        displayResults(results);
    }
});

// Collect form data
function collectFormData() {
    return {
        certificationType: document.getElementById('certification-type').value,
        industry: document.getElementById('industry').value,
        currentSalary: parseFloat(document.getElementById('current-salary').value),
        experienceYears: document.getElementById('experience-years').value,
        location: document.getElementById('location').value,
        companySize: document.getElementById('company-size').value,
        certificationCost: parseFloat(document.getElementById('certification-cost').value),
        studyHours: parseFloat(document.getElementById('study-hours').value),
        hourlyRate: parseFloat(document.getElementById('hourly-rate').value)
    };
}

// Validate form data
function validateFormData(data) {
    if (!data.certificationType || !data.industry || !data.currentSalary || 
        !data.experienceYears || !data.location || !data.companySize || 
        !data.certificationCost || !data.studyHours) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (data.currentSalary < 20000 || data.currentSalary > 500000) {
        alert('Please enter a realistic salary between $20,000 and $500,000.');
        return false;
    }
    
    if (data.certificationCost < 100 || data.certificationCost > 20000) {
        alert('Please enter a realistic certification cost between $100 and $20,000.');
        return false;
    }
    
    return true;
}

// Calculate certification ROI
function calculateCertificationROI(data) {
    const cert = certificationData[data.certificationType];
    
    // Base salary increase calculation
    let salaryIncrease = data.currentSalary * (cert.salaryMultiplier - 1);
    
    // Apply multipliers
    const locationMultiplier = locationMultipliers[data.location] || 1.0;
    const experienceMultiplier = experienceMultipliers[data.experienceYears] || 1.0;
    const companySizeMultiplier = companySizeMultipliers[data.companySize] || 1.0;
    const industryBonus = cert.industryBonus[data.industry] || 1.0;
    
    // Adjusted salary increase
    salaryIncrease = salaryIncrease * locationMultiplier * experienceMultiplier * 
                    companySizeMultiplier * industryBonus;
    
    // Total investment calculation
    const opportunityCost = data.studyHours * data.hourlyRate;
    const totalInvestment = data.certificationCost + opportunityCost;
    
    // New salary and financial projections
    const newSalary = data.currentSalary + salaryIncrease;
    const monthlyIncrease = salaryIncrease / 12;
    
    // Payback period (months)
    const paybackMonths = totalInvestment / monthlyIncrease;
    
    // 5-year projections
    const fiveYearIncrease = salaryIncrease * 5;
    const fiveYearROI = ((fiveYearIncrease - totalInvestment) / totalInvestment) * 100;
    
    // Job opportunity increase estimate
    const jobOpportunityIncrease = Math.min(cert.demandScore * 5, 45);
    
    // Recommendation logic
    let recommendation = '';
    let recommendationClass = '';
    
    if (fiveYearROI > 200 && paybackMonths < 18) {
        recommendation = 'Excellent Investment - High ROI with quick payback';
        recommendationClass = 'text-green-400';
    } else if (fiveYearROI > 100 && paybackMonths < 30) {
        recommendation = 'Good Investment - Solid returns expected';
        recommendationClass = 'text-yellow-400';
    } else if (fiveYearROI > 50) {
        recommendation = 'Moderate Investment - Consider timing and alternatives';
        recommendationClass = 'text-orange-400';
    } else {
        recommendation = 'Questionable Investment - Explore other options';
        recommendationClass = 'text-red-400';
    }
    
    return {
        certificationName: cert.name,
        currentSalary: data.currentSalary,
        newSalary: newSalary,
        salaryIncrease: salaryIncrease,
        monthlyIncrease: monthlyIncrease,
        totalInvestment: totalInvestment,
        certificationCost: data.certificationCost,
        opportunityCost: opportunityCost,
        paybackMonths: paybackMonths,
        fiveYearIncrease: fiveYearIncrease,
        fiveYearROI: fiveYearROI,
        jobOpportunityIncrease: jobOpportunityIncrease,
        demandScore: cert.demandScore,
        recommendation: recommendation,
        recommendationClass: recommendationClass,
        multipliers: {
            location: locationMultiplier,
            experience: experienceMultiplier,
            companySize: companySizeMultiplier,
            industry: industryBonus
        }
    };
}

// Display results
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('result-content');
    
    contentDiv.innerHTML = `
        <div class="bg-broder rounded-lg p-6 border border-accent mb-6">
            <h3 class="text-2xl font-bold text-primary mb-4">ROI Analysis: ${results.certificationName}</h3>
            
            <!-- Key Metrics -->
            <div class="grid md:grid-cols-3 gap-6 mb-6">
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-primary">$${Math.round(results.salaryIncrease).toLocaleString()}</div>
                    <div class="text-sm text-light">Annual Salary Increase</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-accent">${Math.round(results.paybackMonths)} months</div>
                    <div class="text-sm text-light">Payback Period</div>
                </div>
                <div class="bg-dark p-4 rounded border border-accent text-center">
                    <div class="text-2xl font-bold text-green-400">${Math.round(results.fiveYearROI)}%</div>
                    <div class="text-sm text-light">5-Year ROI</div>
                </div>
            </div>
            
            <!-- Recommendation -->
            <div class="bg-primary/10 border-l-4 border-primary p-6 mb-6">
                <h4 class="font-semibold text-primary mb-2">Investment Recommendation</h4>
                <p class="text-lg ${results.recommendationClass}">${results.recommendation}</p>
            </div>
            
            <!-- Detailed Breakdown -->
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-dark p-4 rounded border border-accent">
                    <h4 class="font-semibold text-accent mb-3">Financial Impact</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-light">Current Salary:</span>
                            <span class="text-text">$${results.currentSalary.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Projected New Salary:</span>
                            <span class="text-text">$${Math.round(results.newSalary).toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Monthly Increase:</span>
                            <span class="text-primary">$${Math.round(results.monthlyIncrease).toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">5-Year Total Increase:</span>
                            <span class="text-green-400">$${Math.round(results.fiveYearIncrease).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-dark p-4 rounded border border-accent">
                    <h4 class="font-semibold text-accent mb-3">Investment Breakdown</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-light">Certification Cost:</span>
                            <span class="text-text">$${results.certificationCost.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Opportunity Cost (Time):</span>
                            <span class="text-text">$${Math.round(results.opportunityCost).toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Total Investment:</span>
                            <span class="text-primary">$${Math.round(results.totalInvestment).toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-light">Market Demand Score:</span>
                            <span class="text-accent">${results.demandScore}/10</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Multiplier Analysis -->
            <div class="mt-6 bg-dark p-4 rounded border border-accent">
                <h4 class="font-semibold text-accent mb-3">Adjustment Factors Applied</h4>
                <div class="grid md:grid-cols-4 gap-4 text-sm">
                    <div class="text-center">
                        <div class="text-lg font-bold text-primary">${(results.multipliers.location * 100).toFixed(0)}%</div>
                        <div class="text-light">Location</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-primary">${(results.multipliers.experience * 100).toFixed(0)}%</div>
                        <div class="text-light">Experience</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-primary">${(results.multipliers.companySize * 100).toFixed(0)}%</div>
                        <div class="text-light">Company Size</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-primary">${(results.multipliers.industry * 100).toFixed(0)}%</div>
                        <div class="text-light">Industry Bonus</div>
                    </div>
                </div>
            </div>
            
            <!-- Additional Insights -->
            <div class="mt-6 bg-dark p-4 rounded border border-accent">
                <h4 class="font-semibold text-accent mb-3">Additional Benefits</h4>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-light">Job Opportunities Increase:</span>
                        <span class="text-primary ml-2">+${Math.round(results.jobOpportunityIncrease)}%</span>
                    </div>
                    <div>
                        <span class="text-light">Career Advancement:</span>
                        <span class="text-accent ml-2">Enhanced prospects</span>
                    </div>
                    <div>
                        <span class="text-light">Job Security:</span>
                        <span class="text-green-400 ml-2">Improved marketability</span>
                    </div>
                    <div>
                        <span class="text-light">Professional Network:</span>
                        <span class="text-yellow-400 ml-2">Industry connections</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Load footer component
fetch('../src/components/Footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    })
    .catch(error => console.log('Footer loading failed:', error));