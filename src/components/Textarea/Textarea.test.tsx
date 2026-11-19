import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('is a multi-line textbox labelled by its visible label', () => {
    render(<Textarea label="How was your day?" />);
    const textarea = screen.getByRole('textbox', { name: 'How was your day?' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('reads out hint and error, and is marked invalid on error', () => {
    render(<Textarea label="Note" hint="Only you can see this." error="Write at least a word" />);
    const textarea = screen.getByRole('textbox', { name: 'Note' });
    expect(textarea).toBeInvalid();
    expect(textarea).toHaveAccessibleDescription(
      'Only you can see this. Error: Write at least a word',
    );
  });

  it('shows and describes a character count that updates as you type', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Note" maxLength={280} showCount />);
    const textarea = screen.getByRole('textbox', { name: 'Note' });

    expect(textarea).toHaveAccessibleDescription('0 of 280 characters');
    await user.type(textarea, 'calm');
    expect(screen.getByText('4 of 280 characters')).toBeInTheDocument();
    expect(textarea).toHaveAttribute('maxlength', '280');
  });

  it('counts from defaultValue when uncontrolled', () => {
    render(<Textarea label="Note" maxLength={10} showCount defaultValue="hello" />);
    expect(screen.getByText('5 of 10 characters')).toBeInTheDocument();
  });

  it('counts from value when controlled and still calls onChange', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('ab');
      return (
        <Textarea
          label="Note"
          maxLength={10}
          showCount
          value={value}
          onChange={(event) => {
            spy();
            setValue(event.target.value);
          }}
        />
      );
    }
    render(<Controlled />);
    expect(screen.getByText('2 of 10 characters')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Note' }), 'c');
    expect(screen.getByText('3 of 10 characters')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not show a count without maxLength', () => {
    render(<Textarea label="Note" showCount />);
    expect(screen.queryByText(/characters/)).not.toBeInTheDocument();
  });
});
