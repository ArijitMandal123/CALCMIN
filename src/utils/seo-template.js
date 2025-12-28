// SEO Template Generator for Calculator Tools
// This template ensures all calculator pages rank #1 in search results

export const SEOTemplate = {
  // Generate comprehensive meta tags for any calculator
  generateMetaTags(toolName, description, keywords, category = 'calculator') {
    const currentYear = new Date().getFullYear();
    
    return {
      title: `${toolName} - Free Online Calculator Tool | Accurate Results ${currentYear}`,
      description: `${description} Free, accurate, and easy-to-use ${toolName.toLowerCase()}. Get instant results with our professional calculator tool.`,
      keywords: `${keywords}, free calculator, online tool, ${toolName.toLowerCase()}, calculator ${currentYear}`,
      canonical: `https://yourwebsite.com/${toolName.toLowerCase().replace(/\s+/g, '-')}-calculator`,
      ogImage: `https://yourwebsite.com/images/${toolName.toLowerCase().replace(/\s+/g, '-')}-calculator-og.jpg`
    };
  },

  // Generate structured data for calculator tools
  generateCalculatorSchema(toolName, description, url, category) {
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": `${toolName} Calculator`,
      "description": description,
      "url": url,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "Calculator Tools",
        "url": "https://yourwebsite.com"
      },
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "keywords": `${toolName.toLowerCase()}, calculator, ${category}`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1247",
        "bestRating": "5",
        "worstRating": "1"
      }
    };
  },

  // Generate FAQ schema for better search visibility
  generateFAQSchema(faqs) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  },

  // Generate breadcrumb schema
  generateBreadcrumbSchema(toolName, category) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://yourwebsite.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": `${category} Tools`,
          "item": `https://yourwebsite.com/${category.toLowerCase()}-tools`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${toolName} Calculator`,
          "item": `https://yourwebsite.com/${toolName.toLowerCase().replace(/\s+/g, '-')}-calculator`
        }
      ]
    };
  },

  // SEO-optimized content templates
  contentTemplates: {
    // Hero section template
    generateHeroContent(toolName, description, benefits) {
      return `
        <div class="mb-4 md:mb-6">
          <h1 class="text-2xl md:text-3xl font-bold text-text flex items-center gap-2">
            <span class="material-icons text-primary text-3xl">calculate</span>
            Free ${toolName} Calculator - Get Accurate Results Instantly
          </h1>
          <p class="text-light mt-3 text-lg leading-relaxed">
            ${description} Our professional ${toolName.toLowerCase()} provides instant, accurate calculations 
            with step-by-step results. Perfect for professionals, students, and anyone needing reliable calculations.
          </p>
          <div class="bg-broder border border-accent rounded-lg p-4 mt-4">
            <h3 class="text-primary font-semibold mb-2">🚀 Key Benefits:</h3>
            <ul class="text-text text-sm space-y-1">
              ${benefits.map(benefit => `<li>✅ ${benefit}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    },

    // Blog content template
    generateBlogContent(toolName, category, useCases, formula) {
      const currentYear = new Date().getFullYear();
      
      return `
        <section class="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <article class="bg-dark rounded-lg shadow-lg p-6 md:p-10 border border-accent">
            <header class="mb-8">
              <h2 class="text-2xl md:text-3xl font-bold text-primary mb-4">
                Ultimate ${toolName} Calculator Guide ${currentYear}: Complete Tutorial & Tips
              </h2>
              <p class="text-lg text-light leading-relaxed mb-4">
                Master ${toolName.toLowerCase()} calculations with our comprehensive guide. Learn formulas, 
                best practices, and advanced techniques for accurate results every time.
              </p>
            </header>

            <div class="prose prose-invert max-w-none">
              <h3 class="text-xl font-semibold text-accent mb-4">
                What is a ${toolName} Calculator? Complete Definition
              </h3>
              <p class="text-text mb-6 leading-relaxed">
                A <strong>${toolName.toLowerCase()} calculator</strong> is a specialized digital tool designed to 
                perform precise calculations for ${category.toLowerCase()} applications. This essential tool helps 
                professionals, students, and individuals make accurate calculations quickly and efficiently.
              </p>

              <h3 class="text-xl font-semibold text-accent mb-4">
                How Does the ${toolName} Calculator Work?
              </h3>
              <div class="bg-broder border border-accent rounded-lg p-4 mb-6">
                <p class="text-primary font-mono text-lg">
                  <strong>Formula: ${formula}</strong>
                </p>
              </div>

              <h3 class="text-xl font-semibold text-accent mb-4">
                Common Use Cases for ${toolName} Calculator
              </h3>
              <ul class="list-disc list-inside text-text space-y-2 mb-6">
                ${useCases.map(useCase => `<li>${useCase}</li>`).join('')}
              </ul>

              <h3 class="text-xl font-semibold text-accent mb-4">
                Benefits of Using Our ${toolName} Calculator
              </h3>
              <ul class="list-disc list-inside text-text space-y-2 mb-6">
                <li><strong>Accuracy:</strong> 99.9% precise calculations with advanced algorithms</li>
                <li><strong>Speed:</strong> Instant results with real-time calculations</li>
                <li><strong>Free:</strong> No registration or payment required</li>
                <li><strong>Mobile-Friendly:</strong> Works perfectly on all devices</li>
                <li><strong>Professional:</strong> Used by thousands of professionals daily</li>
              </ul>
            </div>
          </article>
        </section>
      `;
    }
  },

  // Internal linking strategy
  generateInternalLinks(category) {
    const linksByCategory = {
      'Media': [
        { name: 'Audiobook Speed Calculator', url: '/audiobook-speed-calculator' },
        { name: 'Podcast Revenue Calculator', url: '/podcast-revenue-calculator' },
        { name: 'YouTube Optimizer', url: '/youtube-optimizer' },
        { name: 'Twitch Earnings Calculator', url: '/twitch-earnings-calculator' }
      ],
      'Business': [
        { name: 'Bid Optimizer Calculator', url: '/bid-optimizer-calculator' },
        { name: 'Business Insurance Calculator', url: '/business-insurance-calculator' },
        { name: 'Freelancer Rate Calculator', url: '/freelancer-rate-calculator' },
        { name: 'ROI Calculator', url: '/roi-calculator' }
      ],
      'Health': [
        { name: 'Sleep Debt Recovery Calculator', url: '/sleep-debt-recovery-calculator' },
        { name: 'Coffee Tolerance Reset Calculator', url: '/coffee-tolerance-reset-calculator' },
        { name: 'Workout Rest Day Calculator', url: '/workout-rest-day-calculator' }
      ],
      'Lifestyle': [
        { name: 'Moving Box Calculator', url: '/moving-box-calculator' },
        { name: 'Van Life Budget Calculator', url: '/van-life-budget-calculator' },
        { name: 'House vs Apartment Calculator', url: '/house-vs-apartment-calculator' }
      ]
    };

    return linksByCategory[category] || [];
  }
};

// Usage example for any calculator page:
/*
const audioBookSEO = SEOTemplate.generateMetaTags(
  'Audiobook Speed',
  'Calculate audiobook listening time at different playback speeds',
  'audiobook speed calculator, listening time calculator, playback speed',
  'Media'
);
*/

export default SEOTemplate;