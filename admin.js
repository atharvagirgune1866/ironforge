const $ = id => document.getElementById(id);
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
const PASSWORD = 'ironforge123'; // demo only: visible in the source, so not real security
const STATUSES = ['New', 'Contacted', 'Visit Scheduled', 'Completed'];
const load = () => JSON.parse(localStorage.getItem('ironforge_enquiries') || '[]');
const save = l => localStorage.setItem('ironforge_enquiries', JSON.stringify(l));

function open() { $('loginBox').classList.add('hidden'); $('dash').classList.remove('hidden'); $('logout').classList.remove('hidden'); render(); }
if (sessionStorage.getItem('if_admin')) open();
$('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  if ($('password').value === PASSWORD) { sessionStorage.setItem('if_admin', '1'); open(); } else $('loginMsg').classList.remove('hidden');
});
$('logout').onclick = () => { sessionStorage.removeItem('if_admin'); location.reload(); };
STATUSES.forEach(s => { const o = el('option', '', s); o.value = s; $('statusFilter').append(o); });
$('search').oninput = $('statusFilter').onchange = () => render();
$('clear').onclick = () => { if (confirm('Delete all enquiries?')) { save([]); render(); } };

function render() {
  const all = load(), q = $('search').value.toLowerCase(), st = $('statusFilter').value;
  $('stats').replaceChildren();
  [['Total', all.length], ...STATUSES.map(s => [s, all.filter(x => x.status === s).length])].forEach(([k, v]) => {
    const c = el('div', 'card stat'); c.append(el('b', '', v), el('span', '', k)); $('stats').append(c);
  });
  $('rows').replaceChildren();
  all.filter(x => (!st || x.status === st) && [x.id, x.name, x.email, x.phone].join(' ').toLowerCase().includes(q)).forEach(en => {
    const tr = el('tr'), contact = el('td');
    contact.append(el('b', '', en.name), el('br'), document.createTextNode(en.email + ' · ' + en.phone));
    if (en.message) contact.append(el('br'), el('em', '', '"' + en.message + '"'));
    const sel = el('select'); STATUSES.forEach(s => { const o = el('option', '', s); o.value = s; if (s === en.status) o.selected = true; sel.append(o); });
    sel.onchange = () => { en.status = sel.value; save(all); render(); };
    const stTd = el('td'); stTd.append(sel);
    const notes = el('td'); en.notes.forEach(n => notes.append(el('div', '', n)));
    const ni = el('input'); ni.placeholder = 'Add note + Enter';
    ni.onkeydown = k => { if (k.key === 'Enter' && ni.value.trim()) { en.notes.push(ni.value.trim()); save(all); render(); } };
    notes.append(ni);
    tr.append(el('td', '', en.id), contact, el('td', '', en.plan || '-'), stTd, notes); $('rows').append(tr);
  });
}
