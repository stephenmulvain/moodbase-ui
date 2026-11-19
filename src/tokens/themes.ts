/** Brand and theme names. Kept separate from the token model so the library bundle stays tiny. */
export const brands = ['calm', 'warm'] as const;
export type Brand = (typeof brands)[number];

export const themes = ['light', 'dark'] as const;
export type Theme = (typeof themes)[number];
