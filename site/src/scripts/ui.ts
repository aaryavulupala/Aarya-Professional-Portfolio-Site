/** Small shared helpers for the interactive bits. Everything degrades without JS. */

let toastTimer: number | undefined;
export function toast(message: string) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-on'), 2600);
}

export async function copyText(text: string, okMessage: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast(okMessage);
  } catch {
    // Clipboard blocked (insecure context, permissions): fall back to a selectable prompt.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    toast(ok ? okMessage : `Couldn't copy. Select it manually: ${text}`);
  }
}

export function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* storage unavailable: theme still applies for this visit */
  }
  document.dispatchEvent(new CustomEvent('themechange'));
}

/** Wire any [data-copy] button. */
export function bindCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => copyText(btn.dataset.copy!, `Copied ${btn.dataset.copy}`));
  });
}
