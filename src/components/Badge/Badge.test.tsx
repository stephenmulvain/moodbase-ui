import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its label as inline text', () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText('New');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('badge', 'neutral');
  });

  it('applies the tone class', () => {
    render(<Badge tone="success">Synced</Badge>);
    expect(screen.getByText('Synced')).toHaveClass('success');
  });

  it('is not interactive and passes through attributes', () => {
    render(
      <Badge id="streak" title="3 days in a row">
        3-day streak
      </Badge>,
    );
    const badge = screen.getByText('3-day streak');
    expect(badge).toHaveAttribute('id', 'streak');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
