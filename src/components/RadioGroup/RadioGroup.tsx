import { useId, type ChangeEvent, type ComponentPropsWithRef, type ReactNode } from 'react';
import {
  FieldError,
  FieldHint,
  fieldStyles,
  hasContent,
  joinIds,
  RequiredMark,
} from '../internal/field';
import choice from '../internal/choice.module.css';
import styles from './RadioGroup.module.css';

export interface RadioOption {
  value: string;
  label: ReactNode;
  /** Extra detail for this option, read out with it. */
  hint?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<
  ComponentPropsWithRef<'fieldset'>,
  'onChange' | 'defaultValue'
> {
  /** The question, rendered as the fieldset's legend. */
  label: ReactNode;
  /** Shared `name` for the radios. Generated when omitted. */
  name?: string;
  options: RadioOption[];
  /** Selected value (controlled). */
  value?: string;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Helper text under the question, read out when entering the group. */
  hint?: ReactNode;
  /** Error message for the whole group. */
  error?: ReactNode;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue,
  onChange,
  hint,
  error,
  required,
  orientation = 'vertical',
  disabled,
  id,
  className,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: RadioGroupProps) {
  const generated = useId();
  const groupId = id ?? generated;
  const groupName = name ?? groupId;
  const hintId = `${groupId}-hint`;
  const errorId = `${groupId}-error`;
  const hasHint = hasContent(hint);
  const hasError = hasContent(error);
  const controlled = value !== undefined;

  return (
    <fieldset
      {...rest}
      id={groupId}
      disabled={disabled}
      // radiogroup (not plain group) supports aria-invalid and aria-required;
      // individual radios do not, per the ARIA spec.
      role="radiogroup"
      aria-invalid={hasError || undefined}
      aria-required={required || undefined}
      aria-describedby={joinIds(hasHint && hintId, hasError && errorId, ariaDescribedBy)}
      className={[styles.group, className].filter(Boolean).join(' ')}
    >
      <legend className={`${fieldStyles.label} ${styles.legend}`}>
        {label}
        {required && <RequiredMark />}
      </legend>

      {hasHint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <FieldError id={errorId}>{error}</FieldError>

      <div className={orientation === 'horizontal' ? styles.horizontal : styles.vertical}>
        {options.map((option, index) => {
          const optionId = `${groupId}-option-${index}`;
          const optionHintId = `${optionId}-hint`;
          const hasOptionHint = hasContent(option.hint);
          return (
            <div key={option.value} className={choice.choice}>
              <div className={choice.row}>
                <input
                  id={optionId}
                  type="radio"
                  name={groupName}
                  value={option.value}
                  required={required}
                  disabled={option.disabled}
                  {...(controlled
                    ? { checked: value === option.value }
                    : { defaultChecked: defaultValue === option.value })}
                  onChange={(event) => onChange?.(option.value, event)}
                  aria-describedby={hasOptionHint ? optionHintId : undefined}
                  className={[choice.control, choice.radio, hasError && choice.invalid]
                    .filter(Boolean)
                    .join(' ')}
                />
                <label htmlFor={optionId} className={choice.label}>
                  {option.label}
                </label>
              </div>
              {hasOptionHint && <FieldHint id={optionHintId}>{option.hint}</FieldHint>}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
