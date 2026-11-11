export type Palette = 'blue' | 'green' | 'neutral' | 'dark';

export const PALETTES: Palette[] = ['blue', 'green', 'neutral', 'dark'];

export const PALETTE_NAMES: Record<Palette, string> = {
  blue: 'Нежно-голубая',
  green: 'Зелёная',
  neutral: 'Белая',
  dark: 'Тёмная',
};

/** Характерные цвета палитры для свотча: [основной, фон]. */
export const PALETTE_SWATCH: Record<Palette, [string, string]> = {
  blue: ['hsl(216 60% 42%)', 'hsl(210 42% 93%)'],
  green: ['hsl(142 55% 22%)', 'hsl(110 37% 94%)'],
  neutral: ['hsl(215 18% 34%)', 'hsl(0 0% 97%)'],
  dark: ['hsl(216 70% 60%)', 'hsl(215 25% 10%)'],
};

export function nextPalette(current: Palette): Palette {
  return PALETTES[(PALETTES.indexOf(current) + 1) % PALETTES.length];
}
