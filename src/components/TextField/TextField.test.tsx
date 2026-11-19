import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
  it('is labelled by its visible label', () => {
    render(<TextField label="Name for this entry" />);
    expect(screen.getByRole('textbox', { name: 'Name for this entry' })).toBeInTheDocument();
  });

  it('describes itself with its hint', () => {
    render(<TextField label="Note" hint="A few words is enough." />);
    expect(screen.getByRole('textbox', { name: 'Note' })).toHaveAccessibleDescription(
      'A few words is enough.',
    );
  });

  it('is not marked invalid and has no description without hint or error', () => {
    render(<TextField label="Note" />);
    const input = screen.getByRole('textbox', { name: 'Note' });
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('marks itself invalid and reads out the error after the hint', () => {
    render(
      <TextField label="Email" hint="We only use this to sign you in." error="Enter an email" />,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription(
      'We only use this to sign you in. Error: Enter an email',
    );
    expect(screen.getByText('Enter an email')).toBeVisible();
  });

  it('uses the native required attribute without repeating "required" in the name', () => {
    render(<TextField label="Email" required />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeRequired();
    expect(screen.getByText('(required)')).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps any aria-describedby passed in', () => {
    render(
      <>
        <p id="extra">Saved automatically.</p>
        <TextField label="Note" hint="Optional." aria-describedby="extra" />
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Note' })).toHaveAccessibleDescription(
      'Optional. Saved automatically.',
    );
  });

  it('accepts typing and reports changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Note" onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: 'Note' });
    await user.type(input, 'calm');
    expect(input).toHaveValue('calm');
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it('works as a controlled input and clears the error once fixed', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <TextField
          label="Note"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          error={value ? undefined : 'Write a note'}
        />
      );
    }
    render(<Controlled />);

    const input = screen.getByRole('textbox', { name: 'Note' });
    expect(input).toBeInvalid();
    await user.type(input, 'ok');
    expect(input).toBeValid();
    expect(screen.queryByText('Write a note')).not.toBeInTheDocument();
  });

  it('cannot be edited when disabled', async () => {
    const user = userEvent.setup();
    render(<TextField label="Note" disabled />);

    const input = screen.getByRole('textbox', { name: 'Note' });
    expect(input).toBeDisabled();
    await user.type(input, 'nope');
    expect(input).toHaveValue('');
  });

  it('respects a custom id, forwards ref and passes through input props', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField ref={ref} id="email" label="Email" type="email" autoComplete="email" />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('gives each field a unique id when none is passed', () => {
    render(
      <>
        <TextField label="First" />
        <TextField label="Second" />
      </>,
    );
    const first = screen.getByRole('textbox', { name: 'First' });
    const second = screen.getByRole('textbox', { name: 'Second' });
    expect(first.id).not.toBe(second.id);
  });
});
