import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual emphasis. Use one `primary` per view; `danger` only for destructive actions. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Shows a spinner and ignores clicks, but stays focusable and keeps its label
   * so screen reader users don't lose their place.
   */
  loading?: boolean;
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
  /** Decorative icon before the label. Hidden from assistive tech. */
  startIcon?: ReactNode;
  /** Decorative icon after the label. Hidden from assistive tech. */
  endIcon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  type = 'button',
  className,
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      // Also stops a type="submit" button from submitting its form twice.
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={loading || rest['aria-disabled']}
      onClick={handleClick}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={styles.content}>
        {startIcon && (
          <span className={styles.icon} aria-hidden="true">
            {startIcon}
          </span>
        )}
        {children}
        {endIcon && (
          <span className={styles.icon} aria-hidden="true">
            {endIcon}
          </span>
        )}
      </span>
    </button>
  );
}
