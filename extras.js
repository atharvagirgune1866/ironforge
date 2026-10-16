// ================= WORKOUT GENERATOR =================
const EX = {
  push: { bodyweight: ['Push-ups', 'Pike Push-ups', 'Bench Dips'], dumbbells: ['Dumbbell Bench Press', 'Dumbbell Shoulder Press', 'Dumbbell Fly'], gym: ['Barbell Bench Press', 'Overhead Press', 'Cable Fly'] },
  pull: { bodyweight: ['Inverted Rows', 'Superman Hold', 'Towel Rows'], dumbbells: ['One-Arm Dumbbell Row', 'Dumbbell Pullover', 'Rear Delt Fly'], gym: ['Lat Pulldown', 'Barbell Row', 'Seated Cable Row'] },
  legs: { bodyweight: ['Bodyweight Squat', 'Walking Lunges', 'Glute Bridge'], dumbbells: ['Goblet Squat', 'Dumbbell Romanian Deadlift', 'Dumbbell Lunges'], gym: ['Back Squat', 'Leg Press', 'Romanian Deadlift'] },
  core: { bodyweight: ['Plank', 'Bicycle Crunch', 'Leg Raises'], dumbbells: ['Russian Twist', 'Weighted Sit-up', 'Plank'], gym: ['Cable Crunch', 'Hanging Knee Raise', 'Plank'] },
  cardio: { bodyweight: ['Jumping Jacks', 'Mountain Climbers', 'Burpees', 'High Knees'], dumbbells: ['Dumbbell Thrusters', 'Dumbbell Swings', 'Farmer Carry', 'Burpees'], gym: ['Rowing Machine', 'Assault Bike', 'Treadmill Intervals', 'Battle Ropes'] },
};
const SPLIT = { Strength: ['legs', 'push', 'pull', 'legs', 'push', 'pull'], 'Muscle Gain': ['push', 'pull', 'legs', 'push', 'pull', 'legs'], 'Fat Loss': ['full', 'cardio', 'full', 'cardio', 'full', 'cardio'] };
const SNAME = { legs: 'Lower Body', push: 'Push: Chest, Shoulders, Triceps', pull: 'Pull: Back & Biceps', full: 'Full Body', cardio: 'Conditioning' };
const SCHEME = { Strength: [5, '5'], 'Muscle Gain': [4, '8-12'], 'Fat Loss': [3, '12-15'] };
const LV = { Beginner: -1, Intermediate: 0, Advanced: 1 };
const DAYSET = { 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 4, 5], 6: [0, 1, 2, 3, 4, 5] };
const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

