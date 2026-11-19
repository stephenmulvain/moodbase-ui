import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { Card } from '../Card';
import { Checkbox } from '../Checkbox';
import { Heading } from '../Heading';
import { Switch } from '../Switch';
import { Textarea } from '../Textarea';
import { RadioGroup } from './RadioGroup';

const sleepOptions = [
  { value: 'well', label: 'Well' },
  { value: 'okay', label: 'Okay', hint: 'Woke up once or twice' },
  { value: 'poorly', label: 'Poorly' },
];

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'How did you sleep?', options: sleepOptions, onChange: fn() },
  argTypes: {
    hint: { control: 'text' },
    error: { control: 'text' },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'Think about last night.' } };

export const Horizontal: Story = { args: { orientation: 'horizontal' } };

export const WithError: Story = {
  args: { required: true, error: 'Choose how you slept, or skip this question' },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 'okay' } };

function CheckInForm() {
  const [sleep, setSleep] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const sleepError = submitted && !sleep ? 'Choose how you slept' : undefined;

  return (
    <Card as="section" aria-labelledby="checkin-title" style={{ maxWidth: 480 }}>
      <Heading level={2} size="sm" id="checkin-title">
        Evening check-in
      </Heading>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
        style={{ display: 'grid', gap: 'var(--mb-space-6)', marginTop: 'var(--mb-space-4)' }}
      >
        <RadioGroup
          label="How did you sleep?"
          options={sleepOptions}
          value={sleep}
          onChange={setSleep}
          error={sleepError}
          required
        />
        <Textarea
          label="Anything you'd like to remember?"
          hint="Only you can see this."
          maxLength={280}
          showCount
        />
        <Checkbox label="Mark today as a rest day" />
        <Switch label="Remind me tomorrow evening" defaultChecked />
        <div>
          <Button type="submit">Save check-in</Button>
        </div>
      </form>
    </Card>
  );
}

export const CheckInExample: Story = {
  name: 'Example: check-in form',
  render: () => <CheckInForm />,
  parameters: {
    docs: {
      description: {
        story:
          'Composition example using every form control. Press "Save check-in" without choosing a sleep option to see the group error.',
      },
    },
  },
};
