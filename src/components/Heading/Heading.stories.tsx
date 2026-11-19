import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';

const meta = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { level: 2, children: 'How are you feeling today?' },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', '2xl'] },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultSizesByLevel: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--mb-space-4)' }}>
      <Heading level={1}>Level 1 · 2xl</Heading>
      <Heading level={2}>Level 2 · xl</Heading>
      <Heading level={3}>Level 3 · lg</Heading>
      <Heading level={4}>Level 4 · md</Heading>
      <Heading level={5}>Level 5 · sm</Heading>
    </div>
  ),
};

export const LevelIndependentOfSize: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--mb-space-2)' }}>
      <Heading level={2} size="sm">
        A level 2 heading that looks small
      </Heading>
      <Heading level={4} size="xl">
        A level 4 heading that looks large
      </Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Choose `level` from the page outline and `size` from the visual design. Screen reader users jump between headings by level, so levels must not skip around to get a look.',
      },
    },
  },
};
