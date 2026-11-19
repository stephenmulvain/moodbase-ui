import { useState, type ChangeEvent, type ComponentPropsWithRef, type ReactNode } from 'react';
import {
  FieldError,
  FieldHint,
  fieldStyles,
  hasContent,
  joinIds,
  RequiredMark,
  useFieldIds,
} from '../internal/field';
import inputStyles from '../internal/textInput.module.css';
import styles from './Textarea.module.css';

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  /** Visible label. Always required: placeholders are not labels. */
  label: ReactNode;
  /** Helper text shown under the label and read out with the field. */
  hint?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message is read out. */
  error?: ReactNode;
  /**
   * Shows "12 of 280 characters" under the field. Requires `maxLength`.
   * Read out with the field on focus, not on every keystroke.
   */
  showCount?: boolean;
}

const lengthOf = (value: TextareaProps['value']): number =>
  typeof value === 'string' ? value.length : 0;

export function Textarea({
  label,
  hint,
  error,
  showCount = false,
  id,
  className,
  required,
  rows = 4,
  maxLength,
  value,
  defaultValue,
  onChange,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextareaProps) {
  const { controlId, hintId, errorId } = useFieldIds(id);
  const countId = `${controlId}-count`;
  const hasHint = hasContent(hint);
  const hasError = hasContent(error);
  const counting = showCount && maxLength !== undefined;

  // Track length ourselves for uncontrolled use; controlled use reads `value`.
  const [uncontrolledLength, setUncontrolledLength] = useState(() => lengthOf(defaultValue));
  const length = value !== undefined ? lengthOf(value) : uncontrolledLength;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setUncontrolledLength(event.target.value.length);
    onChange?.(event);
  };

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={controlId} className={`${fieldStyles.label} ${styles.label}`}>
        {label}
        {required && <RequiredMark />}
      </label>

      {hasHint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <FieldError id={errorId}>{error}</FieldError>

      <textarea
        {...rest}
        id={controlId}
        rows={rows}
        required={required}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        aria-invalid={hasError || undefined}
        aria-describedby={joinIds(
          hasHint && hintId,
          hasError && errorId,
          counting && countId,
          ariaDescribedBy,
        )}
        className={`${inputStyles.input} ${styles.textarea}`}
      />

      {counting && (
        <div id={countId} className={`${fieldStyles.hint} ${styles.count}`}>
          {length} of {maxLength} characters
        </div>
      )}
    </div>
  );
}
