import type { ComponentPropsWithRef } from 'react';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface HeadingProps extends ComponentPropsWithRef<'h2'> {
  /**
   * Document outline level (h1–h6). Pick it from the page structure, never from
   * how big it should look: screen reader users navigate by heading level.
   */
  level: HeadingLevel;
  /** Visual size, independent of level. Defaults to a size that suits the level. */
  size?: HeadingSize;
}

const defaultSize: Record<HeadingLevel, HeadingSize> = {
  1: '2xl',
  2: 'xl',
  3: 'lg',
  4: 'md',
  5: 'sm',
  6: 'sm',
};

export function Heading({ level, size, className, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  const classes = [styles.heading, styles[`size${size ?? defaultSize[level]}`], className]
    .filter(Boolean)
    .join(' ');
  return <Tag {...rest} className={classes} />;
}
