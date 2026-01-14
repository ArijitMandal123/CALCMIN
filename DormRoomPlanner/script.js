// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

document.getElementById('dorm-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const roomLength = parseFloat(document.getElementById('roomLength').value);
  const roomWidth = parseFloat(document.getElementById('roomWidth').value);
  const roomType = document.getElementById('roomType').value;
  const doorLocation = document.getElementById('doorLocation').value;
  const windowCount = parseInt(document.getElementById('windowCount').value);
  const closetType = document.getElementById('closetType').value;
  const bedType = document.getElementById('bedType').value;
  const deskSize = document.getElementById('deskSize').value;
  const storageNeeds = document.getElementById('storageNeeds').value;
  const extraFurniture = document.getElementById('extraFurniture').value;

  const roomArea = roomLength * roomWidth;
  const isSmallRoom = roomArea < 100;
  const isMediumRoom = roomArea >= 100 && roomArea < 150;
  
  // Calculate space efficiency
  let spaceEfficiency = 'Good';
  let efficiencyColor = 'text-green-400';
  
  if (roomType === 'triple' && roomArea < 120) {
    spaceEfficiency = 'Cramped';
    efficiencyColor = 'text-red-400';
  } else if (roomType === 'double' && roomArea < 80) {
    spaceEfficiency = 'Tight';
    efficiencyColor = 'text-orange-400';
  } else if (isSmallRoom) {
    spaceEfficiency = 'Cozy';
    efficiencyColor = 'text-yellow-400';
  }

  // Generate layout recommendations
  const recommendations = generateRecommendations(roomType, bedType, isSmallRoom, doorLocation, storageNeeds);
  
  // Calculate furniture dimensions and placement
  const furnitureLayout = calculateFurnitureLayout(roomLength, roomWidth, bedType, deskSize, roomType);

  displayResults(roomArea, spaceEfficiency, efficiencyColor, recommendations, furnitureLayout, roomType);
});

function generateRecommendations(roomType, bedType, isSmall, doorLocation, storage) {
  const tips = [];
  
  if (isSmall) {
    tips.push('Consider loft beds to maximize floor space');
    tips.push('Use vertical storage solutions');
    tips.push('Multi-functional furniture is essential');
  }
  
  if (bedType === 'loft') {
    tips.push('Place desk underneath loft bed');
    tips.push('Ensure adequate headroom (6+ feet)');
  }
  
  if (roomType === 'double' || roomType === 'triple') {
    tips.push('Create privacy zones with furniture placement');
    tips.push('Coordinate with roommate(s) on shared items');
  }
  
  if (storage === 'extensive') {
    tips.push('Invest in under-bed storage containers');
    tips.push('Use over-door organizers');
    tips.push('Consider storage ottoman/seating');
  }
  
  if (doorLocation === 'center-wall') {
    tips.push('Avoid blocking door swing with furniture');
    tips.push('Create clear pathway from door');
  }
  
  return tips;
}

function calculateFurnitureLayout(length, width, bedType, deskSize, roomType) {
  const layout = {};
  
  // Bed dimensions
  const bedSizes = {
    twin: { length: 6.25, width: 3.25 },
    'twin-xl': { length: 6.67, width: 3.25 },
    loft: { length: 6.67, width: 3.25, height: 6 },
    bunk: { length: 6.67, width: 3.25, height: 6 }
  };
  
  // Desk dimensions
  const deskSizes = {
    compact: { length: 3, width: 1.5 },
    standard: { length: 4, width: 2 },
    large: { length: 5, width: 2.5 }
  };
  
  layout.bed = bedSizes[bedType];
  layout.desk = deskSizes[deskSize];
  
  // Calculate remaining space
  const usedSpace = layout.bed.length * layout.bed.width + layout.desk.length * layout.desk.width;
  const totalSpace = length * width;
  layout.remainingSpace = totalSpace - usedSpace;
  layout.spaceUtilization = ((usedSpace / totalSpace) * 100).toFixed(1);
  
  return layout;
}

function displayResults(area, efficiency, efficiencyColor, tips, layout, roomType) {
  const resultsDiv = document.getElementById('results');
  const contentDiv = document.getElementById('result-content');

  const roomSize = area < 100 ? 'Small' : area < 150 ? 'Medium' : 'Large';
  const sizeColor = area < 100 ? 'text-orange-400' : area < 150 ? 'text-yellow-400' : 'text-green-400';

  contentDiv.innerHTML = `
    <div class="bg-broder border border-accent rounded-lg p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-medium text-text mb-4 flex items-center gap-2">
        <span class="material-icons text-primary">design_services</span> Dorm Room Layout Plan
      </h2>
      
      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div class="bg-dark p-4 rounded text-center">
          <div class="text-primary text-3xl font-bold">${area.toFixed(0)}</div>
          <div class="text-light text-sm">Square Feet</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="${sanitizeText(sizeColor)} text-2xl font-bold">${sanitizeText(roomSize)}</div>
          <div class="text-light text-sm">Room Size</div>
        </div>
        <div class="bg-dark p-4 rounded text-center">
          <div class="${sanitizeText(efficiencyColor)} text-2xl font-bold">${sanitizeText(efficiency)}</div>
          <div class="text-light text-sm">Space Rating</div>
        </div>
      </div>

      <div class="bg-dark p-4 rounded mb-4">
        <h3 class="text-text font-medium mb-3">Furniture Layout Analysis</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-light">Bed Space:</span><span class="text-text font-medium">${(layout.bed.length * layout.bed.width).toFixed(1)} sq ft</span></div>
          <div class="flex justify-between"><span class="text-light">Desk Space:</span><span class="text-text font-medium">${(layout.desk.length * layout.desk.width).toFixed(1)} sq ft</span></div>
          <div class="flex justify-between"><span class="text-light">Remaining Space:</span><span class="text-text font-medium">${layout.remainingSpace.toFixed(1)} sq ft</span></div>
          <div class="flex justify-between border-t border-accent pt-2"><span class="text-light">Space Utilization:</span><span class="text-text font-medium">${sanitizeText(layout.spaceUtilization)}%</span></div>
        </div>
      </div>

      <div class="bg-dark p-4 rounded mb-4">
        <h3 class="text-text font-medium mb-3">Optimal Layout Strategy</h3>
        <div class="text-sm text-light">
          ${roomType === 'single' ? 
            'Single room allows flexible furniture arrangement. Place bed along longest wall, desk near window for natural light.' :
            roomType === 'double' ?
            'Double room requires coordination. Consider L-shaped arrangement with beds on adjacent walls, desks opposite each other.' :
            'Triple room needs creative solutions. Bunk beds or loft beds are essential. Create distinct zones for each person.'
          }
        </div>
      </div>
      
      <div class="bg-accent/20 border border-accent rounded p-3 text-sm">
        <strong>🏠 Layout Recommendations:</strong>
        <ul class="mt-2 space-y-1 text-light">
          ${tips.map(tip => `<li>• ${tip}</li>`).join('')}
          <li>• Measure twice, buy once - verify dimensions before purchasing</li>
          <li>• Leave 2-3 feet of walking space around furniture</li>
        </ul>
      </div>
    </div>
  `;
  
  resultsDiv.classList.remove('hidden');
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
