import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  getAvailableVoices,
  getTtsSettings,
  hasVoice,
  speak,
  subscribeTts,
  supported,
  setTtsSettings,
  type TtsSettings,
} from '../lib/tts';
import { cn } from '@/lib/utils';

/** TTS settings block: enable/disable, auto-speak, voice and speed. */
export function TtsSettingsPanel() {
  const [settings, setSettings] = useState<TtsSettings>(getTtsSettings());
  const [voiceOk, setVoiceOk] = useState(hasVoice());

  useEffect(
    () =>
      subscribeTts(() => {
        setSettings(getTtsSettings());
        setVoiceOk(hasVoice());
      }),
    []
  );

  if (!supported()) return null;

  const voices = getAvailableVoices();
  const patch = (p: Partial<TtsSettings>) => setTtsSettings(p);

  return (
    <div className="mt-6 border-t-2 border-border pt-4">
      <p className="mb-3 flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
        {settings.enabled ? (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        ) : (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        )}
        Озвучка
      </p>

      <div className="flex flex-col items-center gap-2.5">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => patch({ enabled: e.target.checked })}
            className="h-4 w-4 accent-[hsl(var(--primary))]"
          />
          Включена
        </label>

        {settings.enabled && (
          <>
            {!voiceOk && (
              <p className="max-w-xs text-center text-xs font-semibold text-muted-foreground">
                В этом браузере нет сербского голоса. Лучше всего озвучка работает в Chrome и Edge.
              </p>
            )}
            {voices.length > 0 && (
              <select
                value={settings.voiceURI ?? ''}
                onChange={(e) => patch({ voiceURI: e.target.value || null })}
                className="max-w-full rounded-xl border-2 border-border bg-card px-3 py-1.5 text-sm font-semibold"
              >
                <option value="">Голос: автоматически</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            )}

            <label className="flex items-center gap-2 text-sm font-bold">
              Скорость
              <input
                type="range"
                min={0.6}
                max={1.2}
                step={0.1}
                value={settings.rate}
                onChange={(e) => patch({ rate: Number(e.target.value) })}
                className={cn('w-32 accent-[hsl(var(--primary))]')}
              />
              <button
                type="button"
                onClick={() => speak('Dobro došli! Kako ste?')}
                className="rounded-lg border-2 border-border px-2 py-0.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-secondary"
              >
                Тест
              </button>
            </label>
          </>
        )}
      </div>
    </div>
  );
}
