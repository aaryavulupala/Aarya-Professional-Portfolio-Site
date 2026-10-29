export {};
/* A blocky pixel-art avatar built from CSS 3D cubes. The head follows the cursor.
   Textures are drawn from tiny character maps onto canvases, then used as crisp backgrounds. */

const U = 9; // px per texel
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

const PAL: Record<string, string> = {
  H: '#15100d', h: '#261a13', // hair
  S: '#b8794b', s: '#9c6239', N: '#a86d42', // skin, shade, nose
  W: '#f4f1ea', E: '#1b0f0a', M: '#6e3b24', // eye white, eye, mouth
  J: '#1a1a1e', L: '#2b2b32', T: '#b23a07', // suit, lapel, tie
  B: '#0b0b0d', // belt / shoes
};

function tex(rows: string[], flip = false): string {
  const w = rows[0].length;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = rows.length;
  const g = c.getContext('2d')!;
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      g.fillStyle = PAL[ch] ?? PAL.S;
      g.fillRect(flip ? w - 1 - x : x, y, 1, 1);
    }),
  );
  return c.toDataURL();
}
const rep = (row: string, n: number) => Array.from({ length: n }, () => row);

type Faces = { front: string; back: string; left: string; right: string; top: string; bottom: string };

function div(cls: string) {
  const d = document.createElement('div');
  d.className = cls;
  return d;
}

function box(w: number, h: number, d: number, t: Faces): HTMLElement {
  const el = div('mc__box');
  const face = (fw: number, fh: number, transform: string, url: string, shade: number) => {
    const f = div('mc__face');
    f.style.cssText = `width:${fw}px;height:${fh}px;margin:${-fh / 2}px 0 0 ${-fw / 2}px;transform:${transform};background-image:url(${url});filter:brightness(${shade})`;
    el.append(f);
  };
  face(w, h, `translateZ(${d / 2}px)`, t.front, 1);
  face(w, h, `rotateY(180deg) translateZ(${d / 2}px)`, t.back, 0.86);
  face(d, h, `rotateY(90deg) translateZ(${w / 2}px)`, t.right, 0.8);
  face(d, h, `rotateY(-90deg) translateZ(${w / 2}px)`, t.left, 0.8);
  face(w, d, `rotateX(90deg) translateZ(${h / 2}px)`, t.top, 1.12);
  face(w, d, `rotateX(-90deg) translateZ(${h / 2}px)`, t.bottom, 0.55);
  return el;
}

function pivot(): HTMLElement {
  return div('mc__pivot');
}

