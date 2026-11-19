# moodbase-ui

The design system for **Moodbase**, a calm, supportive mood tracking dashboard. Built with React, TypeScript, CSS Modules and design tokens.

> Status: foundations in place (tokens, theming, tooling). Components are being built one at a time.

## About

_TODO: Why this design system exists, who it is for, and what Moodbase is._

## Live demo

_TODO: Link to the deployed Storybook._

## Design decisions

_TODO: Expand._ Starting points:

- **Calm by default.** Soft, desaturated hues and generous radii. Nothing shouts.
- **No alarming reds for low moods.** `danger` is a dusty rose reserved for genuine errors and destructive actions. Mood colors will be a separate scale, so a low mood is never styled as an error.
- **Semantic tokens only in components.** Components never reference raw primitives, so a new brand or mode needs no component changes.

## Tokens and theming

Tokens live in [`src/tokens`](src/tokens) as JSON in the [W3C Design Tokens (DTCG)](https://www.designtokens.org/) format, in two layers:

| Layer     | Files                          | Examples                                                        |
| --------- | ------------------------------ | --------------------------------------------------------------- |
| Primitive | `primitives/*.json`            | `color.tide.600`, `space.4`, `radius.lg`, `font-size.xl`        |
| Semantic  | `semantic/{brand}.{mode}.json` | `surface`, `text-muted`, `accent`, `danger`, `focus-ring`, etc. |

`npm run tokens` turns them into CSS custom properties in [`src/styles/tokens.css`](src/styles/tokens.css), scoped by data attributes:

```html
<html data-brand="warm" data-theme="dark"></html>
```

```css
.card {
  background: var(--mb-color-surface-raised);
  color: var(--mb-color-text);
  padding: var(--mb-space-4);
  border-radius: var(--mb-radius-lg);
}
```

Brands: **Calm** (soft blues and greens) and **Warm** (soft corals and ambers), each in light and dark. With no attributes set, Calm / light is the default.

## Accessibility

- Every semantic color pairing is checked against **WCAG 2.1 AA** (4.5:1 text, 3:1 non-text) for every brand and mode, in [`tokens.test.ts`](src/tokens/tokens.test.ts). CI fails if a token change breaks contrast.
- Visible `:focus-visible` rings using the `focus-ring` token, and they stay visible in Windows forced-colors mode.
- `rem`-based type scale that respects the reader's browser font size.
- `eslint-plugin-jsx-a11y` (strict) in linting and `@storybook/addon-a11y` checks in Storybook.

_TODO: Add keyboard and screen reader notes per component._

## How I used AI

_TODO: Describe how AI tools were used, what you reviewed and decided yourself, and what you changed._

## Run locally

Requires Node 22.18+ (Node 24 recommended, see `.nvmrc`).

```bash
npm install
npm run storybook        # Storybook at http://localhost:6006
```

| Script                    | What it does                                    |
| ------------------------- | ----------------------------------------------- |
| `npm run tokens`          | Rebuild `tokens.css` from the JSON tokens       |
| `npm run lint`            | ESLint + Prettier check                         |
| `npm run format`          | Auto-format with Prettier                       |
| `npm run typecheck`       | TypeScript strict type-check                    |
| `npm test`                | Run Vitest once (`npm run test:watch` to watch) |
| `npm run build`           | Build the library into `dist/`                  |
| `npm run build-storybook` | Build static Storybook into `storybook-static/` |
