# Calculator Template System

This directory contains reusable templates and patterns for creating consistent calculator pages across the CalcMin.pro website.

## Files Overview

### `calculator-template.html`
The main HTML template with placeholder variables for creating new calculator pages. Contains:
- Complete HTML structure with SEO meta tags
- Consistent layout with header, form, results, and ads
- Schema.org structured data
- Responsive design patterns

### `template-config.js`
JavaScript configuration file providing:
- Reusable form field patterns
- Blog section templates
- Application categories for schema markup
- Material icon mappings
- Template variable replacement functions

### `style-patterns.css`
CSS utility classes and patterns for:
- Form styling consistency
- Layout patterns
- Card designs
- Typography scales
- Animation effects
- Responsive breakpoints

## Usage Guide

### Creating a New Calculator Page

1. **Copy the base template:**
   ```bash
   cp src/templates/calculator-template.html NewCalculator/index.html
   ```

2. **Replace template variables:**
   ```javascript
   const variables = {
       TOOL_TITLE: "Your Calculator Name",
       TOOL_SUBTITLE: "Brief Description",
       TOOL_FOLDER: "YourCalculatorFolder",
       TOOL_ICON: "calculate", // Material icon name
       TOOL_DESCRIPTION: "Detailed description...",
       META_DESCRIPTION: "SEO meta description...",
       // ... more variables
   };
   ```

3. **Build form fields using patterns:**
   ```javascript
   const formFields = [
       FORM_FIELD_PATTERNS.numberInput("amount", "Amount ($)", "e.g., 1000", 0, null, null, true),
       FORM_FIELD_PATTERNS.selectInput("category", "Category", [
           {value: "option1", text: "Option 1"},
           {value: "option2", text: "Option 2"}
       ], true)
   ].join('');
   ```

## Template Variables Reference

### Required Variables
- `TOOL_TITLE` - Main calculator name
- `TOOL_SUBTITLE` - Brief subtitle for SEO
- `TOOL_FOLDER` - Directory name (for URLs)
- `TOOL_ICON` - Material icon name
- `TOOL_DESCRIPTION` - Description shown on page
- `FORM_ID` - HTML form ID
- `SUBMIT_BUTTON_TEXT` - Submit button text

### SEO Variables
- `META_DESCRIPTION` - Meta description (150-160 chars)
- `META_KEYWORDS` - Comma-separated keywords
- `OG_DESCRIPTION` - Open Graph description
- `TWITTER_DESCRIPTION` - Twitter card description
- `SCHEMA_DESCRIPTION` - Schema.org description
- `APPLICATION_CATEGORY` - Schema app category

### Content Variables
- `BLOG_TITLE` - Main blog section title
- `BLOG_INTRO` - Introduction paragraph
- `BLOG_SECTIONS` - Main content sections
- `FORM_FIELDS` - Calculator form HTML

## Form Field Patterns

### Basic Inputs
```javascript
// Text input
FORM_FIELD_PATTERNS.textInput(id, label, placeholder, required)

// Number input
FORM_FIELD_PATTERNS.numberInput(id, label, placeholder, min, max, step, required)

// Select dropdown
FORM_FIELD_PATTERNS.selectInput(id, label, options, required)

// Range slider
FORM_FIELD_PATTERNS.rangeInput(id, label, min, max, step, defaultValue)
```

### Group Inputs
```javascript
// Checkbox group
FORM_FIELD_PATTERNS.checkboxGroup(name, label, options)

// Radio button group
FORM_FIELD_PATTERNS.radioGroup(name, label, options)
```

### Layout Patterns
```javascript
// Two-column layout
FORM_FIELD_PATTERNS.twoColumnGrid(leftField, rightField)

// Three-column layout
FORM_FIELD_PATTERNS.threeColumnGrid(field1, field2, field3)
```

## Blog Section Patterns

### Content Sections
```javascript
// Introduction section
BLOG_SECTION_PATTERNS.introSection(title, content)

// Feature grid
BLOG_SECTION_PATTERNS.featureGrid(title, features)

// Comparison table
BLOG_SECTION_PATTERNS.comparisonTable(title, headers, rows)

// FAQ section
BLOG_SECTION_PATTERNS.faqSection(title, faqs)
```

## CSS Class Patterns

### Form Elements
- `.calc-input` - Standard input styling
- `.calc-input-large` - Larger input fields
- `.calc-select` - Select dropdown styling
- `.calc-checkbox` - Checkbox styling
- `.calc-radio` - Radio button styling

### Buttons
- `.calc-button-primary` - Primary action button
- `.calc-button-secondary` - Secondary button
- `.calc-button-small` - Small button variant

### Layout
- `.calc-container` - Main container
- `.calc-grid-main` - Main grid layout
- `.calc-two-column` - Two-column grid
- `.calc-three-column` - Three-column grid

### Cards
- `.calc-card` - Basic card styling
- `.calc-card-header` - Header card
- `.calc-card-form` - Form container card
- `.calc-card-result` - Results display card

### Typography
- `.calc-title` - Main page title
- `.calc-subtitle` - Subtitle text
- `.calc-section-title` - Section headings
- `.calc-label` - Form labels

## Best Practices

### SEO Optimization
1. Use descriptive, keyword-rich titles
2. Write unique meta descriptions (150-160 characters)
3. Include relevant keywords naturally
4. Add proper schema markup
5. Use semantic HTML structure

### Accessibility
1. Include proper ARIA labels
2. Ensure keyboard navigation works
3. Use semantic HTML elements
4. Provide alternative text for icons
5. Maintain proper heading hierarchy

### Performance
1. Minimize inline styles
2. Use CSS classes for consistency
3. Optimize images and assets
4. Implement lazy loading where appropriate
5. Minimize JavaScript bundle size

### Consistency
1. Follow established naming conventions
2. Use template patterns consistently
3. Maintain visual hierarchy
4. Apply consistent spacing
5. Use standard color palette

## Example Implementation

```html
<!-- Replace template variables -->
<h1 class="calc-title">
    <span class="material-icons calc-icon-large">calculate</span>
    ROI Calculator
</h1>

<!-- Use form patterns -->
<form id="roi-form" class="calc-space-y-6">
    <div class="calc-two-column">
        <div class="calc-input-group">
            <label class="calc-label">Initial Investment</label>
            <input type="number" class="calc-input" placeholder="e.g., 10000">
        </div>
        <div class="calc-input-group">
            <label class="calc-label">Return Amount</label>
            <input type="number" class="calc-input" placeholder="e.g., 12000">
        </div>
    </div>
    <button type="submit" class="calc-button-primary">
        Calculate ROI
    </button>
</form>
```

This template system ensures consistency, reduces development time, and maintains high-quality standards across all calculator pages.