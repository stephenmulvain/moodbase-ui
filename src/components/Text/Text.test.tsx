import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('renders a paragraph by default', () => {
    render(<Text>Every check-in counts.</Text>);
    expect(screen.getByText('Every check-in counts.').tagName).toBe('P');
  });

  it('renders the requested element', () => {
    render(
      <Text as="strong" weight="semibold">
        4 check-ins
      </Text>,
    );
    expect(screen.getByText('4 check-ins').tagName).toBe('STRONG');
  });

  it('applies size, tone and weight', () => {
    render(
      <Text size="sm" tone="muted" weight="medium">
        Only you can see this.
      </Text>,
    );
    expect(screen.getByText('Only you can see this.')).toHaveClass(
      'sizeSm',
      'toneMuted',
      'weightMedium',
    );
  });

  it('defaults to md, default tone and regular weight', () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText('Hello')).toHaveClass('sizeMd', 'toneDefault', 'weightRegular');
  });

  it('passes through attributes and merges className', () => {
    render(
      <Text id="note" className="custom">
        Note
      </Text>,
    );
    const text = screen.getByText('Note');
    expect(text).toHaveAttribute('id', 'note');
    expect(text).toHaveClass('text', 'custom');
  });
});
