import type { ComponentPropsWithRef, ReactNode } from 'react';
import styles from './Alert.module.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  tone?: AlertTone;
  /** Short summary in bold. Optional: a single sentence alert can use children only. */
  title?: ReactNode;
  /**
   * Announce to screen readers when the alert appears. Use for alerts added in response
   * to something the person did (e.g. "Entry saved"). Danger interrupts (role="alert");
   * other tones wait politely (role="status"). Leave off for alerts present on page load.
   */
  announce?: boolean;
  /** Shows a close button. Leave out for alerts that must stay visible. */
  onDismiss?: () => void;
  /** Accessible name for the close button. */
  dismissLabel?: string;
}

/** Spoken before the message, because icon and colour alone don't reach everyone. */
const toneLabel: Record<AlertTone, string> = {
  info: 'Information:',
  success: 'Success:',
  warning: 'Warning:',
  danger: 'Error:',
};

const icons: Record<AlertTone, ReactNode> = {
  info: (
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm1-11.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM9 9a1 1 0 0 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2v-3a1 1 0 0 0-1-1H9Z" />
  ),
  success: (
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.58 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
  ),
  warning: (
    <path d="M8.26 3.1a2 2 0 0 1 3.48 0l6.02 10.7A2 2 0 0 1 16.02 17H3.98a2 2 0 0 1-1.74-3.2L8.26 3.1ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 10 15Z" />
  ),
  danger: (
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-12a1 1 0 0 1 1 1v3.5a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm0 9a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 10 15Z" />
  ),
};

export function Alert({
  tone = 'info',
  title,
  announce = false,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  children,
  ...rest
}: AlertProps) {
  const role = announce ? (tone === 'danger' ? 'alert' : 'status') : undefined;
  const prefix = <span className={styles.visuallyHidden}>{toneLabel[tone]} </span>;

  return (
    <div
      role={role}
      {...rest}
      data-tone={tone}
      className={[styles.alert, styles[tone], className].filter(Boolean).join(' ')}
    >
      {/* evenodd: the inner shapes (i, check, !) are cut out of the filled outline. */}
      <svg
        className={styles.icon}
        viewBox="0 0 20 20"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        aria-hidden="true"
      >
        {icons[tone]}
      </svg>

      <div className={styles.content}>
        {title !== undefined && title !== null && title !== false ? (
          <>
            <p className={styles.title}>
              {prefix}
              {title}
            </p>
            {children && <div className={styles.body}>{children}</div>}
          </>
        ) : (
          <div className={styles.body}>
            {prefix}
            {children}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
