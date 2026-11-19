import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { Card } from '../Card';
import { Heading } from '../Heading';
import { Text } from '../Text';
import { Textarea } from '../Textarea';
import { defaultMoodLabels, moodLevels, type MoodLevel } from './mood';
import { MoodIcon } from './MoodIcon';
import { MoodPicker } from './MoodPicker';

const meta = {
  title: 'Components/MoodPicker',
  component: MoodPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The signature Moodbase control. Five moods on a cool-to-warm scale with no alarming reds: a hard day is acknowledged, never styled as an error. Each mood has a face and a word, so colour is never the only cue.',
      },
    },
  },
  args: { onChange: fn() },
  argTypes: { hint: { control: 'text' }, error: { control: 'text' } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MoodPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = { args: { defaultValue: 4 } };

export const WithHint: Story = {
  args: { hint: 'There are no wrong answers. Pick whatever feels closest.' },
};

export const WithError: Story = {
  args: { required: true, error: "Choose how you're feeling, or skip today's check-in" },
};

export const CustomLabels: Story = {
  args: {
    label: 'How was your morning?',
    labels: { 1: 'Rough', 2: 'Slow', 3: 'Fine', 4: 'Nice', 5: 'Wonderful' },
  },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 3 } };

export const MoodScale: Story = {
  name: 'Mood scale',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--mb-space-3)' }}>
      {moodLevels.map((level) => (
        <div
          key={level}
          style={{ display: 'flex', gap: 'var(--mb-space-3)', alignItems: 'center' }}
        >
          <MoodIcon level={level} size={32} />
          <Text weight="medium" style={{ minWidth: 96 }}>
            {defaultMoodLabels[level]}
          </Text>
          <Text as="span" size="sm" tone="muted">
            <code>--mb-color-mood-{level}</code>
          </Text>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shared by both brands so a mood always looks the same, including in future charts. Light and dark modes use their own shades. Every mood colour is tested at 3:1 or more against both surfaces and its selected tint.',
      },
    },
  },
};

function CheckIn() {
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const error = submitted && mood === null ? "Choose how you're feeling" : undefined;

  return (
    <Card as="section" aria-labelledby="mood-checkin-title" variant="elevated">
      <Heading level={2} size="sm" id="mood-checkin-title">
        Today&apos;s check-in
      </Heading>
      <form
        noValidate
        style={{ display: 'grid', gap: 'var(--mb-space-6)', marginTop: 'var(--mb-space-4)' }}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
          setSaved(mood !== null);
        }}
      >
        <MoodPicker
          name="mood"
          value={mood}
          onChange={(level) => {
            setMood(level);
            setSaved(false);
          }}
          error={error}
          required
        />
        <Textarea label="Want to add a note?" hint="Optional." maxLength={280} showCount />
        <div style={{ display: 'flex', gap: 'var(--mb-space-3)', alignItems: 'center' }}>
          <Button type="submit">Save check-in</Button>
          {saved && mood !== null && (
            <Text as="span" tone="success" role="status">
              Saved. Thanks for checking in.
            </Text>
          )}
        </div>
      </form>
    </Card>
  );
}

export const CheckInExample: Story = {
  name: 'Example: daily check-in',
  render: () => <CheckIn />,
  parameters: {
    docs: {
      description: {
        story:
          'Composition example: MoodPicker inside a Card with Textarea and Button. Save without choosing a mood to see the error.',
      },
    },
  },
};
