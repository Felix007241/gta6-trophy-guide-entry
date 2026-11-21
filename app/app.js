// Leonida Legend — GTA VI trophy guide & tracker.
// Plain static app: loads data/trophies.json, saves ticks in localStorage,
// exports/imports progress as a file. No network requests at run time.
const KEY = 'leonida-legend-progress-v1';
const SPOILER_KEY = 'leonida-legend-spoiler-v1';

const STAGES = [
  { n: 1, title: 'Story first', text: 'Play the story in order. Chapters 1–4, the named story missions and the final mission — 13 trophies, all hidden until earned.' },
  { n: 2, title: 'Stranger strands', text: 'Finish 8 mission strands for strangers across Leonida, including the finals for Andy, Kenton, Billy, Randy and Tyrone.' },
  { n: 3, title: 'Activities', text: '250 stunts, 42 gold Shooting Range medals, drone races at all 14 spots, 20 different races, fishing, the arcade, 50 challenges, meditation at all 18 spots.' },
  { n: 4, title: 'Collectibles', text: '3 card sets, WAiNK It at 100 locations, 100 vehicles discovered, all 52 areas explored, all 8 garages bought, 10 vehicles registered.' },
  { n: 5, title: 'Crime with your partner', text: 'Partner robberies: 3 shops back-to-back, 5 bank vaults, a jewelry store unseen, an armored truck, one illegal operation per gang.' },
  { n: 6, title: 'Money & odd jobs', text: 'Launder $250,000 of Marked Bills, spend $100,000 in shops, plus Combat Focus, the airport departure, the Rhino, the showroom smash and the odd one-offs.' },
  { n: 7, title: '100% & platinum', text: 'Clear the in-game 100% checklist for A Long Road, and the platinum pops with the last of the other 54.' },
];

const KINDS = [
  ['all', 'All 55'],
  ['story', 'Story'],
  ['missable', 'Missable'],
  ['collectibles', 'Collectibles'],
  ['activities', 'Activities'],
  ['side', 'Side missions'],
  ['crime', 'Crime'],
  ['online', 'Online'],
];

const params = new URLSearchParams(location.search);
let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let filter = params.get('filter') ?? 'all';
let grade = params.get('grade') ?? 'all';
let query = params.get('search') ?? '';
let spoiler = params.has('spoiler') ? params.get('spoiler') !== '0' : (localStorage.getItem(SPOILER_KEY) ?? '1') === '1';

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

const rowsEl = document.getElementById('rows');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoiler');
const filtersEl = document.getElementById('filters');
const listMetaEl = document.getElementById('listMeta');
const emptyEl = document.getElementById('empty');

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
  localStorage.setItem(SPOILER_KEY, spoiler ? '1' : '0');
}

function saveProgress() { save(); render(); }

function stageTrophies(n) { return trophies.filter((t) => t.stage === n); }

function renderRoadmap() {
  const ol = document.getElementById('stages');
  ol.replaceChildren();
  for (const s of STAGES) {
    const list = stageTrophies(s.n);
    const done = list.filter((t) => earned.has(t.name)).length;
    const li = document.createElement('li');
    const title = document.createElement('strong');
    title.textContent = `Stage ${s.n} — ${s.title}`;
    const meta = document.createElement('div');
    meta.className = 'stage-meta';
    meta.textContent = `${done}/${list.length} earned`;
    const text = document.createElement('div');
    text.className = 'stage-trophies';
    text.textContent = s.text;
    li.append(title, meta, text);
    ol.append(li);
  }
}

function matches(t) {
  if (grade !== 'all' && t.grade !== grade) return false;
  if (filter === 'missable' && !t.missable) return false;
  else if (filter === 'online') return false;
  else if (filter !== 'all' && filter !== 'missable' && t.kind !== filter) return false;
  if (query) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(query.toLowerCase())) return false;
  }
  return true;
}

