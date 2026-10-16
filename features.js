// ----- dark / light toggle -----
const root = document.documentElement;
try { root.dataset.theme = localStorage.getItem('if_theme') || 'dark'; } catch { root.dataset.theme = 'dark'; }
$('themeBtn').onclick = () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('if_theme', root.dataset.theme); } catch {} };

// ----- scroll animations -----
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('show'); io.unobserve(x.target); } }), { threshold: .1 });
document.querySelectorAll('.reveal').forEach(s => io.observe(s));

// ----- WhatsApp -----
$('wa').href = 'https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent('Hi IRONFORGE, I want to know about membership.');

// ----- BMI & calories -----
$('bmiForm').addEventListener('submit', e => {
  e.preventDefault();
  const age = +$('age').value, h = +$('ht').value, w = +$('wt').value;
  const bmi = w / Math.pow(h / 100, 2);
  const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const bmr = 10 * w + 6.25 * h - 5 * age + ($('sex').value === 'm' ? 5 : -161);
  const maint = bmr * +$('act').value, target = maint + +$('goal').value;
  const protein = Math.round(w * 1.8);
  const o = $('bmiOut'); o.classList.remove('hidden');
  o.textContent = `BMI ${bmi.toFixed(1)} (${cat}). Maintenance ~${Math.round(maint)} kcal/day, target ~${Math.round(target)} kcal/day, protein ~${protein} g/day.`;
});

// ----- timetable -----
function showDay(d) {
  document.querySelectorAll('#dayTabs button').forEach(b => b.classList.toggle('on', b.textContent === d));
  $('dayClasses').replaceChildren();
  TIMETABLE[d].forEach(([t, n, c]) => { const k = el('div', 'card'); k.append(el('span', 'tag', t), el('h3', '', n), el('p', '', 'Coach: ' + c)); $('dayClasses').append(k); });
}
Object.keys(TIMETABLE).forEach(d => { const b = el('button', '', d); b.type = 'button'; b.onclick = () => showDay(d); $('dayTabs').append(b); });
showDay(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]);

// ----- membership calculator -----
PLANS.forEach(p => { const o = el('option', '', p.name + ' - ₹' + p.price + '/mo'); o.value = p.name; $('cplan').append(o); });
const DISC = { 1: 0, 3: .05, 6: .10, 12: .15 };
function calc() {
  const p = PLANS.find(x => x.name === $('cplan').value), m = +$('cmonths').value;
  const monthly = p.price + ($('ctrainer').checked ? CONFIG.TRAINER_ADDON : 0);
  const sub = monthly * m, disc = Math.round(sub * DISC[m]), fee = m >= 6 ? 0 : CONFIG.JOINING_FEE;
  $('cTotal').textContent = '₹' + (sub - disc + fee).toLocaleString('en-IN');
  $('cDetail').textContent = `₹${sub.toLocaleString('en-IN')} - ₹${disc.toLocaleString('en-IN')} discount + ₹${fee} joining fee${fee ? '' : ' (waived)'}`;
}
['cplan', 'cmonths', 'ctrainer'].forEach(id => $(id).addEventListener('change', calc)); calc();

// ----- reviews & gallery -----
REVIEWS.forEach(r => { const c = el('div', 'card'); c.append(el('div', 'stars', '★★★★★'), el('p', '', '"' + r.text + '"'), el('b', '', r.name)); $('reviewList').append(c); });
GALLERY.forEach(g => $('galleryList').append(el('div', 'tile', g)));
