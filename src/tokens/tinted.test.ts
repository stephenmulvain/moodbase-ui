/**
 * Contrast on tinted backgrounds (Alert, Badge). These colours are computed in CSS with
 * color-mix(), so they aren't tokens; this test recomputes them with mixHex() and checks
 * them for every brand and theme.
 */
import { describe, expect, it } from 'vitest';
import { contrastRatio, mixHex, TINT } from './contrast';
import { brands, resolveTheme, themes } from './index';

const alertTones = ['accent', 'success', 'warning', 'danger'] as const;
const badgeTones = ['text-muted', 'accent', 'success', 'warning', 'danger'] as const;

describe.each(brands.flatMap((brand) => themes.map((theme) => ({ brand, theme }))))(
  '$brand / $theme tinted feedback colours',
  ({ brand, theme }) => {
    const colors = resolveTheme(brand, theme);
    const get = (name: string): string => {
      const value = colors[`color.${name}`];
      if (!value) throw new Error(`Missing color.${name}`);
      return value;
    };
    const raised = get('surface-raised');

    it.each(alertTones)('Alert (%s): text ≥ 4.5:1 and icon ≥ 3:1 on its tint', (tone) => {
      const background = mixHex(get(tone), raised, TINT.alert);
      expect(contrastRatio(get('text'), background)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(get(tone), background)).toBeGreaterThanOrEqual(3);
    });

    it.each(badgeTones)('Badge (%s): text ≥ 4.5:1 on its tint', (tone) => {
      const background = mixHex(get(tone), raised, TINT.badge);
      expect(contrastRatio(get(tone), background)).toBeGreaterThanOrEqual(4.5);
    });
  },
);
