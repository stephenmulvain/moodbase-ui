/**
 * WCAG 2.1 contrast helpers and the colour pairings the system promises to keep accessible.
 * Used by the token tests (to fail CI on regressions) and the Foundations docs page.
 */

function hexToRgb(hex: string): [number, number, number] {
  const match = /^#?([\da-f]{6})$/i.exec(hex.trim());
  if (!match?.[1]) throw new Error(`Expected a 6-digit hex colour, got "${hex}".`);
  const int = Number.parseInt(match[1], 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/** WCAG 2.1 relative luminance. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.1 contrast ratio between two hex colours, from 1 to 21. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/**
 * Mirrors CSS `color-mix(in srgb, <color> <amount>, <base>)`: a straight blend of the
 * gamma-encoded sRGB channels. Lets tests check contrast on tinted backgrounds.
 */
export function mixHex(color: string, base: string, amount: number): string {
  const a = hexToRgb(color);
  const b = hexToRgb(base);
  const channel = (i: 0 | 1 | 2) => Math.round(a[i] * amount + b[i] * (1 - amount));
  return `#${[channel(0), channel(1), channel(2)]
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

/**
 * How much tone colour tints a feedback background. Must match the percentages in
 * Alert.module.css, Badge.module.css and MoodPicker.module.css (selected tile);
 * the tinted contrast tests depend on them.
 */
export const TINT = { alert: 0.1, badge: 0.14, mood: 0.12 } as const;

export interface ContrastRequirement {
  /** Semantic colour name without the `color.` prefix. */
  foreground: string;
  background: string;
  /** 4.5 = AA body text, 3 = AA non-text UI (borders, focus rings, icons). */
  minimum: 4.5 | 3;
  use: string;
}

const TEXT = 4.5;
const NON_TEXT = 3;

const onSurfaces = (foreground: string, minimum: 4.5 | 3, use: string): ContrastRequirement[] =>
  ['surface', 'surface-raised'].map((background) => ({ foreground, background, minimum, use }));

export const contrastRequirements: ContrastRequirement[] = [
  ...onSurfaces('text', TEXT, 'Body text'),
  ...onSurfaces('text-muted', TEXT, 'Secondary text'),
  ...onSurfaces('accent', TEXT, 'Links and accent text'),
  ...onSurfaces('success', TEXT, 'Success text and icons'),
  ...onSurfaces('warning', TEXT, 'Warning text and icons'),
  ...onSurfaces('danger', TEXT, 'Error text and icons'),
  ...onSurfaces('border-strong', NON_TEXT, 'Input and control outlines'),
  ...onSurfaces('focus-ring', NON_TEXT, 'Keyboard focus ring'),
  { foreground: 'on-accent', background: 'accent', minimum: TEXT, use: 'Text on accent buttons' },
  { foreground: 'on-accent', background: 'danger', minimum: TEXT, use: 'Text on danger buttons' },
  ...([1, 2, 3, 4, 5] as const).flatMap((level) =>
    onSurfaces(`mood-${level}`, NON_TEXT, `Mood ${level} icon and indicator`),
  ),
];
