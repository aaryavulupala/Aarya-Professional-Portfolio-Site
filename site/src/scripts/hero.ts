export {};
/* Live status panel: local clock + latest public commit (GitHub REST API). */
const clock = document.getElementById('clock');
if (clock) {
  const tz = clock.dataset.tz!;
  const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz, timeZoneName: 'short' });
  const tick = () => (clock.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 15_000);
}

const el = document.getElementById('commit');
const body = el?.querySelector<HTMLElement>('.commit__body');
const USER = 'aaryavulupala';
const CACHE = 'latest-commit-v2';

type Commit = { repo: string; message: string; at: string; url: string };

function ago(iso: string) {
  const s = Math.max(1, (Date.now() - new Date(iso).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (s < 3600) return rtf.format(-Math.round(s / 60), 'minute');
  if (s < 86400) return rtf.format(-Math.round(s / 3600), 'hour');
  if (s < 86400 * 60) return rtf.format(-Math.round(s / 86400), 'day');
  return rtf.format(-Math.round(s / 86400 / 30), 'month');
}

function show(state: 'ready' | 'error' | 'empty', c?: Commit) {
  if (!el || !body) return;
  el.dataset.state = state;
  body.hidden = false;
  body.replaceChildren();
  if (state === 'ready' && c) {
    const a = document.createElement('a');
    a.className = 'link commit__msg';
    a.href = c.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = c.message;
    const meta = document.createElement('span');
    meta.className = 'commit__meta';
    meta.textContent = `${c.repo} · ${ago(c.at)}`;
    body.append(a, meta);
  } else {
    const p = document.createElement('span');
    p.textContent = state === 'empty' ? 'No recent public commits. Most of my work is in private repos.' : "Couldn't reach GitHub right now. ";
    body.append(p);
    if (state === 'error') {
      const a = document.createElement('a');
      a.className = 'link';
      a.href = `https://github.com/${USER}`;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'See my profile';
      body.append(a);
    }
  }
}

async function load() {
  try {
    const cached = sessionStorage.getItem(CACHE);
    if (cached) {
      const { t, c } = JSON.parse(cached);
      if (Date.now() - t < 10 * 60_000) return show(c ? 'ready' : 'empty', c);
    }
  } catch {
    /* no sessionStorage */
  }
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 6000);
    const gh = async (path: string) => {
      const res = await fetch(`https://api.github.com${path}`, { signal: ctl.signal, headers: { Accept: 'application/vnd.github+json' } });
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    };
    // The public events feed can be empty; the most recently pushed repo is more reliable.
    const repos: any[] = await gh(`/users/${USER}/repos?sort=pushed&per_page=5`);
    let commit: Commit | null = null;
    for (const r of repos.filter((r) => !r.fork)) {
      const list: any[] = await gh(`/repos/${USER}/${r.name}/commits?per_page=1`);
      if (list[0]) {
        commit = {
          repo: r.name,
          message: String(list[0].commit.message).split('\n')[0].slice(0, 90),
          at: list[0].commit.author.date,
          url: list[0].html_url,
        };
        break;
      }
    }
    clearTimeout(timer);
    try {
      sessionStorage.setItem(CACHE, JSON.stringify({ t: Date.now(), c: commit }));
    } catch {
      /* ignore */
    }
    show(commit ? 'ready' : 'empty', commit ?? undefined);
  } catch {
    show('error');
  }
}
load();
