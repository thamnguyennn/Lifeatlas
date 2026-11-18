import { GLYPH_PATHS } from "./glyph-paths.ts";

export const SIGN_KEYS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
] as const;

interface GlyphProps { name: string; size?: number; className?: string; title?: string }

export function Glyph({ name, size = 20, className = "", title }: GlyphProps) {
  return (
    <svg
      className={`glyph ${className}`} width={size} height={size} viewBox="0 0 100 100"
      role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false"
    >
      <path d={GLYPH_PATHS[name]} fill="currentColor" />
    </svg>
  );
}

export const SignGlyph = ({ sign, ...p }: { sign: number } & Omit<GlyphProps, "name">) => <Glyph name={SIGN_KEYS[sign]} {...p} />;
