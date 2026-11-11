// Растрирует assets/icon.svg в набор PNG-иконок PWA.
// Запуск: node scripts/gen-icons.mjs (нужен sharp: npm i -D sharp)
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = readFileSync('assets/icon.svg').toString();

// Maskable-версия: логотип уменьшен до 80% и отцентрован на сплошном фоне
const inner = svg
  .replace(/<\?xml[^>]*\?>/, '')
  .replace(/<svg[^>]*>/, '')
  .replace('</svg>', '');
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">` +
  `<rect width="1024" height="1024" fill="#013A5E"/>` +
  `<g transform="translate(102.4 102.4) scale(0.8)">${inner}</g></svg>`;

await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/icons/icon-512.png');
await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/icons/icon-192.png');
await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile('public/icons/icon-512-maskable.png');

console.log('icons written');
