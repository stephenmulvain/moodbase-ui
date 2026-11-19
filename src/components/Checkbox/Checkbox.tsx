import type { ComponentPropsWithRef, ReactNode } from 'react';
import { FieldError, FieldHint, hasContent, joinIds, useFieldIds } from '../internal/field';
import choice from '../internal/choice.module.css';

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  /** Visible label, placed after the box. Clicking it toggles the checkbox. */
  label: ReactNode;
  /** Helper text under the label, read out with the checkbox. */
  hint?: ReactNode;
  /** Error message. When set, the checkbox is marked invalid and the message is read out. */
  error?: ReactNode;
}

export function Checkbox({
  label,
  hint,
  error,
  id,
  className,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: CheckboxProps) {
  const { controlId, hintId, errorId } = useFieldIds(id);
  const hasHint = hasContent(hint);
  const hasError = hasContent(error);

  return (
    <div className={[choice.choice, className].filter(Boolean).join(' ')}>
      <div className={choice.row}>
        <input
          {...rest}
          id={controlId}
          type="checkbox"
          aria-invalid={hasError || undefined}
          aria-describedby={joinIds(hasHint && hintId, hasError && errorId, ariaDescribedBy)}
          className={`${choice.control} ${choice.checkbox}`}
        />
        <label htmlFor={controlId} className={choice.label}>
          {label}
        </label>
      </div>
      {hasHint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
