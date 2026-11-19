import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('is a native checkbox named by its label', () => {
    render(<Checkbox label="Include sleep in today's entry" />);
    expect(
      screen.getByRole('checkbox', { name: "Include sleep in today's entry" }),
    ).not.toBeChecked();
  });

  it('toggles by clicking the label and with the Space key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Remember me" onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Remember me' });

    await user.click(screen.getByText('Remember me'));
    expect(checkbox).toBeChecked();

    await user.keyboard(' ');
    expect(checkbox).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('reads out hint and error, and is marked invalid on error', () => {
    render(
      <Checkbox
        label="I understand entries are private"
        hint="You can change this later."
        error="Tick the box to continue"
      />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'I understand entries are private' });
    expect(checkbox).toBeInvalid();
    expect(checkbox).toHaveAccessibleDescription(
      'You can change this later. Error: Tick the box to continue',
    );
  });

  it('cannot be toggled when disabled', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Locked" disabled />);
    const checkbox = screen.getByRole('checkbox', { name: 'Locked' });
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toBeDisabled();
  });

  it('works inside forms with name and value', () => {
    render(
      <form aria-label="prefs">
        <Checkbox label="Weekly summary" name="summary" value="weekly" defaultChecked />
      </form>,
    );
    const data = new FormData(screen.getByRole<HTMLFormElement>('form', { name: 'prefs' }));
    expect(data.get('summary')).toBe('weekly');
  });
});
