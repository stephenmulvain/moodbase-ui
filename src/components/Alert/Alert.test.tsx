import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert, type AlertTone } from './Alert';

describe('Alert', () => {
  it.each<[AlertTone, string]>([
    ['info', 'Information:'],
    ['success', 'Success:'],
    ['warning', 'Warning:'],
    ['danger', 'Error:'],
  ])('prefixes %s alerts with "%s" for screen readers', (tone, prefix) => {
    render(<Alert tone={tone}>Your entry was saved.</Alert>);
    expect(screen.getByText(prefix)).toBeInTheDocument();
  });

  it('is not a live region unless asked to announce', () => {
    render(<Alert>Reminders are paused this week.</Alert>);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('announces politely as a status for non-danger tones', () => {
    render(
      <Alert tone="success" announce>
        Entry saved.
      </Alert>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Success: Entry saved.');
  });

  it('interrupts with role="alert" for danger when announcing', () => {
    render(
      <Alert tone="danger" announce title="We couldn't save your entry">
        Check your connection and try again.
      </Alert>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent("Error: We couldn't save your entry");
    expect(alert).toHaveTextContent('Check your connection and try again.');
  });

  it('renders a labelled dismiss button only when onDismiss is given', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = render(<Alert>Tip</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <Alert onDismiss={onDismiss} dismissLabel="Dismiss tip">
        Tip
      </Alert>,
    );
    await user.click(screen.getByRole('button', { name: 'Dismiss tip' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('hides its icon from assistive tech', () => {
    const { container } = render(<Alert>Tip</Alert>);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
