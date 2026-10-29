export {};
/* Scroll feel: a softer wheel, plus a sweep-and-dissolve reveal as blocks arrive. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- slower, eased wheel scrolling (fine pointers only) ---- */
if (!reduce && matchMedia('(pointer: fine)').matches) {
  let target = scrollY;
  let cur = scrollY;
  let raf = 0;
  const max = () => document.documentElement.scrollHeight - innerHeight;
  const clamp = (v: number) => Math.max(0, Math.min(max(), v));

  const tick = () => {
    cur += (target - cur) * 0.11;
    if (Math.abs(target - cur) < 0.5) {
      cur = target;
      raf = 0;
    } else raf = requestAnimationFrame(tick);
    scrollTo({ top: cur, behavior: 'instant' });
  };

  addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const el = e.target as Element;
      if (el.closest('dialog, .win__body')) return; // let inner scrollers behave natively
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
      if (!raf) cur = scrollY;
      target = clamp((raf ? target : scrollY) + dy * 0.55);
      if (!raf) raf = requestAnimationFrame(tick);
    },
    { passive: false },
  );
  // anything else that scrolls (keys, anchors, scrollbar drag) wins and resyncs us
  const resync = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    target = cur = scrollY;
  };
  addEventListener('keydown', resync);
  addEventListener('pointerdown', resync);
  addEventListener('scroll', () => !raf && (target = cur = scrollY), { passive: true });
}

/* ---- dissolve & sweep reveal ---- */
if (!reduce) {
  const sel = [
    '.section__intro',
    '.project__media',
    '.project__body',
    '.project__flow',
    '.role',
    '.edu__school',
    '.edu > div:last-child',
    '.pit__stage',
    '.contact__line',
    '.contact',
    '.sub',
  ].join(',');
  const els = [...document.querySelectorAll<HTMLElement>(sel)];
  els.forEach((el, i) => {
    el.classList.add('sweep');
    if (el.matches('.project__body, .project__flow')) el.style.setProperty('--sweep-delay', '0.12s');
  });
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        el.classList.add('is-in');
        io.unobserve(el);
        // once it has landed, drop the mask so it costs nothing and sticky layouts are untouched
        setTimeout(() => el.classList.add('is-done'), 1500);
      }),
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
  );
  els.forEach((el) => io.observe(el));
}
