import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('is announced as a switch named by its label', () => {
    render(<Switch label="Daily reminder" />);
    expect(screen.getByRole('switch', { name: 'Daily reminder' })).not.toBeChecked();
  });

  it('turns on and off with click and Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Daily reminder" onChange={onChange} />);
    const toggle = screen.getByRole('switch', { name: 'Daily reminder' });

    await user.click(toggle);
    expect(toggle).toBeChecked();
    await user.keyboard(' ');
    expect(toggle).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('reads out its hint', () => {
    render(<Switch label="Daily reminder" hint="We'll nudge you at 8pm." />);
    expect(screen.getByRole('switch', { name: 'Daily reminder' })).toHaveAccessibleDescription(
      "We'll nudge you at 8pm.",
    );
  });

  it('supports controlled use', () => {
    render(<Switch label="Dark mode" checked onChange={() => undefined} />);
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
  });
});
