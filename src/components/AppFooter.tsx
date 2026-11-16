import { TtsSettingsPanel } from './TtsSettings';

/** Ссылки на установку сербских голосов (открываются в новом окне). */
export function VoiceInstallLinks() {
  const links = [
    { href: 'ms-settings:speech', label: 'Голоса Windows' },
    {
      href: 'https://play.google.com/store/apps/details?id=com.google.android.tts',
      label: 'Google TTS (Android)',
    },
    {
      href: 'https://microsoftedge.microsoft.com/addons/search/Serbian%20voice',
      label: 'Голоса для Edge',
    },
  ];
  return (
    <div className="mt-6 border-t-2 border-border pt-4">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
        Нет сербского голоса?
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[hsl(var(--primary))] underline-offset-2 hover:underline"
          >
            {l.label} ↗
          </a>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        В Chrome на компьютере голоса скачиваются автоматически.
      </p>
    </div>
  );
}

/** Общий футер для всех страниц: настройки озвучки + установка голосов. */
export function AppFooter() {
  return (
    <footer className="mx-auto mt-10 w-full max-w-3xl border-t-2 border-border px-4 pb-8 pt-6 text-center">
      <TtsSettingsPanel />
      <VoiceInstallLinks />
    </footer>
  );
}
