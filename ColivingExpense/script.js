// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

let roommateCount = 0;

const form = document.getElementById('coliving-form');
const addRoommateBtn = document.getElementById('add-roommate');
const roommatesContainer = document.getElementById('roommates-container');
const unequalRentCheckbox = document.getElementById('unequal-rent');
const roomSizesDiv = document.getElementById('room-sizes');
const individualExpensesDiv = document.getElementById('individual-expenses');
const resultsDiv = document.getElementById('results');
const resultContent = document.getElementById('result-content');

// Add initial 2 roommates
for (let i = 0; i < 2; i++) {
  addRoommate();
}

addRoommateBtn.addEventListener('click', addRoommate);

function addRoommate() {
  roommateCount++;
  const id = roommateCount;
  roommates.push({ id, name: '' });

  const div = document.createElement('div');
  div.className = 'flex gap-2 items-center';
  div.innerHTML = `
    <input type="text" data-id="${sanitizeText(id)}" placeholder="Roommate ${sanitizeText(id)} Name" class="flex-1 px-2 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary" required>
    <button type="button" onclick="removeRoommate(${sanitizeText(id)})" class="px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
      <span class="material-icons text-sm">delete</span>
    </button>
  `;
  roommatesContainer.appendChild(div);

  updateIndividualExpenses();
  if (unequalRentCheckbox.checked) updateRoomSizes();
}

function removeRoommate(id) {
  if (roommates.length <= 2) {
    // Show error message instead of alert
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-900/20 border border-red-600 rounded p-2 text-red-400 text-sm mt-2';
    errorDiv.innerHTML = '<span class="material-icons text-sm">error</span> Minimum 2 roommates required';
    roommatesContainer.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
    return;
  }
  roommates = roommates.filter(r => r.id !== id);
  const input = document.querySelector(`input[data-id="${sanitizeText(id)}"]`);
  if (input) input.parentElement.remove();
  updateIndividualExpenses();
  if (unequalRentCheckbox.checked) updateRoomSizes();
}

unequalRentCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    roomSizesDiv.classList.remove('hidden');
    updateRoomSizes();
  } else {
    roomSizesDiv.classList.add('hidden');
  }
});

function updateRoomSizes() {
  roomSizesDiv.innerHTML = '';
  roommates.forEach(r => {
    const nameInput = document.querySelector(`input[data-id="${sanitizeText(r.id)}"]`);
    const name = nameInput?.value || `Roommate ${sanitizeText(r.id)}`;
    const div = document.createElement('div');
    div.innerHTML = `
      <label class="block text-sm mb-1">${sanitizeText(name)}'s Room Size (sq ft)</label>
      <input type="number" id="room-size-${sanitizeText(r.id)}" class="w-full px-2 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary" required>
    `;
    roomSizesDiv.appendChild(div);
  });
}

