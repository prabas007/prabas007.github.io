/* Renders the site from CONTENT. You should not need to edit this file. */

const $  = (s, r = document) => r.querySelector(s);
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

/* Wrap [PLACEHOLDER ...] markers in a visible callout so nothing ships unnoticed */
const mark = s => esc(s).replace(/\[PLACEHOLDER[^\]]*\]/gi, m => `<span class="ph">${m}</span>`);

/* ---------- Theme ---------- */
(function theme() {
  const saved = (() => { try { return localStorage.getItem('theme'); } catch (e) { return null; } })();
  if (saved) document.documentElement.dataset.theme = saved;
  document.addEventListener('click', e => {
    if (!e.target.closest('#theme-btn')) return;
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

/* ---------- ?ref= tracking (know which application drove the visit) ------- */
(function ref() {
  const r = new URLSearchParams(location.search).get('ref');
  if (r) { try { sessionStorage.setItem('ref', r); } catch (e) {} console.info('ref:', r); }
})();

const tags = list => `<div class="tags">${list.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;

const mediaBlock = (src, label, cls) => {
  // A missing file leaves a quiet neutral panel rather than a labelled gap.
  if (!src) return `<div class="${cls} empty"></div>`;
  return `<div class="${cls}"><img src="${esc(src)}" alt="${esc(label)} demo"
    onerror="this.closest('.${cls}').classList.add('empty'); this.remove()"></div>`;
};

/* ======================= HOME PAGE ======================= */
function renderHome() {
  const C = CONTENT;

  $('#c-name').textContent    = C.name;
  $('#c-tagline').textContent = C.tagline;
  $('#c-status').textContent  = C.status;
  $('#c-intro').textContent   = C.intro;
  document.title = C.name;

  // Photo, with graceful fallback to a labelled placeholder
  $('#c-photo').innerHTML = C.photo
    ? `<img class="photo" src="${esc(C.photo)}" alt="${esc(C.photoAlt)}" onerror="this.remove()">`
    : '';

  $('#c-links').innerHTML = [
    C.resume ? `<a class="primary" href="${esc(C.resume)}" target="_blank" rel="noopener">Resume</a>` : '',
    `<a href="${esc(C.github)}" target="_blank" rel="noopener">GitHub</a>`,
    `<a href="${esc(C.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`,
    `<a href="mailto:${esc(C.email)}">Email</a>`
  ].join('');

  const featured = C.projects.filter(p => !p.current);
  const current  = C.projects.filter(p =>  p.current);

  $('#proj-count').textContent = String(featured.length).padStart(2, '0');

  $('#c-projects').innerHTML = featured.map(p => `
    <a class="card" href="project.html?p=${encodeURIComponent(p.id)}">
      ${mediaBlock(p.media, p.title, 'card-media')}
      <div class="card-body">
        ${p.domain ? `<div class="domain">${esc(p.domain)}</div>` : ''}
        <div class="card-top">
          <span class="card-title">${esc(p.title)}</span>
          ${p.wip ? '<span class="wip">In progress</span>' : ''}
          <span class="card-year">${esc(p.year)}</span>
        </div>
        <div class="card-sub">${esc(p.subtitle)}</div>
        ${p.award ? `<div class="award">${esc(p.award)}</div>` : ''}
        <p class="card-hook">${esc(p.hook)}</p>
        ${tags(p.stack)}
        <span class="card-cta">Read the write-up &rarr;</span>
      </div>
    </a>`).join('');

  if (current.length) {
    $('#c-current').innerHTML = current.map(p => {
      const inner = `
        <div class="cur-top">
          <span class="cur-title">${esc(p.title)}</span>
          <span class="cur-sub">${esc(p.subtitle)}</span>
          <span class="cur-year">${esc(p.year)}</span>
        </div>
        <p class="cur-hook">${esc(p.hook)}</p>
        ${tags(p.stack)}
        ${p.noPage ? '' : '<span class="card-cta">Read the write-up &rarr;</span>'}`;
      return p.noPage
        ? `<div class="cur-item">${inner}</div>`
        : `<a class="cur-item" href="project.html?p=${encodeURIComponent(p.id)}">${inner}</a>`;
    }).join('');
  } else {
    $('#current')?.remove();
  }

  $('#c-exp').innerHTML = C.experience.map(e => `
    <div class="exp-item">
      <div class="exp-top">
        <span class="exp-co">${esc(e.company)}</span>
        <span class="exp-role">${esc(e.role)}</span>
        <span class="exp-dates">${esc(e.dates)}</span>
      </div>
      <ul>${e.bullets.map(b => `<li>${mark(b)}</li>`).join('')}</ul>
    </div>`).join('');

  $('#c-skills').innerHTML = C.skills.map(g => `
    <div class="skill-group">
      <h3>${esc(g.group)}</h3>
      ${tags(g.items)}
    </div>`).join('');

  $('#c-about').innerHTML = mark(C.about);
  if (C.footer) $('#c-footer').textContent = C.footer; else $('#c-footer').remove();
  $('#c-footer-links').innerHTML = [
    `<a href="mailto:${esc(C.email)}">Email</a>`,
    `<a href="${esc(C.github)}" target="_blank" rel="noopener">GitHub</a>`,
    `<a href="${esc(C.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`,
    C.resume ? `<a href="${esc(C.resume)}" target="_blank" rel="noopener">Resume</a>` : ''
  ].filter(Boolean).join('');

  buildPalette();
}

/* ======================= PROJECT PAGE ======================= */
function renderProject() {
  const id = new URLSearchParams(location.search).get('p');
  const p  = CONTENT.projects.find(x => x.id === id);
  const root = $('#proj-root');

  if (!p) {
    root.innerHTML = `<div class="block"><h2>Not found</h2>
      <p>No project with that id. <a href="index.html" style="color:var(--accent)">Back home</a>.</p></div>`;
    return;
  }

  document.title = `${p.title} — ${CONTENT.name}`;

  const blocks = [];

  blocks.push(`
    <a class="back" href="index.html#projects">&larr; all projects</a>
    <div class="p-head">
      ${p.domain ? `<div class="domain">${esc(p.domain)}</div>` : ''}
      <h1>${esc(p.title)}${p.wip ? ' <span class="wip">In progress</span>' : ''}</h1>
      <div class="p-sub">${esc(p.subtitle)}</div>
      <div class="p-year">${esc(p.year)}</div>
      ${p.award ? `<div class="award">${esc(p.award)}</div>` : ''}
      <p class="p-hook">${esc(p.hook)}</p>
      ${tags(p.stack)}
      ${(p.repo || p.reportUrl) ? `<div class="links" style="margin-top:18px">
        ${p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener">View source &nearr;</a>` : ''}
        ${p.reportUrl ? `<a href="${esc(p.reportUrl)}" target="_blank" rel="noopener">${esc(p.reportLabel || 'Full report')} &nearr;</a>` : ''}
      </div>` : ''}
    </div>
    ${mediaBlock(p.media, p.title, 'p-media')}`);

  if (p.problem) blocks.push(`<div class="block"><h2>The Problem</h2><p>${mark(p.problem)}</p></div>`);
  if (p.built)   blocks.push(`<div class="block"><h2>What I Built</h2><p>${mark(p.built)}</p></div>`);

  if (p.architecture && p.architecture.length) {
    blocks.push(`<div class="block"><h2>Architecture</h2>
      <div class="arch">${p.architecture
        .map(n => `<span class="arch-node">${esc(n)}</span>`)
        .join('<span class="arch-arrow">&rarr;</span>')}</div>
      ${p.architectureNote ? `<p class="arch-note">${mark(p.architectureNote)}</p>` : ''}</div>`);
  }

  if (p.results && p.results.length) {
    blocks.push(`<div class="block"><h2>Results</h2>
      <div class="results">${p.results.map(r => `
        <div class="result">
          <div class="result-val${String(r.value).length > 12 ? ' long' : ''}">${esc(r.value)}</div>
          <div class="result-lbl">${esc(r.label)}</div>
          ${r.note ? `<div class="result-note">${esc(r.note)}</div>` : ''}
        </div>`).join('')}</div></div>`);
  }

  if (p.gallery && p.gallery.length) {
    blocks.push(`<div class="block"><h2>Build</h2>
      <div class="gallery">${p.gallery.map(g => `
        <figure class="shot">
          <div class="shot-img"><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"
            onerror="this.closest('.shot-img').classList.add('empty'); this.remove()"></div>
          <figcaption>${mark(g.caption)}</figcaption>
        </figure>`).join('')}</div></div>`);
  }

  if (p.challenges && p.challenges.length) {
    blocks.push(`<div class="block"><h2>What Broke, and How I Fixed It</h2>
      ${p.challenges.map(c => `
        <div class="chal"><h3>${esc(c.title)}</h3><p>${mark(c.body)}</p></div>`).join('')}</div>`);
  }

  if (p.scope) blocks.push(`<div class="block"><h2>Scope</h2><p class="scope">${mark(p.scope)}</p></div>`);

  if (p.reportUrl) {
    blocks.push(`<div class="block"><h2>Full Write-up</h2>
      <p>Everything above is condensed. The complete report covers every subcircuit,
      schematic, K-map derivation and oscilloscope verification.</p>
      <div class="links"><a class="primary" href="${esc(p.reportUrl)}" target="_blank" rel="noopener">
        ${esc(p.reportLabel || 'Full report')} &nearr;</a></div></div>`);
  }

  // Prev / next
  const i = CONTENT.projects.indexOf(p);
  const nxt = CONTENT.projects[(i + 1) % CONTENT.projects.length];
  blocks.push(`<div class="block" style="padding-bottom:64px">
    <a class="back" href="project.html?p=${encodeURIComponent(nxt.id)}">next: ${esc(nxt.title)} &rarr;</a></div>`);

  root.innerHTML = blocks.join('');


  buildPalette();
}

/* ======================= COMMAND PALETTE (⌘K) ======================= */
let items = [], sel = 0;

function buildPalette() {
  if (!$('#cmdk-back')) {
    // Project pages do not include the markup; inject it.
    const d = el('div', 'cmdk-back');
    d.id = 'cmdk-back';
    d.innerHTML = `<div class="cmdk">
      <input id="cmdk-input" placeholder="Jump to..." autocomplete="off" spellcheck="false">
      <div class="cmdk-list" id="cmdk-list"></div></div>`;
    document.body.appendChild(d);
  }

  const home = location.pathname.endsWith('project.html') ? 'index.html' : '';
  items = [
    ...CONTENT.projects.filter(p => !p.noPage).map(p => ({ label: p.title, sub: p.current ? 'in progress' : 'project', href: `project.html?p=${encodeURIComponent(p.id)}` })),
    { label: 'Currently Working On', sub: 'section', href: `${home}#current` },
    { label: 'Experience', sub: 'section', href: `${home}#experience` },
    { label: 'Skills',     sub: 'section', href: `${home}#skills` },
    { label: 'About',      sub: 'section', href: `${home}#about` },
    ...(CONTENT.resume ? [{ label: 'Resume', sub: 'link', href: CONTENT.resume }] : []),
    { label: 'GitHub',     sub: 'link',    href: CONTENT.github },
    { label: 'LinkedIn',   sub: 'link',    href: CONTENT.linkedin },
    { label: 'Email',      sub: 'link',    href: `mailto:${CONTENT.email}` }
  ];
  drawPalette('');
}

function drawPalette(q) {
  const list = $('#cmdk-list');
  if (!list) return;
  const f = items.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));
  sel = 0;
  list.innerHTML = f.length
    ? f.map((i, n) => `<div class="cmdk-item ${n === 0 ? 'sel' : ''}" data-href="${esc(i.href)}">
        ${esc(i.label)}<span class="k">${esc(i.sub)}</span></div>`).join('')
    : `<div class="cmdk-item" style="color:var(--text-mute)">no match</div>`;
}

document.addEventListener('keydown', e => {
  const back = $('#cmdk-back');
  if (!back) return;
  const open = back.classList.contains('open');

  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    back.classList.toggle('open');
    if (back.classList.contains('open')) { $('#cmdk-input').value = ''; drawPalette(''); $('#cmdk-input').focus(); }
    return;
  }
  if (!open) return;

  if (e.key === 'Escape') { back.classList.remove('open'); return; }

  const rows = [...document.querySelectorAll('.cmdk-item[data-href]')];
  if (!rows.length) return;

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    rows[sel] && rows[sel].classList.remove('sel');
    sel = (sel + (e.key === 'ArrowDown' ? 1 : rows.length - 1)) % rows.length;
    rows[sel].classList.add('sel');
    rows[sel].scrollIntoView({ block: 'nearest' });
  }
  if (e.key === 'Enter') { e.preventDefault(); rows[sel] && (location.href = rows[sel].dataset.href); }
});

document.addEventListener('input', e => { if (e.target.id === 'cmdk-input') drawPalette(e.target.value); });
document.addEventListener('click', e => {
  const item = e.target.closest('.cmdk-item[data-href]');
  if (item) { location.href = item.dataset.href; return; }
  if (e.target.id === 'cmdk-back') e.target.classList.remove('open');
});

/* ---------- Boot ---------- */
if ($('#proj-root')) renderProject();
else if ($('#c-projects')) renderHome();
