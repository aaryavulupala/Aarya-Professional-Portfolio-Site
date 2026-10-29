export {};
/* A handful of embers drifting upward behind the page. Fixed canvas, ~34 particles. */
const canvas = document.getElementById('embers') as HTMLCanvasElement | null;
const g = canvas?.getContext('2d');

if (canvas && g && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  type P = { x: number; y: number; r: number; vy: number; sway: number; freq: number; phase: number };
  const N = 34;
  let W = 0, H = 0, dpr = 1;
  const ps: P[] = [];
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  const spawn = (p: P, anywhere: boolean) => {
    p.x = rand(0, W);
    p.y = anywhere ? rand(0, H) : H + rand(4, 60);
    p.r = rand(0.7, 2.1);
    p.vy = rand(14, 34);
    p.sway = rand(6, 20);
    p.freq = rand(0.4, 1.1);
    p.phase = rand(0, 6.28);
  };
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
  };
  resize();
  addEventListener('resize', resize);
  for (let i = 0; i < N; i++) {
    const p = {} as P;
    spawn(p, true);
    ps.push(p);
  }

  let last = performance.now();
  const frame = (t: number) => {
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    const dark = document.documentElement.dataset.theme === 'dark';
    const rgb = dark ? '255,122,69' : '190,70,18';
    const peak = dark ? 0.75 : 0.5;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.y -= p.vy * dt;
      p.x += Math.sin(t / 1000 * p.freq + p.phase) * p.sway * dt;
      if (p.y < -10) spawn(p, false);
      // fade in near the bottom, burn out toward the top
      const a = Math.min(1, (H - p.y) / (H * 0.15)) * Math.min(1, p.y / (H * 0.45)) * peak;
      if (a <= 0) continue;
      g.fillStyle = `rgba(${rgb},${a * 0.16})`;
      g.beginPath();
      g.arc(p.x, p.y, p.r * 3.2, 0, 6.283);
      g.fill();
      g.fillStyle = `rgba(${rgb},${a})`;
      g.beginPath();
      g.arc(p.x, p.y, p.r, 0, 6.283);
      g.fill();
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
