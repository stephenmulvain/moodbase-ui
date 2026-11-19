import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'For settings that take effect immediately. If the choice is only applied when a form is submitted, use Checkbox.',
      },
    },
  },
  args: { label: 'Daily reminder', onChange: fn() },
  argTypes: { hint: { control: 'text' }, error: { control: 'text' } },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const WithHint: Story = {
  args: { defaultChecked: true, hint: "We'll send a gentle nudge at 8pm." },
};

export const WithError: Story = {
  args: { error: "We couldn't save this setting. Try again in a moment." },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--mb-space-3)' }}>
      <Switch {...args} disabled label="Disabled, off" />
      <Switch {...args} disabled defaultChecked label="Disabled, on" />
    </div>
  ),
};
