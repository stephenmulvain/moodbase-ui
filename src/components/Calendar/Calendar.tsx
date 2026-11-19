import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
} from 'react';
import { defaultMoodLabels, type MoodLevel } from '../MoodPicker/mood';
import { MoodIcon } from '../MoodPicker/MoodIcon';
import {
  addDays,
  addMonths,
  clampDate,
  endOfWeek,
  getMonthWeeks,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toDateKey,
  type WeekStart,
} from './dates';
import styles from './Calendar.module.css';

export interface CalendarProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'onChange' | 'defaultValue'
> {
  /** Selected day (controlled). Use `null` for none. */
  value?: Date | null;
  /** Initially selected day (uncontrolled). */
  defaultValue?: Date;
  /** Called when a day is chosen with click, Enter or Space. */
  onChange?: (date: Date) => void;
  /** Visible month (controlled). Any date in the month works. */
  month?: Date;
  /** Initially visible month (uncontrolled). Defaults to the selected day, then today. */
  defaultMonth?: Date;
  /** Called with the first day of the newly visible month. */
  onMonthChange?: (month: Date) => void;
  /** Moods to show, keyed by 'YYYY-MM-DD'. */
  moods?: Partial<Record<string, MoodLevel>>;
  /** Override mood names used in each day's accessible label. */
  moodLabels?: Partial<Record<MoodLevel, string>>;
  /** Earliest selectable day. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Mark extra days as unavailable. They stay focusable so keyboard users can pass through. */
  isDateDisabled?: (date: Date) => boolean;
  /** 1 = Monday (default), 0 = Sunday. */
  weekStartsOn?: WeekStart;
  /** BCP 47 locale for month and weekday names, e.g. 'en-GB'. Defaults to the browser's. */
  locale?: string;
  /** Override "today", mainly for tests and stories. */
  today?: Date;
}

/**
 * A month calendar following the WAI-ARIA date picker grid pattern:
 * arrows move by day/week, Home/End to week edges, Page Up/Down by month
 * (Shift for year), Enter/Space to select. Only one day is in the Tab order.
 */
