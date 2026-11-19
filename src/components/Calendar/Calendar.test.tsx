import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Calendar, type CalendarProps } from './Calendar';
import { addMonths, getMonthWeeks, toDateKey } from './dates';

// Fixed "today" and locale so tests don't depend on when or where they run.
const TODAY = new Date(2026, 10, 19); // Thursday 19 November 2026

const renderCalendar = (props: Partial<CalendarProps> = {}) =>
  render(<Calendar today={TODAY} locale="en-GB" {...props} />);

// `(^|\D)` stops "1 December" also matching "11", "21" or "31 December".
const day = (pattern: string) =>
  screen.getByRole('button', { name: new RegExp(`(^|\\D)${pattern}`) });
const cellOf = (button: HTMLElement) => button.closest('td');

describe('Calendar', () => {
  it('is a grid labelled by the visible month, with full weekday column headers', () => {
    renderCalendar();
    const grid = screen.getByRole('grid', { name: 'November 2026' });
    const headers = within(grid).getAllByRole('columnheader');
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveTextContent('Monday');
    expect(headers[6]).toHaveTextContent('Sunday');
  });

  it('can start weeks on Sunday', () => {
    renderCalendar({ weekStartsOn: 0 });
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Sunday');
  });

  it('shows only days of the visible month, each with a full spoken date', () => {
    renderCalendar();
    const grid = screen.getByRole('grid');
    expect(within(grid).getAllByRole('button')).toHaveLength(30);
    expect(day('Thursday,? 19 November 2026')).toHaveTextContent('19');
  });

  it('marks today with aria-current and puts only one day in the Tab order', () => {
    renderCalendar();
    const today = day('19 November 2026');
    expect(today).toHaveAttribute('aria-current', 'date');
    const tabbable = screen
      .getAllByRole('button')
      .filter((button) => button.getAttribute('tabindex') === '0' && button.dataset.date);
    expect(tabbable).toEqual([today]);
  });

  it('selects a day on click and marks its cell selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderCalendar({ onChange });

    await user.click(day('12 November 2026'));
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 12));
    expect(cellOf(day('12 November 2026'))).toHaveAttribute('aria-selected', 'true');
    expect(cellOf(day('13 November 2026'))).toHaveAttribute('aria-selected', 'false');
  });

  it('moves focus with arrows, Home and End, and selects with Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderCalendar({ onChange });

    // Tab order: previous month, next month, then the grid's one tabbable day (today).
    await user.tab();
    await user.tab();
    await user.tab();
    expect(day('19 November 2026')).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(day('20 November 2026')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(day('27 November 2026')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(day('Monday,? 23 November 2026')).toHaveFocus();
    await user.keyboard('{End}');
    expect(day('Sunday,? 29 November 2026')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(day('22 November 2026')).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 22));
  });

  it('crosses into the next month with the arrow keys', async () => {
    const user = userEvent.setup();
    renderCalendar({ defaultValue: new Date(2026, 10, 30) });

    await user.click(day('30 November 2026'));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
    expect(day('1 December 2026')).toHaveFocus();
  });

  it('changes month with Page Up/Down and year with Shift', async () => {
    const user = userEvent.setup();
    renderCalendar();
    await user.click(day('19 November 2026'));

    await user.keyboard('{PageDown}');
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
    expect(day('19 December 2026')).toHaveFocus();

    await user.keyboard('{Shift>}{PageUp}{/Shift}');
    expect(screen.getByRole('grid', { name: 'December 2025' })).toBeInTheDocument();
    expect(day('19 December 2025')).toHaveFocus();
  });

  it('changes month with the previous and next buttons and reports it', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    renderCalendar({ onMonthChange });

    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
    expect(onMonthChange).toHaveBeenLastCalledWith(new Date(2026, 11, 1));

    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument();
  });

  it('respects min and max: days outside are unavailable and focus stays inside', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderCalendar({ onChange, min: new Date(2026, 10, 10), max: new Date(2026, 10, 25) });

    const early = day('5 November 2026');
    expect(early).toHaveAttribute('aria-disabled', 'true');
    expect(early).toHaveAccessibleName(/unavailable/);
    await user.click(early);
    expect(onChange).not.toHaveBeenCalled();

    expect(screen.getByRole('button', { name: 'Previous month' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    await user.click(day('25 November 2026'));
    await user.keyboard('{ArrowRight}{ArrowDown}');
    expect(day('25 November 2026')).toHaveFocus();
  });

  it('includes the mood in a day’s accessible name and shows its icon', () => {
    renderCalendar({ moods: { '2026-11-18': 4, '2026-11-17': 1 } });
    expect(day('18 November 2026, mood: Good')).toBeInTheDocument();
    expect(day('17 November 2026, mood: Struggling')).toBeInTheDocument();
    expect(day('18 November 2026').querySelector('svg[data-mood="4"]')).toBeInTheDocument();
  });

  it('supports controlled value and month', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onMonthChange = vi.fn();
    renderCalendar({
      value: new Date(2026, 1, 14),
      month: new Date(2026, 1, 1),
      onChange,
      onMonthChange,
    });
    expect(screen.getByRole('grid', { name: 'February 2026' })).toBeInTheDocument();
    expect(cellOf(day('14 February 2026'))).toHaveAttribute('aria-selected', 'true');

    // Controlled: clicking reports the change but the parent decides what is shown.
    await user.click(day('20 February 2026'));
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 1, 20));
    expect(cellOf(day('14 February 2026'))).toHaveAttribute('aria-selected', 'true');

    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 2, 1));
    expect(screen.getByRole('grid', { name: 'February 2026' })).toBeInTheDocument();
  });
});

describe('date helpers', () => {
  it('formats local date keys', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('clamps the day when adding months (31 Jan → 28 Feb)', () => {
    expect(addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28));
  });

  it('builds whole weeks with blanks around the month', () => {
    const weeks = getMonthWeeks(new Date(2026, 10, 1), 1); // 1 Nov 2026 is a Sunday
    expect(weeks[0]?.slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(weeks[0]?.[6]).toEqual(new Date(2026, 10, 1));
    expect(weeks.every((week) => week.length === 7)).toBe(true);
  });
});
