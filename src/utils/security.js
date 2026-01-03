// Comprehensive Security Utilities for CALCMIN Project
// Fixes: XSS, Code Injection, Input Validation, CSRF

class SecurityManager {
    constructor() {
        this.csrfToken = this.generateCSRFToken();
        this.initializeCSRFProtection();
    }

    // Generate CSRF token
    generateCSRFToken() {
        return 'csrf_' + Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
    }

    // Initialize CSRF protection for all forms
    initializeCSRFProtection() {
        document.addEventListener('DOMContentLoaded', () => {
            // Add CSRF token to all forms
            document.querySelectorAll('form').forEach(form => {
                if (!form.querySelector('input[name="csrf_token"]')) {
                    const csrfInput = document.createElement('input');
                    csrfInput.type = 'hidden';
                    csrfInput.name = 'csrf_token';
                    csrfInput.value = this.csrfToken;
                    form.appendChild(csrfInput);
                }
            });
        });
    }

    // Validate CSRF token
    validateCSRF(formData) {
        const token = formData.get ? formData.get('csrf_token') : formData.csrf_token;
        return token === this.csrfToken;
    }

    // Sanitize text content (prevents XSS)
    sanitizeText(input) {
        if (input === null || input === undefined) return '';
        if (typeof input !== 'string') input = String(input);
        
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Sanitize HTML attributes
    sanitizeAttribute(input) {
        if (input === null || input === undefined) return '';
        if (typeof input !== 'string') input = String(input);
        
        return input.replace(/[<>"'&]/g, (match) => {
            const entities = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return entities[match];
        });
    }

    // Validate numeric input
    validateNumber(input, min = -Infinity, max = Infinity) {
        const num = parseFloat(input);
        if (isNaN(num)) return null;
        if (num < min || num > max) return null;
        return num;
    }

    // Validate integer input
    validateInteger(input, min = -Infinity, max = Infinity) {
        const num = parseInt(input, 10);
        if (isNaN(num)) return null;
        if (num < min || num > max) return null;
        return num;
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate string length and content
    validateString(input, minLength = 0, maxLength = 1000, allowedChars = null) {
        if (typeof input !== 'string') return null;
        if (input.length < minLength || input.length > maxLength) return null;
        if (allowedChars && !allowedChars.test(input)) return null;
        return this.sanitizeText(input);
    }

    // Safe innerHTML replacement
    safeSetHTML(element, content) {
        if (!element) return;
        element.textContent = '';
        element.insertAdjacentHTML('afterbegin', this.sanitizeText(content));
    }

    // Create safe DOM element with sanitized content
    createSafeElement(tagName, content = '', attributes = {}) {
        const element = document.createElement(tagName);
        if (content) element.textContent = content;
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, this.sanitizeAttribute(value));
        });
        
        return element;
    }

    // Rate limiting for form submissions
    rateLimiter = new Map();
    
    checkRateLimit(identifier, maxRequests = 5, windowMs = 60000) {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        if (!this.rateLimiter.has(identifier)) {
            this.rateLimiter.set(identifier, []);
        }
        
        const requests = this.rateLimiter.get(identifier);
        const validRequests = requests.filter(time => time > windowStart);
        
        if (validRequests.length >= maxRequests) {
            return false;
        }
        
        validRequests.push(now);
        this.rateLimiter.set(identifier, validRequests);
        return true;
    }
}

// Global security instance
window.Security = new SecurityManager();

// Enhanced form validation wrapper
function secureFormSubmission(formId, validationRules, callback) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Rate limiting check
        const clientId = 'client_' + (navigator.userAgent + navigator.language).hashCode();
        if (!window.Security.checkRateLimit(clientId)) {
            alert('Too many requests. Please wait before submitting again.');
            return;
        }

        const formData = new FormData(form);
        
        // CSRF validation
        if (!window.Security.validateCSRF(formData)) {
            alert('Security token invalid. Please refresh the page.');
            return;
        }

        // Input validation
        const validatedData = {};
        let isValid = true;

        Object.entries(validationRules).forEach(([field, rules]) => {
            const value = formData.get(field);
            
            if (rules.required && (!value || value.trim() === '')) {
                isValid = false;
                return;
            }

            if (rules.type === 'number') {
                const num = window.Security.validateNumber(value, rules.min, rules.max);
                if (num === null && value !== '') {
                    isValid = false;
                    return;
                }
                validatedData[field] = num;
            } else if (rules.type === 'integer') {
                const num = window.Security.validateInteger(value, rules.min, rules.max);
                if (num === null && value !== '') {
                    isValid = false;
                    return;
                }
                validatedData[field] = num;
            } else if (rules.type === 'string') {
                const str = window.Security.validateString(value, rules.minLength, rules.maxLength, rules.pattern);
                if (str === null && value !== '') {
                    isValid = false;
                    return;
                }
                validatedData[field] = str;
            } else if (rules.type === 'email') {
                if (value && !window.Security.validateEmail(value)) {
                    isValid = false;
                    return;
                }
                validatedData[field] = window.Security.sanitizeText(value);
            } else {
                validatedData[field] = window.Security.sanitizeText(value);
            }
        });

        if (!isValid) {
            alert('Please check your input and try again.');
            return;
        }

        // Execute callback with validated data
        callback(validatedData);
    });
}

// String hash function for rate limiting
String.prototype.hashCode = function() {
    let hash = 0;
    if (this.length === 0) return hash;
    for (let i = 0; i < this.length; i++) {
        const char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
}