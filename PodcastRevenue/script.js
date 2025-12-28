document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('podcast-form');
  const easyModeBtn = document.getElementById('easyMode');
  const advancedModeBtn = document.getElementById('advancedMode');
  const easyFields = document.getElementById('easyFields');
  const advancedFields = document.getElementById('advancedFields');
  let isAdvancedMode = false;

  easyModeBtn.addEventListener('click', () => {
    isAdvancedMode = false;
    easyModeBtn.classList.add('bg-primary', 'border-primary');
    easyModeBtn.classList.remove('bg-broder', 'border-accent');
    advancedModeBtn.classList.remove('bg-primary', 'border-primary');
    advancedModeBtn.classList.add('bg-broder', 'border-accent');
    easyFields.classList.remove('hidden');
    advancedFields.classList.add('hidden');
  });

  advancedModeBtn.addEventListener('click', () => {
    isAdvancedMode = true;
    advancedModeBtn.classList.add('bg-primary', 'border-primary');
    advancedModeBtn.classList.remove('bg-broder', 'border-accent');
    easyModeBtn.classList.remove('bg-primary', 'border-primary');
    easyModeBtn.classList.add('bg-broder', 'border-accent');
    advancedFields.classList.remove('hidden');
    easyFields.classList.add('hidden');
  });
  
  const cpmRates = {
    business: { us: 35, uk: 28, canada: 26, australia: 24, europe: 20, asia: 12, other: 10 },
    tech: { us: 32, uk: 26, canada: 24, australia: 22, europe: 18, asia: 11, other: 9 },
    health: { us: 28, uk: 22, canada: 20, australia: 19, europe: 16, asia: 10, other: 8 },
    education: { us: 25, uk: 20, canada: 18, australia: 17, europe: 14, asia: 9, other: 7 },
    entertainment: { us: 20, uk: 16, canada: 15, australia: 14, europe: 12, asia: 8, other: 6 },
    sports: { us: 22, uk: 18, canada: 16, australia: 15, europe: 13, asia: 8, other: 6 },
    comedy: { us: 18, uk: 15, canada: 14, australia: 13, europe: 11, asia: 7, other: 5 }
  };
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const downloads = parseInt(document.getElementById('downloads').value);
    const niche = document.getElementById('niche').value;
    const adsPerEpisode = parseInt(document.getElementById('adsPerEpisode').value);
    
    let audience, cpm, monthlyRevenue, yearlyRevenue, perEpisodeRevenue;
    let sponsorships = 0, patreon = 0, merchandise = 0, affiliateRevenue = 0;
    
    if (isAdvancedMode) {
      audience = document.getElementById('audience').value;
      const episodesPerMonth = parseInt(document.getElementById('episodesPerMonth').value) || 4;
      sponsorships = parseFloat(document.getElementById('sponsorships').value) || 0;
      patreon = parseFloat(document.getElementById('patreon').value) || 0;
      merchandise = parseFloat(document.getElementById('merchandise').value) || 0;
      affiliateRevenue = parseFloat(document.getElementById('affiliateRevenue').value) || 0;
      
      cpm = cpmRates[niche][audience];
      const adRevenue = (downloads / 1000) * cpm * adsPerEpisode;
      monthlyRevenue = adRevenue + sponsorships + patreon + merchandise + affiliateRevenue;
      yearlyRevenue = monthlyRevenue * 12;
      perEpisodeRevenue = monthlyRevenue / episodesPerMonth;
    } else {
      audience = 'us';
      cpm = cpmRates[niche][audience];
      monthlyRevenue = (downloads / 1000) * cpm * adsPerEpisode;
      yearlyRevenue = monthlyRevenue * 12;
      perEpisodeRevenue = monthlyRevenue / 4;
    }
    
    const resultHTML = `
      <div class="bg-broder p-4 md:p-6 rounded-lg border-l-4 border-primary">
        <h3 class="text-xl text-primary mb-4 flex items-center gap-2"><span class="material-icons">account_balance_wallet</span> Revenue Breakdown</h3>
        <div class="grid gap-4 text-text text-sm md:text-base">
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">trending_up</span><strong>CPM Rate:</strong></div>
            <p class="text-2xl text-primary font-bold ml-8">$${cpm.toFixed(2)}</p>
          </div>
          
          ${isAdvancedMode ? `<div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">campaign</span><strong>Ad Revenue:</strong></div>
            <p class="text-xl text-accent font-bold ml-8">$${((downloads / 1000) * cpm * adsPerEpisode).toFixed(2)}</p>
          </div>` : ''}
          
          ${isAdvancedMode && sponsorships > 0 ? `<div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">handshake</span><strong>Sponsorships:</strong></div>
            <p class="text-xl text-accent font-bold ml-8">$${sponsorships.toFixed(2)}</p>
          </div>` : ''}
          
          ${isAdvancedMode && patreon > 0 ? `<div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">card_membership</span><strong>Memberships:</strong></div>
            <p class="text-xl text-accent font-bold ml-8">$${patreon.toFixed(2)}</p>
          </div>` : ''}
          
          ${isAdvancedMode && merchandise > 0 ? `<div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">shopping_bag</span><strong>Merchandise:</strong></div>
            <p class="text-xl text-accent font-bold ml-8">$${merchandise.toFixed(2)}</p>
          </div>` : ''}
          
          ${isAdvancedMode && affiliateRevenue > 0 ? `<div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">link</span><strong>Affiliate Revenue:</strong></div>
            <p class="text-xl text-accent font-bold ml-8">$${affiliateRevenue.toFixed(2)}</p>
          </div>` : ''}
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">payments</span><strong>Total Monthly:</strong></div>
            <p class="text-2xl text-primary font-bold ml-8">$${monthlyRevenue.toFixed(2)}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">calendar_today</span><strong>Yearly Revenue:</strong></div>
            <p class="text-2xl text-primary font-bold ml-8">$${yearlyRevenue.toFixed(2)}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">mic</span><strong>Per Episode (avg):</strong></div>
            <p class="text-xl text-accent font-bold ml-8">$${perEpisodeRevenue.toFixed(2)}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">tips_and_updates</span><strong>Growth Tips:</strong></div>
            <ul class="ml-8 space-y-2 list-disc list-inside text-sm">
              <li>Reach 10K downloads/month for direct ad deals</li>
              <li>Premium niches (Business/Tech) command higher CPMs</li>
              <li>US/UK audiences typically pay 2-3x more</li>
              <li>Dynamic ad insertion increases fill rates</li>
              <li>Sponsorships can pay 2-5x more than programmatic ads</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-dark rounded text-xs md:text-sm text-light">
          <p><strong>Note:</strong> Actual revenue varies based on ad network, fill rate, and direct sponsorships. These are industry average estimates.</p>
        </div>
      </div>
    `;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('result-content').innerHTML = resultHTML;
  });
});
