// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('moving-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const books = parseInt(document.getElementById('books').value) || 0;
    const electronics = parseInt(document.getElementById('electronics').value) || 0;
    const decorItems = parseInt(document.getElementById('decorItems').value) || 0;
    const cushions = parseInt(document.getElementById('cushions').value) || 0;
    const clothes = parseInt(document.getElementById('clothes').value) || 0;
    const shoes = parseInt(document.getElementById('shoes').value) || 0;
    const bedding = parseInt(document.getElementById('bedding').value) || 0;
    const accessories = parseInt(document.getElementById('accessories').value) || 0;
    const dishes = parseInt(document.getElementById('dishes').value) || 0;
    const glassware = parseInt(document.getElementById('glassware').value) || 0;
    const pots = parseInt(document.getElementById('pots').value) || 0;
    const appliances = parseInt(document.getElementById('appliances').value) || 0;
    const toiletries = parseInt(document.getElementById('toiletries').value) || 0;
    const towels = parseInt(document.getElementById('towels').value) || 0;
    
    const smallBoxes = Math.ceil(books / 20) + Math.ceil(dishes / 12) + Math.ceil(glassware / 10) + Math.ceil(toiletries / 15);
    const mediumBoxes = Math.ceil(electronics / 3) + Math.ceil(decorItems / 8) + Math.ceil(pots / 6) + Math.ceil(appliances / 2) + Math.ceil(accessories / 20);
    const largeBoxes = Math.ceil(clothes / 30) + Math.ceil(cushions / 10) + Math.ceil(bedding / 3) + Math.ceil(towels / 8);
    const wardrobeBoxes = Math.ceil(shoes / 12);
    
    const totalBoxes = smallBoxes + mediumBoxes + largeBoxes + wardrobeBoxes;
    const estimatedCost = (smallBoxes * 2) + (mediumBoxes * 3) + (largeBoxes * 4) + (wardrobeBoxes * 8);
    
    const resultHTML = `
      <div class="bg-broder p-4 md:p-6 rounded-lg border-l-4 border-primary">
        <h3 class="text-xl text-primary mb-4 flex items-center gap-2"><span class="material-icons">inventory</span> Box Requirements</h3>
        <div class="grid gap-4 text-text text-sm md:text-base">
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">inventory_2</span><strong>Small Boxes (16x12x12"):</strong></div>
            <p class="text-2xl text-primary font-bold ml-8">${sanitizeText(smallBoxes)} boxes</p>
            <p class="text-sm text-light ml-8">Books, dishes, glassware, toiletries</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">inventory_2</span><strong>Medium Boxes (18x18x16"):</strong></div>
            <p class="text-2xl text-primary font-bold ml-8">${sanitizeText(mediumBoxes)} boxes</p>
            <p class="text-sm text-light ml-8">Electronics, decor, pots, appliances</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">inventory_2</span><strong>Large Boxes (20x20x20"):</strong></div>
            <p class="text-2xl text-primary font-bold ml-8">${sanitizeText(largeBoxes)} boxes</p>
            <p class="text-sm text-light ml-8">Clothes, cushions, bedding, towels</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">checkroom</span><strong>Wardrobe Boxes:</strong></div>
            <p class="text-2xl text-primary font-bold ml-8">${sanitizeText(wardrobeBoxes)} boxes</p>
            <p class="text-sm text-light ml-8">Shoes and hanging clothes</p>
          </div>
          
          <div class="bg-dark p-4 rounded border-2 border-primary">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-primary">shopping_cart</span><strong>Total Boxes Needed:</strong></div>
            <p class="text-3xl text-primary font-bold ml-8">${sanitizeText(totalBoxes)} boxes</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">attach_money</span><strong>Estimated Box Cost:</strong></div>
            <p class="text-2xl text-accent font-bold ml-8">$${sanitizeText(estimatedCost)}</p>
          </div>
          
          <div class="bg-dark p-4 rounded">
            <div class="flex items-center gap-2 mb-2"><span class="material-icons text-accent">tips_and_updates</span><strong>Packing Tips:</strong></div>
            <ul class="ml-8 space-y-2 list-disc list-inside text-sm">
              <li>Pack heavy items in small boxes to avoid overloading</li>
              <li>Use bubble wrap for fragile items like dishes and glassware</li>
              <li>Label all boxes with room and contents</li>
              <li>Add 10-15% extra boxes for miscellaneous items</li>
              <li>Don't overfill boxes - leave space for cushioning</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('result-content').innerHTML = resultHTML;
  });
});

