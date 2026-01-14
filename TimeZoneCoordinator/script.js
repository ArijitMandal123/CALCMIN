// Security utilities - Prevent XSS and code injection
function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

  const form = document.getElementById('timezone-form');
  const resultsDiv = document.getElementById('results');
  const resultContent = document.getElementById('result-content');
  const addMemberBtn = document.getElementById('add-member');
  const teamMembersDiv = document.getElementById('team-members');

  let memberCount = 1;

  addMemberBtn.addEventListener('click', addTeamMember);
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    findOptimalTimes();
  });

  function addTeamMember() {
    memberCount++;
    const memberRow = document.createElement('div');
    memberRow.className = 'member-row grid gap-3 mb-3 p-3 bg-dark rounded border border-accent';
    memberRow.innerHTML = `
      <div class="grid md:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs text-light mb-1">Name/Role</label>
          <input type="text" class="member-name w-full px-3 py-2 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Team Member ${sanitizeText(memberCount)}" required>
        </div>
        <div>
          <label class="block text-xs text-light mb-1">Time Zone</label>
          <select class="member-timezone w-full px-3 py-2 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary" required>
            <option value="">Select Time Zone</option>
            <option value="UTC-12">UTC-12 (Baker Island)</option>
            <option value="UTC-11">UTC-11 (American Samoa)</option>
            <option value="UTC-10">UTC-10 (Hawaii)</option>
            <option value="UTC-9">UTC-9 (Alaska)</option>
            <option value="UTC-8">UTC-8 (Pacific Time)</option>
            <option value="UTC-7">UTC-7 (Mountain Time)</option>
            <option value="UTC-6">UTC-6 (Central Time)</option>
            <option value="UTC-5">UTC-5 (Eastern Time)</option>
            <option value="UTC-4">UTC-4 (Atlantic Time)</option>
            <option value="UTC-3">UTC-3 (Argentina)</option>
            <option value="UTC-2">UTC-2 (South Georgia)</option>
            <option value="UTC-1">UTC-1 (Azores)</option>
            <option value="UTC+0">UTC+0 (London/GMT)</option>
            <option value="UTC+1">UTC+1 (Central Europe)</option>
            <option value="UTC+2">UTC+2 (Eastern Europe)</option>
            <option value="UTC+3">UTC+3 (Moscow)</option>
            <option value="UTC+4">UTC+4 (Dubai)</option>
            <option value="UTC+5">UTC+5 (Pakistan)</option>
            <option value="UTC+5:30">UTC+5:30 (India)</option>
            <option value="UTC+6">UTC+6 (Bangladesh)</option>
            <option value="UTC+7">UTC+7 (Thailand)</option>
            <option value="UTC+8">UTC+8 (China/Singapore)</option>
            <option value="UTC+9">UTC+9 (Japan/Korea)</option>
            <option value="UTC+10">UTC+10 (Australia East)</option>
            <option value="UTC+11">UTC+11 (Solomon Islands)</option>
            <option value="UTC+12">UTC+12 (New Zealand)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-light mb-1">Priority</label>
          <select class="member-priority w-full px-3 py-2 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-light mb-1">Work Start Time</label>
          <input type="time" class="member-start w-full px-3 py-2 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary" value="09:00" required>
        </div>
        <div>
          <label class="block text-xs text-light mb-1">Work End Time</label>
          <input type="time" class="member-end w-full px-3 py-2 text-sm border border-accent rounded bg-broder text-text focus:outline-none focus:ring-2 focus:ring-primary" value="17:00" required>
        </div>
      </div>
      <button type="button" class="remove-member text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
        <span class="material-icons text-sm">remove</span> Remove Member
      </button>
    `;

    memberRow.querySelector('.remove-member').addEventListener('click', function() {
      memberRow.remove();
    });

    teamMembersDiv.appendChild(memberRow);
  }

  function findOptimalTimes() {
    const members = collectTeamMembers();
    const duration = parseInt(document.getElementById('meetingDuration').value);
    const selectedDays = Array.from(document.querySelectorAll('.day-checkbox:checked')).map(cb => cb.value);

    if (members.length < 2) {
      resultContent.innerHTML = `
        <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div class="flex items-center gap-2 text-red-400">
            <span class="material-icons">error</span>
            <span class="font-medium">Please add at least 2 team members</span>
          </div>
        </div>
      `;
      resultsDiv.classList.remove('hidden');
      return;
    }

    const optimalTimes = calculateOptimalTimes(members, duration, selectedDays);
    displayResults(optimalTimes, members, duration);
  }

  function collectTeamMembers() {
    const memberRows = document.querySelectorAll('.member-row');
    const members = [];

    memberRows.forEach(row => {
      const name = row.querySelector('.member-name').value;
      const timezone = row.querySelector('.member-timezone').value;
      const priority = row.querySelector('.member-priority').value;
      const startTime = row.querySelector('.member-start').value;
      const endTime = row.querySelector('.member-end').value;

      if (name && timezone && startTime && endTime) {
        members.push({
          name,
          timezone,
          priority,
          startTime,
          endTime,
          utcOffset: parseTimezone(timezone)
        });
      }
    });

    return members;
  }

  function parseTimezone(timezone) {
    if (timezone === 'UTC+5:30') return 5.5;
    const match = timezone.match(/UTC([+-])(\d+)/);
    if (match) {
      const sign = match[1] === '+' ? 1 : -1;
      return sign * parseInt(match[2]);
    }
    return 0;
  }

  function calculateOptimalTimes(members, duration, selectedDays) {
    const timeSlots = [];
    
    // Generate 30-minute time slots for each day
    selectedDays.forEach(day => {
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeSlot = {
            day,
            hour,
            minute,
            utcTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            score: 0,
            memberTimes: [],
            feasible: true
          };

          let totalScore = 0;
          let feasibleCount = 0;

          members.forEach(member => {
            const memberHour = (hour + member.utcOffset + 24) % 24;
            const memberTime = `${memberHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            
            const startHour = parseInt(member.startTime.split(':')[0]);
            const endHour = parseInt(member.endTime.split(':')[0]);
            const startMinute = parseInt(member.startTime.split(':')[1]);
            const endMinute = parseInt(member.endTime.split(':')[1]);
            
            const memberMinutes = memberHour * 60 + minute;
            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;
            const meetingEndMinutes = memberMinutes + duration;

            let isFeasible = false;
            let score = 0;

            if (endHour > startHour) {
              // Same day work hours
              isFeasible = memberMinutes >= startMinutes && meetingEndMinutes <= endMinutes;
            } else {
              // Overnight work hours
              isFeasible = memberMinutes >= startMinutes || meetingEndMinutes <= endMinutes;
            }

            if (isFeasible) {
              feasibleCount++;
              // Score based on how close to ideal work hours (10 AM - 4 PM)
              const idealStart = 10 * 60; // 10 AM
              const idealEnd = 16 * 60;   // 4 PM
              
              if (memberMinutes >= idealStart && meetingEndMinutes <= idealEnd) {
                score = 100; // Perfect time
              } else if (memberMinutes >= (idealStart - 60) && meetingEndMinutes <= (idealEnd + 60)) {
                score = 80; // Good time
              } else if (memberMinutes >= startMinutes && meetingEndMinutes <= endMinutes) {
                score = 60; // Acceptable time
              }

              // Priority multiplier
              if (member.priority === 'high') score *= 1.5;
              else if (member.priority === 'low') score *= 0.7;
            }

            timeSlot.memberTimes.push({
              name: member.name,
              localTime: memberTime,
              timezone: member.timezone,
              feasible: isFeasible,
              score
            });

            totalScore += score;
          });

          timeSlot.feasible = feasibleCount === members.length;
          timeSlot.score = timeSlot.feasible ? totalScore / members.length : 0;
          
          if (timeSlot.feasible) {
            timeSlots.push(timeSlot);
          }
        });
      });
    });

    return timeSlots.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  function displayResults(optimalTimes, members, duration) {
    if (optimalTimes.length === 0) {
      resultContent.innerHTML = `
        <div class="bg-broder p-6 rounded-lg border border-accent">
          <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
            <span class="material-icons text-red-400">error</span> 
            No Optimal Times Found
          </h3>
          <p class="text-light">No meeting times work for all team members with current constraints. Try:</p>
          <ul class="mt-3 space-y-1 text-sm text-light">
            <li>• Expanding work hours for some members</li>
            <li>• Including weekend days</li>
            <li>• Reducing meeting duration</li>
            <li>• Setting some members as lower priority</li>
          </ul>
        </div>
      `;
    } else {
      const dayNames = {
        monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
        thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday'
      };

      resultContent.innerHTML = `
        <div class="bg-broder p-6 rounded-lg border border-accent">
          <h3 class="text-xl font-medium mb-4 text-text flex items-center gap-2">
            <span class="material-icons text-primary">schedule</span> 
            Optimal Meeting Times
          </h3>
          
          <div class="space-y-4">
            ${optimalTimes.slice(0, 5).map((slot, index) => `
              <div class="bg-dark p-4 rounded border border-accent">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-lg font-medium text-text">
                    Option ${index + 1}: ${dayNames[slot.day]} ${sanitizeText(slot.utcTime)} UTC
                  </h4>
                  <span class="text-sm px-2 py-1 rounded ${
                    slot.score >= 90 ? 'bg-green-600 text-white' :
                    slot.score >= 70 ? 'bg-yellow-600 text-white' :
                    'bg-orange-600 text-white'
                  }">
                    Score: ${Math.round(slot.score)}
                  </span>
                </div>
                
                <div class="grid gap-2 text-sm">
                  ${slot.memberTimes.map(member => `
                    <div class="flex justify-between items-center py-1">
                      <span class="text-light">${member.name}:</span>
                      <span class="text-text font-medium">
                        ${sanitizeText(member.localTime)} (${sanitizeText(member.timezone)})
                        ${member.score >= 90 ? '🟢' : member.score >= 70 ? '🟡' : '🟠'}
                      </span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="mt-6 p-4 bg-dark rounded border border-accent">
            <h4 class="text-lg font-medium mb-3 text-text">Team Overview</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              ${members.map(member => `
                <div class="flex justify-between">
                  <span class="text-light">${member.name}:</span>
                  <span class="text-text">${sanitizeText(member.startTime)}-${sanitizeText(member.endTime)} ${sanitizeText(member.timezone)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="mt-4 text-xs text-light">
            <p>🟢 Ideal time (10 AM - 4 PM local) | 🟡 Good time | 🟠 Acceptable time</p>
            <p>Meeting duration: ${sanitizeText(duration)} minutes</p>
          </div>
        </div>
      `;
    }

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }
});
