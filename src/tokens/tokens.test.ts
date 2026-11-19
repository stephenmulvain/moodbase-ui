import { describe, expect, it } from 'vitest';
import { contrastRatio, contrastRequirements } from './contrast';
import { brands, resolveTheme, themes, validateTokens } from './index';

describe('design tokens', () => {
  it('every brand and theme defines the same semantic tokens, all referencing primitives', () => {
    expect(validateTokens()).toEqual([]);
  });

  describe.each(brands.flatMap((brand) => themes.map((theme) => ({ brand, theme }))))(
    '$brand / $theme meets WCAG 2.1 AA',
    ({ brand, theme }) => {
      const colors = resolveTheme(brand, theme);

      it.each(contrastRequirements)(
        '$foreground on $background ≥ $minimum:1 ($use)',
        ({ foreground, background, minimum }) => {
          const fg = colors[`color.${foreground}`];
          const bg = colors[`color.${background}`];
          if (!fg || !bg) throw new Error(`Missing color.${foreground} or color.${background}`);
          expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(minimum);
        },
      );
    },
  );
});
