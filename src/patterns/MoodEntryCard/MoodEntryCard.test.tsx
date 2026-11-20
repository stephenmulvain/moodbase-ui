import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MoodEntryCard, type MoodEntryCardProps } from './MoodEntryCard';

const base: MoodEntryCardProps = {
  date: new Date(2026, 10, 16), // Monday 16 November 2026
  mood: 4,
  locale: 'en-GB',
};

describe('MoodEntryCard', () => {
  it('is an article named by its mood and date', () => {
    render(<MoodEntryCard {...base} />);
    expect(
      screen.getByRole('article', { name: /Good\s+Monday,? 16 November/ }),
    ).toBeInTheDocument();
  });

  it('uses a level 3 heading by default and accepts another level', () => {
    const { rerender } = render(<MoodEntryCard {...base} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Good' })).toBeInTheDocument();
    rerender(<MoodEntryCard {...base} headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Good' })).toBeInTheDocument();
  });

  it('marks up the date as a machine-readable <time>', () => {
    render(<MoodEntryCard {...base} />);
    expect(screen.getByText(/16 November/).closest('time')).toHaveAttribute(
      'datetime',
      '2026-11-16',
    );
  });

  it('accepts custom mood labels', () => {
    render(<MoodEntryCard {...base} mood={1} moodLabels={{ 1: 'Rough' }} />);
    expect(screen.getByRole('heading', { name: 'Rough' })).toBeInTheDocument();
  });

  it('lists tags as a labelled list', () => {
    render(<MoodEntryCard {...base} tags={['Sleep', 'Work']} />);
    const list = screen.getByRole('list', { name: 'Tags' });
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Sleep', 'Work']);
  });

  it('shows no note, tags or actions when none are given', () => {
    render(<MoodEntryCard {...base} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('names Edit with its date so it is clear in a list of entries', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<MoodEntryCard {...base} onEdit={onEdit} />);
    await user.click(screen.getByRole('button', { name: /Edit entry for Monday,? 16 November/ }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  describe('delete confirmation', () => {
    const setup = () => {
      const onDelete = vi.fn();
      render(<MoodEntryCard {...base} onDelete={onDelete} />);
      return { user: userEvent.setup(), onDelete };
    };
    const deleteButton = () => screen.getByRole('button', { name: /^Delete entry for/ });

    it('asks before deleting and moves focus to "Keep entry"', async () => {
      const { user, onDelete } = setup();
      await user.click(deleteButton());

      expect(onDelete).not.toHaveBeenCalled();
      expect(
        screen.getByRole('group', { name: "Delete this entry? This can't be undone." }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Keep entry' })).toHaveFocus();
    });

    it('keeps the entry and returns focus to Delete when cancelled', async () => {
      const { user, onDelete } = setup();
      await user.click(deleteButton());
      await user.click(screen.getByRole('button', { name: 'Keep entry' }));

      expect(onDelete).not.toHaveBeenCalled();
      expect(screen.queryByRole('group')).not.toBeInTheDocument();
      expect(deleteButton()).toHaveFocus();
    });

    it('cancels with Escape', async () => {
      const { user } = setup();
      await user.click(deleteButton());
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('group')).not.toBeInTheDocument();
      expect(deleteButton()).toHaveFocus();
    });

    it('deletes only after confirming', async () => {
      const { user, onDelete } = setup();
      await user.click(deleteButton());
      await user.click(
        within(screen.getByRole('group')).getByRole('button', { name: /^Delete entry for/ }),
      );
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('never deletes from an accidental Enter after opening the confirmation', async () => {
      const { user, onDelete } = setup();
      await user.click(deleteButton());
      await user.keyboard('{Enter}'); // lands on "Keep entry"
      expect(onDelete).not.toHaveBeenCalled();
    });
  });

  describe('note', () => {
    // jsdom has no layout, so simulate a clamped note that does or doesn't overflow.
    let overflow = false;
    beforeEach(() => {
      vi.stubGlobal(
        'ResizeObserver',
        class {
          private callback: () => void;
          constructor(callback: () => void) {
            this.callback = callback;
          }
          observe() {
            this.callback();
          }
          disconnect() {
            /* no-op */
          }
        },
      );
      vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(() =>
        overflow ? 200 : 72,
      );
      vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(() => 72);
    });
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it('shows the note without "Read more" when it fits', () => {
      overflow = false;
      render(<MoodEntryCard {...base} note="A calm day." />);
      expect(screen.getByText('A calm day.')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Read more' })).not.toBeInTheDocument();
    });

    it('offers "Read more" when the note overflows, and toggles it', async () => {
      overflow = true;
      const user = userEvent.setup();
      render(<MoodEntryCard {...base} note="A very long note…" />);

      const toggle = screen.getByRole('button', { name: 'Read more' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).toHaveAttribute('aria-controls', screen.getByText('A very long note…').id);

      await user.click(toggle);
      expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });
  });
});
