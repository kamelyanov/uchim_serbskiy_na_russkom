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
  white: ['hsl(255 30% 60%)', 'hsl(40 15% 98%)'],
  dark: ['hsl(216 60% 70%)', 'hsl(222 17% 13%)'],
  green: ['hsl(150 20% 40%)', 'hsl(120 15% 97%)'],
  blue: ['hsl(210 45% 52%)', 'hsl(210 30% 97%)'],
  purple: ['hsl(265 30% 55%)', 'hsl(270 20% 98%)'],
};

export function nextPalette(current: Palette): Palette {
  return PALETTES[(PALETTES.indexOf(current) + 1) % PALETTES.length];
}
