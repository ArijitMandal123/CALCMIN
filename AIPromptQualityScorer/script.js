document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('prompt-form');
    const promptTextInput = document.getElementById('prompt-text');
    const aiModelSelect = document.getElementById('ai-model');
    const promptPurposeSelect = document.getElementById('prompt-purpose');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const promptText = promptTextInput.value.trim();
        const aiModel = aiModelSelect.value;
        const promptPurpose = promptPurposeSelect.value;
        
        if (promptText.length < 10) {
            resultContent.innerHTML = `
                <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <div class="flex items-center gap-2 text-red-400">
                        <span class="material-icons">error</span>
                        <span class="font-medium">Please enter at least 10 characters for analysis</span>
                    </div>
                </div>
            `;
            resultsDiv.classList.remove('hidden');
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        const analysis = analyzePromptQuality(promptText, aiModel, promptPurpose);
        displayResults(analysis);
        
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    // ===== PROMPT QUALITY ANALYSIS LOGIC =====
    function analyzePromptQuality(promptText, aiModel, promptPurpose) {
        const analysis = {
            overallScore: 0,
            clarity: { score: 0, feedback: '', weight: 25 },
            specificity: { score: 0, feedback: '', weight: 25 },
            context: { score: 0, feedback: '', weight: 20 },
            structure: { score: 0, feedback: '', weight: 15 },
            actionability: { score: 0, feedback: '', weight: 15 },
            improvements: [],
            strengths: []
        };
        
        // Analyze Clarity (25%)
        analysis.clarity = analyzeClarity(promptText);
        
        // Analyze Specificity (25%)
        analysis.specificity = analyzeSpecificity(promptText, promptPurpose);
        
        // Analyze Context (20%)
        analysis.context = analyzeContext(promptText, promptPurpose);
        
        // Analyze Structure (15%)
        analysis.structure = analyzeStructure(promptText);
        
        // Analyze Actionability (15%)
        analysis.actionability = analyzeActionability(promptText, promptPurpose);
        
        // Calculate overall score
        analysis.overallScore = Math.round(
            (analysis.clarity.score * analysis.clarity.weight +
             analysis.specificity.score * analysis.specificity.weight +
             analysis.context.score * analysis.context.weight +
             analysis.structure.score * analysis.structure.weight +
             analysis.actionability.score * analysis.actionability.weight) / 100
        );
        
        // Generate improvements and strengths
        generateImprovements(analysis, promptText, aiModel, promptPurpose);
        
        return analysis;
    }
    
    function analyzeClarity(promptText) {
        let score = 50; // Base score
        let feedback = '';
        
        const words = promptText.split(/\s+/);
        const sentences = promptText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Check for ambiguous words
        const ambiguousWords = ['something', 'anything', 'good', 'bad', 'nice', 'stuff', 'things', 'it'];
        const ambiguousCount = ambiguousWords.filter(word => 
            promptText.toLowerCase().includes(word.toLowerCase())
        ).length;
        
        if (ambiguousCount === 0) {
            score += 20;
            feedback += 'Clear, specific language used. ';
        } else if (ambiguousCount <= 2) {
            score += 10;
            feedback += 'Mostly clear language with minor ambiguity. ';
        } else {
            score -= 10;
            feedback += 'Contains ambiguous terms that may confuse AI. ';
        }
        
        // Check sentence complexity
        const avgWordsPerSentence = words.length / sentences.length;
        if (avgWordsPerSentence <= 20) {
            score += 15;
            feedback += 'Good sentence length for clarity. ';
        } else if (avgWordsPerSentence <= 30) {
            score += 5;
            feedback += 'Acceptable sentence complexity. ';
        } else {
            score -= 10;
            feedback += 'Sentences may be too complex. ';
        }
        
        // Check for jargon or technical terms without explanation
        const technicalTerms = /\b(API|SDK|ML|AI|NLP|GPU|CPU|RAM|SaaS|B2B|ROI|KPI|CRM|ERP)\b/gi;
        const technicalMatches = promptText.match(technicalTerms);
        if (technicalMatches && technicalMatches.length > 3) {
            score -= 5;
            feedback += 'Consider explaining technical terms. ';
        }
        
        return {
            score: Math.max(0, Math.min(100, score)),
            feedback: feedback.trim(),
            weight: 25
        };
    }
    
    function analyzeSpecificity(promptText, promptPurpose) {
        let score = 40; // Base score
        let feedback = '';
        
        // Check for specific numbers, dates, quantities
        const hasNumbers = /\d+/.test(promptText);
        const hasQuantifiers = /\b(exactly|approximately|about|around|at least|no more than|between)\b/i.test(promptText);
        
        if (hasNumbers || hasQuantifiers) {
            score += 20;
            feedback += 'Contains specific quantities or measurements. ';
        } else {
            score -= 10;
            feedback += 'Add specific numbers, quantities, or measurements. ';
        }
        
        // Check for examples
        const hasExamples = /\b(example|for instance|such as|like|including)\b/i.test(promptText);
        if (hasExamples) {
            score += 15;
            feedback += 'Includes helpful examples. ';
        } else {
            score -= 5;
            feedback += 'Consider adding examples to clarify requirements. ';
        }
        
        // Check for format specifications
        const hasFormat = /\b(format|structure|organize|bullet|list|paragraph|table|json|csv)\b/i.test(promptText);
        if (hasFormat) {
            score += 15;
            feedback += 'Specifies desired output format. ';
        } else {
            score -= 10;
            feedback += 'Specify desired output format or structure. ';
        }
        
        // Check for constraints or limitations
        const hasConstraints = /\b(limit|maximum|minimum|within|under|over|must|should|avoid|exclude)\b/i.test(promptText);
        if (hasConstraints) {
            score += 10;
            feedback += 'Includes helpful constraints. ';
        }
        
        return {
            score: Math.max(0, Math.min(100, score)),
            feedback: feedback.trim(),
            weight: 25
        };
    }
    
    function analyzeContext(promptText, promptPurpose) {
        let score = 45; // Base score
        let feedback = '';
        
        const words = promptText.split(/\s+/);
        
        // Check for background information
        const hasBackground = /\b(background|context|situation|scenario|currently|previously|because|since)\b/i.test(promptText);
        if (hasBackground) {
            score += 20;
            feedback += 'Provides helpful background context. ';
        } else {
            score -= 15;
            feedback += 'Add background information or context. ';
        }
        
        // Check for audience specification
        const hasAudience = /\b(audience|readers|users|customers|students|professionals|beginners|experts)\b/i.test(promptText);
        if (hasAudience) {
            score += 15;
            feedback += 'Specifies target audience. ';
        } else {
            score -= 10;
            feedback += 'Consider specifying your target audience. ';
        }
        
        // Check for purpose/goal clarity
        const hasPurpose = /\b(goal|purpose|objective|aim|want|need|help|assist|create|generate|analyze)\b/i.test(promptText);
        if (hasPurpose) {
            score += 10;
            feedback += 'Clear purpose or goal stated. ';
        }
        
        // Length-based context assessment
        if (words.length >= 50) {
            score += 5;
            feedback += 'Sufficient detail provided. ';
        } else if (words.length < 20) {
            score -= 10;
            feedback += 'Prompt may be too brief for complex tasks. ';
        }
        
        return {
            score: Math.max(0, Math.min(100, score)),
            feedback: feedback.trim(),
            weight: 20
        };
    }
    
    function analyzeStructure(promptText) {
        let score = 60; // Base score
        let feedback = '';
        
        const sentences = promptText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Check for logical organization
        const hasSequence = /\b(first|second|third|then|next|finally|step|phase)\b/i.test(promptText);
        if (hasSequence) {
            score += 15;
            feedback += 'Well-organized with clear sequence. ';
        }
        
        // Check for role specification
        const hasRole = /\b(act as|you are|as a|role of|pretend to be)\b/i.test(promptText);
        if (hasRole) {
            score += 10;
            feedback += 'Includes role specification. ';
        } else {
            score -= 5;
            feedback += 'Consider starting with role specification. ';
        }
        
        // Check for proper punctuation and capitalization
        const hasProperCapitalization = /^[A-Z]/.test(promptText.trim());
        const hasProperPunctuation = /[.!?]$/.test(promptText.trim());
        
        if (hasProperCapitalization && hasProperPunctuation) {
            score += 10;
            feedback += 'Proper grammar and punctuation. ';
        } else {
            score -= 5;
            feedback += 'Check grammar and punctuation. ';
        }
        
        // Check for paragraph breaks (for longer prompts)
        if (promptText.length > 200) {
            const hasBreaks = promptText.includes('\n') || sentences.length > 3;
            if (hasBreaks) {
                score += 5;
                feedback += 'Good use of structure for longer prompt. ';
            } else {
                score -= 5;
                feedback += 'Consider breaking into paragraphs. ';
            }
        }
        
        return {
            score: Math.max(0, Math.min(100, score)),
            feedback: feedback.trim(),
            weight: 15
        };
    }
    
    function analyzeActionability(promptText, promptPurpose) {
        let score = 50; // Base score
        let feedback = '';
        
        // Check for action verbs
        const actionVerbs = ['write', 'create', 'generate', 'analyze', 'explain', 'describe', 'compare', 'list', 'summarize', 'calculate', 'design', 'develop'];
        const hasActionVerbs = actionVerbs.some(verb => 
            promptText.toLowerCase().includes(verb.toLowerCase())
        );
        
        if (hasActionVerbs) {
            score += 20;
            feedback += 'Contains clear action instructions. ';
        } else {
            score -= 15;
            feedback += 'Add specific action verbs (write, create, analyze, etc.). ';
        }
        
        // Check for deliverable specification
        const hasDeliverable = /\b(output|result|deliverable|produce|provide|give me|I need)\b/i.test(promptText);
        if (hasDeliverable) {
            score += 15;
            feedback += 'Specifies expected deliverable. ';
        } else {
            score -= 10;
            feedback += 'Clearly state what you want as output. ';
        }
        
        // Check for success criteria
        const hasCriteria = /\b(criteria|requirements|must|should|ensure|make sure|important)\b/i.test(promptText);
        if (hasCriteria) {
            score += 10;
            feedback += 'Includes success criteria. ';
        }
        
        // Check for step-by-step requests
        const hasSteps = /\b(step by step|steps|process|procedure|method|approach)\b/i.test(promptText);
        if (hasSteps) {
            score += 5;
            feedback += 'Requests systematic approach. ';
        }
        
        return {
            score: Math.max(0, Math.min(100, score)),
            feedback: feedback.trim(),
            weight: 15
        };
    }
    
    function generateImprovements(analysis, promptText, aiModel, promptPurpose) {
        const improvements = [];
        const strengths = [];
        
        // Generate improvements based on lowest scores
        const categories = [
            { name: 'clarity', data: analysis.clarity },
            { name: 'specificity', data: analysis.specificity },
            { name: 'context', data: analysis.context },
            { name: 'structure', data: analysis.structure },
            { name: 'actionability', data: analysis.actionability }
        ];
        
        categories.sort((a, b) => a.data.score - b.data.score);
        
        // Top 3 improvement areas
        for (let i = 0; i < Math.min(3, categories.length); i++) {
            const category = categories[i];
            if (category.data.score < 70) {
                improvements.push(getImprovementSuggestion(category.name, promptText, aiModel, promptPurpose));
            }
        }
        
        // Generate strengths from highest scores
        categories.sort((a, b) => b.data.score - a.data.score);
        for (let i = 0; i < Math.min(2, categories.length); i++) {
            const category = categories[i];
            if (category.data.score >= 70) {
                strengths.push(getStrengthFeedback(category.name));
            }
        }
        
        analysis.improvements = improvements;
        analysis.strengths = strengths;
    }
    
    function getImprovementSuggestion(category, promptText, aiModel, promptPurpose) {
        const suggestions = {
            clarity: [
                "Replace vague words like 'good', 'nice', 'stuff' with specific descriptors",
                "Break long sentences into shorter, clearer statements",
                "Define any technical terms or acronyms you use",
                "Use simple, direct language instead of complex phrases"
            ],
            specificity: [
                "Add specific numbers, quantities, or measurements (e.g., '500 words', '3 examples')",
                "Include concrete examples of what you're looking for",
                "Specify the exact format you want (bullet points, paragraphs, table)",
                "Add constraints or limitations to guide the AI"
            ],
            context: [
                "Provide background information about your situation or project",
                "Specify your target audience (beginners, experts, general public)",
                "Explain why you need this information or what you'll use it for",
                "Include relevant details about your industry or field"
            ],
            structure: [
                "Start with a role specification: 'Act as a [expert type]...'",
                "Organize your request with numbered steps or clear sections",
                "Use proper punctuation and capitalization",
                "Break longer prompts into logical paragraphs"
            ],
            actionability: [
                "Start with a clear action verb (write, create, analyze, explain)",
                "Specify exactly what you want as the final output",
                "Include success criteria or quality requirements",
                "Request a step-by-step approach for complex tasks"
            ]
        };
        
        const categoryOptions = suggestions[category] || [];
        return categoryOptions[Math.floor(Math.random() * categoryOptions.length)];
    }
    
    function getStrengthFeedback(category) {
        const strengths = {
            clarity: "Your prompt uses clear, unambiguous language",
            specificity: "You've provided specific details and requirements",
            context: "Good background information and context provided",
            structure: "Well-organized and properly structured prompt",
            actionability: "Clear action items and expected outcomes"
        };
        
        return strengths[category] || "Good work on this aspect";
    }
    
    // ===== RESULTS DISPLAY =====
    function displayResults(analysis) {
        const scoreColor = getScoreColor(analysis.overallScore);
        const scoreLevel = getScoreLevel(analysis.overallScore);
        
        resultContent.innerHTML = `
            <div class="bg-broder border border-accent rounded-lg p-6">
                <div class="text-center mb-6">
                    <div class="text-6xl font-bold ${scoreColor} mb-2">${analysis.overallScore}/100</div>
                    <div class="text-xl text-light">${scoreLevel}</div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-3">Quality Breakdown</h3>
                        <div class="space-y-3">
                            ${generateScoreBar('Clarity', analysis.clarity.score, analysis.clarity.weight)}
                            ${generateScoreBar('Specificity', analysis.specificity.score, analysis.specificity.weight)}
                            ${generateScoreBar('Context', analysis.context.score, analysis.context.weight)}
                            ${generateScoreBar('Structure', analysis.structure.score, analysis.structure.weight)}
                            ${generateScoreBar('Actionability', analysis.actionability.score, analysis.actionability.weight)}
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-3">Key Insights</h3>
                        <div class="space-y-2 text-sm">
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Clarity:</strong> ${analysis.clarity.feedback}
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Specificity:</strong> ${analysis.specificity.feedback}
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Context:</strong> ${analysis.context.feedback}
                            </div>
                        </div>
                    </div>
                </div>
                
                ${analysis.strengths.length > 0 ? `
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-green-400 mb-3">✅ Strengths</h3>
                    <ul class="space-y-2">
                        ${analysis.strengths.map(strength => `
                            <li class="flex items-start gap-2 text-text">
                                <span class="material-icons text-green-400 text-sm mt-0.5">check_circle</span>
                                ${escapeHtml(strength)}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${analysis.improvements.length > 0 ? `
                <div>
                    <h3 class="text-lg font-semibold text-yellow-400 mb-3">💡 Improvement Suggestions</h3>
                    <ul class="space-y-2">
                        ${analysis.improvements.map(improvement => `
                            <li class="flex items-start gap-2 text-text">
                                <span class="material-icons text-yellow-400 text-sm mt-0.5">lightbulb</span>
                                ${escapeHtml(improvement)}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    function generateScoreBar(label, score, weight) {
        const scoreColor = getScoreColor(score);
        return `
            <div class="flex items-center justify-between">
                <span class="text-text text-sm">${label} (${weight}%)</span>
                <div class="flex items-center gap-2">
                    <div class="w-24 h-2 bg-dark rounded-full overflow-hidden">
                        <div class="h-full ${scoreColor} transition-all duration-500" style="width: ${score}%"></div>
                    </div>
                    <span class="text-text text-sm font-medium w-8">${score}</span>
                </div>
            </div>
        `;
    }
    
    function getScoreColor(score) {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    }
    
    function getScoreLevel(score) {
        if (score >= 90) return 'Excellent Prompt Quality';
        if (score >= 80) return 'Very Good Prompt';
        if (score >= 70) return 'Good Prompt';
        if (score >= 60) return 'Fair Prompt';
        if (score >= 40) return 'Needs Improvement';
        return 'Poor Prompt Quality';
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});