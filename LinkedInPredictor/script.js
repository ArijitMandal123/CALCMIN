document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('linkedin-form');
  const resultsDiv = document.getElementById('results');
  const resultContent = document.getElementById('result-content');
  const postContent = document.getElementById('postContent');
  const hashtags = document.getElementById('hashtags');
  const charCount = document.getElementById('charCount');
  const wordCount = document.getElementById('wordCount');
  const hashtagCount = document.getElementById('hashtagCount');

  // Real-time content analysis
  postContent.addEventListener('input', updateContentStats);
  hashtags.addEventListener('input', updateHashtagCount);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    predictPerformance();
  });

  function updateContentStats() {
    const content = postContent.value;
    const chars = content.length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    
    charCount.textContent = chars;
    wordCount.textContent = words;
  }

  function updateHashtagCount() {
    const hashtagText = hashtags.value;
    const hashtagMatches = hashtagText.match(/#\w+/g);
    const count = hashtagMatches ? hashtagMatches.length : 0;
    hashtagCount.textContent = count;
  }

  function predictPerformance() {
    // Get form values
    const content = postContent.value;
    const contentType = document.getElementById('contentType').value;
    const hashtagText = hashtags.value;
    const postDay = document.getElementById('postDay').value;
    const postTime = document.getElementById('postTime').value;
    const timezone = document.getElementById('timezone').value;
    const followerCount = document.getElementById('followerCount').value;
    const engagementRate = parseFloat(document.getElementById('engagementRate').value) || 2.5;
    const industry = document.getElementById('industry').value;

    // Calculate content metrics
    const charLength = content.length;
    const wordLength = content.trim().split(/\s+/).length;
    const hashtagMatches = hashtagText.match(/#\w+/g);
    const hashtagNum = hashtagMatches ? hashtagMatches.length : 0;

    // Performance scoring algorithm
    let performanceScore = 50; // Base score

    // Content length scoring
    if (charLength >= 150 && charLength <= 1300) {
      performanceScore += 15;
    } else if (charLength < 150) {
      performanceScore -= 10;
    } else if (charLength > 2000) {
      performanceScore -= 15;
    }

    // Content type scoring
    const contentTypeScores = {
      'text': 0,
      'image': 20,
      'video': 25,
      'document': 15,
      'poll': 30,
      'carousel': 22
    };
    performanceScore += contentTypeScores[contentType] || 0;

    // Hashtag scoring
    if (hashtagNum >= 3 && hashtagNum <= 5) {
      performanceScore += 10;
    } else if (hashtagNum >= 1 && hashtagNum <= 2) {
      performanceScore += 5;
    } else if (hashtagNum > 10) {
      performanceScore -= 15;
    }

    // Timing scoring
    const dayScores = {
      'tuesday': 15, 'wednesday': 12, 'thursday': 10,
      'monday': 5, 'friday': 3, 'saturday': -5, 'sunday': -8
    };
    const timeScores = {
      'morning': 15, 'afternoon': 10, 'early': 8,
      'late': 5, 'evening': -2, 'night': -10
    };
    performanceScore += dayScores[postDay] || 0;
    performanceScore += timeScores[postTime] || 0;

    // Industry scoring
    const industryScores = {
      'tech': 10, 'marketing': 8, 'consulting': 6,
      'finance': 4, 'sales': 5, 'hr': 3, 'other': 0
    };
    performanceScore += industryScores[industry] || 0;

    // Follower count impact
    const followerMultipliers = {
      '0-500': 0.5, '500-1k': 0.7, '1k-5k': 1.0,
      '5k-10k': 1.2, '10k-50k': 1.5, '50k+': 2.0
    };
    const followerMultiplier = followerMultipliers[followerCount] || 1.0;

    // Calculate predictions
    const baseReach = Math.round(getFollowerNumber(followerCount) * 0.15 * followerMultiplier);
    const predictedReach = Math.round(baseReach * (performanceScore / 100));
    const predictedEngagement = Math.round(predictedReach * (engagementRate / 100));
    const predictedLikes = Math.round(predictedEngagement * 0.7);
    const predictedComments = Math.round(predictedEngagement * 0.2);
    const predictedShares = Math.round(predictedEngagement * 0.1);

    // Performance rating
    let rating = '';
    let ratingColor = '';
    if (performanceScore >= 85) {
      rating = 'Excellent';
      ratingColor = 'text-green-400';
    } else if (performanceScore >= 70) {
      rating = 'Good';
      ratingColor = 'text-green-300';
    } else if (performanceScore >= 55) {
      rating = 'Average';
      ratingColor = 'text-yellow-400';
    } else if (performanceScore >= 40) {
      rating = 'Below Average';
      ratingColor = 'text-orange-400';
    } else {
      rating = 'Poor';
      ratingColor = 'text-red-400';
    }

    // Generate recommendations
    const recommendations = generateRecommendations(charLength, contentType, hashtagNum, postDay, postTime, performanceScore);

    // Display results
    resultContent.innerHTML = `
      <div class="bg-broder p-6 rounded-lg border border-accent">
        <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
          <span class="material-icons text-primary">analytics</span> 
          Performance Prediction
        </h3>
        
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-light">Performance Score:</span>
              <span class="text-text font-bold">${Math.round(performanceScore)}/100</span>
            </div>
            <div class="flex justify-between">
              <span class="text-light">Rating:</span>
              <span class="font-bold ${ratingColor}">${rating}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-light">Predicted Reach:</span>
              <span class="text-text font-medium">${predictedReach.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-light">Total Engagement:</span>
              <span class="text-text font-medium">${predictedEngagement.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-light">Likes:</span>
              <span class="text-text font-medium">${predictedLikes.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-light">Comments:</span>
              <span class="text-text font-medium">${predictedComments.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-light">Shares:</span>
              <span class="text-text font-medium">${predictedShares.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-light">Engagement Rate:</span>
              <span class="text-text font-medium">${((predictedEngagement/predictedReach)*100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-lg font-medium mb-3 text-text">Content Analysis</h4>
          <div class="grid md:grid-cols-3 gap-4 text-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-light">Character Count:</span>
                <span class="text-text ${charLength >= 150 && charLength <= 1300 ? 'text-green-400' : 'text-orange-400'}">${charLength}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Word Count:</span>
                <span class="text-text">${wordLength}</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-light">Hashtags:</span>
                <span class="text-text ${hashtagNum >= 3 && hashtagNum <= 5 ? 'text-green-400' : 'text-orange-400'}">${hashtagNum}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Content Type:</span>
                <span class="text-text">${contentType}</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-light">Post Day:</span>
                <span class="text-text ${['tuesday', 'wednesday', 'thursday'].includes(postDay) ? 'text-green-400' : 'text-orange-400'}">${postDay}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light">Post Time:</span>
                <span class="text-text ${['morning', 'afternoon'].includes(postTime) ? 'text-green-400' : 'text-orange-400'}">${postTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-dark p-4 rounded border border-accent">
          <h4 class="text-lg font-medium mb-3 text-text flex items-center gap-2">
            <span class="material-icons text-accent">lightbulb</span>
            Optimization Recommendations
          </h4>
          <ul class="space-y-2 text-sm text-light">
            ${recommendations.map(rec => `<li class="flex items-start gap-2"><span class="material-icons text-xs text-accent mt-0.5">arrow_right</span>${rec}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }

  function getFollowerNumber(range) {
    const ranges = {
      '0-500': 250,
      '500-1k': 750,
      '1k-5k': 3000,
      '5k-10k': 7500,
      '10k-50k': 30000,
      '50k+': 75000
    };
    return ranges[range] || 1000;
  }

  function generateRecommendations(charLength, contentType, hashtagNum, postDay, postTime, score) {
    const recommendations = [];
    
    if (charLength < 150) {
      recommendations.push('Expand your content to 150-1300 characters for better engagement');
    } else if (charLength > 2000) {
      recommendations.push('Consider shortening your post to under 1300 characters');
    }
    
    if (hashtagNum < 3) {
      recommendations.push('Add 3-5 relevant hashtags to increase discoverability');
    } else if (hashtagNum > 10) {
      recommendations.push('Reduce hashtags to 3-5 for optimal performance');
    }
    
    if (!['tuesday', 'wednesday', 'thursday'].includes(postDay)) {
      recommendations.push('Consider posting on Tuesday-Thursday for higher engagement');
    }
    
    if (!['morning', 'afternoon'].includes(postTime)) {
      recommendations.push('Post during morning (9-12 PM) or afternoon (12-3 PM) for better reach');
    }
    
    if (contentType === 'text') {
      recommendations.push('Add visual content (image/video) to increase engagement by 20-30%');
    }
    
    if (score < 70) {
      recommendations.push('Consider adding a call-to-action to encourage engagement');
      recommendations.push('Ask a question to spark conversation in comments');
    }
    
    return recommendations;
  }
});