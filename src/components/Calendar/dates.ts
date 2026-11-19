/**
 * Small, dependency-free date helpers for the Calendar. All work in local time and
 * return new Date objects; nothing mutates its input.
 */

export type WeekStart = 0 | 1; // 0 = Sunday, 1 = Monday

/** 'YYYY-MM-DD' in local time. Used as the key for moods and for data-date. */
export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export const daysInMonth = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

export const addDays = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

/** Adds months, keeping the day but clamping to the target month's length (31 Jan + 1 → 28/29 Feb). */
export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const day = Math.min(date.getDate(), daysInMonth(target));
  return new Date(target.getFullYear(), target.getMonth(), day);
}

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** Column (0–6) of a date in a week that starts on `weekStartsOn`. */
export const weekdayIndex = (date: Date, weekStartsOn: WeekStart): number =>
  (date.getDay() - weekStartsOn + 7) % 7;

export const startOfWeek = (date: Date, weekStartsOn: WeekStart): Date =>
  addDays(date, -weekdayIndex(date, weekStartsOn));

export const endOfWeek = (date: Date, weekStartsOn: WeekStart): Date =>
  addDays(startOfWeek(date, weekStartsOn), 6);

/** Restricts a date to [min, max] when either bound is given. */
export function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && date < startOfDay(min)) return startOfDay(min);
  if (max && date > startOfDay(max)) return startOfDay(max);
  return date;
}

/**
 * The month as rows of 7 cells. Days from neighbouring months are `null`
 * so the grid only ever shows (and announces) days of the visible month.
 */
export function getMonthWeeks(month: Date, weekStartsOn: WeekStart): (Date | null)[][] {
  const first = startOfMonth(month);
  const cells: (Date | null)[] = Array.from(
    { length: weekdayIndex(first, weekStartsOn) },
    () => null,
  );
  for (let day = 1; day <= daysInMonth(first); day += 1) {
    cells.push(new Date(first.getFullYear(), first.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
