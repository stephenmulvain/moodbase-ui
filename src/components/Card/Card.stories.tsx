import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Button } from '../Button';
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

/* Story-only typography helpers. Real content styles will come from future Text components. */
const title: CSSProperties = {
  margin: 0,
  fontSize: 'var(--mb-font-size-lg)',
  fontWeight: 'var(--mb-font-weight-semibold)',
  lineHeight: 'var(--mb-line-height-tight)',
};
const body: CSSProperties = {
  margin: 'var(--mb-space-2) 0 0',
  color: 'var(--mb-color-text-muted)',
  lineHeight: 'var(--mb-line-height-normal)',
};
const narrow: CSSProperties = { maxWidth: 360 };

const SampleContent = () => (
  <>
    <h3 style={title}>A gentle check-in</h3>
    <p style={body}>Take a moment to notice how you feel. There are no wrong answers.</p>
  </>
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
    <div style={{ display: 'grid', gap: 'var(--mb-space-4)', ...narrow }}>
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
        <p style={{ ...body, margin: 0, fontSize: 'var(--mb-font-size-sm)' }}>
          Sunday, 16 November
        </p>
        <h3 id="entry-title" style={{ ...title, marginTop: 'var(--mb-space-1)' }}>
          Sunday walk
        </h3>
        <p style={body}>Slow morning, long walk by the river. Felt lighter afterwards.</p>
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
        <h2 id="today-title" style={title}>
          Today
        </h2>
        <p style={body}>You haven&apos;t checked in yet.</p>
        <div style={{ marginTop: 'var(--mb-space-4)' }}>
          <Button fullWidth>Check in</Button>
        </div>
      </Card>

      <Card as="section" aria-labelledby="note-title">
        <h2 id="note-title" style={title}>
          Quick note
        </h2>
        <form
          style={{ display: 'grid', gap: 'var(--mb-space-4)', marginTop: 'var(--mb-space-3)' }}
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
        <h2 id="streak-title" style={title}>
          This week
        </h2>
        <p style={body}>4 check-ins. Every one counts, however you were feeling.</p>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Composition example showing Card, Button and TextField together. Each card is a named `section`, so they appear as landmarks screen reader users can jump between.',
      },
    },
  },
};