function init(mount: HTMLElement) {
  /* ---- textures ---- */
  const headFront = tex(['HHHHHHHH', 'HhHHHhHH', 'HHSHHSHH', 'HHHSSHHH', 'HWESSEWH', 'SSSNNSSS', 'SSMMMMSS', 'SSSSSSSS']);
  const headBack = tex([...rep('HHHHHHHH', 6), 'HhHHHhHH', 'HSSSSSSH']);
  const sideRows = ['HHHHHHHH', 'HHHHhHHH', 'HHHHHHHH', 'HHHHHSSS', 'HHHssSSS', 'HHHssSSS', 'HSSSSSSS', 'SSSSSSSS'];
  const headLeft = tex(sideRows); // front is on the right
  const headRight = tex(sideRows, true); // front is on the left
  const headTop = tex(['HHhHHHhH', 'HHHHHHHH', 'hHHHhHHH', 'HHHHHHHH', 'HHhHHHHh', 'HHHHHHHH', 'HhHHhHHH', 'HHHHHHHH']);
  const headBottom = tex(rep('SSSSSSSS', 8));

  const bodyFront = tex(['JJWWWWJJ', 'JLWTTWLJ', 'JLLTTLLJ', 'JJLTTLJJ', ...rep('JJJTTJJJ', 6), 'JJJJJJJJ', 'BBBBBBBB']);
  const bodyBack = tex(rep('JJJJJJJJ', 12));
  const bodySide = tex(rep('JJJJ', 12));
  const bodyTop = tex(rep('JJJJJJJJ', 4));
  const bodyBottom = tex(rep('BBBBBBBB', 4));

  const arm = tex(['LJJJ', ...rep('JJJJ', 8), 'WWWW', 'SSSS', 'SSSS']);
  const armTop = tex(rep('JJJJ', 4));
  const armBottom = tex(rep('SSSS', 4));
  const leg = tex(['LJJJ', ...rep('JJJJ', 9), 'BBBB', 'BBBB']);
  const legTop = tex(rep('JJJJ', 4));
  const legBottom = tex(rep('BBBB', 4));

  /* ---- model ---- */
  const rig = pivot();
  rig.append(
    box(8 * U, 12 * U, 4 * U, { front: bodyFront, back: bodyBack, left: bodySide, right: bodySide, top: bodyTop, bottom: bodyBottom }),
  );

  const headPivot = pivot();
  const headBox = box(8 * U, 8 * U, 8 * U, { front: headFront, back: headBack, left: headLeft, right: headRight, top: headTop, bottom: headBottom });
  headBox.style.transform = `translateY(${-4 * U}px)`;
  headPivot.append(headBox);

  const limb = (w: number, h: number, faces: Faces, x: number, y: number) => {
    const p = pivot();
    const b = box(w, h, w, faces);
    b.style.transform = `translateY(${h / 2}px)`;
    p.append(b);
    p.dataset.x = String(x);
    p.dataset.y = String(y);
    return p;
  };
  const armFaces: Faces = { front: arm, back: arm, left: arm, right: arm, top: armTop, bottom: armBottom };
  const legFaces: Faces = { front: leg, back: leg, left: leg, right: leg, top: legTop, bottom: legBottom };
  const armL = limb(4 * U, 12 * U, armFaces, -6 * U, -6 * U);
  const armR = limb(4 * U, 12 * U, armFaces, 6 * U, -6 * U);
  const legL = limb(4 * U, 12 * U, legFaces, -2 * U, 6 * U);
  const legR = limb(4 * U, 12 * U, legFaces, 2 * U, 6 * U);
  const place = (p: HTMLElement, rx: number) => {
    p.style.transform = `translate(${p.dataset.x}px, ${p.dataset.y}px) rotateX(${rx}deg)`;
  };

  rig.append(headPivot, armL, armR, legL, legR);
  mount.append(rig);

  /* ---- behaviour ---- */
  let tYaw = 0, tPitch = 0, yaw = 0, pitch = 0;
  let lastMove = -1e9;
  let waveUntil = 0;
  let visible = true;
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  addEventListener(
    'pointermove',
    (e) => {
      const r = mount.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.3);
      tYaw = clamp((Math.atan2(dx, 420) * 180) / Math.PI, -65, 65);
      tPitch = clamp((-Math.atan2(dy, 420) * 180) / Math.PI, -35, 38);
      lastMove = performance.now();
    },
    { passive: true },
  );
  mount.addEventListener('click', () => {
    waveUntil = performance.now() + 1500;
    if (REDUCE) place(armR, 150);
  });
  new IntersectionObserver((en) => (visible = en[0].isIntersecting)).observe(mount);

  function draw(t: number) {
    const idle = t - lastMove > 3200;
    if (idle && !REDUCE) {
      tYaw = Math.sin(t / 1700) * 24;
      tPitch = Math.sin(t / 2300) * 7;
    }
    const k = REDUCE ? 1 : 0.12;
    yaw += (tYaw - yaw) * k;
    pitch += (tPitch - pitch) * k;
    headPivot.style.transform = `translateY(${-6 * U}px) rotateX(${pitch}deg) rotateY(${yaw}deg)`;
    rig.style.transform = `translateY(${-2 * U}px) rotateX(-5deg) rotateY(${-8 + yaw * 0.24}deg)`;
    const sway = REDUCE ? 0 : Math.sin(t / 520) * 3;
    place(armL, -sway);
    place(legL, sway * 0.8);
    place(legR, -sway * 0.8);
    place(armR, t < waveUntil ? 150 + Math.sin(t / 85) * 14 : sway);
  }

  draw(0);
  if (REDUCE) {
    addEventListener('pointermove', () => draw(performance.now()), { passive: true });
    return;
  }
  const loop = (t: number) => {
    if (visible && !document.hidden) draw(t);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

const mountEl = document.getElementById('mc');
if (mountEl) init(mountEl);
