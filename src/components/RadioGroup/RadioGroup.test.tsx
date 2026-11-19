import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup, type RadioOption } from './RadioGroup';

const sleep: RadioOption[] = [
  { value: 'well', label: 'Well' },
  { value: 'okay', label: 'Okay', hint: 'Woke up once or twice' },
  { value: 'poorly', label: 'Poorly' },
];

describe('RadioGroup', () => {
  it('is a radio group named by its question, containing one radio per option', () => {
    render(<RadioGroup label="How did you sleep?" options={sleep} />);
    const group = screen.getByRole('radiogroup', { name: 'How did you sleep?' });
    expect(group.tagName).toBe('FIELDSET');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('reads out the group hint and error on the group', () => {
    render(
      <RadioGroup
        label="How did you sleep?"
        hint="Think about last night."
        error="Choose an option"
        options={sleep}
      />,
    );
    expect(
      screen.getByRole('radiogroup', { name: 'How did you sleep?' }),
    ).toHaveAccessibleDescription('Think about last night. Error: Choose an option');
    expect(screen.getByRole('radiogroup', { name: 'How did you sleep?' })).toBeInvalid();
  });

  it('reads out per-option hints with that option', () => {
    render(<RadioGroup label="How did you sleep?" options={sleep} />);
    expect(screen.getByRole('radio', { name: 'Okay' })).toHaveAccessibleDescription(
      'Woke up once or twice',
    );
  });

  it('selects with click and moves selection with arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioGroup label="How did you sleep?" options={sleep} onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'Well' }));
    expect(screen.getByRole('radio', { name: 'Well' })).toBeChecked();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Okay' })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('okay', expect.anything());
  });

  it('supports defaultValue (uncontrolled) and value (controlled)', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('poorly');
      return (
        <RadioGroup
          label="Controlled"
          options={sleep}
          value={value}
          onChange={(next) => {
            setValue(next);
          }}
        />
      );
    }
    const { unmount } = render(
      <RadioGroup label="Uncontrolled" options={sleep} defaultValue="okay" />,
    );
    expect(screen.getByRole('radio', { name: 'Okay' })).toBeChecked();
    unmount();

    render(<Controlled />);
    expect(screen.getByRole('radio', { name: 'Poorly' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'Well' }));
    expect(screen.getByRole('radio', { name: 'Well' })).toBeChecked();
  });

  it('shares one name so the browser treats them as one group', () => {
    render(<RadioGroup label="How did you sleep?" name="sleep" options={sleep} />);
    for (const radio of screen.getAllByRole('radio'))
      expect(radio).toHaveAttribute('name', 'sleep');
  });

  it('disables every option when the group is disabled', () => {
    render(<RadioGroup label="How did you sleep?" options={sleep} disabled />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });
});
