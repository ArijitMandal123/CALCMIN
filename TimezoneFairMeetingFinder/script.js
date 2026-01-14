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
    const membersContainer = document.getElementById('members-container');

    // Add new team member
    addMemberBtn.addEventListener('click', function() {
        const newRow = document.createElement('div');
        newRow.className = 'member-row grid md:grid-cols-4 gap-4 mb-3 p-4 bg-broder rounded border border-accent';
        newRow.innerHTML = `
            <div>
                <label class="block text-sm text-light mb-1">Name</label>
                <input
                    type="text"
                    class="member-name w-full px-3 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Team member name"
                />
            </div>
            <div>
                <label class="block text-sm text-light mb-1">Timezone</label>
                <select class="member-timezone w-full px-3 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select timezone</option>
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
                    <option value="UTC+0">UTC+0 (London, GMT)</option>
                    <option value="UTC+1">UTC+1 (Central Europe)</option>
                    <option value="UTC+2">UTC+2 (Eastern Europe)</option>
                    <option value="UTC+3">UTC+3 (Moscow)</option>
                    <option value="UTC+4">UTC+4 (Dubai)</option>
                    <option value="UTC+5">UTC+5 (Pakistan)</option>
                    <option value="UTC+5.5">UTC+5:30 (India)</option>
                    <option value="UTC+6">UTC+6 (Bangladesh)</option>
                    <option value="UTC+7">UTC+7 (Thailand)</option>
                    <option value="UTC+8">UTC+8 (China, Singapore)</option>
                    <option value="UTC+9">UTC+9 (Japan, Korea)</option>
                    <option value="UTC+10">UTC+10 (Australia East)</option>
                    <option value="UTC+11">UTC+11 (Solomon Islands)</option>
                    <option value="UTC+12">UTC+12 (New Zealand)</option>
                </select>
            </div>
            <div>
                <label class="block text-sm text-light mb-1">Priority Weight</label>
                <select class="member-priority w-full px-3 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="1">Normal (1x)</option>
                    <option value="1.5">Important (1.5x)</option>
                    <option value="2">High Priority (2x)</option>
                    <option value="3">Critical (3x)</option>
                </select>
            </div>
            <div class="flex gap-2">
                <div class="flex-1">
                    <label class="block text-sm text-light mb-1">Working Hours</label>
                    <select class="member-hours w-full px-3 py-2 text-sm border border-accent rounded bg-dark text-text focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="9-17">9 AM - 5 PM</option>
                        <option value="8-16">8 AM - 4 PM</option>
                        <option value="10-18">10 AM - 6 PM</option>
                        <option value="7-15">7 AM - 3 PM</option>
                        <option value="11-19">11 AM - 7 PM</option>
                        <option value="6-14">6 AM - 2 PM</option>
                        <option value="12-20">12 PM - 8 PM</option>
                    </select>
                </div>
                <button type="button" class="remove-member px-3 py-2 text-red-400 hover:text-red-300 transition mt-6">
                    <span class="material-icons text-sm">remove</span>
                </button>
            </div>
        `;

        membersContainer.appendChild(newRow);

        // Add remove functionality
        const removeBtn = newRow.querySelector('.remove-member');
        removeBtn.addEventListener('click', function() {
            newRow.remove();
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        if (validateInputs(formData)) {
            const analysis = findFairMeetingTimes(formData);
            displayResults(analysis);
        }
    });

    function collectFormData() {
        const memberRows = document.querySelectorAll('.member-row');
        const members = [];

        memberRows.forEach(row => {
            const name = row.querySelector('.member-name').value.trim();
            const timezone = row.querySelector('.member-timezone').value;
            const priority = parseFloat(row.querySelector('.member-priority').value);
            const hours = row.querySelector('.member-hours').value;

            if (name && timezone) {
                members.push({ name, timezone, priority, hours });
            }
        });

        const selectedDays = [];
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => {
            if (document.getElementById(`day-${sanitizeText(day)}`).checked) {
                selectedDays.push(day);
            }
        });

        return {
            hours: parseFloat(document.getElementById('meeting-hours').value) || 0,
            minutes: parseFloat(document.getElementById('meeting-minutes').value) || 0,
            members: members,
            frequency: document.getElementById('meeting-frequency').value,
            selectedDays: selectedDays
        };
    }

    function showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-popup').classList.remove('hidden');
    }

    function validateInputs(data) {
        if (data.hours === 0 && data.minutes === 0) {
            showError('Please enter meeting duration.');
            return false;
        }

        if (data.members.length < 2) {
            showError('Please add at least 2 team members with valid timezones.');
            return false;
        }

        if (data.selectedDays.length === 0) {
            showError('Please select at least one preferred day.');
            return false;
        }

        return true;
    }

    // Close error popup
    document.getElementById('close-error').addEventListener('click', function() {
        document.getElementById('error-popup').classList.add('hidden');
    });

    // Close popup when clicking outside
    document.getElementById('error-popup').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });

    function findFairMeetingTimes(data) {
        const meetingDuration = (data.hours * 60) + data.minutes;
        const timeSlots = generateTimeSlots();
        const scoredSlots = [];

        // Calculate unfairness score for each time slot
        timeSlots.forEach(slot => {
            const unfairnessScore = calculateUnfairnessScore(slot, data.members);
            const memberTimes = calculateMemberTimes(slot, data.members);
            
            scoredSlots.push({
                utcTime: slot,
                unfairnessScore: unfairnessScore,
                memberTimes: memberTimes,
                fairnessLevel: getFairnessLevel(unfairnessScore)
            });
        });

        // Sort by unfairness score (lower is better)
        scoredSlots.sort((a, b) => a.unfairnessScore - b.unfairnessScore);

        // Get top 5 options
        const topOptions = scoredSlots.slice(0, 5);

        // Generate rotation schedule if recurring
        const rotationSchedule = data.frequency !== 'one-time' ? 
            generateRotationSchedule(data.members, data.frequency) : null;

        // Calculate statistics
        const stats = calculateStatistics(scoredSlots, data.members);

        return {
            topOptions,
            rotationSchedule,
            stats,
            meetingDuration,
            totalMembers: data.members.length
        };
    }

    function generateTimeSlots() {
        const slots = [];
        // Generate slots every 30 minutes for 24 hours
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                slots.push({ hour, minute });
            }
        }
        return slots;
    }

    function calculateUnfairnessScore(slot, members) {
        let totalUnfairness = 0;

        members.forEach(member => {
            const memberTime = convertToMemberTime(slot, member.timezone);
            const unfairness = calculateMemberUnfairness(memberTime, member.hours) * member.priority;
            totalUnfairness += unfairness;
        });

        return totalUnfairness / members.length;
    }

    function convertToMemberTime(utcSlot, timezone) {
        const offset = parseTimezoneOffset(timezone);
        let hour = utcSlot.hour + offset;
        let minute = utcSlot.minute;

        // Handle day overflow/underflow
        if (hour >= 24) hour -= 24;
        if (hour < 0) hour += 24;

        return { hour, minute };
    }

    function parseTimezoneOffset(timezone) {
        if (timezone === 'UTC+5.5') return 5.5;
        
        const match = timezone.match(/UTC([+-])(\d+)/);
        if (match) {
            const sign = match[1] === '+' ? 1 : -1;
            const offset = parseInt(match[2]);
            return sign * offset;
        }
        return 0;
    }

    function calculateMemberUnfairness(memberTime, workingHours) {
        const [startHour, endHour] = workingHours.split('-').map(h => parseInt(h));
        const hour = memberTime.hour;

        // Perfect working hours = 0 unfairness
        if (hour >= startHour && hour < endHour) {
            return 0;
        }

        // Calculate how far outside working hours
        let hoursOutside;
        if (hour < startHour) {
            hoursOutside = startHour - hour;
        } else {
            hoursOutside = hour - endHour + 1;
        }

        // Early morning penalty is higher than late evening
        if (hour < 6) {
            hoursOutside *= 2; // Double penalty for very early hours
        }

        return Math.min(hoursOutside * 10, 100); // Cap at 100
    }

    function calculateMemberTimes(utcSlot, members) {
        return members.map(member => {
            const memberTime = convertToMemberTime(utcSlot, member.timezone);
            const timeString = formatTime(memberTime);
            const unfairness = calculateMemberUnfairness(memberTime, member.hours);
            
            return {
                name: member.name,
                time: timeString,
                timezone: member.timezone,
                unfairness: unfairness,
                isWorkingHours: unfairness === 0
            };
        });
    }

    function formatTime(time) {
        const hour12 = time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour;
        const ampm = time.hour >= 12 ? 'PM' : 'AM';
        const minute = time.minute.toString().padStart(2, '0');
        return `${sanitizeText(hour12)}:${sanitizeText(minute)} ${sanitizeText(ampm)}`;
    }

    function getFairnessLevel(score) {
        if (score <= 10) return { level: 'Excellent', color: 'text-green-400' };
        if (score <= 25) return { level: 'Good', color: 'text-yellow-400' };
        if (score <= 50) return { level: 'Fair', color: 'text-orange-400' };
        return { level: 'Poor', color: 'text-red-400' };
    }

    function generateRotationSchedule(members, frequency) {
        const rotations = [];
        const rotationCount = frequency === 'weekly' ? 4 : frequency === 'bi-weekly' ? 2 : 1;

        // Create rotation where each member gets priority in turn
        for (let i = 0; i < rotationCount; i++) {
            const priorityMember = members[i % members.length];
            rotations.push({
                week: i + 1,
                priorityMember: priorityMember.name,
                description: `Optimize for ${sanitizeText(priorityMember.name)}'s timezone (${sanitizeText(priorityMember.timezone)})`
            });
        }

        return rotations;
    }

    function calculateStatistics(scoredSlots, members) {
        const bestScore = Math.min(...scoredSlots.map(s => s.unfairnessScore));
        const worstScore = Math.max(...scoredSlots.map(s => s.unfairnessScore));
        const avgScore = scoredSlots.reduce((sum, s) => sum + s.unfairnessScore, 0) / scoredSlots.length;

        // Find timezone spread
        const timezones = [...new Set(members.map(m => m.timezone))];
        const timezoneSpread = timezones.length;

        return {
            bestScore: bestScore.toFixed(1),
            worstScore: worstScore.toFixed(1),
            avgScore: avgScore.toFixed(1),
            timezoneSpread,
            totalOptions: scoredSlots.length
        };
    }

    function sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function displayResults(analysis) {
        resultContent.innerHTML = `
            <div class="bg-broder p-6 rounded-lg border border-accent">
                <h2 class="text-xl font-bold text-text mb-4 flex items-center gap-2">
                    <span class="material-icons text-primary">schedule</span>
                    Fair Meeting Time Analysis
                </h2>
                
                <div class="grid md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Best Option</h3>
                        <div class="text-2xl font-bold text-green-400 mb-2">${sanitizeHtml(analysis.stats.bestScore)}</div>
                        <p class="text-sm text-light">Unfairness Score</p>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Team Size</h3>
                        <div class="text-2xl font-bold text-primary mb-2">${sanitizeHtml(analysis.totalMembers.toString())}</div>
                        <p class="text-sm text-light">Members across ${sanitizeHtml(analysis.stats.timezoneSpread.toString())} timezones</p>
                    </div>
                    
                    <div class="bg-dark p-4 rounded border border-accent">
                        <h3 class="font-semibold text-text mb-2">Meeting Duration</h3>
                        <div class="text-2xl font-bold text-accent mb-2">${sanitizeHtml(analysis.meetingDuration.toString())}min</div>
                        <p class="text-sm text-light">Total meeting time</p>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Top 5 Meeting Time Options</h3>
                    <div class="space-y-4">
                        ${analysis.topOptions.map((option, index) => `
                            <div class="bg-dark p-4 rounded border border-accent">
                                <div class="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 class="font-medium text-text">Option ${index + 1}: ${formatTime(option.utcTime)} UTC</h4>
                                        <p class="text-sm ${sanitizeText(option.fairnessLevel.color)}">${sanitizeHtml(option.fairnessLevel.level)} Fairness (Score: ${sanitizeHtml(option.unfairnessScore.toFixed(1))})</p>
                                    </div>
                                </div>
                                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    ${option.memberTimes.map(member => `
                                        <div class="flex justify-between items-center p-2 bg-broder rounded">
                                            <div>
                                                <span class="text-text font-medium">${sanitizeHtml(member.name)}</span>
                                                <div class="text-xs text-light">${sanitizeHtml(member.timezone)}</div>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-sm ${member.isWorkingHours ? 'text-green-400' : 'text-orange-400'}">${sanitizeHtml(member.time)}</div>
                                                <div class="text-xs ${member.isWorkingHours ? 'text-green-400' : 'text-red-400'}">
                                                    ${member.isWorkingHours ? 'Work Hours' : 'Outside Hours'}
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${analysis.rotationSchedule ? `
                <div class="mb-6">
                    <h3 class="font-semibold text-text mb-3">Rotation Schedule</h3>
                    <div class="bg-dark p-4 rounded border border-accent">
                        <p class="text-light mb-3">For recurring meetings, rotate priority to ensure fairness:</p>
                        <div class="space-y-2">
                            ${analysis.rotationSchedule.map(rotation => `
                                <div class="flex justify-between items-center p-2 bg-broder rounded">
                                    <span class="text-text">Week ${sanitizeHtml(rotation.week.toString())}</span>
                                    <span class="text-primary">${sanitizeHtml(rotation.description)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}

                <div class="bg-primary/10 p-4 rounded border border-primary">
                    <h3 class="font-semibold text-text mb-2 flex items-center gap-2">
                        <span class="material-icons text-primary">lightbulb</span>
                        Key Insights
                    </h3>
                    <ul class="text-sm text-light space-y-1">
                        <li>• Best unfairness score: ${sanitizeHtml(analysis.stats.bestScore)} (lower is better)</li>
                        <li>• Average unfairness across all options: ${sanitizeHtml(analysis.stats.avgScore)}</li>
                        <li>• Team spans ${sanitizeHtml(analysis.stats.timezoneSpread.toString())} different timezone${analysis.stats.timezoneSpread > 1 ? 's' : ''}</li>
                        <li>• ${analysis.topOptions[0].memberTimes.filter(m => m.isWorkingHours).length} of ${sanitizeHtml(analysis.totalMembers.toString())} members in working hours for best option</li>
                        ${analysis.rotationSchedule ? '<li>• Use rotation schedule to distribute inconvenience fairly over time</li>' : ''}
                    </ul>
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
});