function renderList() {
  rowsEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!matches(t)) continue;
    shown++;
    const li = document.createElement('li');
    if (earned.has(t.name)) li.classList.add('earned');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      saveProgress();
    });
    li.append(box);

    const body = document.createElement('div');
    const head = document.createElement('div');
    head.className = 'trophy-head';
    const badge = document.createElement('span');
    badge.className = `badge ${t.grade}`;
    badge.textContent = t.grade;
    head.append(badge);

    const isHidden = spoiler && t.hidden && !earned.has(t.name);
    if (isHidden) {
      const h = document.createElement('h3');
      h.textContent = 'Hidden trophy — story spoiler';
      head.append(h);
      const tag = document.createElement('span');
      tag.className = 'tag hidden-tag';
      tag.textContent = 'hidden until earned';
      head.append(tag);
      body.append(head);
      const p = document.createElement('p');
      p.className = 'spoiler-hidden';
      p.textContent = 'Its name, description and guide stay hidden until you earn it. Tick the box when it pops to reveal it.';
      body.append(p);
    } else {
      const h = document.createElement('h3');
      h.textContent = t.name;
      head.append(h);
      const kindTag = document.createElement('span');
      kindTag.className = 'tag';
      kindTag.textContent = t.kind === 'side' ? 'side mission' : t.kind;
      head.append(kindTag);
      if (t.hidden) {
        const tag = document.createElement('span');
        tag.className = 'tag hidden-tag';
        tag.textContent = 'hidden on PSN';
        head.append(tag);
      }
      if (t.missable) {
        const tag = document.createElement('span');
        tag.className = 'tag missable';
        tag.textContent = 'possibly missable';
        head.append(tag);
      }
      body.append(head);
      const desc = document.createElement('p');
      desc.className = 'desc';
      desc.textContent = t.description;
      body.append(desc);
      const guide = document.createElement('p');
      guide.className = 'guide';
      const label = document.createElement('strong');
      label.textContent = 'How to get it — ';
      guide.append(label, document.createTextNode(t.guide));
      body.append(guide);
      const src = document.createElement('p');
      src.className = 'sources';
      src.textContent = `Sources: ${t.sources.join(' · ')}`;
      body.append(src);
    }
    li.append(body);
    rowsEl.append(li);
  }
  emptyEl.hidden = shown !== 0;
  if (filter === 'online') {
    emptyEl.hidden = false;
    emptyEl.textContent = 'No online trophies — all 55 trophies are offline, single-player (KeenGamer, eGamers). Nothing to earn online.';
  } else {
    emptyEl.textContent = 'No trophies match this filter.';
  }
  listMetaEl.textContent = `Showing ${shown} of ${trophies.length} trophies · ${earned.size} earned`;
}

function renderProgress() {
  document.getElementById('progressBig').textContent = `${earned.size} / ${trophies.length}`;
  document.getElementById('progressFill').style.width = `${(earned.size / trophies.length) * 100}%`;
  const count = (g) => trophies.filter((t) => t.grade === g && earned.has(t.name)).length;
  document.getElementById('progressCounts').textContent =
    `Platinum ${count('platinum')}/1 · Gold ${count('gold')}/2 · Silver ${count('silver')}/6 · Bronze ${count('bronze')}/46`;
}

function renderFilters() {
  filtersEl.replaceChildren();
  for (const [value, label] of KINDS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.setAttribute('aria-pressed', String(filter === value));
    b.addEventListener('click', () => { filter = value; render(); });
    filtersEl.append(b);
  }
}

function render() {
  renderRoadmap();
  renderFilters();
  renderList();
  renderProgress();
  document.getElementById('missableNote').textContent =
    'Missable: only Positive Mental Attitude is flagged as possibly missable (GTABase and PowerPyx). No confirmed missable list exists yet (PlanetGTA6, 21 Nov 2026) — meditate at every spot as you find it and keep a manual save before big missions.';
}

searchEl.value = query;
gradeEl.value = grade;
spoilerEl.checked = spoiler;
searchEl.addEventListener('input', () => { query = searchEl.value; renderList(); });
gradeEl.addEventListener('change', () => { grade = gradeEl.value; render(); });
spoilerEl.addEventListener('change', () => { spoiler = spoilerEl.checked; save(); render(); });

document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned], exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = new Set(trophies.map((t) => t.name));
    const list = Array.isArray(data) ? data : data.earned;
    earned = new Set((list ?? []).filter((n) => names.has(n)));
    saveProgress();
  } catch {
    alert('That file is not a trophy progress export.');
  }
  e.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) { earned = new Set(); saveProgress(); }
});

render();
if (params.get('scroll')) {
  document.getElementById(params.get('scroll'))?.scrollIntoView();
}
