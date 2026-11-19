/** The Moodbase mood scale: 1 (lowest) to 5 (highest). */
export const moodLevels = [1, 2, 3, 4, 5] as const;
export type MoodLevel = (typeof moodLevels)[number];

/**
 * Supportive default labels. "Struggling" rather than "Terrible": the words should
 * acknowledge a hard day without judging it.
 */
export const defaultMoodLabels: Record<MoodLevel, string> = {
  1: 'Struggling',
  2: 'Low',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

/** CSS custom property holding the colour for a mood level, e.g. `var(--mb-color-mood-1)`. */
export const moodColorVar = (level: MoodLevel): string => `var(--mb-color-mood-${level})`;
