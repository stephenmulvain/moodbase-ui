import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import styles from './TextField.module.css';

export type TextFieldSize = 'sm' | 'md' | 'lg';

export interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  /** Visible label. Always required: placeholders are not labels. */
  label: ReactNode;
  /** Helper text shown under the label and read out with the field. */
  hint?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message is read out. */
  error?: ReactNode;
  size?: TextFieldSize;
}

const ErrorIcon = () => (
  <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-12a1 1 0 0 1 1 1v3.5a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm0 9a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 10 15Z"
    />
  </svg>
);

export function TextField({
  label,
  hint,
  error,
  size = 'md',
  id,
  className,
  required,
  type = 'text',
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const hasHint = hint !== undefined && hint !== null && hint !== false && hint !== '';
  const hasError = error !== undefined && error !== null && error !== false && error !== '';

  const describedBy =
    [hasHint && hintId, hasError && errorId, ariaDescribedBy].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className={[styles.field, styles[size], className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && (
          // Screen readers already announce "required" from the attribute.
          <span className={styles.required} aria-hidden="true">
            {' '}
            (required)
          </span>
        )}
      </label>

      {hasHint && (
        <div id={hintId} className={styles.hint}>
          {hint}
        </div>
      )}

      {/* Always rendered so screen readers notice when an error appears. */}
      <div id={errorId} className={styles.error} aria-live="polite">
        {hasError && (
          <>
            <ErrorIcon />
            <span>
              <span className={styles.visuallyHidden}>Error:</span> {error}
            </span>
          </>
        )}
      </div>

      <input
        {...rest}
        id={inputId}
        type={type}
        required={required}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={styles.input}
      />
    </div>
  );
}
