import {
  useId,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  FieldError,
  FieldHint,
  fieldStyles,
  hasContent,
  joinIds,
  RequiredMark,
} from '../internal/field';
import { defaultMoodLabels, moodColorVar, moodLevels, type MoodLevel } from './mood';
import { MoodIcon } from './MoodIcon';
import styles from './MoodPicker.module.css';

export interface MoodPickerProps extends Omit<
  ComponentPropsWithRef<'fieldset'>,
  'onChange' | 'defaultValue'
> {
  /** The question, rendered as the fieldset's legend. */
  label?: ReactNode;
  /** Shared `name` for the radios, used when the picker sits inside a form. */
  name?: string;
  /** Selected mood (controlled). Use `null` for "nothing chosen yet". */
  value?: MoodLevel | null;
  /** Initially selected mood (uncontrolled). */
  defaultValue?: MoodLevel;
  onChange?: (level: MoodLevel, event: ChangeEvent<HTMLInputElement>) => void;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Override any of the default labels (Struggling, Low, Okay, Good, Great). */
  labels?: Partial<Record<MoodLevel, string>>;
}

/**
 * "How are you feeling?" A radio group of five moods. Arrow keys move between moods,
 * each mood has a face and a text label, and the colours run cool to warm with no
 * alarming reds, so a hard day never looks like an error.
 */
export function MoodPicker({
  label = 'How are you feeling?',
  name,
  value,
  defaultValue,
  onChange,
  hint,
  error,
  required,
  labels,
  disabled,
  id,
  className,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: MoodPickerProps) {
  const generated = useId();
  const groupId = id ?? generated;
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
      role="radiogroup"
      aria-invalid={hasError || undefined}
      aria-required={required || undefined}
      aria-describedby={joinIds(hasHint && hintId, hasError && errorId, ariaDescribedBy)}
      className={[styles.picker, className].filter(Boolean).join(' ')}
    >
      <legend className={`${fieldStyles.label} ${styles.legend}`}>
        {label}
        {required && <RequiredMark />}
      </legend>

      {hasHint && <FieldHint id={hintId}>{hint}</FieldHint>}
      <FieldError id={errorId}>{error}</FieldError>

      <div className={styles.options}>
        {moodLevels.map((level) => (
          <label
            key={level}
            className={styles.option}
            style={{ '--_mood': moodColorVar(level) } as CSSProperties}
          >
            <input
              type="radio"
              name={name ?? groupId}
              value={level}
              required={required}
              {...(controlled
                ? { checked: value === level }
                : { defaultChecked: defaultValue === level })}
              onChange={(event) => onChange?.(level, event)}
              className={styles.input}
            />
            <span className={[styles.tile, hasError && styles.invalid].filter(Boolean).join(' ')}>
              <MoodIcon level={level} size={40} />
              <span className={styles.text}>{labels?.[level] ?? defaultMoodLabels[level]}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
