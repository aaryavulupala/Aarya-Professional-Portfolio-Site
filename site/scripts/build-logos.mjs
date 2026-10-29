// Generates public/logos/*.svg|png from icon packages + crops from the NBA logo.
// Run: node scripts/build-logos.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import * as si from 'simple-icons';
import * as si11 from 'si11';

const out = 'public/logos';
fs.mkdirSync(out, { recursive: true });

const dev = (n, v = 'original') => fs.readFileSync(`node_modules/devicon/icons/${n}/${n}-${v}.svg`, 'utf8');
const sized = (svg) =>
  svg.replace(/<svg([^>]*)>/, (m, a) => {
    a = a.replace(/\s(width|height)="[^"]*"/g, '');
    return `<svg${a} width="128" height="128">`;
  });
const brand = (icon) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="128" height="128"><path fill="#${icon.hex}" d="${icon.path}"/></svg>`;
const mono = (label, bg = '#16150F', fg = '#F3F0E8') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128"><rect width="128" height="128" rx="26" fill="${bg}"/><text x="64" y="76" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-weight="700" font-size="${label.length > 3 ? 30 : 40}" fill="${fg}">${label}</text></svg>`;

const files = {
  java: sized(dev('java')),
  python: sized(dev('python')),
  javascript: sized(dev('javascript')),
  typescript: sized(dev('typescript')),
  c: sized(dev('c')),
  html5: sized(dev('html5')),
  css3: sized(dev('css3')),
  react: sized(dev('react')),
  nextjs: sized(dev('nextjs')),
  nodejs: sized(dev('nodejs')),
  springboot: sized(dev('spring')),
  fastapi: sized(dev('fastapi')),
  pandas: sized(dev('pandas')),
  numpy: sized(dev('numpy')),
  scikitlearn: sized(dev('scikitlearn')),
  tensorflow: sized(dev('tensorflow')),
  aws: sized(dev('amazonwebservices')),
  postgresql: sized(dev('postgresql')),
  mysql: sized(dev('mysql')),
  firebase: sized(dev('firebase')),
  supabase: sized(dev('supabase')),
  git: sized(dev('git')),
  github: sized(dev('github')),
  postman: sized(dev('postman')),
  cursor: sized(dev('cursor')),
  claudecode: sized(dev('claudecode')),
  codex: sized(dev('codex')),
  cicd: sized(dev('githubactions')),
  slack: sized(dev('slack')),
  twilio: sized(dev('twilio')),
  vercel: sized(dev('vercel', 'original')),
  databricks: brand(si11.siDatabricks),
  stripe: brand(si.siStripe),
  clerk: brand(si.siClerk),
  resend: brand(si.siResend),
  gemini: brand(si.siGooglegemini),
  googlecalendar: brand(si.siGooglecalendar),
  appsscript: brand(si.siGoogleappsscript),
  brevo: brand(si.siBrevo),
  sql: mono('SQL'),
  rest: mono('REST'),
};
for (const [k, v] of Object.entries(files)) fs.writeFileSync(path.join(out, `${k}.svg`), v);

// XGBoost + SHAP aren't in the icon packs: crop them from the supplied NBA artwork.
const src = 'src/assets/nba-logo.png';
const crops = { xgboost: [893, 322, 195, 195], shap: [925, 690, 195, 195] };
for (const [k, [left, top, width, height]] of Object.entries(crops)) {
  const mask = Buffer.from(`<svg width="${width}" height="${height}"><circle cx="${width / 2}" cy="${height / 2}" r="${width / 2}"/></svg>`);
  await sharp(src).extract({ left, top, width, height }).composite([{ input: mask, blend: 'dest-in' }]).png().toFile(path.join(out, `${k}.png`));
}
console.log('logos:', fs.readdirSync(out).length);
