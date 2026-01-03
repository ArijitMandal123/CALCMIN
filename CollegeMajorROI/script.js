// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('roi-form');
  const resultsDiv = document.getElementById('results');
  const resultContent = document.getElementById('result-content');
  const majorSelect = document.getElementById('major');
  const degreeSelect = document.getElementById('degreeLevel');
  const schoolSelect = document.getElementById('schoolType');

  // Auto-populate fields based on major selection
  majorSelect.addEventListener('change', function() {
    const majorData = getMajorData(this.value);
    if (majorData) {
      document.getElementById('startingSalary').value = majorData.startingSalary;
      document.getElementById('midCareerSalary').value = majorData.midCareerSalary;
      document.getElementById('employmentRate').value = majorData.employmentRate;
      document.getElementById('jobGrowth').value = majorData.jobGrowth;
    }
  });

  // Auto-populate tuition based on school type
  schoolSelect.addEventListener('change', function() {
    const tuitionData = getTuitionData(this.value);
    if (tuitionData) {
      document.getElementById('annualTuition').value = tuitionData.tuition;
      document.getElementById('livingExpenses').value = tuitionData.living;
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateROI();
  });

  function getMajorData(major) {
    const majors = {
      'computer-science': { startingSalary: 75000, midCareerSalary: 120000, employmentRate: 95, jobGrowth: 22 },
      'engineering': { startingSalary: 70000, midCareerSalary: 110000, employmentRate: 90, jobGrowth: 8 },
      'business': { startingSalary: 55000, midCareerSalary: 85000, employmentRate: 85, jobGrowth: 5 },
      'nursing': { startingSalary: 60000, midCareerSalary: 80000, employmentRate: 95, jobGrowth: 15 },
      'finance': { startingSalary: 65000, midCareerSalary: 95000, employmentRate: 80, jobGrowth: 5 },
      'accounting': { startingSalary: 50000, midCareerSalary: 75000, employmentRate: 85, jobGrowth: 4 },
      'marketing': { startingSalary: 45000, midCareerSalary: 70000, employmentRate: 75, jobGrowth: 6 },
      'psychology': { startingSalary: 40000, midCareerSalary: 65000, employmentRate: 70, jobGrowth: 3 },
      'education': { startingSalary: 42000, midCareerSalary: 58000, employmentRate: 80, jobGrowth: 4 },
      'biology': { startingSalary: 45000, midCareerSalary: 70000, employmentRate: 75, jobGrowth: 5 },
      'english': { startingSalary: 38000, midCareerSalary: 55000, employmentRate: 65, jobGrowth: 2 },
      'history': { startingSalary: 36000, midCareerSalary: 52000, employmentRate: 60, jobGrowth: 1 },
      'art': { startingSalary: 32000, midCareerSalary: 48000, employmentRate: 55, jobGrowth: 1 },
      'communications': { startingSalary: 40000, midCareerSalary: 60000, employmentRate: 70, jobGrowth: 3 },
      'criminal-justice': { startingSalary: 42000, midCareerSalary: 65000, employmentRate: 75, jobGrowth: 5 },
      'social-work': { startingSalary: 38000, midCareerSalary: 55000, employmentRate: 80, jobGrowth: 7 }
    };
    return majors[major];
  }

  function getTuitionData(schoolType) {
    const tuition = {
      'public-instate': { tuition: 12000, living: 12000 },
      'public-outstate': { tuition: 28000, living: 12000 },
      'private': { tuition: 45000, living: 15000 },
      'community': { tuition: 4000, living: 10000 }
    };
    return tuition[schoolType];
  }

  function calculateROI() {
    const formData = {
      major: document.getElementById('major').value,
      degreeLevel: document.getElementById('degreeLevel').value,
      schoolType: document.getElementById('schoolType').value,
      annualTuition: parseFloat(document.getElementById('annualTuition').value) || 0,
      livingExpenses: parseFloat(document.getElementById('livingExpenses').value) || 0,
      scholarships: parseFloat(document.getElementById('scholarships').value) || 0,
      workStudy: parseFloat(document.getElementById('workStudy').value) || 0,
      startingSalary: parseFloat(document.getElementById('startingSalary').value) || 0,
      midCareerSalary: parseFloat(document.getElementById('midCareerSalary').value) || 0,
      employmentRate: parseFloat(document.getElementById('employmentRate').value) || 85,
      jobGrowth: parseFloat(document.getElementById('jobGrowth').value) || 5,
      alternativeIncome: parseFloat(document.getElementById('alternativeIncome').value) || 35000,
      opportunityCost: document.getElementById('opportunityCost').value
    };

    const analysis = performROIAnalysis(formData);
    displayResults(analysis, formData);
  }

  function performROIAnalysis(data) {
    // Determine years to complete degree
    const degreeYears = {
      'associates': 2,
      'bachelors': 4,
      'masters': 6,
      'doctorate': 8
    };
    const yearsInSchool = degreeYears[data.degreeLevel] || 4;

    // Calculate total education costs
    const annualNetCost = data.annualTuition + data.livingExpenses - data.scholarships - data.workStudy;
    const totalEducationCost = annualNetCost * yearsInSchool;

    // Calculate opportunity cost
    const opportunityCostTotal = data.opportunityCost === 'yes' ? 
      data.alternativeIncome * yearsInSchool : 0;

    const totalInvestment = totalEducationCost + opportunityCostTotal;

    // Calculate career earnings (30-year projection)
    const careerYears = 30;
    const adjustedStartingSalary = data.startingSalary * (data.employmentRate / 100);
    const adjustedMidCareerSalary = data.midCareerSalary * (data.employmentRate / 100);
    
    // Calculate lifetime earnings with degree
    let totalEarningsWithDegree = 0;
    for (let year = 1; year <= careerYears; year++) {
      const progress = year / careerYears;
      const salary = adjustedStartingSalary + (adjustedMidCareerSalary - adjustedStartingSalary) * progress;
      totalEarningsWithDegree += salary;
    }

    // Calculate lifetime earnings without degree
    const totalEarningsWithoutDegree = data.alternativeIncome * (careerYears + yearsInSchool);

    // Calculate net benefit and ROI
    const netBenefit = totalEarningsWithDegree - totalEarningsWithoutDegree - totalEducationCost;
    const roi = ((totalEarningsWithDegree - totalEarningsWithoutDegree - totalInvestment) / totalInvestment) * 100;

    // Calculate payback period
    let paybackYears = 0;
    let cumulativeReturn = 0;
    const annualBenefit = (totalEarningsWithDegree / careerYears) - data.alternativeIncome;
    
    if (annualBenefit > 0) {
      paybackYears = totalInvestment / annualBenefit;
    }

    return {
      totalInvestment,
      totalEducationCost,
      opportunityCostTotal,
      totalEarningsWithDegree,
      totalEarningsWithoutDegree,
      netBenefit,
      roi,
      paybackYears,
      yearsInSchool,
      annualBenefit,
      adjustedStartingSalary,
      adjustedMidCareerSalary
    };
  }

  function displayResults(analysis, formData) {
    const roiColor = analysis.roi >= 200 ? 'text-green-400' : 
                     analysis.roi >= 100 ? 'text-yellow-400' : 'text-red-400';
    
    const paybackColor = analysis.paybackYears <= 10 ? 'text-green-400' : 
                         analysis.paybackYears <= 15 ? 'text-yellow-400' : 'text-red-400';

    const majorName = formData.major.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

    resultContent.innerHTML = `
      <div class="bg-broder p-6 rounded-lg border border-accent">
        <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
          <span class="material-icons text-primary">school</span> 
          ${sanitizeText(majorName)} ROI Analysis
        </h3>
        
        <div class="grid md:grid-cols-3 gap-4 mb-6">
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold ${sanitizeText(roiColor)}">${analysis.roi.toFixed(0)}%</div>
            <div class="text-sm text-light">30-Year ROI</div>
          </div>
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold ${sanitizeText(paybackColor)}">${analysis.paybackYears.toFixed(1)}</div>
            <div class="text-sm text-light">Payback Years</div>
          </div>
          <div class="bg-dark p-4 rounded border border-accent text-center">
            <div class="text-2xl font-bold text-primary">$${(analysis.netBenefit/1000).toFixed(0)}K</div>
            <div class="text-sm text-light">Net Lifetime Benefit</div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-lg font-medium mb-3 text-text">Investment Breakdown</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-light">Education Costs:</span>
                <span class="text-text">$${analysis.totalEducationCost.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Opportunity Cost:</span>
                <span class="text-text">$${analysis.opportunityCostTotal.toLocaleString()}</span>
              </div>
              <div class="flex justify-between border-t border-accent pt-2 font-medium">
                <span class="text-light">Total Investment:</span>
                <span class="text-text">$${analysis.totalInvestment.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Years in School:</span>
                <span class="text-text">${sanitizeText(analysis.yearsInSchool)} years</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-medium mb-3 text-text">Career Projections</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-light">Starting Salary:</span>
                <span class="text-text">$${analysis.adjustedStartingSalary.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Mid-Career Salary:</span>
                <span class="text-text">$${analysis.adjustedMidCareerSalary.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Annual Benefit:</span>
                <span class="text-text">$${analysis.annualBenefit.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Employment Rate:</span>
                <span class="text-text">${sanitizeText(formData.employmentRate)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Lifetime Earnings Comparison</h4>
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div class="p-3 bg-dark rounded border border-accent">
              <div class="font-medium text-green-400 mb-1">With ${sanitizeText(majorName)} Degree</div>
              <div class="text-xl font-bold text-text">$${(analysis.totalEarningsWithDegree/1000000).toFixed(1)}M</div>
              <div class="text-xs text-light">30-year career earnings</div>
            </div>
            <div class="p-3 bg-dark rounded border border-accent">
              <div class="font-medium text-orange-400 mb-1">Without Degree</div>
              <div class="text-xl font-bold text-text">$${(analysis.totalEarningsWithoutDegree/1000000).toFixed(1)}M</div>
              <div class="text-xs text-light">Alternative path earnings</div>
            </div>
          </div>
        </div>

        <div class="bg-dark p-4 rounded border border-accent">
          <h4 class="text-lg font-medium mb-3 text-text">Investment Recommendation</h4>
          <div class="text-sm text-light">
            ${generateRecommendation(analysis, formData)}
          </div>
        </div>

        <div class="mt-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded text-sm text-yellow-200">
          <strong>Disclaimer:</strong> This analysis is based on average data and projections. 
          Actual results may vary significantly based on individual performance, economic conditions, 
          career choices, and market changes. Consider non-financial factors like job satisfaction and personal fulfillment.
        </div>
      </div>
    `;

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }

  function generateRecommendation(analysis, formData) {
    if (analysis.roi >= 200 && analysis.paybackYears <= 10) {
      return `<strong class="text-green-400">Excellent Investment:</strong> This major shows strong ROI with relatively quick payback. The financial case for this degree is very compelling.`;
    } else if (analysis.roi >= 100 && analysis.paybackYears <= 15) {
      return `<strong class="text-yellow-400">Good Investment:</strong> This major provides positive returns, though payback takes some time. Consider your passion for the field alongside financial factors.`;
    } else if (analysis.roi >= 50) {
      return `<strong class="text-orange-400">Moderate Investment:</strong> This major provides modest returns. Carefully weigh financial outcomes against personal interests and alternative career paths.`;
    } else if (analysis.roi >= 0) {
      return `<strong class="text-red-400">Questionable Investment:</strong> This major shows minimal financial returns. Consider if non-financial benefits justify the investment, or explore alternative education paths.`;
    } else {
      return `<strong class="text-red-400">Poor Investment:</strong> This major shows negative financial returns based on current projections. Strongly consider alternative career paths or lower-cost education options.`;
    }
  }
});