export function Calendar({
  value,
  defaultValue,
  onChange,
  month,
  defaultMonth,
  onMonthChange,
  moods,
  moodLabels,
  min,
  max,
  isDateDisabled,
  weekStartsOn = 1,
  locale,
  today: todayProp,
  className,
  ...rest
}: CalendarProps) {
  const headingId = useId();
  const gridRef = useRef<HTMLTableElement>(null);
  const shouldFocus = useRef(false);

  const today = startOfDay(todayProp ?? new Date());
  const [internalValue, setInternalValue] = useState<Date | null>(
    defaultValue ? startOfDay(defaultValue) : null,
  );
  const selected = value !== undefined ? value && startOfDay(value) : internalValue;

  const [internalMonth, setInternalMonth] = useState(() =>
    startOfMonth(defaultMonth ?? value ?? defaultValue ?? todayProp ?? new Date()),
  );
  const visibleMonth = month ? startOfMonth(month) : internalMonth;
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  // The one day in the Tab order: last focused, else selected, else today, else the 1st.
  const focusTarget =
    [focusedDate, selected, today].find(
      (date): date is Date => date !== null && isSameMonth(date, visibleMonth),
    ) ?? visibleMonth;
  const focusKey = toDateKey(focusTarget);

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusKey}"]`)?.focus();
  }, [focusKey]);

  const formats = useMemo(
    () => ({
      monthYear: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      fullDate: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      weekdayShort: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
    }),
    [locale],
  );

  const monthTime = visibleMonth.getTime();
  const weeks = useMemo(
    () => getMonthWeeks(new Date(monthTime), weekStartsOn),
    [monthTime, weekStartsOn],
  );
  const weekdays = useMemo(() => {
    const start = startOfWeek(new Date(2026, 0, 7), weekStartsOn);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [weekStartsOn]);

  const minDay = min ? startOfDay(min) : undefined;
  const maxDay = max ? startOfDay(max) : undefined;
  const isUnavailable = (date: Date): boolean =>
    (minDay !== undefined && date < minDay) ||
    (maxDay !== undefined && date > maxDay) ||
    isDateDisabled?.(date) === true;

  const canGoBack = !minDay || startOfMonth(minDay) < visibleMonth;
  const canGoForward = !maxDay || startOfMonth(maxDay) > visibleMonth;

  const changeMonth = (date: Date) => {
    const next = startOfMonth(date);
    if (!month) setInternalMonth(next);
    onMonthChange?.(next);
  };

  const moveFocus = (date: Date) => {
    const target = clampDate(date, minDay, maxDay);
    shouldFocus.current = true;
    setFocusedDate(target);
    if (!isSameMonth(target, visibleMonth)) changeMonth(target);
  };

  const select = (date: Date) => {
    setFocusedDate(date);
    if (isUnavailable(date)) return;
    if (value === undefined) setInternalValue(date);
    onChange?.(date);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const keyMoves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusTarget, -1),
      ArrowRight: () => addDays(focusTarget, 1),
      ArrowUp: () => addDays(focusTarget, -7),
      ArrowDown: () => addDays(focusTarget, 7),
      Home: () => startOfWeek(focusTarget, weekStartsOn),
      End: () => endOfWeek(focusTarget, weekStartsOn),
      PageUp: () => addMonths(focusTarget, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focusTarget, event.shiftKey ? 12 : 1),
    };
    const move = keyMoves[event.key];
    if (!move) return;
    event.preventDefault();
    moveFocus(move());
  };

  const labelFor = (date: Date): string => {
    const mood = moods?.[toDateKey(date)];
    const moodText = mood ? `, mood: ${moodLabels?.[mood] ?? defaultMoodLabels[mood]}` : '';
    const unavailable = isUnavailable(date) ? ', unavailable' : '';
    return `${formats.fullDate.format(date)}${moodText}${unavailable}`;
  };

  return (
    <div {...rest} className={[styles.calendar, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.nav}
          aria-label="Previous month"
          aria-disabled={!canGoBack || undefined}
          onClick={() => {
            if (canGoBack) changeMonth(addMonths(visibleMonth, -1));
          }}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M12.5 4.5 7 10l5.5 5.5" />
          </svg>
        </button>
        {/* Polite live region: the new month is announced after Page Up/Down or the buttons. */}
        <div id={headingId} className={styles.title} aria-live="polite">
          {formats.monthYear.format(visibleMonth)}
        </div>
        <button
          type="button"
          className={styles.nav}
          aria-label="Next month"
          aria-disabled={!canGoForward || undefined}
          onClick={() => {
            if (canGoForward) changeMonth(addMonths(visibleMonth, 1));
          }}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M7.5 4.5 13 10l-5.5 5.5" />
          </svg>
        </button>
      </div>

      <table
        ref={gridRef}
        role="grid"
        aria-labelledby={headingId}
        className={styles.grid}
        onKeyDown={handleKeyDown}
      >
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th key={day.getDay()} scope="col" className={styles.weekday}>
                <span aria-hidden="true">{formats.weekdayShort.format(day)}</span>
                <span className={styles.visuallyHidden}>{formats.weekdayLong.format(day)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toDateKey(week.find((d): d is Date => d !== null) ?? visibleMonth)}>
              {week.map((date, index) => {
                if (!date) return <td key={`empty-${String(index)}`} />;
                const key = toDateKey(date);
                const isSelected = selected !== null && isSameDay(date, selected);
                const isToday = isSameDay(date, today);
                const unavailable = isUnavailable(date);
                const mood = moods?.[key];
                return (
                  <td key={key} role="gridcell" aria-selected={isSelected}>
                    <button
                      type="button"
                      data-date={key}
                      tabIndex={key === focusKey ? 0 : -1}
                      aria-label={labelFor(date)}
                      aria-current={isToday ? 'date' : undefined}
                      aria-disabled={unavailable || undefined}
                      className={[
                        styles.day,
                        isToday && styles.today,
                        isSelected && styles.selected,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => {
                        select(date);
                      }}
                    >
                      <span className={styles.number}>{date.getDate()}</span>
                      {mood && <MoodIcon level={mood} size={16} />}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
