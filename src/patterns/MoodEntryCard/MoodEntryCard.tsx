import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card, type CardProps } from '../../components/Card';
import { Heading, type HeadingLevel } from '../../components/Heading';
import { defaultMoodLabels, MoodIcon, type MoodLevel } from '../../components/MoodPicker';
import { Text } from '../../components/Text';
import styles from './MoodEntryCard.module.css';

export interface MoodEntryCardProps extends Omit<CardProps, 'as' | 'children'> {
  date: Date;
  mood: MoodLevel;
  /** The person's note. Line breaks are kept. Clamped to `noteLines` with "Read more". */
  note?: string;
  /** Factors such as "Sleep" or "Work", shown as badges. */
  tags?: string[];
  /** Shows an Edit button. */
  onEdit?: () => void;
  /** Shows a Delete button with a gentle in-card confirmation before this is called. */
  onDelete?: () => void;
  /** Heading level for the mood, to fit the page outline. */
  headingLevel?: HeadingLevel;
  /** Lines of note shown before "Read more". */
  noteLines?: number;
  /** BCP 47 locale for the date, e.g. 'en-GB'. Defaults to the browser's. */
  locale?: string;
  /** Override mood names (Struggling, Low, Okay, Good, Great). */
  moodLabels?: Partial<Record<MoodLevel, string>>;
}

const pad = (n: number) => String(n).padStart(2, '0');
const isoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * One day's check-in: mood, date, note, tags and actions.
 * Pattern built from Card, MoodIcon, Heading, Text, Badge and Button.
 */
export function MoodEntryCard({
  date,
  mood,
  note,
  tags = [],
  onEdit,
  onDelete,
  headingLevel = 3,
  noteLines = 3,
  locale,
  moodLabels,
  className,
  ...cardProps
}: MoodEntryCardProps) {
  const titleId = useId();
  const dateId = useId();
  const noteId = useId();
  const confirmId = useId();

  const moodLabel = moodLabels?.[mood] ?? defaultMoodLabels[mood];
  const dateText = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);

  /* ---- Note clamping: "Read more" only appears when the note really overflows. ---- */
  const noteRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    // Only measure while clamped; once expanded, keep the toggle so it can collapse.
    // ResizeObserver also re-checks when the card's width changes.
    const element = noteRef.current;
    if (expanded || !element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      setOverflows(element.scrollHeight > element.clientHeight + 1);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [expanded, note, noteLines]);

  /* ---- Delete confirmation, with focus moved in and restored on cancel. ---- */
  const [confirming, setConfirming] = useState(false);
  const keepRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (confirming) keepRef.current?.focus();
    else if (restoreFocus.current) {
      restoreFocus.current = false;
      deleteRef.current?.focus();
    }
  }, [confirming]);

  const cancelDelete = () => {
    restoreFocus.current = true;
    setConfirming(false);
  };

  /** Escape on either confirmation button cancels, like closing a dialog. */
  const handleConfirmKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelDelete();
    }
  };

  // The space sits outside the hidden span: whitespace at the start of an element is
  // dropped from accessible names, which would read "Editentry for…".
  const forDate = (
    <>
      {' '}
      <span className={styles.visuallyHidden}>entry for {dateText}</span>
    </>
  );
  const hasActions = Boolean(onEdit ?? onDelete);

  return (
    <Card
      {...cardProps}
      as="article"
      aria-labelledby={`${titleId} ${dateId}`}
      className={[styles.card, className].filter(Boolean).join(' ')}
    >
      <div className={styles.header}>
        <MoodIcon level={mood} size={40} />
        <div className={styles.titles}>
          <Heading level={headingLevel} size="sm" id={titleId}>
            {moodLabel}
          </Heading>
          <Text size="sm" tone="muted">
            <time id={dateId} dateTime={isoDate(date)}>
              {dateText}
            </time>
          </Text>
        </div>
      </div>

      {note && (
        <div>
          <Text
            ref={noteRef}
            id={noteId}
            className={[styles.note, !expanded && styles.clamped].filter(Boolean).join(' ')}
            style={{ '--_lines': noteLines } as CSSProperties}
          >
            {note}
          </Text>
          {(overflows || expanded) && (
            <Button
              size="sm"
              variant="ghost"
              className={styles.readMore}
              aria-expanded={expanded}
              aria-controls={noteId}
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              {expanded ? 'Show less' : 'Read more'}
            </Button>
          )}
        </div>
      )}

      {tags.length > 0 && (
        <ul className={styles.tags} aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      )}

      {hasActions && (
        <div className={styles.footer}>
          {confirming ? (
            <div role="group" aria-labelledby={confirmId} className={styles.confirm}>
              <Text id={confirmId} weight="medium">
                Delete this entry? This can&apos;t be undone.
              </Text>
              <div className={styles.actions}>
                <Button
                  ref={keepRef}
                  size="sm"
                  variant="secondary"
                  onClick={cancelDelete}
                  onKeyDown={handleConfirmKeyDown}
                >
                  Keep entry
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onKeyDown={handleConfirmKeyDown}
                  onClick={() => {
                    setConfirming(false);
                    onDelete?.();
                  }}
                >
                  Delete{forDate}
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.actions}>
              {onEdit && (
                <Button size="sm" variant="secondary" onClick={onEdit}>
                  Edit{forDate}
                </Button>
              )}
              {onDelete && (
                <Button
                  ref={deleteRef}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setConfirming(true);
                  }}
                >
                  Delete{forDate}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
