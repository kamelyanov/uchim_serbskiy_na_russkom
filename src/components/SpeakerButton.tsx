import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { hasVoice, noteUserGesture, speak, subscribeTts } from '../lib/tts';
import { cn } from '../lib/utils';

interface SpeakerButtonProps {
  /** Serbian text in Latin script. */
  text: string;
  size?: 'sm' | 'md';
  className?: string;
  /** Slower playback, e.g. for single vocabulary words. */
  rate?: number;
}

export function SpeakerButton({ text, size = 'md', className, rate }: SpeakerButtonProps) {
  const [voiceReady, setVoiceReady] = useState(hasVoice());
  const [playing, setPlaying] = useState(false);

  useEffect(() => subscribeTts(() => setVoiceReady(hasVoice())), []);

  if (!voiceReady) return null;

  return (
    <button
      type="button"
      aria-label="Прослушать"
      onClick={(e) => {
        e.stopPropagation();
        noteUserGesture();
        setPlaying(true);
        const ok = speak(text, { rate, onEnd: () => setPlaying(false) });
        if (!ok) setPlaying(false);
      }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
        size === 'sm' ? 'h-7 w-7' : 'h-9 w-9',
        playing && 'text-primary animate-pulse',
        className
      )}
    >
      <Volume2 className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
    </button>
  );
}
