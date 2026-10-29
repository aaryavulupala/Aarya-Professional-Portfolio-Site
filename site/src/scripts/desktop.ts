export {};
/* Mini desktop: icons open draggable, minimizable windows inside the desk. */

const desk = document.getElementById('desk');
const tray = document.getElementById('tray');

if (desk && tray) {
  const wins = new Map<string, HTMLElement>();
  desk.querySelectorAll<HTMLElement>('.win').forEach((w) => wins.set(w.id.replace('win-', ''), w));
  let z = 10;
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const front = (w: HTMLElement) => {
    w.style.zIndex = String(++z);
  };
  const keepInside = (w: HTMLElement) => {
    const maxX = Math.max(0, desk.clientWidth - w.offsetWidth);
    const maxY = Math.max(0, desk.clientHeight - w.offsetHeight);
    w.style.left = `${clamp(parseFloat(w.style.left) || 0, 0, maxX)}px`;
    w.style.top = `${clamp(parseFloat(w.style.top) || 0, 0, maxY)}px`;
  };
  const syncTray = () => {
    tray.replaceChildren();
    wins.forEach((w, slug) => {
      if (!w.hidden && w.classList.contains('is-min')) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = w.querySelector('.win__name')?.textContent ?? slug;
        b.setAttribute('aria-label', `Restore ${w.getAttribute('aria-label')}`);
        b.addEventListener('click', () => open(slug));
        tray.append(b);
      }
    });
    tray.hidden = tray.childElementCount === 0;
  };

  function open(slug: string) {
    const w = wins.get(slug);
    if (!w) return;
    const wasHidden = w.hidden;
    w.hidden = false;
    w.classList.remove('is-min');
    if (wasHidden && !w.style.left) {
      const n = [...wins.values()].filter((x) => !x.hidden).length - 1;
      w.style.left = `${12 + n * 22}px`;
      w.style.top = `${8 + n * 22}px`;
    }
    keepInside(w);
    front(w);
    syncTray();
    w.focus({ preventScroll: true });
  }
  function close(w: HTMLElement) {
    w.hidden = true;
    w.classList.remove('is-min');
    syncTray();
    desk!.querySelector<HTMLElement>(`[data-open="${w.id.replace('win-', '')}"]`)?.focus();
  }
  function minimize(w: HTMLElement) {
    w.classList.add('is-min');
    syncTray();
    desk!.querySelector<HTMLElement>(`[data-open="${w.id.replace('win-', '')}"]`)?.focus();
  }

  desk.querySelectorAll<HTMLElement>('[data-open]').forEach((b) => b.addEventListener('click', () => open(b.dataset.open!)));

  wins.forEach((w) => {
    w.addEventListener('pointerdown', () => front(w));
    w.addEventListener('keydown', (e) => e.key === 'Escape' && close(w));
    w.querySelector('[data-close]')?.addEventListener('click', () => close(w));
    w.querySelector('[data-min]')?.addEventListener('click', () => minimize(w));
    w.querySelector('[data-jump]')?.addEventListener('click', () => minimize(w));

    // drag by the title bar
    const bar = w.querySelector<HTMLElement>('.win__title')!;
    let drag: { id: number; dx: number; dy: number } | null = null;
    bar.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      const r = w.getBoundingClientRect();
      drag = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top };
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove', (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const d = desk.getBoundingClientRect();
      w.style.left = `${e.clientX - d.left - drag.dx}px`;
      w.style.top = `${e.clientY - d.top - drag.dy}px`;
      keepInside(w);
    });
    const end = (e: PointerEvent) => {
      if (drag?.id === e.pointerId) drag = null;
    };
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
  });

  new ResizeObserver(() => wins.forEach((w) => !w.hidden && keepInside(w))).observe(desk);
}
