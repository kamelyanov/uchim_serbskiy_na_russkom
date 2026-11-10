// Растрирует assets/icon.svg в набор PNG-иконок PWA.
// Запуск: node scripts/gen-icons.mjs (нужен sharp: npm i -D sharp)
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = readFileSync('assets/icon.svg');

// Maskable-версия: сова уменьшена до 80% и отцентрована на сплошном фоне
const maskableSvg = svg
  .toString()
  .replace('<rect width="512" height="512" rx="110" fill="#f2f7ec"/>',
    '<rect width="512" height="512" fill="#f2f7ec"/><g transform="translate(51.2 51.2) scale(0.8)">')
  .replace('</svg>', '</g></svg>');

await sharp(svg).resize(512, 512).png().toFile('public/icons/icon-512.png');
await sharp(svg).resize(192, 192).png().toFile('public/icons/icon-192.png');
await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile('public/icons/icon-512-maskable.png');

console.log('icons written');
