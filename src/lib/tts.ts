// Text-to-speech for Serbian via the Web Speech API.
// Always feed it Serbian Latin (our source of truth) regardless of UI script:
// sr-RS / hr-HR voices are trained on Latin text.

export interface TtsSettings {
  voiceURI: string | null;
  rate: number;
  /** Master switch; when false, speaker buttons are hidden and nothing plays. */
  enabled: boolean;
}

const SETTINGS_KEY = 'ucimo-srpski-tts';
const DEFAULT_RATE = 0.9;

let voices: SpeechSynthesisVoice[] = [];
let selectedVoice: SpeechSynthesisVoice | null = null;
let settings: TtsSettings = loadSettings();
let listeners: (() => void)[] = [];

function loadSettings(): TtsSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<TtsSettings>;
      return {
        voiceURI: typeof parsed.voiceURI === 'string' ? parsed.voiceURI : null,
        rate: typeof parsed.rate === 'number' && parsed.rate > 0 ? parsed.rate : DEFAULT_RATE,
        enabled: parsed.enabled !== false,
      };
    }
  } catch {
    // corrupted settings — fall through to defaults
  }
  return { voiceURI: null, rate: DEFAULT_RATE, enabled: true };
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getTtsSettings(): TtsSettings {
  return settings;
}

export function setTtsSettings(patch: Partial<TtsSettings>) {
  settings = { ...settings, ...patch };
  saveSettings();
  pickVoice();
  notify();
}

function notify() {
  listeners.forEach((fn) => fn());
}

/** Subscribe to TTS availability/voice changes. Returns unsubscribe. */
export function subscribeTts(fn: () => void): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

// Preference order: Serbian first, then close South-Slavic fallbacks
// (Croatian voices read Serbian Latin correctly; both are ijekavian).
const LANG_PRIORITY = ['sr-rs', 'sr', 'hr-hr', 'hr', 'bs'];

function pickVoice() {
  if (settings.voiceURI) {
    const v = voices.find((voice) => voice.voiceURI === settings.voiceURI);
    if (v) {
      selectedVoice = v;
      return;
    }
  }
  for (const lang of LANG_PRIORITY) {
    const v = voices.find((voice) => voice.lang.toLowerCase().startsWith(lang));
    if (v) {
      selectedVoice = v;
      return;
    }
  }
  selectedVoice = null;
}

function refreshVoices() {
  if (!supported()) return;
  const loaded = window.speechSynthesis.getVoices();
  if (loaded.length > 0) {
    voices = loaded;
    pickVoice();
    notify();
  }
}

export function supported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** True when a suitable voice was found and TTS is enabled. */
export function hasVoice(): boolean {
  return settings.enabled && selectedVoice !== null;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  return voices.filter((v) =>
    LANG_PRIORITY.some((lang) => v.lang.toLowerCase().startsWith(lang))
  );
}

/** Call once on app start. Safe to call multiple times. */
export function initTts() {
  if (!supported()) return;
  refreshVoices();
  if (voices.length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
    // Some builds of Chrome populate voices late without firing the event.
    let attempts = 0;
    const timer = setInterval(() => {
      refreshVoices();
      if (voices.length > 0 || ++attempts >= 10) clearInterval(timer);
    }, 500);
  }
}

/** Remove emoji and other symbols that voices read aloud awkwardly. */
function normalize(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\uFE0F/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface SpeakOptions {
  /** Override rate for this utterance (e.g. slower for single words). */
  rate?: number;
  /** Called when the utterance finishes or is cancelled. */
  onEnd?: () => void;
}

export function speak(text: string, options: SpeakOptions = {}): boolean {
  if (!supported() || !settings.enabled || !selectedVoice) return false;
  const clean = normalize(text);
  if (!clean) return false;

  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.voice = selectedVoice;
  utterance.lang = selectedVoice.lang;
  utterance.rate = options.rate ?? settings.rate;
  if (options.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = options.onEnd;
  }
  synth.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (supported()) window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return supported() && window.speechSynthesis.speaking;
}
