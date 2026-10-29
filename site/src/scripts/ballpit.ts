export {};
/* Skill ball pit: a small circle-physics sim on <canvas>.
   Honest about cost: it only runs while the pit is on screen and something is moving. */

const stage = document.querySelector<HTMLElement>('[data-pit]');
const canvas = stage?.querySelector<HTMLCanvasElement>('canvas');
const tip = stage?.querySelector<HTMLElement>('.pit__tip');
const shakeBtn = stage?.querySelector<HTMLButtonElement>('.pit__shake');

if (stage && canvas && tip) boot(stage, canvas, tip, shakeBtn ?? null);

type Ball = {
  x: number; y: number; vx: number; vy: number; r: number;
  img: HTMLImageElement; loaded: boolean; failed: boolean;
  name: string; detail: string; full: boolean;
};

function boot(stage: HTMLElement, canvas: HTMLCanvasElement, tip: HTMLElement, shakeBtn: HTMLButtonElement | null) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const GRAV = 1900;
  const REST = 0.5;
  const STEP = 1 / 120;

  const items = [...document.querySelectorAll<HTMLElement>('.pit__src li[data-logo]')];
  const balls: Ball[] = items.map((li) => {
    const img = new Image();
    const b: Ball = {
      x: 0, y: -999, vx: 0, vy: 0, r: 30, img, loaded: false, failed: false,
      name: li.dataset.name!, detail: li.dataset.detail || '', full: !!li.dataset.full,
    };
    img.onload = () => { b.loaded = true; draw(); };
    img.onerror = () => { b.failed = true; draw(); };
    img.src = li.dataset.logo!;
    return b;
  });

  let W = 0, H = 0, dpr = 1;
  let spawned = false;
  let running = false;
  let last = 0, acc = 0, calmFor = 0;
  let visible = false;
  let hover: Ball | null = null;
  let drag: { ball: Ball; tx: number; ty: number; dx: number; dy: number; id: number } | null = null;
  let stroke = '#cfcabc';
  let label = '#16150f';

  const readTheme = () => {
    const cs = getComputedStyle(document.documentElement);
    stroke = cs.getPropertyValue('--rule').trim() || stroke;
    label = cs.getPropertyValue('--ink-muted').trim() || label;
  };

  function size() {
    const rect = stage.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const r = Math.max(22, Math.min(36, W / 22));
    balls.forEach((b) => (b.r = r));
    // keep everything inside after a resize
    balls.forEach((b) => {
      b.x = Math.min(Math.max(b.x, b.r), W - b.r);
      b.y = Math.min(b.y, H - b.r);
    });
  }

  function spawn() {
    spawned = true;
    balls.forEach((b, i) => {
      b.x = b.r + Math.random() * (W - 2 * b.r);
      b.y = -b.r - i * (reduce ? 4 : 46);
      b.vx = (Math.random() - 0.5) * 120;
      b.vy = 0;
    });
    if (reduce) {
      // no motion: settle off-screen and show the finished pile
      for (let i = 0; i < 2400; i++) step(STEP);
      balls.forEach((b) => { b.vx = b.vy = 0; });
      draw();
    } else wake();
  }

  function step(dt: number) {
    for (const b of balls) {
      if (drag && drag.ball === b) {
        b.vx = Math.max(-1800, Math.min(1800, (drag.tx - drag.dx - b.x) * 24));
        b.vy = Math.max(-1800, Math.min(1800, (drag.ty - drag.dy - b.y) * 24));
      } else b.vy += GRAV * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.vx *= 1 - 0.25 * dt;
    }
    for (let it = 0; it < 3; it++) {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i], c = balls[j];
          const dx = c.x - a.x, dy = c.y - a.y;
          const min = a.r + c.r;
          const d2 = dx * dx + dy * dy;
          if (d2 >= min * min) continue;
          const d = Math.sqrt(d2) || 0.001;
          const nx = dx / d, ny = dy / d;
          const push = (min - d) / 2;
          a.x -= nx * push; a.y -= ny * push;
          c.x += nx * push; c.y += ny * push;
          const vn = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
          if (vn < 0) {
            const j2 = (-(1 + REST) * vn) / 2;
            a.vx -= j2 * nx; a.vy -= j2 * ny;
            c.vx += j2 * nx; c.vy += j2 * ny;
          }
        }
      }
      for (const b of balls) {
        if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * REST; }
        if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * REST; }
        if (b.y > H - b.r) {
          b.y = H - b.r;
          b.vy = -Math.abs(b.vy) * REST;
          b.vx *= 0.985; // floor friction
          if (Math.abs(b.vy) < 30) b.vy = 0;
        }
      }
    }
  }

  function draw() {
    if (!W) return;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, W, H);
    for (const b of balls) {
      if (b.y < -b.r) continue;
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx!.fillStyle = '#fdfcf8';
      ctx!.fill();
      ctx!.lineWidth = b === hover ? 2 : 1;
      ctx!.strokeStyle = b === hover ? getComputedStyle(document.documentElement).getPropertyValue('--signal').trim() : stroke;
      ctx!.stroke();
      if (b.loaded) {
        ctx!.clip();
        const s = b.full ? b.r * 2 : b.r * 1.15;
        ctx!.drawImage(b.img, b.x - s / 2, b.y - s / 2, s, s);
      } else if (b.failed) {
        ctx!.fillStyle = label;
        ctx!.font = `500 ${b.r * 0.42}px ui-monospace, Menlo, monospace`;
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        ctx!.fillText(b.name.slice(0, 3), b.x, b.y);
      }
      ctx!.restore();
    }
  }

  function frame(t: number) {
    if (!running) return;
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    acc += dt;
    while (acc >= STEP) { step(STEP); acc -= STEP; }
    draw();
    let maxV = 0;
    for (const b of balls) if (b.y > 0) maxV = Math.max(maxV, Math.hypot(b.vx, b.vy));
    const settled = !drag && balls.every((b) => b.y > 0) && maxV < 45;
    calmFor = settled ? calmFor + dt : 0;
    if (calmFor > 0.7) { running = false; balls.forEach((b) => { b.vx = b.vy = 0; }); draw(); return; }
    requestAnimationFrame(frame);
  }
  function wake() {
    if (running || reduce || !visible || !spawned) return;
    running = true; calmFor = 0; last = performance.now();
    requestAnimationFrame(frame);
  }

  /* ---------------- pointer interaction ---------------- */
  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const hit = (x: number, y: number) => {
    for (let i = balls.length - 1; i >= 0; i--) {
      const b = balls[i];
      if (Math.hypot(b.x - x, b.y - y) <= b.r) return b;
    }
    return null;
  };
  let tipTimer: number | undefined;
  function showTip(b: Ball | null, linger = 0) {
    clearTimeout(tipTimer);
    hover = b;
    if (!b) { tip.hidden = true; if (!running) draw(); return; }
    tip.hidden = false;
    tip.textContent = b.detail ? `${b.name} · ${b.detail}` : b.name;
    const half = tip.offsetWidth / 2;
    tip.style.left = `${Math.min(Math.max(b.x, half + 4), W - half - 4)}px`;
    tip.style.top = `${Math.max(b.y - b.r - 6, tip.offsetHeight + 4)}px`;
    if (!running) draw();
    if (linger) tipTimer = window.setTimeout(() => showTip(null), linger);
  }

  if (!reduce) {
    canvas.addEventListener('pointermove', (e) => {
      const p = local(e);
      if (drag && drag.id === e.pointerId) { drag.tx = p.x; drag.ty = p.y; showTip(drag.ball); return; }
      if (e.pointerType === 'touch') return;
      const b = hit(p.x, p.y);
      canvas.style.cursor = b ? 'grab' : 'default';
      if (b !== hover) showTip(b);
    });
    canvas.addEventListener('pointerdown', (e) => {
      const p = local(e);
      const b = hit(p.x, p.y);
      if (!b) return;
      drag = { ball: b, tx: p.x, ty: p.y, dx: p.x - b.x, dy: p.y - b.y, id: e.pointerId };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
      showTip(b, e.pointerType === 'touch' ? 1800 : 0);
      wake();
    });
    const release = (e: PointerEvent) => {
      if (!drag || drag.id !== e.pointerId) return;
      drag = null;
      canvas.style.cursor = 'grab';
      wake();
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('pointerleave', () => { if (!drag) showTip(null); });

    if (shakeBtn) {
      shakeBtn.hidden = false;
      shakeBtn.addEventListener('click', () => {
        balls.forEach((b) => { b.vy -= 650 + Math.random() * 700; b.vx += (Math.random() - 0.5) * 700; });
        wake();
      });
    }
  } else {
    const hint = document.querySelector('.pit__hint');
    if (hint) hint.textContent = 'Hover or tap a logo to see its name.';
    // static pile: hover/tap still names a logo
    canvas.addEventListener('pointerdown', (e) => { const p = local(e); showTip(hit(p.x, p.y), 1800); });
    canvas.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') { const p = local(e); const b = hit(p.x, p.y); if (b !== hover) showTip(b); } });
  }

  /* ---------------- lifecycle ---------------- */
  readTheme();
  size();
  document.addEventListener('themechange', () => { readTheme(); draw(); });
  new ResizeObserver(() => {
    const w = stage.clientWidth;
    if (Math.abs(w - W) < 1 && Math.abs(stage.clientHeight - H) < 1) return;
    size();
    if (spawned) { reduce ? draw() : wake(); draw(); }
  }).observe(stage);

  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !spawned) spawn();
      else if (visible) wake();
      else running = false;
    },
    { threshold: 0.25 },
  ).observe(stage);
}
