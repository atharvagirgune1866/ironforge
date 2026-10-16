const $ = id => document.getElementById(id);
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

PROGRAMS.forEach(p => { const c = el('div', 'card'); c.append(el('span', 'tag', p.level), el('h3', '', p.title), el('p', '', p.description)); $('programList').append(c); });
PLANS.forEach(p => {
  const c = el('div', 'card' + (p.featured ? ' featured' : ''));
  const price = el('div', 'price', '₹' + p.price); price.append(el('small', '', ' / ' + p.period));
  const ul = el('ul'); p.features.forEach(f => ul.append(el('li', '', f)));
  const b = el('a', 'btn', 'Choose ' + p.name); b.href = '#contact'; b.onclick = () => { $('plan').value = p.name; };
  c.append(el('h3', '', p.name), price, ul, b); $('planList').append(c);
  const o = el('option', '', p.name); o.value = p.name; $('plan').append(o);
});
TRAINERS.forEach(t => { const c = el('div', 'card'); c.append(el('h3', '', t.name), el('span', 'tag', t.speciality), el('p', '', t.bio)); $('trainerList').append(c); });

$('enquiryForm').addEventListener('submit', e => {
  e.preventDefault();
  const msg = $('formMsg'); msg.className = 'msg';
  const name = $('name').value.trim(), email = $('email').value.trim(), phone = $('phone').value.trim();
  const errors = [];
  if (name.length < 2) errors.push('Name must be at least 2 characters');
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email required');
  if (!/^[0-9+\-\s]{7,15}$/.test(phone)) errors.push('Valid phone number required');
  if (errors.length) { msg.classList.add('err'); msg.textContent = errors.join(', '); return; }
  const enquiry = {
    id: 'IF-' + Date.now().toString(36).toUpperCase(), name, email, phone,
    plan: $('plan').value, message: $('message').value.trim(), status: 'New', notes: [], date: new Date().toISOString(),
  };
  const list = JSON.parse(localStorage.getItem('ironforge_enquiries') || '[]');
  list.unshift(enquiry);
  localStorage.setItem('ironforge_enquiries', JSON.stringify(list));
  msg.classList.add('ok'); msg.textContent = 'Thank you! Your enquiry ID is ' + enquiry.id + '. We will contact you soon.';
  e.target.reset();
});
