import type { ComponentPropsWithRef, ReactNode } from 'react';
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
  const { controlId, hintId, errorId } = useFieldIds(id);
  const hasHint = hasContent(hint);
  const hasError = hasContent(error);

  return (
    <div className={[styles.field, inputStyles[size], className].filter(Boolean).join(' ')}>
      <label htmlFor={controlId} className={`${fieldStyles.label} ${styles.label}`}>
        {label}
        {required && <RequiredMark />}
      </label>

      {hasHint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <FieldError id={errorId}>{error}</FieldError>

      <input
        {...rest}
        id={controlId}
        type={type}
        required={required}
        aria-invalid={hasError || undefined}
        aria-describedby={joinIds(hasHint && hintId, hasError && errorId, ariaDescribedBy)}
        className={inputStyles.input}
      />
    </div>
  );
}
