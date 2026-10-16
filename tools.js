/* IRONFORGE IRON LAB add-on
   Existing Workout Planner = Workout Generator.
   This file adds a rest timer and an Iron Streak tracker without changing the rest of the site.
*/
(() => {
  const $ = id => document.getElementById(id);
  const tools = $('tools');
  const grid = tools && tools.querySelector('.grid');
  if (!tools || !grid) return;

  // Add matching styling so no existing stylesheet needs to be replaced.
  const css = document.createElement('style');
  css.textContent = `
    #tools .lab-note{color:var(--muted);font-size:.9rem}
    #tools .lab-number{color:var(--orange);font-size:.72rem;font-weight:850;letter-spacing:.16em}
    #tools .timer-presets{display:flex;gap:7px;flex-wrap:wrap;margin:14px 0}
    #tools .timer-presets button{margin:0;padding:7px 10px;font-size:.82rem;background:transparent;border:1px solid var(--line);color:var(--muted)}
    #tools .timer-presets button.active{background:var(--orange);border-color:var(--orange);color:white}
    #tools .timer-face{width:min(210px,100%);aspect-ratio:1;border-radius:50%;margin:20px auto;display:grid;place-items:center;background:conic-gradient(var(--orange) var(--timer-progress,100%),var(--line) 0);position:relative}
    #tools .timer-face:before{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--card)}
    #tools .timer-face>div{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px}
    #tools .timer-face strong{font-size:2.45rem;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
    #tools .timer-face span{font-size:.62rem;letter-spacing:.1em;color:var(--muted);text-align:center}
    #tools .timer-controls{display:flex;justify-content:center;gap:10px}
    #tools .timer-controls button{margin:0;min-width:95px}
    #tools .timer-controls .ghost{background:transparent;border:1px solid var(--line);color:var(--text)}
    #tools .timer-status{color:var(--muted);font-size:.82rem;text-align:center;min-height:24px}
    #tools .streak-total{display:flex;align-items:center;gap:12px;margin:20px 0}
    #tools .streak-total strong{font-size:3.4rem;line-height:1;color:var(--orange);font-variant-numeric:tabular-nums}
    #tools .streak-total span{font-size:.72rem;letter-spacing:.12em;color:var(--muted);font-weight:800}
    #tools .streak-week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;margin:18px 0}
    #tools .streak-day{border:1px solid var(--line);border-radius:7px;text-align:center;padding:8px 1px;color:var(--muted);font-size:.65rem}
    #tools .streak-day strong{display:grid;place-items:center;width:26px;height:26px;margin:5px auto 0;border-radius:50%;background:#292929;font-size:.78rem}
    #tools .streak-day.done{border-color:#71371f;color:var(--text)}
    #tools .streak-day.done strong{background:var(--orange);color:#111}
    #tools .streak-day.today{box-shadow:inset 0 0 0 1px var(--orange)}
    #tools .streak-toggle{width:100%}
    #tools .streak-note{font-size:.78rem;color:var(--muted);min-height:36px}
    @media(max-width:560px){#tools .timer-face{width:185px}}
  `;
  document.head.append(css);

  // Existing planForm is already the Workout Generator and remains connected to WORKOUTS.
  const plannerTitle = document.querySelector('#planForm h3');
  if (plannerTitle) plannerTitle.textContent = 'Workout Generator';

  // Create the Rest Timer card.
  const timer = document.createElement('div');
  timer.className = 'card';
  timer.innerHTML = `
    <span class="lab-number">02 / FOCUS</span>
    <h3>Workout Timer</h3>
    <p class="lab-note">Choose a rest interval and focus on recovery between sets.</p>
    <div class="timer-presets" aria-label="Rest time presets">
      <button type="button" data-seconds="30">30 sec</button>
      <button type="button" data-seconds="60" class="active">60 sec</button>
      <button type="button" data-seconds="90">90 sec</button>
      <button type="button" data-seconds="120">2 min</button>
    </div>
    <div class="timer-face" id="ifTimerFace" role="timer" aria-live="polite">
      <div><strong id="ifTimerDisplay">01:00</strong><span id="ifTimerLabel">READY WHEN YOU ARE</span></div>
    </div>
    <div class="timer-controls"><button type="button" id="ifTimerStart">Start</button><button type="button" class="ghost" id="ifTimerReset">Reset</button></div>
    <p class="timer-status" id="ifTimerStatus">Choose a rest time and start.</p>`;
  grid.append(timer);

  const timerDisplay = $('ifTimerDisplay');
  const timerFace = $('ifTimerFace');
  const timerLabel = $('ifTimerLabel');
  const timerStart = $('ifTimerStart');
  const timerReset = $('ifTimerReset');
  const timerStatus = $('ifTimerStatus');
  const presetButtons = [...timer.querySelectorAll('[data-seconds]')];
  let duration = 60, remaining = 60, endAt = 0, interval = null, running = false;

  const fmt = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  function paintTimer() {
    timerDisplay.textContent = fmt(remaining);
    timerFace.style.setProperty('--timer-progress', `${duration ? remaining / duration * 100 : 0}%`);
    timerLabel.textContent = remaining === 0 ? 'REST COMPLETE' : running ? 'BREATHE & RECOVER' : 'READY WHEN YOU ARE';
  }
  function stopTimer() {
    if (interval !== null) clearInterval(interval);
    interval = null; running = false;
  }
  function tick() {
    remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    if (!remaining) {
      remaining = 0; stopTimer(); timerStart.textContent = 'Start again';
      timerStatus.textContent = 'Rest complete. Begin your next set when you are ready.';
    }
    paintTimer();
  }
  presetButtons.forEach(button => button.addEventListener('click', () => {
    stopTimer(); duration = Number(button.dataset.seconds); remaining = duration;
    presetButtons.forEach(b => b.classList.toggle('active', b === button));
    timerStart.textContent = 'Start'; timerStatus.textContent = 'Timer set. Start when ready.';
    paintTimer();
  }));
  timerStart.addEventListener('click', () => {
    if (running) {
      remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      stopTimer(); timerStart.textContent = 'Resume'; timerStatus.textContent = 'Paused.';
      paintTimer(); return;
    }
    if (remaining <= 0) remaining = duration;
    running = true; endAt = Date.now() + remaining * 1000;
    timerStart.textContent = 'Pause'; timerStatus.textContent = 'Timer running. Keep your breathing steady.';
    interval = setInterval(tick, 200); paintTimer();
  });
  timerReset.addEventListener('click', () => {
    stopTimer(); remaining = duration; timerStart.textContent = 'Start';
    timerStatus.textContent = 'Timer reset.'; paintTimer();
  });
  paintTimer();

  // Create the Iron Streak card.
  const streak = document.createElement('div');
  streak.className = 'card';
  streak.innerHTML = `
    <span class="lab-number">03 / CONSISTENCY</span>
    <h3>Iron Streak</h3>
    <p class="lab-note">Mark your workout days. Consistency beats perfection.</p>
    <div class="streak-total"><strong id="ifStreakCount">0</strong><span>DAY STREAK 🔥</span></div>
    <div class="streak-week" id="ifStreakWeek" aria-label="Last seven days"></div>
    <button type="button" id="ifStreakToggle" class="streak-toggle">+ Mark today's workout</button>
    <p class="streak-note" id="ifStreakNote" aria-live="polite">Saved only in this browser on this device.</p>`;
  grid.append(streak);

  const KEY = 'ironforge_workout_dates_v1';
  const weekBox = $('ifStreakWeek');
  const streakCount = $('ifStreakCount');
  const streakToggle = $('ifStreakToggle');
  const streakNote = $('ifStreakNote');
  const dateKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const shifted = (d, days) => { const n = new Date(d.getFullYear(), d.getMonth(), d.getDate()); n.setDate(n.getDate()+days); return n; };
  function readDates() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(data) ? [...new Set(data.filter(v => /^\d{4}-\d{2}-\d{2}$/.test(v)))].sort() : [];
    } catch { return []; }
  }
  function currentStreak(dates, todayKey) {
    const set = new Set(dates); let cursor = new Date();
    if (!set.has(todayKey)) {
      const yesterday = dateKey(shifted(cursor, -1));
      if (!set.has(yesterday)) return 0;
      cursor = shifted(cursor, -1);
    }
    let total = 0;
    while (set.has(dateKey(cursor))) { total++; cursor = shifted(cursor, -1); }
    return total;
  }
  function renderStreak(message) {
    const dates = readDates(), set = new Set(dates), now = new Date(), today = dateKey(now);
    streakCount.textContent = currentStreak(dates, today);
    weekBox.replaceChildren();
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    for (let i = -6; i <= 0; i++) {
      const d = shifted(now, i), key = dateKey(d), done = set.has(key);
      const cell = document.createElement('div');
      cell.className = 'streak-day' + (done ? ' done' : '') + (i === 0 ? ' today' : '');
      const day = document.createElement('span'); day.textContent = days[d.getDay()];
      const mark = document.createElement('strong'); mark.textContent = done ? '✓' : d.getDate();
      cell.title = key + (done ? ' — workout completed' : '');
      cell.append(day, mark); weekBox.append(cell);
    }
    const doneToday = set.has(today);
    streakToggle.textContent = doneToday ? '✓ Workout completed today · Undo' : '+ Mark today’s workout';
    streakNote.textContent = message || (doneToday ? 'Logged for today. Recover well!' : 'Missed a day? No problem. Start again when ready.');
  }
  streakToggle.addEventListener('click', () => {
    const today = dateKey(new Date()), dates = new Set(readDates());
    const wasDone = dates.has(today);
    if (wasDone) dates.delete(today); else dates.add(today);
    let saved = true;
    try { localStorage.setItem(KEY, JSON.stringify([...dates].sort())); } catch { saved = false; }
    renderStreak(saved ? (wasDone ? 'Today’s workout mark was removed.' : 'Workout logged. One session at a time!') : 'Browser storage is unavailable; your mark may not persist.');
  });
  renderStreak();
})();
