export type Palette = 'white' | 'dark' | 'green' | 'blue' | 'purple';

export const PALETTES: Palette[] = ['white', 'dark', 'green', 'blue', 'purple'];

export const PALETTE_NAMES: Record<Palette, string> = {
  white: 'Белая · лаванда',
  dark: 'Тёмная · графит',
  green: 'Зелёная · шалфей',
  blue: 'Голубая · деним',
  purple: 'Фиолетовая · сирень',
};

/** Характерные цвета палитры для свотча: [основной, фон]. */
export const PALETTE_SWATCH: Record<Palette, [string, string]> = {
  white: ['hsl(255 45% 58%)', 'hsl(255 25% 97%)'],
  dark: ['hsl(216 70% 68%)', 'hsl(222 17% 13%)'],
  green: ['hsl(150 38% 35%)', 'hsl(130 32% 95%)'],
  blue: ['hsl(210 62% 48%)', 'hsl(210 45% 95%)'],
  purple: ['hsl(265 48% 52%)', 'hsl(270 40% 96%)'],
};

export function nextPalette(current: Palette): Palette {
  return PALETTES[(PALETTES.indexOf(current) + 1) % PALETTES.length];
}
