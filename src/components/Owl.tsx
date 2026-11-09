// Sova — the little owl mascot. Hand-drawn inline SVG with thick strokes.
interface Props {
  size?: number;
  mood?: 'happy' | 'excited' | 'sad';
  className?: string;
}

export function Owl({ size = 96, mood = 'happy', className }: Props) {
  const green = 'hsl(142 55% 22%)';
  const gold = 'hsl(42 100% 59%)';
  const mint = 'hsl(110 37% 94%)';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* ear tufts */}
      <path d="M28 26 L38 10 L48 26" fill={green} stroke={green} strokeWidth="6" strokeLinejoin="round" />
      <path d="M72 26 L82 10 L92 26" fill={green} stroke={green} strokeWidth="6" strokeLinejoin="round" />
      {/* body */}
      <ellipse cx="60" cy="68" rx="42" ry="44" fill={green} />
      {/* belly */}
      <ellipse cx="60" cy="82" rx="26" ry="26" fill={mint} />
      {/* wings */}
      <path d="M22 62 Q12 78 24 92 Q30 78 30 66 Z" fill={gold} />
      <path d="M98 62 Q108 78 96 92 Q90 78 90 66 Z" fill={gold} />
      {/* eyes */}
      <circle cx="45" cy="52" r="14" fill="white" />
      <circle cx="75" cy="52" r="14" fill="white" />
      {mood === 'sad' ? (
        <>
          <circle cx="45" cy="56" r="6" fill="hsl(120 9% 11%)" />
          <circle cx="75" cy="56" r="6" fill="hsl(120 9% 11%)" />
        </>
      ) : (
        <>
          <circle cx="47" cy="50" r="6" fill="hsl(120 9% 11%)" />
          <circle cx="77" cy="50" r="6" fill="hsl(120 9% 11%)" />
          <circle cx="49" cy="48" r="2" fill="white" />
          <circle cx="79" cy="48" r="2" fill="white" />
        </>
      )}
      {/* beak */}
      <path d="M60 60 L54 68 Q60 74 66 68 Z" fill={gold} />
      {/* feet */}
      <path d="M46 110 h10 M64 110 h10" stroke={gold} strokeWidth="5" strokeLinecap="round" />
      {mood === 'excited' && (
        <>
          <path d="M14 34 l-6 -6 M106 34 l6 -6 M20 22 l-4 -8" stroke={gold} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
