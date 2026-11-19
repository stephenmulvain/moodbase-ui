import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Card, type CardPadding } from './Card';

describe('Card', () => {
  it('renders its content in a div by default, with no landmark role', () => {
    const { container } = render(<Card>How was your day?</Card>);
    const card = container.firstElementChild;
    expect(card?.tagName).toBe('DIV');
    expect(card).not.toHaveAttribute('role');
    expect(screen.getByText('How was your day?')).toBeVisible();
  });

  it('renders as an article for self-contained items like a mood entry', () => {
    render(
      <Card as="article" aria-labelledby="entry-title">
        <h3 id="entry-title">Sunday walk</h3>
      </Card>,
    );
    expect(screen.getByRole('article', { name: 'Sunday walk' })).toBeInTheDocument();
  });

  it('renders as a named region when used as a labelled section', () => {
    render(
      <Card as="section" aria-labelledby="week-title">
        <h2 id="week-title">This week</h2>
      </Card>,
    );
    expect(screen.getByRole('region', { name: 'This week' })).toBeInTheDocument();
  });

  it('renders as list items inside a list', () => {
    render(
      <ul>
        <Card as="li">Monday</Card>
        <Card as="li">Tuesday</Card>
      </ul>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  // In tests, CSS Module classes are exposed by their camelCase key (e.g. `paddingMd`).
  it.each<[CardPadding, string]>([
    ['none', 'paddingNone'],
    ['sm', 'paddingSm'],
    ['md', 'paddingMd'],
    ['lg', 'paddingLg'],
  ])('applies the %s padding style', (padding, className) => {
    const { container } = render(<Card padding={padding}>Content</Card>);
    expect(container.firstElementChild).toHaveClass(className);
  });

  it('defaults to the outlined variant with medium padding', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstElementChild).toHaveClass('outlined', 'paddingMd');
  });

  it('applies the elevated variant', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    expect(container.firstElementChild).toHaveClass('elevated');
  });

  it('forwards ref, merges className and passes through attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} className="custom" data-testid="card" id="summary">
        Content
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(ref.current).toBe(card);
    expect(card).toHaveClass('card', 'custom');
    expect(card).toHaveAttribute('id', 'summary');
  });
});
