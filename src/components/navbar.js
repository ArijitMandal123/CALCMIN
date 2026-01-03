// All calculator tools data
const calculatorTools = [
  { name: "AI Prompt Quality Scorer", url: "AIPromptQualityScorer" },
  {
    name: "Content Repurposing Calculator",
    url: "ContentRepurposingCalculator",
  },
  {
    name: "LinkedIn Engagement Predictor",
    url: "LinkedInEngagementPredictor",
  },
  { name: "Hashtag ROI Calculator", url: "HashtagROICalculator" },
  { name: "Video Script Length Optimizer", url: "VideoScriptOptimizer" },
  { name: "Deep Work Block Scheduler", url: "DeepWorkScheduler" },
  { name: "Meeting ROI Calculator", url: "MeetingROICalculator" },
  { name: "Timezone Fair Meeting Finder", url: "TimezoneFairMeetingFinder" },
  {
    name: "Focus Session Sustainability Calculator",
    url: "FocusSessionSustainabilityCalculator",
  },
  {
    name: "Asynchronous Communication Audit Tool",
    url: "AsynchronousCommunicationAudit",
  },
  { name: "Tax Bracket Optimization Calculator", url: "TaxBracketOptimizer" },
  {
    name: "Recurring Subscription Savings Tracker",
    url: "SubscriptionSavingsTracker",
  },
  { name: "Salary Negotiation Calculator", url: "SalaryNegotiationCalculator" },
  { name: "Crypto Tax Loss Harvesting Calculator", url: "CryptoTaxLossHarvesting" },
  { name: "Dividend Growth Projection Calculator", url: "DividendGrowthProjection" },
  { name: "Walking Step Equivalent Calculator", url: "WalkingStepEquivalent" },
  { name: "Caffeine Dependency Recovery Timeline", url: "CaffeineDependencyRecovery" },
  { name: "Sunscreen SPF Effectiveness Calculator", url: "SunscreenSPFCalculator" },
  { name: "Sleep Debt Payback Plan Calculator", url: "SleepDebtPaybackPlan" },
  { name: "Alcohol Tolerance Reset Planner", url: "AlcoholToleranceReset" },
  { name: "Audiobook Speed Calculator", url: "AudiobookSpeed" },
  { name: "Twitch Earnings Calculator", url: "TwitchEarnings" },
  { name: "Podcast Revenue Calculator", url: "PodcastRevenue" },
  { name: "YouTube Optimizer", url: "YouTubeOptimizer" },
  { name: "Bid Optimizer Calculator", url: "BidOptimizer" },
  { name: "Business Insurance Calculator", url: "BusinessInsurance" },
  { name: "College Major ROI Calculator", url: "CollegeMajorROI" },
  { name: "Contractor vs Employee Calculator", url: "ContractorVsEmployee" },
  { name: "Coworking ROI Calculator", url: "CoworkingROI" },
  { name: "Emergency Fund Calculator", url: "EmergencyFund" },
  { name: "Financial Independence Calculator", url: "FinancialIndependence" },
  {
    name: "Freelance Profitability Calculator",
    url: "FreelanceProfitability",
  },
  { name: "Freelancer Rate Calculator", url: "FreelancerRate" },
  { name: "Online Course Pricing Calculator", url: "OnlineCoursePricing" },
  { name: "Passive Income Timeline Calculator", url: "PassiveIncomeTimeline" },
  { name: "Remote Work Tax Calculator", url: "RemoteWorkTax" },
  { name: "Subscription Audit Calculator", url: "SubscriptionAudit" },
  { name: "Vacation Rental ROI Calculator", url: "VacationRentalROI" },
  { name: "Coliving Expense Calculator", url: "ColivingExpense" },
  { name: "Dorm Room Planner Calculator", url: "DormRoomPlanner" },
  { name: "Food Waste Cost Calculator", url: "FoodWasteCost" },
  { name: "House vs Apartment Calculator", url: "HouseVsApartment" },
  { name: "Moving Box Calculator", url: "MovingBoxCalculator" },
  { name: "Van Life Budget Calculator", url: "VanLifeBudget" },
  { name: "Home Renovation Priority Sequencer", url: "HomeRenovationPrioritySequencer" },
  { name: "Rent vs Buy Calculator", url: "RentVsBuyCalculator" },
  { name: "Pet Adoption Readiness Financial Test", url: "PetAdoptionReadinessTest" },
  { name: "Interior Design Concept Feasibility Checker", url: "InteriorDesignFeasibilityChecker" },
  { name: "Moving Cost Estimator & Company Comparison", url: "MovingCostEstimator" },
  { name: "Digital Nomad Visa Feasibility Checker", url: "DigitalNomadVisa" },
  { name: "Sustainable Travel Carbon Offset Calculator", url: "SustainableTravelCarbon" },
  { name: "Staycation vs Vacation Cost Comparison", url: "StaycationVsVacation" },
  { name: "Cruise Ship ROI Calculator", url: "CruiseShipROI" },
  { name: "Expat Cost of Living Advisor", url: "ExpatCostOfLiving" },
  { name: "Freelance Hourly Rate Calculator", url: "FreelanceHourlyRate" },
  { name: "Business Breakeven Analysis Tool", url: "BusinessBreakeven" },
  { name: "Service Business Pricing Optimizer", url: "ServiceBusinessPricing" },
  { name: "Product Viability Scorer", url: "ProductViabilityScorer" },
  { name: "E-Commerce Product Profitability Calculator", url: "ECommerceProductProfitability" },
  { name: "Plastic Usage Carbon Footprint Calculator", url: "PlasticCarbonFootprint" },
  { name: "Water Usage Cost & Environmental Calculator", url: "WaterUsageCalculator" },
  { name: "Organic vs. Conventional Food Environmental Impact Analyzer", url: "OrganicFoodImpactAnalyzer" },
  { name: "Renewable Energy Feasibility Checker", url: "RenewableEnergyChecker" },
  { name: "Sustainable Shopping Impact Tracker", url: "SustainableShoppingTracker" },
  { name: "Coffee Tolerance Reset Calculator", url: "CoffeeToleranceReset" },
  {
    name: "Habit Streak Probability Calculator",
    url: "HabitStreakProbability",
  },
  { name: "Pet Adoption Readiness Calculator", url: "PetAdoptionReadiness" },
  { name: "Pet Medication Dosage Calculator", url: "PetMedicationDosage" },
  { name: "Plant Growth Light Calculator", url: "PlantGrowthLight" },
  { name: "Sleep Debt Recovery Calculator", url: "SleepDebtRecovery" },
  { name: "Workout Rest Day Calculator", url: "WorkoutRestDay" },
  { name: "EV Charging Cost Calculator", url: "EVChargingCost" },
  { name: "Event Carbon Footprint Calculator", url: "EventCarbonFootprint" },
  { name: "Fuel Station Queue Calculator", url: "FuelStationQueue" },
  { name: "Language Learning Time Calculator", url: "LanguageLearningTime" },
  { name: "LinkedIn Predictor Calculator", url: "LinkedInPredictor" },
  { name: "Social Engagement Calculator", url: "SocialEngagement" },
  { name: "Time Zone Coordinator Calculator", url: "TimeZoneCoordinator" },
  { name: "Study Material Format Optimizer", url: "StudyMaterialOptimizer" },
  { name: "Exam Score Predictor", url: "ExamScorePredictor" },
  { name: "Language Learning Timeline Calculator", url: "LanguageLearningTimelineCalculator" },
  { name: "Certification ROI Calculator", url: "CertificationROICalculator" },
  { name: "Micro-Credential Value Assessor", url: "MicroCredentialValueAssessor" },
  { name: "Gaming PC Budget Allocator", url: "GamingPCBudgetAllocator" },
  { name: "Gacha Game Spending ROI Calculator", url: "GachaGameROICalculator" },
  { name: "Game Completion Time Estimator", url: "GameCompletionTimeEstimator" },
  { name: "Speedrun Potential Analyzer", url: "SpeedrunPotentialAnalyzer" },
  { name: "Streaming Equipment Sufficiency Checker", url: "StreamingEquipmentChecker" },
  { name: "AI Anxiety Symptom Severity Predictor", url: "AIAnxietyPredictor" },
  { name: "Career Satisfaction Pulse Calculator", url: "CareerSatisfactionPulse" },
];

