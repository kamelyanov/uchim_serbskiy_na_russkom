import { TtsSettingsPanel } from './TtsSettings';

/** Общий футер для всех страниц: настройки озвучки. */
export function AppFooter() {
  return (
    <footer className="mx-auto mt-10 w-full max-w-3xl border-t-2 border-border px-4 pb-8 pt-6 text-center">
      <TtsSettingsPanel />
    </footer>
  );
}
