# moodbase-ui

The design system for **Moodbase**, a calm, private mood tracking dashboard. Built with React, TypeScript, CSS Modules and design tokens.

**[View the live Storybook →](https://stephenmulvain.github.io/moodbase-ui/)**

## About

**moodbase-ui** is the design system behind **Moodbase**, a mood tracking dashboard I'm building for myself. I wanted a reliable way to track my own mood and couldn't find an app that did it the way I needed, so I'm designing and building one, starting with the foundations.

Moodbase should feel **safe, calm and completely private**: a place to be honest about a hard day without feeling judged, and without anyone else ever seeing it. Every part of this design system is built around that.

The design system is the starting point, not the finished article. It will evolve as the Moodbase designs mature: new patterns, refined tokens and components shaped by real screens.

### What's inside

| Area        | Components                                            |
| ----------- | ----------------------------------------------------- |
| Foundations | Colour, type and spacing tokens · Foundations docs    |
| Typography  | Heading · Text                                        |
| Actions     | Button                                                |
| Layout      | Card                                                  |
| Forms       | TextField · Textarea · Checkbox · RadioGroup · Switch |
| Feedback    | Alert · Badge                                         |
| Mood        | MoodIcon · MoodPicker · Calendar (with mood history)  |

## Live demo

**[stephenmulvain.github.io/moodbase-ui](https://stephenmulvain.github.io/moodbase-ui/)**

Use the **Brand** and **Theme** switchers in the toolbar to see every component in Calm and Warm, light and dark. Good places to start:

- **Foundations → Colors**: every token, with live WCAG contrast checks
- **Components → MoodPicker → Example: daily check-in**
- **Components → Calendar → Example: mood history** (try it with just the keyboard)

The demo redeploys automatically on every merge to `main`.

## Design decisions

- **Safe, calm and private, in the details.** Hints say "Only you can see this." Errors explain what to do next without blame. A missed day says "No check-in… That's okay." rather than showing a warning.
- **No alarming reds for low moods.** The mood scale runs cool to warm: lavender, blue, teal, sage, gold. A hard day is acknowledged, never styled as an error. `danger` is a dusty rose kept for genuine errors and destructive actions only.
- **Supportive words.** The scale is _Struggling, Low, Okay, Good, Great_: "Struggling" rather than "Terrible", so the language acknowledges without judging.
- **Colour is never the only cue.** Every mood has a face and a word; every error has an icon, text and a spoken "Error:" prefix; selected states also change weight or border.
- **One mood scale for both brands.** Moods behave like data, so a "Low" day looks the same in Calm and Warm (and in future charts). Light and dark modes get their own shades.
- **Two brands, one set of components.** Calm (soft blues and greens) and Warm (soft corals and amber), each in light and dark. Components only use semantic tokens, so a new brand or mode needs no component changes.
- **Primitives first, patterns later.** Components stay generic (a Card knows nothing about moods). Moodbase-specific patterns, illustrations and richer cards will be built on top as the designs mature.
- **Heading level is separate from size.** The outline screen reader users navigate by never has to bend to get a look.

## Tokens and theming

Tokens live in [`src/tokens`](src/tokens) as JSON in the [W3C Design Tokens (DTCG)](https://www.designtokens.org/) format, in two layers:

| Layer     | Files                          | Examples                                                                     |
| --------- | ------------------------------ | ---------------------------------------------------------------------------- |
| Primitive | `primitives/*.json`            | `color.tide.600`, `space.4`, `radius.lg`, `font-size.xl`                     |
| Semantic  | `semantic/{brand}.{mode}.json` | `surface`, `text-muted`, `accent`, `danger`, `focus-ring`, `mood-1`…`mood-5` |

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

With no attributes set, Calm / light is the default. CI fails if `tokens.css` is out of date with the JSON.

## Accessibility

WCAG 2.1 AA is the minimum, and it's tested rather than assumed.

- **Contrast in CI.** Every semantic colour pairing (4.5:1 text, 3:1 borders, focus rings, icons and mood colours) is checked for every brand and mode in [`tokens.test.ts`](src/tokens/tokens.test.ts). Tinted backgrounds made with `color-mix()` (Alert, Badge, selected moods) are recomputed and checked in [`tinted.test.ts`](src/tokens/tinted.test.ts).
- **Keyboard first.** Visible focus rings everywhere. Native inputs under every custom control, so Tab, Space and arrow keys behave as expected. Calendar follows the WAI-ARIA date picker grid pattern.
- **Screen readers.** Visible labels on every field; hints and errors linked with `aria-describedby`; errors and new alerts announced politely; each calendar day has a full spoken date, including its mood.
- **Comfortable reading.** `rem`-based type that respects browser font size, and 16px minimum in inputs so mobile browsers don't zoom.
- **Respectful motion and contrast modes.** `prefers-reduced-motion` and Windows High Contrast (`forced-colors`) are handled in every component.
- **Guard rails.** `eslint-plugin-jsx-a11y` (strict) in linting, the Storybook a11y panel on every story, and React Testing Library tests that query by role and accessible name.

## How I used AI

I built moodbase-ui with Claude Code as a collaborator. I owned the project: driving the vision, deciding what Moodbase needs, and shaping the building blocks that the next step will be built on. Claude helped build this foundation: the code, tests and documentation behind it. The major next steps, the Moodbase patterns and the app itself, will be driven completely by me.

Along the way I practised the parts of shipping a design system that sit outside design tools: working with Git and pull requests, seeing design tokens become real CSS, and running checks on every change. It's also helped me refine my own AI design process: knowing where to set direction, what to review, and when to step in.

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

Every pull request runs the token check, lint, type-check, tests and a Storybook build in GitHub Actions.

---

Designed by **Stephen Mulvain**, Product Designer · [stephenmulvain.com](https://www.stephenmulvain.com)
