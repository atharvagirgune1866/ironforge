// ----- stats with count-up -----
GYM.stats.forEach(([n, suf, label]) => {
  const c = el('div', 'stat2'); const b = el('b', '', '0'); b.dataset.t = n; b.dataset.s = suf; c.append(b, el('span', '', label)); $('statBar').append(c);
});
const cio = new IntersectionObserver(es => es.forEach(x => {
  if (!x.isIntersecting) return; cio.unobserve(x.target);
  const b = x.target.querySelector('b'), t = +b.dataset.t; let i = 0;
  const id = setInterval(() => { i = Math.min(i + Math.ceil(t / 40), t); b.textContent = i + b.dataset.s; if (i >= t) clearInterval(id); }, 30);
}), { threshold: .5 });
document.querySelectorAll('.stat2').forEach(s => cio.observe(s));

// ----- why us -----
WHY.forEach(([ic, t, d]) => { const c = el('div', 'card'); const i = el('div', 'ico'); i.innerHTML = icon(ic); c.append(i, el('h3', '', t), el('p', '', d)); $('whyList').append(c); });

// ----- gallery with icons -----
const gIcons = ['dumbbell', 'flame', 'users', 'heart', 'shield', 'clock'];
$('galleryList').replaceChildren();
GALLERY.forEach((g, i) => { const t = el('div', 'tile'); const ic = el('div', 'tico'); ic.innerHTML = icon(gIcons[i % 6]); t.append(ic, el('span', '', g)); $('galleryList').append(t); });

// ----- FAQ (accordion) -----
FAQ.forEach(([q, a]) => { const d = el('details'); d.append(el('summary', '', q), el('p', '', a)); $('faqList').append(d); });

// ----- footer details -----
$('fAddr').textContent = GYM.address; $('fPhone').textContent = 'Phone: ' + GYM.phone; $('fMail').textContent = 'Email: ' + GYM.email;
GYM.hours.forEach(([d, t]) => { const r = el('p'); r.append(el('b', '', d + ': '), document.createTextNode(t)); $('fHours').append(r); });

// ----- progress bar + back to top -----
addEventListener('scroll', () => {
  const h = document.documentElement; $('progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  $('toTop').classList.toggle('show', h.scrollTop > 500);
});
$('toTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
