import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { children: 'New', tone: 'neutral' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'accent', 'success', 'warning', 'danger'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mb-space-2)' }}>
      <Badge tone="neutral">Draft</Badge>
      <Badge tone="accent">New</Badge>
      <Badge tone="success">Synced</Badge>
      <Badge tone="warning">Offline</Badge>
      <Badge tone="danger">Not saved</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Every tone is AA-tested on its own tint in all brands and modes.',
      },
    },
  },
};
