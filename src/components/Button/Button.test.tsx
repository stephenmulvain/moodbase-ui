import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('is exposed as a button named by its label', () => {
    render(<Button>Log mood</Button>);
    expect(screen.getByRole('button', { name: 'Log mood' })).toBeInTheDocument();
  });

  it('defaults to type="button" so it never submits a form by accident', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Button>Cancel</Button>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('can be reached with Tab and activated with Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('does not respond when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  describe('when loading', () => {
    it('keeps its accessible name, stays focusable and announces it is busy', async () => {
      const user = userEvent.setup();
      render(<Button loading>Save entry</Button>);

      const button = screen.getByRole('button', { name: 'Save entry' });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeEnabled();

      await user.tab();
      expect(button).toHaveFocus();
    });

    it('ignores clicks and does not submit its form', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const onSubmit = vi.fn();
      render(
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <Button type="submit" loading onClick={onClick}>
            Save entry
          </Button>
        </form>,
      );

      await user.click(screen.getByRole('button', { name: 'Save entry' }));
      expect(onClick).not.toHaveBeenCalled();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('hides decorative icons from assistive tech', () => {
    render(<Button startIcon={<svg data-testid="icon" />}>Add entry</Button>);
    expect(screen.getByRole('button', { name: 'Add entry' })).toBeInTheDocument();
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="custom">
        Save
      </Button>,
    );
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Save' }));
    expect(ref.current).toHaveClass('custom');
  });
});
