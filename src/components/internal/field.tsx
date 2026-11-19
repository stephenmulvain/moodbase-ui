/**
 * Shared, internal building blocks for form fields (not exported from the library).
 * Every form control uses the same label / hint / error behaviour:
 *   - hint and error are linked to the control with aria-describedby
 *   - errors use an icon, text and a hidden "Error:" prefix, never colour alone
 *   - the error region is always rendered and polite, so new errors are announced
 */
import { useId, type ReactNode } from 'react';
import styles from './field.module.css';

/** True when a ReactNode would render something visible. */
export const hasContent = (node: ReactNode): boolean =>
  node !== undefined && node !== null && node !== false && node !== '';

export function useFieldIds(id?: string) {
  const generated = useId();
  const controlId = id ?? generated;
  return {
    controlId,
    hintId: `${controlId}-hint`,
    errorId: `${controlId}-error`,
  };
}

/** Joins describedby ids, skipping empty ones. Returns undefined when there are none. */
export const joinIds = (...ids: (string | false | undefined)[]): string | undefined =>
  ids.filter(Boolean).join(' ') || undefined;

export function FieldHint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div id={id} className={styles.hint}>
      {children}
    </div>
  );
}

const ErrorIcon = () => (
  <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-12a1 1 0 0 1 1 1v3.5a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm0 9a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 10 15Z"
    />
  </svg>
);

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <div id={id} className={styles.error} aria-live="polite">
      {hasContent(children) && (
        <>
          <ErrorIcon />
          <span>
            <span className={styles.visuallyHidden}>Error:</span> {children}
          </span>
        </>
      )}
    </div>
  );
}

export function RequiredMark() {
  // Screen readers already announce "required" from the native attribute.
  return (
    <span className={styles.required} aria-hidden="true">
      {' '}
      (required)
    </span>
  );
}

export { styles as fieldStyles };
