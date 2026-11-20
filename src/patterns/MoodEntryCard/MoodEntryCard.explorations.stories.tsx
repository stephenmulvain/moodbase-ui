/**
 * EXPLORATION (design record): three layout directions for the Mood entry card pattern.
 * Direction A (Stacked) was chosen; see MoodEntryCard.tsx.
 * Built only from existing components, to compare before building the real pattern.
 * Not part of the library; kept in Storybook as a record of the design process.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Heading } from '../../components/Heading';
import { defaultMoodLabels, MoodIcon, type MoodLevel } from '../../components/MoodPicker';
import { Text } from '../../components/Text';

interface SampleEntry {
  date: Date;
  mood: MoodLevel;
  note?: string;
  tags: string[];
}

const entries: { label: string; entry: SampleEntry }[] = [
  {
    label: 'A typical day',
    entry: {
      date: new Date(2026, 10, 16),
      mood: 4,
      note: 'Slow morning, long walk by the river. Felt lighter afterwards.',
      tags: ['Exercise', 'Time outside'],
    },
  },
  {
    label: 'A hard day (long note)',
    entry: {
      date: new Date(2026, 10, 10),
      mood: 1,
      note: 'Barely slept and work felt relentless. Snapped at a colleague in the afternoon and felt bad about it for the rest of the day. Tried to go for a walk but it was raining, so I stayed in. Going to bed early and hoping tomorrow is gentler. Writing this down helped a little.',
      tags: ['Sleep', 'Work'],
    },
  },
  {
    label: 'A quick check-in (no note or tags)',
    entry: { date: new Date(2026, 10, 18), mood: 3, tags: [] },
  },
];

const long = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
};

/** Action buttons with hidden context, so "Edit" is "Edit entry for Monday 16 November" to screen readers. */
function Actions({ dateText, compact = false }: { dateText: string; compact?: boolean }) {
  const forDate = (
    <>
      {' '}
      <span style={visuallyHidden}>entry for {dateText}</span>
    </>
  );
  return (
    <div style={{ display: 'flex', gap: 'var(--mb-space-2)' }}>
      <Button size="sm" variant={compact ? 'ghost' : 'secondary'}>
        Edit{forDate}
      </Button>
      {!compact && (
        <Button size="sm" variant="ghost">
          Delete{forDate}
        </Button>
      )}
    </div>
  );
}

/** Long notes clamp to three lines with a "Read more" toggle. */
function Note({ text, lines = 3 }: { text: string; lines?: number }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const isLong = text.length > 140;
  return (
    <div>
      <Text
        id={id}
        style={
          isLong && !open
            ? {
                display: '-webkit-box',
                WebkitLineClamp: lines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
            : undefined
        }
      >
        {text}
      </Text>
      {isLong && (
        <Button
          size="sm"
          variant="ghost"
          aria-expanded={open}
          aria-controls={id}
          style={{
            marginTop: 'var(--mb-space-1)',
            marginInlineStart: 'calc(var(--mb-space-3) * -1)',
          }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open ? 'Show less' : 'Read more'}
        </Button>
      )}
    </div>
  );
}

const Tags = ({ tags }: { tags: string[] }) =>
  tags.length > 0 ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mb-space-2)' }}>
      {tags.map((tag) => (
        <Badge key={tag}>{tag}</Badge>
      ))}
    </div>
  ) : null;

/* ---------- Option A: Stacked ---------- */

function StackedCard({ entry }: { entry: SampleEntry }) {
  const titleId = useId();
  const dateText = long.format(entry.date);
  return (
    <Card as="article" aria-labelledby={titleId}>
      <div style={{ display: 'grid', gap: 'var(--mb-space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--mb-space-3)', alignItems: 'center' }}>
          <MoodIcon level={entry.mood} size={40} />
          <div>
            <Heading level={3} size="sm" id={titleId}>
              {defaultMoodLabels[entry.mood]}
            </Heading>
            <Text size="sm" tone="muted">
              {dateText}
            </Text>
          </div>
        </div>
        {entry.note && <Note text={entry.note} />}
        <Tags tags={entry.tags} />
        <div
          style={{
            paddingTop: 'var(--mb-space-3)',
            borderTop: 'var(--mb-border-width-thin) solid var(--mb-color-border)',
          }}
        >
          <Actions dateText={dateText} />
        </div>
      </div>
    </Card>
  );
}

/* ---------- Option B: Journal (date-led) ---------- */

