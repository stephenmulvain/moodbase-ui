import type { ComponentPropsWithRef, ReactNode } from 'react';
import { FieldError, FieldHint, hasContent, joinIds, useFieldIds } from '../internal/field';
import choice from '../internal/choice.module.css';

export interface SwitchProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'role'> {
  /** Visible label. Describe the setting, not the action ("Daily reminder", not "Turn on"). */
  label: ReactNode;
  /** Helper text under the label, read out with the switch. */
  hint?: ReactNode;
  /** Error message, e.g. when a setting could not be saved. */
  error?: ReactNode;
}

/**
 * An on/off setting that takes effect immediately. A native checkbox with
 * role="switch", so screen readers announce it as "switch, on/off".
 * Use Checkbox instead when the choice is only applied after submitting a form.
 */
export function Switch({
  label,
  hint,
  error,
  id,
  className,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: SwitchProps) {
  const { controlId, hintId, errorId } = useFieldIds(id);
  const hasHint = hasContent(hint);
  const hasError = hasContent(error);

  return (
    <div className={[choice.choice, choice.switchChoice, className].filter(Boolean).join(' ')}>
      <div className={choice.row}>
        <input
          {...rest}
          id={controlId}
          type="checkbox"
          role="switch"
          aria-invalid={hasError || undefined}
          aria-describedby={joinIds(hasHint && hintId, hasError && errorId, ariaDescribedBy)}
          className={`${choice.control} ${choice.switch}`}
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
