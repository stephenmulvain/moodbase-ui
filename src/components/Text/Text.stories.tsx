import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    children: 'Noticing how you feel, without judging it, is the first step.',
  },
  argTypes: {
    as: { control: 'inline-radio', options: ['p', 'span', 'div', 'strong', 'em', 'small'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    tone: {
      control: 'inline-radio',
      options: ['default', 'muted', 'accent', 'success', 'warning', 'danger'],
    },
    weight: { control: 'inline-radio', options: ['regular', 'medium', 'semibold', 'bold'] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--mb-space-3)' }}>
      {(['lg', 'md', 'sm', 'xs'] as const).map((size) => (
        <Text key={size} {...args} size={size}>
          {size}: {args.children}
        </Text>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--mb-space-3)' }}>
      <Text {...args} tone="default">
        Default: primary reading text.
      </Text>
      <Text {...args} tone="muted">
        Muted: supporting details, dates and hints.
      </Text>
      <Text {...args} tone="accent">
        Accent: highlighted information.
      </Text>
      <Text {...args} tone="success">
        Success: your entry was saved.
      </Text>
      <Text {...args} tone="warning">
        Warning: you are offline, changes will sync later.
      </Text>
      <Text {...args} tone="danger">
        Danger: this entry could not be deleted.
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Every tone passes WCAG AA on both surfaces in all brands and modes. Tone supports the words; it never replaces them.',
      },
    },
  },
};

export const Weights: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--mb-space-3)' }}>
      {(['regular', 'medium', 'semibold', 'bold'] as const).map((weight) => (
        <Text key={weight} {...args} weight={weight}>
          {weight}
        </Text>
      ))}
    </div>
  ),
};
