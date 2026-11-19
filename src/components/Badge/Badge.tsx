import type { ComponentPropsWithRef } from 'react';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  /** Colour role. The words carry the meaning; tone only supports them. */
  tone?: BadgeTone;
}

/** A small, non-interactive label for status or metadata, e.g. "New" or "Synced". */
export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={[styles.badge, styles[tone], className].filter(Boolean).join(' ')} />
  );
}
