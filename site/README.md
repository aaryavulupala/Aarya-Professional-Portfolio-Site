# aaryavulupala.com

Personal portfolio. Astro + TypeScript + hand-written CSS (no UI framework, no Tailwind).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # type-checks (astro check) then builds to dist/
npm run preview
```

## Where things live

| Path | What |
|---|---|
| `src/data/content.ts` | **All copy and data**: projects, experience, leadership, education, skills, links. Edit here. |
| `src/styles/global.css` | Design tokens (colour, type scale, spacing), buttons, chips, motion rules |
| `src/components/` | One component per section, plus `DogLoader`, `Palette` (⌘K), `Header` |
| `src/scripts/` | `hero.ts` (clock + GitHub commit), `ballpit.ts` (canvas physics), `minecraft.ts` (3D pixel avatar), `desktop.ts` (draggable windows), `motion.ts` (slower wheel + sweep reveal), `embers.ts` (background embers), `chrome.ts` (nav, menu, palette, image fallbacks) |
| `public/logos/` | Tech logos. Regenerate with `node scripts/build-logos.mjs` |
| `public/og.png` | Social preview. Source: `scripts/og.html` |

## Deploy (Vercel)

Import the repo, framework preset **Astro**, no env vars needed. Then add the domain `aaryavulupala.com`.

## Notes

- The status panel calls GitHub's public REST API from the browser (unauthenticated, 60 req/hr/IP) and caches for 10 minutes in `sessionStorage`. Failure and empty states are handled.
- Motion honours `prefers-reduced-motion`: the ball pit renders as a settled static pile and the dog loader only wags its tail.
- Without JavaScript the skills render as a plain grouped list.
