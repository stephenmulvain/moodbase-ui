import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Button } from '../Button';
import { Heading } from '../Heading';
import { Text } from '../Text';
import { TextField } from '../TextField';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { variant: 'outlined', padding: 'md', as: 'div' },
  argTypes: {
    as: { control: 'inline-radio', options: ['div', 'article', 'section', 'li', 'aside'] },
    variant: { control: 'inline-radio', options: ['outlined', 'elevated'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Story-only layout helpers. A Stack layout component may replace these later. */
const narrow: CSSProperties = { maxWidth: 360 };
const stack = (gap: string): CSSProperties => ({ display: 'grid', gap: `var(--mb-space-${gap})` });

const SampleContent = () => (
  <div style={stack('2')}>
    <Heading level={3} size="sm">
      A gentle check-in
    </Heading>
    <Text tone="muted">Take a moment to notice how you feel. There are no wrong answers.</Text>
  </div>
);

export const Outlined: Story = {
  render: (args) => (
    <div style={narrow}>
      <Card {...args}>
        <SampleContent />
      </Card>
    </div>
  ),
};

export const Elevated: Story = {
  args: { variant: 'elevated' },
  render: Outlined.render,
};

export const Paddings: Story = {
  render: (args) => (
    <div style={{ ...stack('4'), ...narrow }}>
      {(['sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} {...args} padding={padding}>
          <code>padding=&quot;{padding}&quot;</code>
        </Card>
      ))}
    </div>
  ),
};

export const EdgeToEdgeMedia: Story = {
  args: { padding: 'none', variant: 'elevated' },
  render: (args) => (
    <div style={narrow}>
      <Card {...args}>
        {/* Placeholder for future illustrations: a soft gradient from the brand tokens. */}
        <div
          aria-hidden="true"
          style={{
            height: 120,
            background:
              'linear-gradient(135deg, var(--mb-color-accent), var(--mb-color-surface-raised))',
            opacity: 0.6,
          }}
        />
        <div style={{ padding: 'var(--mb-space-6)' }}>
          <SampleContent />
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use `padding="none"` when media should run to the edges; the card clips it to its rounded corners.',
      },
    },
  },
};

export const MoodEntryExample: Story = {
  name: 'Example: mood entry',
  args: { as: 'article', 'aria-labelledby': 'entry-title' },
  render: (args) => (
    <div style={narrow}>
      <Card {...args}>
        <div style={stack('2')}>
          <Text size="sm" tone="muted">
            Sunday, 15 November
          </Text>
          <Heading level={3} size="sm" id="entry-title">
            Sunday walk
          </Heading>
          <Text tone="muted">Slow morning, long walk by the river. Felt lighter afterwards.</Text>
        </div>
        <div style={{ display: 'flex', gap: 'var(--mb-space-2)', marginTop: 'var(--mb-space-4)' }}>
          <Button size="sm" variant="secondary">
            Edit entry
          </Button>
          <Button size="sm" variant="ghost">
            Share
          </Button>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Composition example, not a component. Rendered as an `article` named by its heading, so screen reader users can jump between entries. A future MoodEntryCard pattern will add the mood indicator and illustration.',
      },
    },
  },
};

export const DashboardExample: Story = {
  name: 'Example: dashboard grid',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'var(--mb-space-4)',
      }}
    >
      <Card as="section" aria-labelledby="today-title" variant="elevated">
        <div style={stack('2')}>
          <Heading level={2} size="sm" id="today-title">
            Today
          </Heading>
          <Text tone="muted">You haven&apos;t checked in yet.</Text>
        </div>
        <div style={{ marginTop: 'var(--mb-space-4)' }}>
          <Button fullWidth>Check in</Button>
        </div>
      </Card>

      <Card as="section" aria-labelledby="note-title">
        <Heading level={2} size="sm" id="note-title">
          Quick note
        </Heading>
        <form
          style={{ ...stack('4'), marginTop: 'var(--mb-space-3)' }}
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <TextField label="What's on your mind?" hint="Only you can see this." />
          <Button type="submit" variant="secondary">
            Save note
          </Button>
        </form>
      </Card>

      <Card as="section" aria-labelledby="streak-title">
        <div style={stack('2')}>
          <Heading level={2} size="sm" id="streak-title">
            This week
          </Heading>
          <Text tone="muted">4 check-ins. Every one counts, however you were feeling.</Text>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Composition example showing Card, Heading, Text, Button and TextField together. Each card is a named `section`, so they appear as landmarks screen reader users can jump between.',
      },
    },
  },
};