function updateIndividualExpenses() {
  individualExpensesDiv.innerHTML = '';
  roommates.forEach(r => {
    const nameInput = document.querySelector(`input[data-id="${sanitizeText(r.id)}"]`);
    const name = nameInput?.value || `Roommate ${sanitizeText(r.id)}`;
    const div = document.createElement('div');
    div.innerHTML = `
      <label class="block text-sm mb-1">${sanitizeText(name)} paid for shared items ($)</label>
      <input type="number" id="paid-${sanitizeText(r.id)}" step="0.01" class="w-full px-2 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary">
    `;
    individualExpensesDiv.appendChild(div);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  calculateSplit();
});

function calculateSplit() {
  // Get roommate names
  const roommateData = roommates.map(r => {
    const nameInput = document.querySelector(`input[data-id="${sanitizeText(r.id)}"]`);
    return {
      id: r.id,
      name: nameInput.value || `Roommate ${sanitizeText(r.id)}`
    };
  });

  const totalRent = parseFloat(document.getElementById('total-rent').value) || 0;
  const electricity = parseFloat(document.getElementById('electricity').value) || 0;
  const water = parseFloat(document.getElementById('water').value) || 0;
  const gas = parseFloat(document.getElementById('gas').value) || 0;
  const internet = parseFloat(document.getElementById('internet').value) || 0;
  const groceries = parseFloat(document.getElementById('groceries').value) || 0;
  const cleaning = parseFloat(document.getElementById('cleaning').value) || 0;
  const household = parseFloat(document.getElementById('household').value) || 0;
  const other = parseFloat(document.getElementById('other').value) || 0;

  const totalUtilities = electricity + water + gas + internet;
  const totalShared = groceries + cleaning + household + other;

  // Calculate rent split
  let rentSplit = {};
  if (unequalRentCheckbox.checked) {
    let totalRoomSize = 0;
    roommateData.forEach(r => {
      const size = parseFloat(document.getElementById(`room-size-${sanitizeText(r.id)}`).value) || 0;
      totalRoomSize += size;
    });
    roommateData.forEach(r => {
      const size = parseFloat(document.getElementById(`room-size-${sanitizeText(r.id)}`).value) || 0;
      rentSplit[r.id] = (size / totalRoomSize) * totalRent;
    });
  } else {
    const perPerson = totalRent / roommateData.length;
    roommateData.forEach(r => {
      rentSplit[r.id] = perPerson;
    });
  }

  // Equal split for utilities and shared
  const utilitiesPerPerson = totalUtilities / roommateData.length;
  const sharedPerPerson = totalShared / roommateData.length;

  // Individual expenses paid
  let totalPaid = 0;
  const paidAmounts = {};
  roommateData.forEach(r => {
    const paid = parseFloat(document.getElementById(`paid-${sanitizeText(r.id)}`).value) || 0;
    paidAmounts[r.id] = paid;
    totalPaid += paid;
  });

  // Calculate final amounts
  const results = roommateData.map(r => {
    const rentOwed = rentSplit[r.id];
    const utilitiesOwed = utilitiesPerPerson;
    const sharedOwed = sharedPerPerson;
    const totalOwed = rentOwed + utilitiesOwed + sharedOwed;
    const paid = paidAmounts[r.id];
    const balance = paid - totalOwed;

    return {
      name: r.name,
      rent: rentOwed,
      utilities: utilitiesOwed,
      shared: sharedOwed,
      total: totalOwed,
      paid: paid,
      balance: balance
    };
  });

  displayResults(results, totalRent, totalUtilities, totalShared, totalPaid);
}

function displayResults(results, totalRent, totalUtilities, totalShared, totalPaid) {
  const totalExpenses = totalRent + totalUtilities + totalShared;

  let html = `
    <div class="bg-broder p-4 md:p-6 rounded-lg border border-accent">
      <h2 class="text-xl md:text-2xl font-medium mb-4 text-primary flex items-center gap-2">
        <span class="material-icons">assessment</span> Expense Breakdown
      </h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="bg-dark p-3 rounded border border-accent">
          <div class="text-xs text-light mb-1">Total Rent</div>
          <div class="text-lg font-medium text-accent">$${totalRent.toFixed(2)}</div>
        </div>
        <div class="bg-dark p-3 rounded border border-accent">
          <div class="text-xs text-light mb-1">Total Utilities</div>
          <div class="text-lg font-medium text-accent">$${totalUtilities.toFixed(2)}</div>
        </div>
        <div class="bg-dark p-3 rounded border border-accent">
          <div class="text-xs text-light mb-1">Shared Expenses</div>
          <div class="text-lg font-medium text-accent">$${totalShared.toFixed(2)}</div>
        </div>
        <div class="bg-dark p-3 rounded border border-accent">
          <div class="text-xs text-light mb-1">Total Expenses</div>
          <div class="text-lg font-medium text-primary">$${totalExpenses.toFixed(2)}</div>
        </div>
      </div>

      <h3 class="text-lg font-medium mb-3 text-text">Individual Breakdown</h3>
      <div class="space-y-3">
  `;

  results.forEach(r => {
    const balanceColor = r.balance > 0 ? 'text-green-400' : r.balance < 0 ? 'text-red-400' : 'text-light';
    const balanceText = r.balance > 0 ? `Gets back $${Math.abs(r.balance).toFixed(2)}` : 
                        r.balance < 0 ? `Owes $${Math.abs(r.balance).toFixed(2)}` : 
                        'Settled';

    html += `
      <div class="bg-dark p-4 rounded border border-accent">
        <div class="flex justify-between items-start mb-2">
          <h4 class="text-base font-medium text-text">${sanitizeText(r.name)}</h4>
          <div class="text-right">
            <div class="text-sm ${sanitizeText(balanceColor)} font-medium">${sanitizeText(balanceText)}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div>
            <span class="text-light">Rent:</span>
            <span class="text-text ml-1">$${r.rent.toFixed(2)}</span>
          </div>
          <div>
            <span class="text-light">Utilities:</span>
            <span class="text-text ml-1">$${r.utilities.toFixed(2)}</span>
          </div>
          <div>
            <span class="text-light">Shared:</span>
            <span class="text-text ml-1">$${r.shared.toFixed(2)}</span>
          </div>
          <div>
            <span class="text-light">Total Owed:</span>
            <span class="text-text ml-1">$${r.total.toFixed(2)}</span>
          </div>
        </div>
        ${r.paid > 0 ? `<div class="text-xs text-light mt-2">Already paid: $${r.paid.toFixed(2)}</div>` : ''}
      </div>
    `;
  });

  html += `
      </div>

      <div class="mt-6 p-4 bg-dark rounded border border-primary">
        <h3 class="text-base font-medium mb-2 text-primary flex items-center gap-2">
          <span class="material-icons text-sm">info</span> Settlement Summary
        </h3>
        <div class="text-sm text-light space-y-1">
  `;

  const owes = results.filter(r => r.balance < 0).sort((a, b) => a.balance - b.balance);
  const getsBack = results.filter(r => r.balance > 0).sort((a, b) => b.balance - a.balance);

  if (owes.length > 0 && getsBack.length > 0) {
    owes.forEach(debtor => {
      getsBack.forEach(creditor => {
        if (Math.abs(debtor.balance) > 0.01 && creditor.balance > 0.01) {
          const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
          html += `<div>• ${sanitizeText(debtor.name)} pays ${sanitizeText(creditor.name)}: $${amount.toFixed(2)}</div>`;
          debtor.balance += amount;
          creditor.balance -= amount;
        }
      });
    });
  } else {
    html += `<div>All expenses are settled!</div>`;
  }

  html += `
        </div>
      </div>
    </div>
  `;

  resultContent.innerHTML = html;
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

