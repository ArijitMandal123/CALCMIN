# Project Structure & Architecture

## Directory Organization

### Root Level Files
- `index.html` - Main homepage with quantum-themed hero section
- `sitemap.xml` - SEO sitemap for search engine indexing
- `ads.txt` - Google AdSense verification file
- `Readme.md` - Project documentation and tool catalog
- `*.md` files - SEO strategy guides and implementation plans

### Calculator Directories
Each calculator follows a consistent structure:
```
CalculatorName/
├── index.html    # Main calculator page
└── script.js     # Calculator logic and functionality
```

**Available Calculators (38 total):**
- AudiobookSpeed, BidOptimizer, BusinessInsurance
- CoffeeToleranceReset, ColivingExpense, CollegeMajorROI
- ContractorVsEmployee, CoworkingROI, DormRoomPlanner
- EmergencyFund, EVChargingCost, EventCarbonFootprint
- FinancialIndependence, FoodWasteCost, FreelanceProfitability
- FreelancerRate, FuelStationQueue, HabitStreakProbability
- HouseVsApartment, LanguageLearningTime, LinkedInPredictor
- MovingBoxCalculator, OnlineCoursePricing, PassiveIncomeTimeline
- PetAdoptionReadiness, PetMedicationDosage, PlantGrowthLight
- PodcastRevenue, RemoteWorkTax, SleepDebtRecovery
- SocialEngagement, SubscriptionAudit, TimeZoneCoordinator
- TwitchEarnings, VacationRentalROI, VanLifeBudget
- WorkoutRestDay, YouTubeOptimizer

### Source Code Structure
```
src/
├── components/
│   ├── Footer.html     # Reusable footer component
│   ├── Navbar.html     # Navigation header component
│   └── navbar.js       # Navigation functionality
└── utils/
    ├── seo-optimizer.js    # SEO optimization utilities
    ├── seo-template.js     # SEO template generator
    └── seo.js             # Core SEO functions
```

### Public Assets
```
public/
├── ads/
│   ├── desktop.html    # Desktop ad templates
│   └── mobile.html     # Mobile ad templates
├── .htaccess          # Apache server configuration
├── favicon.ico        # Site favicon
├── manifest.json      # PWA manifest
└── robots.txt         # Search engine crawler instructions
```

### Amazon Q Rules
```
.amazonq/
└── rules/
    └── memory-bank/   # AI assistant memory documentation
```

## Core Components & Relationships

### Homepage (index.html)
- **Hero Section**: Quantum-themed animated landing area
- **Calculator Grid**: Organized by categories with visual cards
- **Navigation**: Responsive navbar with category filtering
- **Footer**: Links, legal info, and additional resources

### Individual Calculators
- **Consistent Layout**: Header, input form, results display, footer
- **Shared Styling**: Tailwind CSS with custom quantum theme
- **Interactive Elements**: Real-time calculations, input validation
- **SEO Optimization**: Meta tags, structured data, breadcrumbs

### Shared Components
- **Navbar**: Consistent navigation across all pages
- **Footer**: Standard footer with links and branding
- **SEO Utils**: Automated meta tag generation and optimization

## Architectural Patterns

### Frontend Architecture
- **Static Site**: Pure HTML/CSS/JavaScript (no backend required)
- **Component-Based**: Reusable HTML components loaded via JavaScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

### SEO Architecture
- **Page-Level Optimization**: Each calculator has unique SEO strategy
- **Structured Data**: Schema.org markup for rich snippets
- **Internal Linking**: Strategic cross-linking between related calculators
- **Content Strategy**: Keyword-optimized descriptions and titles

### Styling Architecture
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme**: Quantum/sci-fi design system
- **Color Palette**: Consistent brand colors across all pages
- **Animation System**: CSS animations for interactive elements

### JavaScript Architecture
- **Vanilla JS**: No external frameworks for fast loading
- **Modular Scripts**: Separate JS files for each calculator
- **Shared Utilities**: Common functions in utils directory
- **Event-Driven**: User interactions trigger calculations

## Data Flow

### User Interaction Flow
1. User lands on homepage or specific calculator
2. Navigates through category-organized calculator grid
3. Inputs data into calculator form fields
4. JavaScript processes inputs and displays results
5. User can modify inputs for real-time recalculation

### SEO Data Flow
1. SEO utilities generate optimized meta tags
2. Structured data provides rich snippet information
3. Sitemap guides search engine crawling
4. Internal links distribute page authority

### Content Management
- **Static Content**: All content stored in HTML files
- **Calculator Logic**: JavaScript handles all calculations
- **SEO Content**: Meta descriptions and titles in each page
- **Documentation**: Markdown files for project management

## Integration Points

### External Services
- **Google AdSense**: Ad serving and revenue tracking
- **Google Analytics**: User behavior and performance tracking
- **Search Console**: SEO monitoring and optimization
- **CDN Services**: Font loading (Google Fonts, Material Icons)

### Internal Integrations
- **Component Loading**: Dynamic navbar/footer injection
- **Cross-Calculator Links**: Related calculator recommendations
- **Shared Styling**: Consistent theme across all pages
- **SEO Automation**: Automated meta tag and structured data generation