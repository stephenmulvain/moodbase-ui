import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'How was your day?', onChange: fn() },
  argTypes: { hint: { control: 'text' }, error: { control: 'text' } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'Write as much or as little as you like. Only you can see this.' },
};

export const WithCharacterCount: Story = {
  args: { maxLength: 280, showCount: true, hint: 'A short note is enough.' },
  parameters: {
    docs: {
      description: {
        story:
          'The count is read out with the field when it receives focus, rather than announced on every keystroke.',
      },
    },
  },
};

export const WithError: Story = {
  args: { required: true, error: 'Write a few words about your day, or skip this step' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Slow morning, long walk by the river.' },
};
