// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

  const form = document.getElementById('twitch-form');
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
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const subscribers = parseInt(document.getElementById('subscribers').value) || 0;
    const avgDonation = parseFloat(document.getElementById('avgDonation').value) || 0;
    const streamsPerMonth = parseInt(document.getElementById('streamsPerMonth').value) || 0;
    
    let subRevenue, bitsRevenue, adRevenue, totalMonthly;
    
    if (isAdvancedMode) {
      const subTier = parseFloat(document.getElementById('subTier').value);
      const partnerStatus = parseFloat(document.getElementById('partnerStatus').value);
      const bits = parseInt(document.getElementById('bits').value) || 0;
      const giftedSubs = parseInt(document.getElementById('giftedSubs').value) || 0;
      const sponsorships = parseFloat(document.getElementById('sponsorships').value) || 0;
      const merchandise = parseFloat(document.getElementById('merchandise').value) || 0;
      adRevenue = parseFloat(document.getElementById('adRevenue').value) || 0;
      
      subRevenue = (subscribers + giftedSubs) * subTier * partnerStatus;
      bitsRevenue = (bits / 100);
      const donationRevenue = avgDonation * streamsPerMonth;
      totalMonthly = subRevenue + bitsRevenue + donationRevenue + adRevenue + sponsorships + merchandise;
    } else {
      subRevenue = subscribers * 2.5;
      bitsRevenue = 0;
      adRevenue = 0;
      const donationRevenue = avgDonation * streamsPerMonth;
      totalMonthly = subRevenue + donationRevenue;
    }
    const yearlyRevenue = totalMonthly * 12;
    
    const resultHTML = `
      <div class="bg-broder p-4 md:p-6 rounded-lg border-l-4 border-primary">
        <h3 class="text-xl text-primary mb-4 flex items-center gap-2"><span class="material-icons">account_balance_wallet</span> Earnings Breakdown</h3>
        <div class="grid gap-3 text-text text-sm md:text-base">
          <div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="material-icons text-accent">subscriptions</span> Subscription Revenue:</span><strong class="text-accent">$${subRevenue.toFixed(2)}</strong></div>
          ${isAdvancedMode ? `<div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="material-icons text-accent">diamond</span> Bits Revenue:</span><strong class="text-accent">$${bitsRevenue.toFixed(2)}</strong></div>` : ''}
          <div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="material-icons text-accent">attach_money</span> Donation Revenue:</span><strong class="text-accent">$${(avgDonation * streamsPerMonth).toFixed(2)}</strong></div>
          ${isAdvancedMode ? `<div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="material-icons text-accent">campaign</span> Ad Revenue:</span><strong class="text-accent">$${adRevenue.toFixed(2)}</strong></div>` : ''}
          ${isAdvancedMode ? `<div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="material-icons text-accent">handshake</span> Sponsorships:</span><strong class="text-accent">$${parseFloat(document.getElementById('sponsorships').value || 0).toFixed(2)}</strong></div>` : ''}
          ${isAdvancedMode ? `<div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="material-icons text-accent">shopping_bag</span> Merchandise:</span><strong class="text-accent">$${parseFloat(document.getElementById('merchandise').value || 0).toFixed(2)}</strong></div>` : ''}
          <div class="border-t border-accent pt-3 mt-2 flex justify-between items-center text-lg"><span class="flex items-center gap-2"><span class="material-icons text-primary">payments</span> Total Monthly:</span><strong class="text-primary">$${totalMonthly.toFixed(2)}</strong></div>
          <div class="flex justify-between items-center text-lg"><span class="flex items-center gap-2"><span class="material-icons text-primary">calendar_today</span> Estimated Yearly:</span><strong class="text-primary">$${yearlyRevenue.toFixed(2)}</strong></div>
        </div>
        <div class="mt-4 p-3 bg-dark rounded text-xs md:text-sm text-light">
          <p><strong>Note:</strong> Actual earnings may vary based on partnership status, region, and platform policies. This is an estimate.</p>
        </div>
      </div>
    `;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('result-content').innerHTML = resultHTML;
  });
});

