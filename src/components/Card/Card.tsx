import type { ComponentPropsWithRef } from 'react';
import styles from './Card.module.css';

export type CardElement = 'div' | 'article' | 'section' | 'li' | 'aside';
export type CardVariant = 'outlined' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends ComponentPropsWithRef<'div'> {
  /**
   * The HTML element to render, so the card means the right thing to assistive tech.
   * Use `article` for self-contained items (a mood entry), `section` for a titled region
   * of a page (give it `aria-labelledby`), `li` inside a list.
   */
  as?: CardElement;
  /** `outlined`: soft border. `elevated`: gentle shadow plus a subtle border for dark mode. */
  variant?: CardVariant;
  /** Inner spacing. Use `none` for edge-to-edge media and lay out the content yourself. */
  padding?: CardPadding;
}

const paddingClass: Record<CardPadding, string | undefined> = {
  none: styles.paddingNone,
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

/**
 * A plain surface container. Deliberately generic: Moodbase-specific cards
 * (mood entries, insights) are built as patterns on top of it.
 */
export function Card({
  as = 'div',
  variant = 'outlined',
  padding = 'md',
  className,
  ...rest
}: CardProps) {
  // Every allowed element accepts the same props as a div for our purposes.
  const Component = as as 'div';
  const classes = [styles.card, styles[variant], paddingClass[padding], className]
    .filter(Boolean)
    .join(' ');

  return <Component {...rest} className={classes} />;
}
