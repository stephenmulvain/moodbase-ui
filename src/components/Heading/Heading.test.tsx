import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Heading, type HeadingLevel } from './Heading';

describe('Heading', () => {
  it.each<HeadingLevel>([1, 2, 3, 4, 5, 6])('renders a real h%i for level %i', (level) => {
    render(<Heading level={level}>Your week</Heading>);
    expect(screen.getByRole('heading', { level, name: 'Your week' })).toBeInTheDocument();
  });

  it('keeps the semantic level when the visual size changes', () => {
    render(
      <Heading level={2} size="sm">
        Recent entries
      </Heading>,
    );
    const heading = screen.getByRole('heading', { level: 2, name: 'Recent entries' });
    expect(heading).toHaveClass('sizesm');
  });

  it('picks a default size from the level', () => {
    render(<Heading level={1}>Moodbase</Heading>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('size2xl');
  });

  it('passes through id and className for aria-labelledby use', () => {
    render(
      <Heading level={3} id="entry-title" className="custom">
        Sunday walk
      </Heading>,
    );
    const heading = screen.getByRole('heading', { name: 'Sunday walk' });
    expect(heading).toHaveAttribute('id', 'entry-title');
    expect(heading).toHaveClass('heading', 'custom');
  });
});
