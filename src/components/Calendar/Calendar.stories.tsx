import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Card } from '../Card';
import { Heading } from '../Heading';
import { defaultMoodLabels, type MoodLevel } from '../MoodPicker/mood';
import { MoodIcon } from '../MoodPicker/MoodIcon';
import { Text } from '../Text';
import { Calendar } from './Calendar';
import { toDateKey } from './dates';

// Stories use a fixed "today" so the docs look the same whenever they're viewed.
const TODAY = new Date(2026, 10, 19);

/** A plausible month of check-ins up to today, with a few skipped days. */
const sampleMoods: Record<string, MoodLevel> = Object.fromEntries(
  ([3, 4, 4, null, 2, 3, 5, 4, 3, 1, 2, 3, null, 4, 4, 5, 3, 4, 4] as (MoodLevel | null)[]).flatMap(
    (mood, index) => (mood === null ? [] : [[toDateKey(new Date(2026, 10, index + 1)), mood]]),
  ),
);

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Month calendar following the WAI-ARIA date picker grid pattern. Keyboard: arrows move by day and week, Home/End to the start/end of the week, Page Up/Down by month, Shift + Page Up/Down by year, Enter or Space to select. Only one day is in the Tab order.',
      },
    },
  },
  args: { today: TODAY, onChange: fn(), onMonthChange: fn() },
  argTypes: {
    weekStartsOn: { control: 'inline-radio', options: [1, 0] },
    locale: { control: 'text' },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = { args: { defaultValue: new Date(2026, 10, 12) } };

export const WithMoods: Story = {
  args: { moods: sampleMoods },
  parameters: {
    docs: {
      description: {
        story:
          'Pass `moods` keyed by `YYYY-MM-DD`. Each day shows its mood face and includes the mood in its spoken name, e.g. "Tuesday 10 November 2026, mood: Struggling".',
      },
    },
  },
};

export const MinAndMax: Story = {
  args: { min: new Date(2026, 10, 1), max: TODAY },
  parameters: {
    docs: {
      description: {
        story:
          'Only past days this month can be chosen. Unavailable days stay focusable so keyboard users can move through them, and are announced as unavailable.',
      },
    },
  },
};

export const SundayStart: Story = { args: { weekStartsOn: 0, locale: 'en-US' } };

export const OtherLocale: Story = {
  args: { locale: 'fr-FR', defaultValue: TODAY },
  parameters: {
    docs: {
      description: { story: 'Month and weekday names come from `Intl`, so any locale works.' },
    },
  },
};

function MoodHistory() {
  const [selected, setSelected] = useState<Date>(TODAY);
  const mood = sampleMoods[toDateKey(selected)];
  const dateText = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(selected);

  return (
    <Card as="section" aria-labelledby="history-title" style={{ maxWidth: 440 }}>
      <Heading level={2} size="sm" id="history-title">
        Your month
      </Heading>
      <Calendar
        style={{ marginTop: 'var(--mb-space-4)' }}
        today={TODAY}
        locale="en-GB"
        max={TODAY}
        moods={sampleMoods}
        value={selected}
        onChange={setSelected}
      />
      <div
        role="status"
        style={{
          display: 'flex',
          gap: 'var(--mb-space-3)',
          alignItems: 'center',
          marginTop: 'var(--mb-space-4)',
          paddingTop: 'var(--mb-space-4)',
          borderTop: 'var(--mb-border-width-thin) solid var(--mb-color-border)',
        }}
      >
        {mood ? (
          <>
            <MoodIcon level={mood} size={36} />
            <div>
              <Text weight="semibold">{defaultMoodLabels[mood]}</Text>
              <Text size="sm" tone="muted">
                {dateText}
              </Text>
            </div>
          </>
        ) : (
          <Text tone="muted">No check-in on {dateText}. That&apos;s okay.</Text>
        )}
      </div>
    </Card>
  );
}

export const MoodHistoryExample: Story = {
  name: 'Example: mood history',
  render: () => <MoodHistory />,
  parameters: {
    docs: {
      description: {
        story:
          'Composition example: Calendar with moods inside a Card. Choosing a day shows its entry below; missed days get a gentle message rather than a warning.',
      },
    },
  },
};
