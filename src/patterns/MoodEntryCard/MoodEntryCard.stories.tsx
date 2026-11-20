import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Alert } from '../../components/Alert';
import type { MoodLevel } from '../../components/MoodPicker';
import { MoodEntryCard } from './MoodEntryCard';

const longNote =
  'Barely slept and work felt relentless. Snapped at a colleague in the afternoon and felt bad about it for the rest of the day.\n\nTried to go for a walk but it was raining, so I stayed in. Going to bed early and hoping tomorrow is gentler. Writing this down helped a little.';

const meta = {
  title: 'Patterns/Mood entry card',
  component: MoodEntryCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One day\'s check-in. A pattern built from Card, MoodIcon, Heading, Text, Badge and Button, following direction "A. Stacked" from the explorations. The card is an `article` named by its mood and date; notes clamp with "Read more" only when they overflow; Delete asks for a gentle in-card confirmation first.',
      },
    },
  },
  args: {
    date: new Date(2026, 10, 16),
    mood: 4,
    note: 'Slow morning, long walk by the river. Felt lighter afterwards.',
    tags: ['Exercise', 'Time outside'],
    locale: 'en-GB',
    onEdit: fn(),
    onDelete: fn(),
  },
  argTypes: {
    mood: { control: 'inline-radio', options: [1, 2, 3, 4, 5] },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4] },
    date: { control: 'date' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MoodEntryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypicalDay: Story = {};

export const HardDayLongNote: Story = {
  name: 'Hard day (long note)',
  args: { date: new Date(2026, 10, 10), mood: 1, note: longNote, tags: ['Sleep', 'Work'] },
  parameters: {
    docs: {
      description: {
        story:
          'The note keeps the person\'s own line breaks and clamps to three lines. "Read more" appears only when the text actually overflows, at any width.',
      },
    },
  },
};

export const QuickCheckIn: Story = {
  name: 'Quick check-in (mood only)',
  args: { date: new Date(2026, 10, 18), mood: 3, note: undefined, tags: [] },
};

export const ReadOnly: Story = {
  name: 'Read only (no actions)',
  args: { onEdit: undefined, onDelete: undefined },
};

function Timeline() {
  const [entries, setEntries] = useState<
    { id: number; date: Date; mood: MoodLevel; note?: string; tags: string[] }[]
  >([
    { id: 1, date: new Date(2026, 10, 18), mood: 3, tags: [] },
    {
      id: 2,
      date: new Date(2026, 10, 16),
      mood: 4,
      note: 'Slow morning, long walk by the river. Felt lighter afterwards.',
      tags: ['Exercise', 'Time outside'],
    },
    { id: 3, date: new Date(2026, 10, 10), mood: 1, note: longNote, tags: ['Sleep', 'Work'] },
  ]);
  const [deleted, setDeleted] = useState<string>();

  return (
    <div style={{ display: 'grid', gap: 'var(--mb-space-4)' }}>
      {deleted && (
        <Alert
          tone="success"
          announce
          onDismiss={() => {
            setDeleted(undefined);
          }}
        >
          Entry for {deleted} deleted.
        </Alert>
      )}
      <ul
        aria-label="Recent entries"
        style={{
          display: 'grid',
          gap: 'var(--mb-space-4)',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {entries.map(({ id, ...entry }) => (
          <li key={id}>
            <MoodEntryCard
              {...entry}
              locale="en-GB"
              onEdit={() => undefined}
              onDelete={() => {
                setEntries((current) => current.filter((item) => item.id !== id));
                setDeleted(
                  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(
                    entry.date,
                  ),
                );
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const TimelineExample: Story = {
  name: 'Example: recent entries',
  render: () => <Timeline />,
  parameters: {
    docs: {
      description: {
        story:
          'A list of entries. Try deleting one: the card asks first, focus lands on "Keep entry", Escape cancels, and a confirmed delete is announced with a success Alert. In the app, also move focus to the next entry (or the list heading) once a card is removed, so keyboard users are not left on nothing.',
      },
    },
  },
};
