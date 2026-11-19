import type { ComponentPropsWithRef } from 'react';
import styles from './Text.module.css';

export type TextElement = 'p' | 'span' | 'div' | 'strong' | 'em' | 'small';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg';
export type TextTone = 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'danger';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps extends ComponentPropsWithRef<'p'> {
  /** HTML element. `p` for paragraphs, `span` inline, `strong`/`em` when the emphasis has meaning. */
  as?: TextElement;
  size?: TextSize;
  /**
   * Colour role. Every tone meets WCAG AA (4.5:1) on surface and surface-raised.
   * Never rely on tone alone to convey meaning: say it in the words too.
   */
  tone?: TextTone;
  weight?: TextWeight;
}

const sizeClass: Record<TextSize, string | undefined> = {
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const toneClass: Record<TextTone, string | undefined> = {
  default: styles.toneDefault,
  muted: styles.toneMuted,
  accent: styles.toneAccent,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
};

const weightClass: Record<TextWeight, string | undefined> = {
  regular: styles.weightRegular,
  medium: styles.weightMedium,
  semibold: styles.weightSemibold,
  bold: styles.weightBold,
};

export function Text({
  as = 'p',
  size = 'md',
  tone = 'default',
  weight = 'regular',
  className,
  ...rest
}: TextProps) {
  const Tag = as as 'p';
  const classes = [styles.text, sizeClass[size], toneClass[tone], weightClass[weight], className]
    .filter(Boolean)
    .join(' ');
  return <Tag {...rest} className={classes} />;
}
