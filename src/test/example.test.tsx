/**
 * Example test showing the testing conventions for this library.
 * Replace with real component tests as components are added.
 *
 * Conventions:
 *  - Query by role and accessible name, the way assistive tech sees the page.
 *  - Drive interactions with user-event (real keyboard/pointer sequences), not fireEvent.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

describe('testing setup', () => {
  it('finds elements by accessible name and moves focus with the keyboard', async () => {
    const user = userEvent.setup();
    render(
      <main data-brand="calm" data-theme="light">
        <label htmlFor="note">Today&apos;s note</label>
        <input id="note" />
        <button type="button">Log mood</button>
      </main>,
    );

    await user.tab();
    expect(screen.getByRole('textbox', { name: "Today's note" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Log mood' })).toHaveFocus();
  });
});
