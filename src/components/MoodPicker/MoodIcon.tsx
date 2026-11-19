import type { ComponentPropsWithRef } from 'react';
import { moodColorVar, type MoodLevel } from './mood';

export interface MoodIconProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'> {
  level: MoodLevel;
  /** Width and height in px. */
  size?: number;
  /**
   * Accessible name, e.g. "Mood: Good". Leave empty when a visible label sits next
   * to the icon; the icon is then hidden from assistive tech.
   */
  title?: string;
}

/** Mouth shapes from a gentle frown (1) to a broad smile (5). Kept soft on purpose. */
const mouths: Record<MoodLevel, string> = {
  1: 'M6.75 14.25 Q10 11.75 13.25 14.25',
  2: 'M7 13.75 Q10 12.75 13 13.75',
  3: 'M7 13.25 L13 13.25',
  4: 'M7 12.75 Q10 15 13 12.75',
  5: 'M6.5 12.25 Q10 16.75 13.5 12.25',
};

export function MoodIcon({ level, size = 32, title, style, ...rest }: MoodIconProps) {
  const labelled = title !== undefined && title !== '';
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? title : undefined}
      style={{ color: moodColorVar(level), flexShrink: 0, ...style }}
      data-mood={level}
      {...rest}
    >
      <circle cx="10" cy="10" r="8.25" fill="currentColor" fillOpacity={0.16} />
      <circle cx="7.5" cy="8.25" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="8.25" r="0.9" fill="currentColor" stroke="none" />
      <path d={mouths[level]} />
    </svg>
  );
}
