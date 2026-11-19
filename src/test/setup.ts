// Adds DOM matchers like toBeInTheDocument() and toHaveFocus() to Vitest's expect.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Unmount anything rendered by a test so tests never leak into each other.
afterEach(() => {
  cleanup();
});
