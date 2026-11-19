import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { MoodLevel } from './mood';
import { MoodIcon } from './MoodIcon';
import { MoodPicker } from './MoodPicker';

describe('MoodPicker', () => {
  it('is a radio group asking how you feel, with five named moods in order', () => {
    render(<MoodPicker />);
    expect(screen.getByRole('radiogroup', { name: 'How are you feeling?' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio').map((radio) => radio.getAttribute('value'))).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
    for (const name of ['Struggling', 'Low', 'Okay', 'Good', 'Great']) {
      expect(screen.getByRole('radio', { name })).toBeInTheDocument();
    }
  });

  it('selects a mood by clicking its tile and reports the level', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MoodPicker onChange={onChange} />);

    await user.click(screen.getByText('Good'));
    expect(screen.getByRole('radio', { name: 'Good' })).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(4, expect.anything());
  });

  it('moves between moods with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<MoodPicker defaultValue={3} />);

    await user.tab();
    expect(screen.getByRole('radio', { name: 'Okay' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Good' })).toBeChecked();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Low' })).toBeChecked();
  });

  it('supports controlled use, including nothing selected', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [mood, setMood] = useState<MoodLevel | null>(null);
      return (
        <MoodPicker
          value={mood}
          onChange={(level) => {
            setMood(level);
          }}
        />
      );
    }
    render(<Controlled />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).not.toBeChecked();
    await user.click(screen.getByText('Struggling'));
    expect(screen.getByRole('radio', { name: 'Struggling' })).toBeChecked();
  });

  it('reads out hint and error on the group and marks it invalid', () => {
    render(
      <MoodPicker hint="There are no wrong answers." error="Choose how you're feeling" required />,
    );
    const group = screen.getByRole('radiogroup', { name: 'How are you feeling?' });
    expect(group).toBeInvalid();
    expect(group).toHaveAttribute('aria-required', 'true');
    expect(group).toHaveAccessibleDescription(
      "There are no wrong answers. Error: Choose how you're feeling",
    );
  });

  it('accepts custom labels and a custom question', () => {
    render(<MoodPicker label="How was your morning?" labels={{ 1: 'Rough', 5: 'Wonderful' }} />);
    expect(screen.getByRole('radiogroup', { name: 'How was your morning?' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Rough' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Okay' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Wonderful' })).toBeInTheDocument();
  });

  it('submits the chosen level with the form', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="check-in">
        <MoodPicker name="mood" />
      </form>,
    );
    await user.click(screen.getByText('Low'));
    const data = new FormData(screen.getByRole<HTMLFormElement>('form', { name: 'check-in' }));
    expect(data.get('mood')).toBe('2');
  });

  it('disables every mood when disabled', () => {
    render(<MoodPicker disabled />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });
});

describe('MoodIcon', () => {
  it('is hidden from assistive tech by default (decorative next to a label)', () => {
    const { container } = render(<MoodIcon level={2} />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('becomes a named image when given a title', () => {
    render(<MoodIcon level={5} title="Mood: Great" />);
    expect(screen.getByRole('img', { name: 'Mood: Great' })).toHaveAttribute('data-mood', '5');
  });
});
