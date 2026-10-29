import { bindCopyButtons, copyText, toggleTheme } from './ui';
import './motion';
import './embers';

/* ---- header: scrolled state, active section, theme, mobile menu ---- */
const root = document.documentElement;
const onScroll = () => root.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

const menu = document.getElementById('menu-dialog') as HTMLDialogElement | null;
document.getElementById('menu-open')?.addEventListener('click', () => menu?.showModal());
menu?.querySelectorAll('[data-close-menu]').forEach((a) => a.addEventListener('click', () => menu.close()));
// If the viewport grows past the breakpoint while open, don't strand the user in a modal.
matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && menu?.open && menu.close());

const links = document.querySelectorAll<HTMLAnchorElement>('.nav a[data-nav]');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.setAttribute('aria-current', String(l.dataset.nav === en.target.id)));
    });
  },
  { rootMargin: '-40% 0px -55% 0px' },
);
document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));

/* ---- section labels fade in once ---- */
const rev = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        rev.unobserve(en.target);
      }
    }),
  { threshold: 0.4 },
);
document.querySelectorAll('.reveal').forEach((el) => rev.observe(el));

bindCopyButtons();

/* ---- command palette ---- */
type Item = { group: string; label: string; hint: string; action: 'hash' | 'copy' | 'open' | 'theme'; value: string };
const dlg = document.getElementById('palette') as HTMLDialogElement | null;
const input = document.getElementById('palette-input') as HTMLInputElement | null;
const list = document.getElementById('palette-list');
const empty = dlg?.querySelector<HTMLElement>('.palette__empty');
const data: Item[] = JSON.parse(document.getElementById('palette-data')?.textContent || '[]');
let shown: Item[] = [];
let sel = 0;

function render() {
  if (!list || !input) return;
  const q = input.value.trim().toLowerCase();
  shown = data.filter((i) => !q || `${i.label} ${i.hint} ${i.group}`.toLowerCase().includes(q));
  sel = Math.min(sel, Math.max(shown.length - 1, 0));
  list.replaceChildren();
  let group = '';
  shown.forEach((item, idx) => {
    if (item.group !== group) {
      group = item.group;
      const g = document.createElement('li');
      g.setAttribute('role', 'group');
      g.setAttribute('aria-label', group);
      g.textContent = group;
      list.appendChild(g);
    }
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.id = `opt-${idx}`;
    li.setAttribute('aria-selected', String(idx === sel));
    const label = document.createElement('span');
    label.textContent = item.label;
    const hint = document.createElement('small');
    hint.textContent = item.hint;
    li.append(label, hint);
    li.addEventListener('click', () => run(item));
    li.addEventListener('mousemove', () => {
      if (sel !== idx) {
        sel = idx;
        mark();
      }
    });
    list.appendChild(li);
  });
  if (empty) empty.hidden = shown.length > 0;
  input.setAttribute('aria-activedescendant', shown.length ? `opt-${sel}` : '');
}
function mark() {
  list?.querySelectorAll('[role=option]').forEach((el, i) => el.setAttribute('aria-selected', String(i === sel)));
  input?.setAttribute('aria-activedescendant', `opt-${sel}`);
  list?.querySelector(`#opt-${sel}`)?.scrollIntoView({ block: 'nearest' });
}
function run(item: Item) {
  dlg?.close();
  if (item.action === 'hash') {
    const target = document.querySelector(item.value);
    if (target) {
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      history.replaceState(null, '', item.value);
    }
  } else if (item.action === 'copy') copyText(item.value, `Copied ${item.value}`);
  else if (item.action === 'open') window.open(item.value, '_blank', 'noopener');
  else toggleTheme();
}
function openPalette() {
  if (!dlg || dlg.open) return;
  if (input) input.value = '';
  sel = 0;
  render();
  dlg.showModal();
  input?.focus();
}
document.querySelectorAll('[data-palette-open]').forEach((b) => b.addEventListener('click', openPalette));
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    dlg?.open ? dlg.close() : openPalette();
  }
});
input?.addEventListener('input', () => {
  sel = 0;
  render();
});
input?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!shown.length) return;
    sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
    mark();
  } else if (e.key === 'Enter' && shown[sel]) {
    e.preventDefault();
    run(shown[sel]);
  }
});
// click on the backdrop closes
dlg?.addEventListener('click', (e) => e.target === dlg && dlg.close());

/* ---- broken images get a designed fallback instead of a torn icon ---- */
function fallback(img: HTMLImageElement) {
  if (!img.parentElement || img.dataset.failed) return;
  img.dataset.failed = '1';
  const box = document.createElement('div');
  box.className = 'img-fallback';
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', img.alt || 'Image unavailable');
  box.textContent = 'image unavailable';
  img.replaceWith(box);
}
document.querySelectorAll<HTMLImageElement>('img[data-fallback]').forEach((img) => {
  if (img.complete && img.naturalWidth === 0 && img.currentSrc) fallback(img);
  else img.addEventListener('error', () => fallback(img), { once: true });
});

/* shortcut hint: ⌘K on Apple platforms, Ctrl K elsewhere */
if (!/Mac|iPhone|iPad/.test(navigator.platform)) {
  document.querySelectorAll('.kbd span').forEach((s) => (s.textContent = 'Ctrl K'));
}