function JournalCard({ entry }: { entry: SampleEntry }) {
  const titleId = useId();
  const dateText = long.format(entry.date);
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(entry.date);
  const monthShort = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(entry.date);
  return (
    <Card as="article" aria-labelledby={titleId} padding="none">
      <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr' }}>
        <div
          aria-hidden="true"
          style={{
            display: 'grid',
            alignContent: 'start',
            justifyItems: 'center',
            gap: 'var(--mb-space-1)',
            padding: 'var(--mb-space-6) var(--mb-space-2)',
            borderInlineEnd: 'var(--mb-border-width-thin) solid var(--mb-color-border)',
            background: 'var(--mb-color-surface)',
          }}
        >
          <Text as="span" size="sm" tone="muted" weight="medium">
            {weekday}
          </Text>
          <span
            style={{
              fontSize: 'var(--mb-font-size-3xl)',
              fontWeight: 'var(--mb-font-weight-semibold)',
              lineHeight: 1,
              color: 'var(--mb-color-text)',
            }}
          >
            {entry.date.getDate()}
          </span>
          <Text as="span" size="sm" tone="muted">
            {monthShort}
          </Text>
        </div>
        <div style={{ display: 'grid', gap: 'var(--mb-space-3)', padding: 'var(--mb-space-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--mb-space-2)', alignItems: 'center' }}>
            <MoodIcon level={entry.mood} size={24} />
            <Heading level={3} size="sm" id={titleId}>
              {defaultMoodLabels[entry.mood]}
              <span style={visuallyHidden}>, {dateText}</span>
            </Heading>
          </div>
          {entry.note ? (
            <Note text={entry.note} />
          ) : (
            <Text tone="muted" size="sm">
              No note this time.
            </Text>
          )}
          <Tags tags={entry.tags} />
          <Actions dateText={dateText} />
        </div>
      </div>
    </Card>
  );
}

/* ---------- Option C: Compact row ---------- */

function CompactRow({ entry }: { entry: SampleEntry }) {
  const titleId = useId();
  const dateText = long.format(entry.date);
  return (
    <Card as="article" aria-labelledby={titleId} padding="sm">
      <div style={{ display: 'flex', gap: 'var(--mb-space-3)', alignItems: 'center' }}>
        <MoodIcon level={entry.mood} size={32} />
        <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: 2 }}>
          <div style={{ display: 'flex', gap: 'var(--mb-space-2)', alignItems: 'baseline' }}>
            <Heading
              level={3}
              size="sm"
              id={titleId}
              style={{ fontSize: 'var(--mb-font-size-md)' }}
            >
              {defaultMoodLabels[entry.mood]}
            </Heading>
            <Text as="span" size="sm" tone="muted">
              {dateText}
            </Text>
          </div>
          {(entry.note ?? entry.tags.length > 0) && (
            <Text
              size="sm"
              tone="muted"
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {entry.note ?? entry.tags.join(' · ')}
            </Text>
          )}
        </div>
        <Actions dateText={dateText} compact />
      </div>
    </Card>
  );
}

/* ---------- Stories ---------- */

const Column = ({ children, gap = '4' }: { children: ReactNode; gap?: string }) => (
  <div style={{ display: 'grid', gap: `var(--mb-space-${gap})`, maxWidth: 480 }}>{children}</div>
);

const meta = {
  title: 'Patterns/Mood entry card/Explorations',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Design record: three layout directions compared before building the pattern. **A. Stacked was chosen** and became the Mood entry card. Each shows a typical day, a hard day with a long note, and a quick check-in. Switch Brand and Theme in the toolbar to compare them in every mode.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OptionAStacked: Story = {
  name: 'A. Stacked',
  render: () => (
    <Column>
      {entries.map(({ label, entry }) => (
        <StackedCard key={label} entry={entry} />
      ))}
    </Column>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Mood leads, with a large face and mood word as the heading. Note, tags and actions stack below. Clear and roomy; the most "card-like". Best for a detail view or a few recent entries.',
      },
    },
  },
};

export const OptionBJournal: Story = {
  name: 'B. Journal',
  render: () => (
    <Column>
      {entries.map(({ label, entry }) => (
        <JournalCard key={label} entry={entry} />
      ))}
    </Column>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Date leads, like a diary page. The mood is a smaller line beside the note. Feels personal and reflective; makes days easy to scan in a long history.',
      },
    },
  },
};

export const OptionCCompact: Story = {
  name: 'C. Compact row',
  render: () => (
    <Column gap="2">
      {entries.map(({ label, entry }) => (
        <CompactRow key={label} entry={entry} />
      ))}
    </Column>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'One line per day: face, mood, date and a one-line preview, with Edit only (delete would live in the edit view). Dense and fast to scan; best for long timelines. Tags and full notes need a tap through.',
      },
    },
  },
};
