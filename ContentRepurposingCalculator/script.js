document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('content-form');
    const contentTypeSelect = document.getElementById('content-type');
    const contentLengthInput = document.getElementById('content-length');
    const lengthUnitSelect = document.getElementById('length-unit');
    const platformCheckboxes = document.querySelectorAll('.platform-checkbox');
    const qualityLevelSelect = document.getElementById('quality-level');
    const followerCountInput = document.getElementById('follower-count');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('result-content');
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const contentType = contentTypeSelect.value;
        const contentLength = parseInt(contentLengthInput.value);
        const lengthUnit = lengthUnitSelect.value;
        const selectedPlatforms = Array.from(platformCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const qualityLevel = qualityLevelSelect.value;
        const followerCount = parseInt(followerCountInput.value) || 0;
        
        if (!contentType || !contentLength || selectedPlatforms.length === 0) {
            resultContent.innerHTML = `
                <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <div class="flex items-center gap-2 text-red-400">
                        <span class="material-icons">error</span>
                        <span class="font-medium">Please fill in all required fields and select at least one platform</span>
                    </div>
                </div>
            `;
            resultsDiv.classList.remove('hidden');
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        const analysis = calculateRepurposingValue(contentType, contentLength, lengthUnit, selectedPlatforms, qualityLevel, followerCount);
        displayResults(analysis);
        
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    // ===== CONTENT REPURPOSING CALCULATION LOGIC =====
    function calculateRepurposingValue(contentType, contentLength, lengthUnit, platforms, qualityLevel, followerCount) {
        const analysis = {
            totalPieces: 0,
            platformBreakdown: {},
            timeInvestment: 0,
            estimatedReach: 0,
            contentSuggestions: [],
            roiAnalysis: {}
        };
        
        // Convert content length to standardized format (words)
        const standardizedLength = convertToWords(contentLength, lengthUnit, contentType);
        
        // Get base multipliers for content type
        const baseMultipliers = getContentTypeMultipliers(contentType, standardizedLength);
        
        // Calculate platform-specific content pieces
        platforms.forEach(platform => {
            const platformData = calculatePlatformContent(platform, baseMultipliers, qualityLevel);
            analysis.platformBreakdown[platform] = platformData;
            analysis.totalPieces += platformData.pieces;
        });
        
        // Calculate time investment
        analysis.timeInvestment = calculateTimeInvestment(analysis.totalPieces, qualityLevel);
        
        // Calculate estimated reach
        analysis.estimatedReach = calculateEstimatedReach(platforms, followerCount, analysis.totalPieces);
        
        // Generate content suggestions
        analysis.contentSuggestions = generateContentSuggestions(contentType, platforms, qualityLevel);
        
        // Calculate ROI analysis
        analysis.roiAnalysis = calculateROI(analysis.totalPieces, analysis.timeInvestment, analysis.estimatedReach);
        
        return analysis;
    }
    
    function convertToWords(length, unit, contentType) {
        switch (unit) {
            case 'words':
                return length;
            case 'minutes':
                // Approximate words per minute based on content type
                const wordsPerMinute = {
                    'blog-post': 200,
                    'video': 150,
                    'podcast': 160,
                    'webinar': 140,
                    'ebook': 200,
                    'case-study': 180,
                    'research': 200,
                    'interview': 150
                };
                return length * (wordsPerMinute[contentType] || 160);
            case 'pages':
                return length * 250; // Average words per page
            default:
                return length;
        }
    }
    
    function getContentTypeMultipliers(contentType, wordCount) {
        const baseMultipliers = {
            'blog-post': {
                social: Math.min(15, Math.floor(wordCount / 150)),
                visual: Math.min(8, Math.floor(wordCount / 300)),
                video: Math.min(5, Math.floor(wordCount / 400)),
                email: Math.min(6, Math.floor(wordCount / 250)),
                audio: Math.min(3, Math.floor(wordCount / 500))
            },
            'video': {
                social: Math.min(12, Math.floor(wordCount / 200)),
                visual: Math.min(10, Math.floor(wordCount / 150)),
                video: Math.min(8, Math.floor(wordCount / 100)),
                email: Math.min(5, Math.floor(wordCount / 300)),
                audio: Math.min(4, Math.floor(wordCount / 400))
            },
            'podcast': {
                social: Math.min(15, Math.floor(wordCount / 180)),
                visual: Math.min(8, Math.floor(wordCount / 250)),
                video: Math.min(6, Math.floor(wordCount / 300)),
                email: Math.min(7, Math.floor(wordCount / 200)),
                audio: Math.min(5, Math.floor(wordCount / 350))
            },
            'webinar': {
                social: Math.min(18, Math.floor(wordCount / 160)),
                visual: Math.min(10, Math.floor(wordCount / 200)),
                video: Math.min(8, Math.floor(wordCount / 250)),
                email: Math.min(8, Math.floor(wordCount / 180)),
                audio: Math.min(6, Math.floor(wordCount / 300))
            },
            'ebook': {
                social: Math.min(25, Math.floor(wordCount / 120)),
                visual: Math.min(15, Math.floor(wordCount / 200)),
                video: Math.min(10, Math.floor(wordCount / 300)),
                email: Math.min(12, Math.floor(wordCount / 150)),
                audio: Math.min(8, Math.floor(wordCount / 250))
            },
            'case-study': {
                social: Math.min(12, Math.floor(wordCount / 200)),
                visual: Math.min(8, Math.floor(wordCount / 250)),
                video: Math.min(5, Math.floor(wordCount / 350)),
                email: Math.min(6, Math.floor(wordCount / 200)),
                audio: Math.min(3, Math.floor(wordCount / 400))
            },
            'research': {
                social: Math.min(20, Math.floor(wordCount / 150)),
                visual: Math.min(12, Math.floor(wordCount / 200)),
                video: Math.min(8, Math.floor(wordCount / 300)),
                email: Math.min(10, Math.floor(wordCount / 180)),
                audio: Math.min(6, Math.floor(wordCount / 350))
            },
            'interview': {
                social: Math.min(14, Math.floor(wordCount / 170)),
                visual: Math.min(9, Math.floor(wordCount / 220)),
                video: Math.min(7, Math.floor(wordCount / 280)),
                email: Math.min(7, Math.floor(wordCount / 200)),
                audio: Math.min(5, Math.floor(wordCount / 320))
            }
        };
        
        return baseMultipliers[contentType] || baseMultipliers['blog-post'];
    }
    
    function calculatePlatformContent(platform, baseMultipliers, qualityLevel) {
        const qualityMultiplier = {
            'basic': 0.7,
            'standard': 1.0,
            'premium': 1.4
        }[qualityLevel];
        
        const platformMappings = {
            'linkedin': {
                types: ['social', 'visual', 'video'],
                weights: [0.6, 0.3, 0.1],
                avgEngagement: 0.027
            },
            'instagram': {
                types: ['visual', 'social', 'video'],
                weights: [0.5, 0.3, 0.2],
                avgEngagement: 0.018
            },
            'tiktok': {
                types: ['video', 'social'],
                weights: [0.8, 0.2],
                avgEngagement: 0.055
            },
            'youtube': {
                types: ['video', 'visual'],
                weights: [0.7, 0.3],
                avgEngagement: 0.042
            },
            'twitter': {
                types: ['social', 'visual'],
                weights: [0.7, 0.3],
                avgEngagement: 0.021
            },
            'facebook': {
                types: ['social', 'visual', 'video'],
                weights: [0.4, 0.4, 0.2],
                avgEngagement: 0.015
            },
            'pinterest': {
                types: ['visual', 'social'],
                weights: [0.8, 0.2],
                avgEngagement: 0.012
            },
            'email': {
                types: ['email', 'social'],
                weights: [0.8, 0.2],
                avgEngagement: 0.25
            },
            'blog': {
                types: ['social', 'visual', 'email'],
                weights: [0.5, 0.3, 0.2],
                avgEngagement: 0.035
            }
        };
        
        const platformData = platformMappings[platform];
        let totalPieces = 0;
        
        platformData.types.forEach((type, index) => {
            const basePieces = baseMultipliers[type] || 0;
            const weightedPieces = Math.round(basePieces * platformData.weights[index] * qualityMultiplier);
            totalPieces += weightedPieces;
        });
        
        return {
            pieces: Math.max(1, totalPieces),
            avgEngagement: platformData.avgEngagement,
            formats: getFormatSuggestions(platform, totalPieces)
        };
    }
    
    function getFormatSuggestions(platform, pieceCount) {
        const formatSuggestions = {
            'linkedin': ['Professional posts', 'Carousel slides', 'Video clips', 'Poll questions', 'Industry insights'],
            'instagram': ['Quote graphics', 'Story highlights', 'Reels', 'IGTV videos', 'Carousel posts'],
            'tiktok': ['Quick tips', 'Behind-scenes', 'Trending audio', 'Educational series', 'Transformations'],
            'youtube': ['Shorts', 'Tutorial series', 'Compilations', 'Live streams', 'Reaction videos'],
            'twitter': ['Thread series', 'Quote tweets', 'Poll questions', 'Image posts', 'Video clips'],
            'facebook': ['Status updates', 'Photo albums', 'Video posts', 'Event announcements', 'Group discussions'],
            'pinterest': ['Infographic pins', 'Quote graphics', 'Step-by-step guides', 'Before/after', 'Tip collections'],
            'email': ['Newsletter segments', 'Tip series', 'Case study breakdowns', 'Resource roundups', 'Personal stories'],
            'blog': ['Related posts', 'Resource pages', 'FAQ sections', 'Guest post pitches', 'Series continuations']
        };
        
        const suggestions = formatSuggestions[platform] || [];
        return suggestions.slice(0, Math.min(5, Math.ceil(pieceCount / 2)));
    }
    
    function calculateTimeInvestment(totalPieces, qualityLevel) {
        const timePerPiece = {
            'basic': 0.25,      // 15 minutes per piece
            'standard': 0.5,    // 30 minutes per piece
            'premium': 1.0      // 60 minutes per piece
        }[qualityLevel];
        
        return Math.round(totalPieces * timePerPiece * 10) / 10; // Round to 1 decimal
    }
    
    function calculateEstimatedReach(platforms, followerCount, totalPieces) {
        if (followerCount === 0) return 0;
        
        const avgReachRate = 0.15; // 15% of followers typically see content
        const platformMultiplier = Math.min(2.0, 1 + (platforms.length - 1) * 0.2);
        const contentMultiplier = Math.min(3.0, 1 + (totalPieces - 1) * 0.05);
        
        return Math.round(followerCount * avgReachRate * platformMultiplier * contentMultiplier);
    }
    
    function generateContentSuggestions(contentType, platforms, qualityLevel) {
        const suggestions = {
            'blog-post': [
                'Extract key quotes for social media graphics',
                'Create step-by-step carousel posts',
                'Turn statistics into infographics',
                'Record video explanations of main points',
                'Write email newsletter series from sections'
            ],
            'video': [
                'Create short clips for social media',
                'Extract audio for podcast episodes',
                'Generate quote graphics from key moments',
                'Write blog posts from video transcript',
                'Create behind-the-scenes content'
            ],
            'podcast': [
                'Create audiogram clips for social sharing',
                'Extract quotes for graphic design',
                'Write blog posts from episode transcript',
                'Create video versions with simple visuals',
                'Develop email series from episode themes'
            ],
            'webinar': [
                'Break into educational video series',
                'Create presentation slide carousels',
                'Extract Q&A for FAQ content',
                'Generate tip sheets from key points',
                'Create follow-up email sequences'
            ]
        };
        
        const baseSuggestions = suggestions[contentType] || suggestions['blog-post'];
        const count = qualityLevel === 'premium' ? 5 : qualityLevel === 'standard' ? 4 : 3;
        
        return baseSuggestions.slice(0, count);
    }
    
    function calculateROI(totalPieces, timeInvestment, estimatedReach) {
        const contentEfficiency = totalPieces / Math.max(1, timeInvestment);
        const reachEfficiency = estimatedReach / Math.max(1, timeInvestment);
        
        let roiLevel = 'Good';
        if (contentEfficiency >= 3 && reachEfficiency >= 1000) {
            roiLevel = 'Excellent';
        } else if (contentEfficiency >= 2 && reachEfficiency >= 500) {
            roiLevel = 'Very Good';
        } else if (contentEfficiency >= 1.5 && reachEfficiency >= 200) {
            roiLevel = 'Good';
        } else {
            roiLevel = 'Fair';
        }
        
        return {
            level: roiLevel,
            contentEfficiency: Math.round(contentEfficiency * 10) / 10,
            reachEfficiency: Math.round(reachEfficiency),
            timeROI: `${Math.round((totalPieces - 1) * 100)}% more content for ${Math.round(timeInvestment * 100)}% more time`
        };
    }
    
    // ===== RESULTS DISPLAY =====
    function displayResults(analysis) {
        const roiColor = getRoiColor(analysis.roiAnalysis.level);
        
        resultContent.innerHTML = `
            <div class="bg-broder border border-accent rounded-lg p-6">
                <div class="text-center mb-6">
                    <div class="text-5xl font-bold text-primary mb-2">${analysis.totalPieces}</div>
                    <div class="text-xl text-light">Total Content Pieces</div>
                    <div class="text-sm text-accent mt-1">From 1 Original Piece</div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-3">Platform Breakdown</h3>
                        <div class="space-y-3">
                            ${Object.entries(analysis.platformBreakdown).map(([platform, data]) => `
                                <div class="flex items-center justify-between">
                                    <span class="text-text capitalize">${platform.replace('-', ' ')}</span>
                                    <div class="flex items-center gap-2">
                                        <span class="text-accent font-medium">${data.pieces} pieces</span>
                                        <span class="text-xs text-light">(${Math.round(data.avgEngagement * 100)}% avg engagement)</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-3">ROI Analysis</h3>
                        <div class="space-y-2 text-sm">
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">ROI Level:</strong> 
                                <span class="${roiColor}">${analysis.roiAnalysis.level}</span>
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Time Investment:</strong> ${analysis.timeInvestment} hours
                            </div>
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Content Efficiency:</strong> ${analysis.roiAnalysis.contentEfficiency} pieces/hour
                            </div>
                            ${analysis.estimatedReach > 0 ? `
                            <div class="bg-dark border border-accent rounded p-3">
                                <strong class="text-accent">Estimated Reach:</strong> ${analysis.estimatedReach.toLocaleString()} impressions
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">📋 Content Format Suggestions</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        ${Object.entries(analysis.platformBreakdown).map(([platform, data]) => `
                            <div class="bg-dark border border-accent rounded p-3">
                                <h4 class="text-accent font-semibold capitalize mb-2">${platform.replace('-', ' ')}</h4>
                                <ul class="text-xs text-text space-y-1">
                                    ${data.formats.map(format => `<li>• ${format}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold text-primary mb-3">💡 Repurposing Strategy Tips</h3>
                    <ul class="space-y-2">
                        ${analysis.contentSuggestions.map(suggestion => `
                            <li class="flex items-start gap-2 text-text">
                                <span class="material-icons text-accent text-sm mt-0.5">lightbulb</span>
                                ${suggestion}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="mt-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 text-center">
                    <div class="text-primary font-semibold mb-2">🚀 Content Multiplication Success!</div>
                    <div class="text-sm text-text">
                        You can create <strong>${analysis.totalPieces}x more content</strong> in just <strong>${analysis.timeInvestment} hours</strong>
                        ${analysis.estimatedReach > 0 ? ` and potentially reach <strong>${analysis.estimatedReach.toLocaleString()} people</strong>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    function getRoiColor(level) {
        const colors = {
            'Excellent': 'text-green-400',
            'Very Good': 'text-green-300',
            'Good': 'text-yellow-400',
            'Fair': 'text-orange-400'
        };
        return colors[level] || 'text-gray-400';
    }
});