['Strength', 'Muscle Gain', 'Fat Loss'].forEach(g => { const o = el('option', '', g); o.value = g; $('gGoal').append(o); });
const pick = (type, eq, n, off) => { const p = EX[type][eq]; return Array.from({ length: Math.min(n, p.length) }, (_, i) => p[(i + off) % p.length]); };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function buildPlan(goal, level, eq, days) {
  const [base, reps] = SCHEME[goal], sets = clamp(base + LV[level], 2, 5), seen = {}, plan = {};
  DAYSET[days].forEach((slot, i) => {
    const t = SPLIT[goal][i]; const off = (seen[t] = (seen[t] || 0) + 1) - 1; let items = [];
    if (t === 'cardio') {
      const rounds = 6 + 2 * (LV[level] + 1);
      items = pick('cardio', eq, 4, off).map(x => x + ': ' + rounds + ' rounds, 30 s on / 30 s off');
    } else if (t === 'full') {
      items = ['push', 'pull', 'legs'].map(m => pick(m, eq, 1, off)[0] + ': ' + sets + ' x ' + reps);
    } else {
      items = pick(t, eq, 3, off).map((x, k) => x + ': ' + (k ? Math.max(sets - 1, 2) : sets) + ' x ' + reps);
    }
    items.push(pick('core', eq, 1, off)[0] + ': 3 x 30-45 s');
    plan[slot] = { name: SNAME[t], items };
  });
  return plan;
}
$('genForm').addEventListener('submit', e => {
  e.preventDefault(); const out = $('genOut'); out.replaceChildren();
  const plan = buildPlan($('gGoal').value, $('gLevel').value, $('gEquip').value, +$('gDays').value);
  WEEK.forEach((d, i) => {
    const c = el('div', 'card day' + (plan[i] ? '' : ' rest'));
    c.append(el('span', 'tag', d));
    if (plan[i]) { c.append(el('h3', '', plan[i].name)); const ul = el('ul'); plan[i].items.forEach(x => ul.append(el('li', '', x))); c.append(ul); }
    else c.append(el('h3', '', 'Rest & Recover'), el('p', '', 'Light walk, stretching and good sleep.'));
    out.append(c);
  });
  out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ================= WORKOUT TIMER =================
const R = 54, CIRC = 2 * Math.PI * R;
let tTotal = 60, tLeft = 60, tEnd = 0, tId = null;
const ring = $('tRing'); ring.style.strokeDasharray = CIRC;
const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
function draw() { $('tTxt').textContent = fmt(tLeft); ring.style.strokeDashoffset = CIRC * (1 - tLeft / tTotal); }
function stopT() { clearInterval(tId); tId = null; $('tStart').textContent = 'Start'; }
function beep() {
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)();
    [0, .25, .5].forEach(t => { const o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; g.gain.value = .15; o.connect(g); g.connect(a.destination); o.start(a.currentTime + t); o.stop(a.currentTime + t + .15); });
  } catch {}
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
}
function tick() { tLeft = Math.max(0, Math.ceil((tEnd - Date.now()) / 1000)); draw(); if (!tLeft) { stopT(); beep(); $('tTxt').textContent = 'GO!'; } }
$('tStart').onclick = () => {
  if (tId) { stopT(); return; }               // acts as Pause
  if (!tLeft) tLeft = tTotal;
  tEnd = Date.now() + tLeft * 1000; tId = setInterval(tick, 200); $('tStart').textContent = 'Pause';
};
$('tReset').onclick = () => { stopT(); tLeft = tTotal; draw(); };
function setT(s) { stopT(); tTotal = tLeft = clamp(s, 5, 3600); draw(); }
[30, 45, 60, 90, 120].forEach(s => { const b = el('button', 'ghost', s + 's'); b.type = 'button'; b.onclick = () => setT(s); $('tPresets').append(b); });
$('tSet').onclick = () => { const v = parseInt($('tCustom').value); if (v) setT(v); };
draw();

// ================= IRON STREAK =================
const SK = 'if_streak';
const pad = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const addD = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
let done = new Set(); try { done = new Set(JSON.parse(localStorage.getItem(SK) || '[]')); } catch {}
const saveS = () => { try { localStorage.setItem(SK, JSON.stringify([...done])); } catch {} };

function renderStreak() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let d = done.has(ymd(today)) ? today : addD(today, -1), cur = 0;
  while (done.has(ymd(d))) { cur++; d = addD(d, -1); }
  let best = 0, run = 0, prev = null;
  [...done].sort().forEach(k => { const dt = new Date(k + 'T00:00:00'); run = prev && ymd(addD(prev, 1)) === k ? run + 1 : 1; prev = dt; best = Math.max(best, run); });
  const mon = addD(today, -((today.getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => ymd(addD(mon, i))).filter(k => done.has(k)).length;
  $('sCur').textContent = cur; $('sBest').textContent = best; $('sWeek').textContent = week + ' / 4';
  $('sBar').style.width = Math.min(week / 4 * 100, 100) + '%';
  const grid = $('sGrid'); grid.replaceChildren();
  const start = addD(mon, -21);
  for (let i = 0; i < 28; i++) {
    const dt = addD(start, i), k = ymd(dt), future = dt > today;
    const b = el('button', 'cell' + (done.has(k) ? ' on' : '') + (k === ymd(today) ? ' today' : ''), dt.getDate());
    b.type = 'button'; b.disabled = future; b.title = k;
    b.onclick = () => { done.has(k) ? done.delete(k) : done.add(k); saveS(); renderStreak(); };
    grid.append(b);
  }
}
$('sReset').onclick = () => { if (confirm('Clear all streak data?')) { done.clear(); saveS(); renderStreak(); } };
WEEK.forEach(w => $('sDays').append(el('span', '', w)));
renderStreak();