// Load navbar component
async function loadNavbar() {
  try {
    // Try multiple possible paths until one works
    const possiblePaths = [
      "src/components/Navbar.html", // For main index page
      "../src/components/Navbar.html", // For calculator pages
      "../../src/components/Navbar.html", // For nested pages
      "/src/components/Navbar.html", // Absolute path from root
    ];

    let navbarHTML = "";
    let pathFound = false;

    for (const path of possiblePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          navbarHTML = await response.text();
          pathFound = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (pathFound) {
      document.getElementById("navbar-container").innerHTML = navbarHTML;
      initializeNavbar();
    } else {
      console.error("Could not load navbar from any path");
    }
  } catch (error) {
    console.error("Error loading navbar:", error);
  }
}

// Category definitions with tools
const categories = {
  "AI Content & Creators": {
    icon: "psychology",
    tools: calculatorTools.filter((tool) =>
      [
        "AI Prompt Quality Scorer",
        "Content Repurposing Calculator",
        "LinkedIn Engagement Predictor",
        "Hashtag ROI Calculator",
        "Video Script Length Optimizer",
      ].includes(tool.name)
    ),
  },
  "Gaming & Entertainment": {
    icon: "sports_esports",
    tools: calculatorTools.filter((tool) =>
      [
        "Gaming PC Budget Allocator",
        "Gacha Game Spending ROI Calculator",
        "Game Completion Time Estimator",
        "Speedrun Potential Analyzer",
        "Streaming Equipment Sufficiency Checker",
      ].includes(tool.name)
    ),
  },
  "Media & Entertainment": {
    icon: "music_note",
    tools: calculatorTools.filter((tool) =>
      [
        "Audiobook Speed Calculator",
        "Twitch Earnings Calculator",
        "Podcast Revenue Calculator",
        "YouTube Optimizer",
      ].includes(tool.name)
    ),
  },
  "Business & Finance": {
    icon: "business",
    tools: calculatorTools.filter((tool) =>
      [
        "Bid Optimizer Calculator",
        "Business Insurance Calculator",
        "College Major ROI Calculator",
        "Contractor vs Employee Calculator",
        "Coworking ROI Calculator",
        "Emergency Fund Calculator",
        "Financial Independence Calculator",
        "Freelance Profitability Calculator",
        "Freelancer Rate Calculator",
        "Online Course Pricing Calculator",
        "Passive Income Timeline Calculator",
        "Remote Work Tax Calculator",
        "Subscription Audit Calculator",
        "Vacation Rental ROI Calculator",
        "Freelance Hourly Rate Calculator",
        "Business Breakeven Analysis Tool",
        "Service Business Pricing Optimizer",
        "Product Viability Scorer",
        "E-Commerce Product Profitability Calculator",
        "Career Satisfaction Pulse Calculator",
      ].includes(tool.name)
    ),
  },
  "Lifestyle & Living": {
    icon: "home",
    tools: calculatorTools.filter((tool) =>
      [
        "Coliving Expense Calculator",
        "Dorm Room Planner Calculator",
        "Food Waste Cost Calculator",
        "House vs Apartment Calculator",
        "Moving Box Calculator",
        "Van Life Budget Calculator",
        "Home Renovation Priority Sequencer",
        "Rent vs Buy Calculator",
        "Pet Adoption Readiness Financial Test",
        "Interior Design Concept Feasibility Checker",
        "Moving Cost Estimator & Company Comparison",
        "Digital Nomad Visa Feasibility Checker",
        "Sustainable Travel Carbon Offset Calculator",
        "Staycation vs Vacation Cost Comparison",
        "Cruise Ship ROI Calculator",
        "Expat Cost of Living Advisor",
      ].includes(tool.name)
    ),
  },
  "Health & Wellness": {
    icon: "favorite",
    tools: calculatorTools.filter((tool) =>
      [
        "Coffee Tolerance Reset Calculator",
        "Habit Streak Probability Calculator",
        "Pet Adoption Readiness Calculator",
        "Pet Medication Dosage Calculator",
        "Plant Growth Light Calculator",
        "Sleep Debt Recovery Calculator",
        "Workout Rest Day Calculator",
        "Walking Step Equivalent Calculator",
        "Caffeine Dependency Recovery Timeline",
        "Sunscreen SPF Effectiveness Calculator",
        "Sleep Debt Payback Plan Calculator",
        "Alcohol Tolerance Reset Planner",
        "AI Anxiety Symptom Severity Predictor",
      ].includes(tool.name)
    ),
  },
  "Transportation & Environment": {
    icon: "directions_car",
    tools: calculatorTools.filter((tool) =>
      [
        "EV Charging Cost Calculator",
        "Event Carbon Footprint Calculator",
        "Fuel Station Queue Calculator",
        "Plastic Usage Carbon Footprint Calculator",
        "Water Usage Cost & Environmental Calculator",
        "Organic vs. Conventional Food Environmental Impact Analyzer",
        "Renewable Energy Feasibility Checker",
        "Sustainable Shopping Impact Tracker",
      ].includes(tool.name)
    ),
  },
  "Remote Work & Productivity": {
    icon: "work",
    tools: calculatorTools.filter((tool) =>
      [
        "Deep Work Block Scheduler",
        "Meeting ROI Calculator",
        "Timezone Fair Meeting Finder",
        "Focus Session Sustainability Calculator",
        "Asynchronous Communication Audit Tool",
      ].includes(tool.name)
    ),
  },
  "Education & Productivity": {
    icon: "school",
    tools: calculatorTools.filter((tool) =>
      [
        "Study Material Format Optimizer",
        "Exam Score Predictor",
        "Language Learning Timeline Calculator",
        "Certification ROI Calculator",
        "Micro-Credential Value Assessor",
        "Language Learning Time Calculator",
        "LinkedIn Predictor Calculator",
        "Social Engagement Calculator",
        "Time Zone Coordinator Calculator",
      ].includes(tool.name)
    ),
  },
  "Personal Finance & Investing": {
    icon: "account_balance",
    tools: calculatorTools.filter((tool) =>
      [
        "Tax Bracket Optimization Calculator",
        "Recurring Subscription Savings Tracker",
        "Salary Negotiation Calculator",
        "Crypto Tax Loss Harvesting Calculator",
        "Dividend Growth Projection Calculator",
      ].includes(tool.name)
    ),
  },
};

// Generate desktop navigation
function generateDesktopNav() {
  const desktopNav = document.getElementById("desktop-nav");
  if (!desktopNav) return;

  // Show only first 4 categories in main nav
  const mainCategories = Object.entries(categories).slice(0, 4);

  desktopNav.innerHTML = mainCategories
    .map(
      ([categoryName, categoryData]) => `
    <div class="relative group">
      <button class="px-2 py-1.5 text-xs rounded hover:bg-white/10 transition flex items-center gap-1">
        <span class="material-icons text-xs">${categoryData.icon}</span>
        ${categoryName.split(" ")[0]}
        <span class="material-icons text-xs">keyboard_arrow_down</span>
      </button>
      <div class="absolute top-full right-0 mt-1 bg-dark border border-accent rounded-lg shadow-lg min-w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div class="p-2">
          ${categoryData.tools
            .map(
              (tool) => `
            <a href="/${tool.url}/" class="block px-2 py-1.5 text-xs text-text hover:bg-accent/20 rounded transition">${tool.name}</a>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Generate More tools dropdown
function generateMoreToolsDropdown() {
  const moreToolsDropdown = document.getElementById("more-tools-dropdown");
  if (!moreToolsDropdown) return;

  // Show remaining categories in More dropdown
  const moreCategories = Object.entries(categories).slice(4);

  moreToolsDropdown.innerHTML = moreCategories
    .map(
      ([categoryName, categoryData]) => `
    <div class="mb-3">
      <h4 class="text-xs font-semibold text-accent mb-1 flex items-center gap-1">
        <span class="material-icons text-xs">${categoryData.icon}</span>
        ${categoryName}
      </h4>
      <div class="ml-4">
        ${categoryData.tools
          .map(
            (tool) => `
          <a href="/${tool.url}/" class="block px-2 py-1 text-xs text-text hover:bg-accent/20 rounded transition">${tool.name}</a>
        `
          )
          .join("")}
      </div>
    </div>
  `
    )
    .join("");
}

// Generate mobile navigation
function generateMobileNav() {
  const mobileCategories = document.getElementById("mobile-categories");
  if (!mobileCategories) return;

  mobileCategories.innerHTML = Object.entries(categories)
    .map(
      ([categoryName, categoryData]) => `
    <div class="border-b border-accent/30 pb-4">
      <h3 class="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
        <span class="material-icons text-sm">${categoryData.icon}</span>
        ${categoryName}
      </h3>
      <div class="space-y-1 ml-6">
        ${categoryData.tools
          .map(
            (tool) => `
          <a href="/${tool.url}/" class="block text-xs text-text hover:text-primary transition py-1">${tool.name}</a>
        `
          )
          .join("")}
      </div>
    </div>
  `
    )
    .join("");
}

// Generate mobile More tools
function generateMobileMoreTools() {
  const mobileMoreTools = document.getElementById("mobile-more-tools");
  if (!mobileMoreTools) return;

  // Show remaining categories in mobile More section
  const moreCategories = Object.entries(categories).slice(4);

  moreCategories.forEach(([categoryName, categoryData]) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "mb-3";
    categoryDiv.innerHTML = `
      <h4 class="text-xs font-semibold text-accent mb-1 flex items-center gap-1">
        <span class="material-icons text-xs">${categoryData.icon}</span>
        ${categoryName}
      </h4>
      <div class="ml-2">
        ${categoryData.tools
          .map(
            (tool) => `
          <a href="/${tool.url}/" class="block text-xs text-text hover:text-primary transition py-1">${tool.name}</a>
        `
          )
          .join("")}
      </div>
    `;
    mobileMoreTools.appendChild(categoryDiv);
  });
}

// Initialize navbar functionality
function initializeNavbar() {
  // Generate navigation menus
  generateDesktopNav();
  generateMoreToolsDropdown();
  generateMobileNav();
  generateMobileMoreTools();

  const searchInput = document.getElementById("search-input");
  const searchSuggestions = document.getElementById("search-suggestions");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileSidebar = document.getElementById("mobile-sidebar");
  const closeSidebar = document.getElementById("close-sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  // Search functionality
  if (searchInput && searchSuggestions) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();

      if (query.length < 2) {
        searchSuggestions.classList.add("hidden");
        return;
      }

      const matches = calculatorTools
        .filter((tool) => tool.name.toLowerCase().includes(query))
        .slice(0, 5);

      if (matches.length > 0) {
        searchSuggestions.innerHTML = matches
          .map(
            (tool) =>
              `<a href="/${tool.url}/" class="block px-3 py-2 text-text hover:bg-accent/20 text-sm">${tool.name}</a>`
          )
          .join("");
        searchSuggestions.classList.remove("hidden");
      } else {
        searchSuggestions.classList.add("hidden");
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !searchInput.contains(e.target) &&
        !searchSuggestions.contains(e.target)
      ) {
        searchSuggestions.classList.add("hidden");
      }
    });
  }

  // Mobile menu functionality
  if (mobileMenuBtn && mobileSidebar) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileSidebar.classList.remove("translate-x-full");
      sidebarOverlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", closeMobileSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeMobileSidebar);
  }

  function closeMobileSidebar() {
    mobileSidebar.classList.add("translate-x-full");
    sidebarOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

// Generate footer categories
function generateFooterCategories() {
  const footerCategories = document.getElementById("footer-categories");
  if (!footerCategories) return;

  const categoryIcons = {
    "AI Content & Creators": "🤖",
    "Media & Entertainment": "🎵",
    "Business & Finance": "💼",
    "Remote Work & Productivity": "🏢",
    "Lifestyle & Living": "🏠",
    "Health & Wellness": "🌱",
    "Transportation & Environment": "🚗",
    "Education & Productivity": "📚",
  };

  footerCategories.innerHTML = Object.entries(categories)
    .map(
      ([categoryName, categoryData]) => `
    <div>
      <h3 class="text-lg font-semibold text-primary mb-4">
        ${categoryIcons[categoryName] || "🔧"} ${categoryName}
      </h3>
      <div class="${
        categoryData.tools.length > 8 ? "max-h-64 overflow-y-auto pr-2" : ""
      }">
        <ul class="space-y-2 text-sm">
          ${categoryData.tools
            .map(
              (tool) => `
            <li><a href="/${tool.url}/" class="text-light hover:text-primary transition-colors duration-200">${tool.name}</a></li>
          `
            )
            .join("")}
        </ul>
      </div>
    </div>
  `
    )
    .join("");
}

// Load footer component
async function loadFooter() {
  try {
    const possiblePaths = [
      "src/components/Footer.html", // For main index page
      "../src/components/Footer.html", // For calculator pages
      "../../src/components/Footer.html", // For nested pages
      "/src/components/Footer.html", // Absolute path from root
    ];

    let footerHTML = "";
    let pathFound = false;

    for (const path of possiblePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          footerHTML = await response.text();
          pathFound = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (pathFound) {
      const footerContainer = document.getElementById("footer-container");
      if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
        // Generate footer categories after footer is loaded
        generateFooterCategories();
      }
    }
  } catch (error) {
    console.error("Error loading footer:", error);
  }
}

// Initialize navbar and footer when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  loadFooter();
});
