/**
 * Calculator Template Configuration System
 * Provides standardized structure and styling patterns for all calculator pages
 */

// Common form field patterns
const FORM_FIELD_PATTERNS = {
    // Basic input fields
    textInput: (id, label, placeholder, required = false) => `
        <div>
            <label class="block text-sm font-medium mb-2">${label}</label>
            <input type="text" id="${id}" placeholder="${placeholder}" 
                   class="w-full px-3 py-2 border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary" 
                   ${required ? 'required' : ''}>
        </div>`,

    numberInput: (id, label, placeholder, min = 0, max = null, step = null, required = false) => `
        <div>
            <label class="block text-sm font-medium mb-2">${label}</label>
            <input type="number" id="${id}" placeholder="${placeholder}" 
                   class="w-full px-3 py-2 border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary" 
                   min="${min}" ${max ? `max="${max}"` : ''} ${step ? `step="${step}"` : ''} ${required ? 'required' : ''}>
        </div>`,

    selectInput: (id, label, options, required = false) => `
        <div>
            <label class="block text-sm font-medium mb-2">${label}</label>
            <select id="${id}" class="w-full px-3 py-2 border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary" ${required ? 'required' : ''}>
                <option value="">Select ${label.toLowerCase()}</option>
                ${options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
            </select>
        </div>`,

    rangeInput: (id, label, min, max, step, defaultValue) => `
        <div>
            <label class="block text-sm font-medium mb-2">${label}</label>
            <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${defaultValue}"
                   class="w-full h-2 bg-broder rounded-lg appearance-none cursor-pointer">
            <div class="flex justify-between text-xs text-light mt-1">
                <span>${min}</span>
                <span id="${id}-value">${defaultValue}</span>
                <span>${max}</span>
            </div>
        </div>`,

    checkboxGroup: (name, label, options) => `
        <div>
            <label class="block text-sm font-medium mb-2">${label}</label>
            <div class="grid md:grid-cols-2 gap-3">
                ${options.map(opt => `
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="${opt.id}" name="${name}" value="${opt.value}" 
                               class="rounded border-accent bg-dark text-primary focus:ring-primary">
                        <span class="text-sm">${opt.text}</span>
                    </label>
                `).join('')}
            </div>
        </div>`,

    radioGroup: (name, label, options) => `
        <div>
            <label class="block text-sm font-medium mb-2">${label}</label>
            <div class="flex gap-4">
                ${options.map(opt => `
                    <label class="flex items-center gap-2">
                        <input type="radio" name="${name}" value="${opt.value}" class="text-primary">
                        <span class="text-text">${opt.text}</span>
                    </label>
                `).join('')}
            </div>
        </div>`,

    // Grid layouts for multiple inputs
    twoColumnGrid: (leftField, rightField) => `
        <div class="grid md:grid-cols-2 gap-6">
            ${leftField}
            ${rightField}
        </div>`,

    threeColumnGrid: (field1, field2, field3) => `
        <div class="grid md:grid-cols-3 gap-6">
            ${field1}
            ${field2}
            ${field3}
        </div>`
};

// Common blog section patterns
const BLOG_SECTION_PATTERNS = {
    introSection: (title, content) => `
        <section class="bg-broder rounded-lg p-6 border border-accent">
            <h2 class="text-2xl font-bold mb-4 text-primary">${title}</h2>
            <div class="prose prose-invert max-w-none">
                ${content}
            </div>
        </section>`,

    featureGrid: (title, features) => `
        <section class="bg-broder rounded-lg p-6 border border-accent">
            <h2 class="text-2xl font-bold mb-4 text-primary">${title}</h2>
            <div class="grid md:grid-cols-2 gap-6">
                ${features.map(feature => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="font-semibold text-accent mb-2">${feature.title}</h4>
                        <p class="text-sm text-light">${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        </section>`,

    comparisonTable: (title, headers, rows) => `
        <section class="bg-broder rounded-lg p-6 border border-accent">
            <h2 class="text-2xl font-bold mb-4 text-primary">${title}</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-sm border border-accent rounded">
                    <thead class="bg-dark">
                        <tr>
                            ${headers.map(header => `<th class="p-3 text-left text-accent">${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="text-light">
                        ${rows.map(row => `
                            <tr class="border-t border-accent">
                                ${row.map(cell => `<td class="p-3">${cell}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>`,

    faqSection: (title, faqs) => `
        <section class="bg-broder rounded-lg p-6 border border-accent">
            <h2 class="text-2xl font-bold mb-4 text-primary">${title}</h2>
            <div class="space-y-4">
                ${faqs.map(faq => `
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h4 class="font-semibold text-accent mb-2">${faq.question}</h4>
                        <p class="text-sm text-light">${faq.answer}</p>
                    </div>
                `).join('')}
            </div>
        </section>`
};

// Application categories for schema markup
const APPLICATION_CATEGORIES = {
    finance: "FinanceApplication",
    health: "HealthApplication",
    productivity: "UtilitiesApplication",
    business: "BusinessApplication",
    education: "EducationalApplication",
    lifestyle: "LifestyleApplication"
};

// Common material icons for different tool types
const TOOL_ICONS = {
    calculator: "calculate",
    money: "monetization_on",
    health: "health_and_safety",
    time: "schedule",
    business: "business_center",
    analytics: "analytics",
    speed: "speed",
    security: "security",
    growth: "trending_up",
    optimization: "tune",
    planning: "event_note",
    assessment: "assessment",
    balance: "account_balance",
    fitness: "fitness_center",
    sleep: "bedtime",
    food: "restaurant",
    travel: "flight",
    home: "home",
    work: "work",
    education: "school"
};

// Template replacement function
function replaceTemplateVariables(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value);
    }
    return result;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FORM_FIELD_PATTERNS,
        BLOG_SECTION_PATTERNS,
        APPLICATION_CATEGORIES,
        TOOL_ICONS,
        replaceTemplateVariables
    };
}