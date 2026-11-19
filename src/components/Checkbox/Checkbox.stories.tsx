import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Include sleep in this entry', onChange: fn() },
  argTypes: { hint: { control: 'text' }, error: { control: 'text' } },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const WithHint: Story = {
  args: { hint: 'Adds a sleep question to your daily check-in.' },
};

export const WithError: Story = {
  args: {
    label: 'I understand my entries are stored on this device',
    error: 'Tick the box to continue',
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--mb-space-3)' }}>
      <Checkbox {...args} disabled label="Disabled" />
      <Checkbox {...args} disabled defaultChecked label="Disabled and checked" />
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <fieldset
      style={{ border: 0, margin: 0, padding: 0, display: 'grid', gap: 'var(--mb-space-3)' }}
    >
      <legend
        style={{
          marginBottom: 'var(--mb-space-2)',
          fontWeight: 'var(--mb-font-weight-semibold)',
          color: 'var(--mb-color-text)',
        }}
      >
        What affected your mood today?
      </legend>
      <Checkbox label="Sleep" name="factors" value="sleep" />
      <Checkbox label="Work" name="factors" value="work" />
      <Checkbox label="Exercise" name="factors" value="exercise" />
      <Checkbox label="Time with others" name="factors" value="social" />
    </fieldset>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Related checkboxes go in a `fieldset` whose `legend` asks the question.',
      },
    },
  },
};
