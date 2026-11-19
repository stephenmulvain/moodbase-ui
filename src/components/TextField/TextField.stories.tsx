import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Name this entry', onChange: fn(), onBlur: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    hint: { control: 'text' },
    error: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'A few words is enough, like "Sunday walk".' },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    defaultValue: 'stephen@',
    hint: 'We only use this to sign you in.',
    error: 'Enter an email address in the correct format, like name@example.com',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Errors say what to do next, use an icon and text (never color alone) and are announced to screen readers with an "Error:" prefix.',
      },
    },
  },
};

export const Required: Story = {
  args: { label: 'Email', type: 'email', required: true, autoComplete: 'email' },
};

export const WithPlaceholder: Story = {
  args: { label: 'Search entries', type: 'search', placeholder: 'e.g. tired, sunny, work' },
  parameters: {
    docs: {
      description: {
        story: 'Placeholders are for examples only. The label always stays visible.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Morning check-in' },
};

export const ReadOnly: Story = {
  args: { label: 'Entry date', readOnly: true, defaultValue: '19 November 2026' },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--mb-space-6)' }}>
      <TextField {...args} size="sm" label="Small" />
      <TextField {...args} size="md" label="Medium" />
      <TextField {...args} size="lg" label="Large" />
    </div>
  ),
};

function ValidationDemo() {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const error = touched && value.trim() === '' ? 'Give this entry a name' : undefined;

  return (
    <TextField
      label="Name this entry"
      hint="Leave the field empty and press Tab to see the error."
      required
      value={value}
      error={error}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      onBlur={() => {
        setTouched(true);
      }}
    />
  );
}

export const ValidationPattern: Story = {
  render: () => <ValidationDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Recommended pattern: validate when the person leaves the field, not while they type, and clear the error as soon as it is fixed.',
      },
    },
  },
};
