# Development Guidelines & Standards

## Code Quality Standards Analysis

### JavaScript Code Structure (Found in 5/5 files)
- **Event-Driven Architecture**: All calculators use `DOMContentLoaded` event listeners and form submission handlers
- **Function Separation**: Clear separation between data collection, calculation logic, and display functions
- **Error Handling**: Input validation and graceful error messaging in user-facing components
- **Consistent Naming**: camelCase for variables and functions, descriptive names that indicate purpose

### HTML/CSS Integration Patterns (Found in 5/5 files)
- **Tailwind CSS Classes**: Consistent use of utility classes for styling
- **Material Icons**: Standard iconography using `material-icons` class
- **Responsive Design**: Grid layouts with `md:` breakpoints for mobile-first design
- **Color System**: Consistent color variables (primary, accent, broder, dark, light, text)

### Form Handling Standards (Found in 5/5 files)
```javascript
// Standard pattern for form submission
document.getElementById('form-id').addEventListener('submit', function(e) {
    e.preventDefault();
    // Process form data
});
```

### Data Collection Patterns (Found in 4/5 files)
- **Centralized Data Collection**: Dedicated functions like `collectFormData()`, `collectTeamMembers()`
- **Type Conversion**: Explicit parsing with `parseInt()`, `parseFloat()` for numeric inputs
- **Validation**: Input validation before processing calculations
- **Object Structure**: Consistent data object patterns for passing between functions

## Semantic Patterns Overview

### Calculator Architecture Pattern (Found in 5/5 files)
1. **Data Collection Phase**: Gather user inputs from form elements
2. **Calculation Phase**: Process data through specialized calculation functions
3. **Analysis Phase**: Generate insights, recommendations, and scoring
4. **Display Phase**: Render results with formatted HTML and styling

### Component Loading Pattern (Found in 2/5 files)
```javascript
// Async component loading with fallback paths
async function loadComponent() {
    const possiblePaths = ['../path1', '../../path2', '/absolute/path'];
    for (const path of possiblePaths) {
        try {
            const response = await fetch(path);
            if (response.ok) return await response.text();
        } catch (e) { continue; }
    }
}
```

### SEO Optimization Pattern (Found in 1/5 files)
- **Class-Based Architecture**: SEO functionality encapsulated in reusable classes
- **Configuration Objects**: Tool-specific configurations for meta tags and content
- **Template Generation**: Automated HTML generation for consistent SEO implementation
- **Schema Markup**: Structured data generation for search engines

### Scoring System Pattern (Found in 2/5 files)
```javascript
// Multi-factor scoring with weighted calculations
function calculateScore(factors) {
    const weightedScore = (factor1 * weight1) + (factor2 * weight2);
    return {
        score: Math.round(weightedScore),
        level: getScoreLevel(weightedScore)
    };
}
```

## Frequently Used Code Idioms

### DOM Manipulation Patterns (Found in 5/5 files)
```javascript
// Standard element selection and manipulation
const element = document.getElementById('element-id');
element.classList.remove('hidden');
element.scrollIntoView({ behavior: 'smooth' });
```

### Conditional Styling (Found in 4/5 files)
```javascript
// Dynamic CSS class assignment based on conditions
const colorClass = score >= 80 ? 'text-green-400' : 
                  score >= 60 ? 'text-yellow-400' : 'text-red-400';
```

### Array Processing (Found in 3/5 files)
```javascript
// Functional array operations for data transformation
const results = items.map(item => processItem(item))
                   .filter(result => result.isValid)
                   .sort((a, b) => b.score - a.score);
```

### Template Literal HTML Generation (Found in 5/5 files)
```javascript
// Multi-line HTML generation with embedded expressions
const html = `
    <div class="bg-broder p-4 rounded border border-accent">
        <h3 class="text-primary">${title}</h3>
        <p class="text-light">${description}</p>
    </div>
`;
```

## Internal API Usage Patterns

### Form Data Extraction (Found in 4/5 files)
```javascript
// Standard form data collection pattern
function collectFormData() {
    return {
        field1: document.getElementById('field1').value,
        field2: parseInt(document.getElementById('field2').value),
        field3: document.getElementById('field3').checked
    };
}
```

### Results Display API (Found in 5/5 files)
```javascript
// Consistent results rendering pattern
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = generateResultsHTML(data);
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
```

### Dynamic Content Generation (Found in 3/5 files)
```javascript
// Dynamic HTML generation with data mapping
const content = items.map(item => `
    <div class="item-container">
        <span class="item-label">${item.label}:</span>
        <span class="item-value">${item.value}</span>
    </div>
`).join('');
```

### Navigation System API (Found in 1/5 files)
```javascript
// Category-based navigation with tool organization
const categories = {
    'Category Name': {
        icon: 'material_icon_name',
        tools: toolsArray.filter(tool => categoryCondition)
    }
};
```

## Popular Annotations & Comments

### Function Documentation (Found in 3/5 files)
```javascript
// Calculate optimal meeting times based on team constraints
function calculateOptimalTimes(members, duration, selectedDays) {
    // Implementation details
}
```

### Section Separators (Found in 4/5 files)
```javascript
// ===== DATA COLLECTION =====
// ===== CALCULATION LOGIC =====
// ===== RESULTS DISPLAY =====
```

### Configuration Comments (Found in 2/5 files)
```javascript
// Tool configurations for SEO optimization
toolConfigs = {
    'ToolName': {
        category: 'Category',
        description: 'Tool description',
        // Additional config...
    }
};
```

## Development Best Practices

### Error Handling Standards
- Always prevent default form submission with `e.preventDefault()`
- Validate inputs before processing calculations
- Provide user-friendly error messages in the UI
- Use try-catch blocks for async operations

### Performance Considerations
- Use event delegation for dynamic content
- Minimize DOM queries by caching element references
- Implement efficient sorting and filtering algorithms
- Load components asynchronously to improve page load times

### Accessibility Standards
- Use semantic HTML elements and proper heading hierarchy
- Include Material Icons for visual enhancement
- Implement keyboard navigation support
- Provide clear visual feedback for user interactions

### Code Organization Principles
- Separate concerns: data collection, calculation, and display
- Use descriptive function and variable names
- Group related functionality into logical sections
- Maintain consistent indentation and formatting

### SEO Implementation Standards
- Generate meta tags programmatically for consistency
- Include structured data (Schema.org) for rich snippets
- Implement breadcrumb navigation for better UX
- Use semantic HTML for better search engine understanding