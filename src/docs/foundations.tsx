/**
 * Storybook-only documentation views for the design tokens.
 * Not exported from the library. Everything is read from the token JSON so docs never drift.
 */
import type { ReactNode } from 'react';
import {
  getReference,
  getSemanticTokens,
  primitiveTokens,
  resolveTheme,
  resolveTokenValue,
  type Brand,
  type Theme,
  type Token,
} from '../tokens';
import { contrastRatio, contrastRequirements } from '../tokens/contrast';
import styles from './foundations.module.css';

interface ThemeProps {
  brand: Brand;
  theme: Theme;
}

const brandLabel: Record<Brand, string> = { calm: 'Calm', warm: 'Warm' };
const byGroup = (group: string): Token[] => primitiveTokens.filter((t) => t.path[0] === group);
const raw = (token: Token): string => String(resolveTokenValue(token));
const remToPx = (value: string): string =>
  value.endsWith('rem') ? `${Number.parseFloat(value) * 16}px` : value;

function Page({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Foundations</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.intro}>{intro}</p>
      </header>
      {children}
    </main>
  );
}

function Section({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {intro && <p className={styles.muted}>{intro}</p>}
      {children}
    </section>
  );
}

/* ---------- Colors ---------- */

const readableOn = (hex: string): string =>
  contrastRatio('#FFFFFF', hex) >= contrastRatio('#13181E', hex) ? '#FFFFFF' : '#13181E';

function colorScales(): [string, Token[]][] {
  const scales = new Map<string, Token[]>();
  for (const token of byGroup('color')) {
    const [, scale, step] = token.path;
    if (!scale || !step) continue; // skip single values like color.white
    scales.set(scale, [...(scales.get(scale) ?? []), token]);
  }
  return [...scales];
}

export function ColorsPage({ brand, theme }: ThemeProps) {
  const semantic = getSemanticTokens(brand, theme);
  const resolved = resolveTheme(brand, theme);

  return (
    <Page
      title="Color"
      intro={`Semantic colors for ${brandLabel[brand]} in ${theme} mode. Components only use these; switch Brand and Theme in the toolbar to see them change.`}
    >
      <Section title="Semantic tokens">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">CSS variable</th>
                <th scope="col">Points to</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {semantic.map((token) => (
                <tr key={token.name}>
                  <td>
                    <span className={styles.tokenName}>
                      <span
                        aria-hidden="true"
                        className={styles.swatch}
                        style={{ background: `var(${token.cssVar})` }}
                      />
                      {token.path.slice(1).join('-')}
                    </span>
                    {token.description && (
                      <span className={styles.description}>{token.description}</span>
                    )}
                  </td>
                  <td>
                    <code>{token.cssVar}</code>
                  </td>
                  <td>
                    <code>{getReference(token.value)}</code>
                  </td>
                  <td>
                    <code>{resolved[token.name]}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Contrast checks"
        intro="WCAG 2.1 AA: 4.5:1 for text, 3:1 for borders, focus rings and icons. These same checks run in CI."
      >
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Preview</th>
                <th scope="col">Pair</th>
                <th scope="col">Used for</th>
                <th scope="col">Ratio</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {contrastRequirements.map(({ foreground, background, minimum, use }) => {
                const fg = resolved[`color.${foreground}`] ?? '#000000';
                const bg = resolved[`color.${background}`] ?? '#FFFFFF';
                const ratio = contrastRatio(fg, bg);
                const pass = ratio >= minimum;
                return (
                  <tr key={`${foreground}-${background}`}>
                    <td>
                      <span
                        aria-hidden="true"
                        className={styles.pairPreview}
                        style={{ color: fg, background: bg, borderColor: fg }}
                      >
                        Aa
                      </span>
                    </td>
                    <td>
                      <code>{foreground}</code> on <code>{background}</code>
                    </td>
                    <td>{use}</td>
                    <td>
                      {ratio.toFixed(2)}:1 <span className={styles.muted}>(min {minimum}:1)</span>
                    </td>
                    <td>
                      <span className={pass ? styles.pass : styles.fail}>
                        {pass ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Primitive scales"
        intro="Raw palette shared by both brands. Semantic tokens pick from these."
      >
        <div className={styles.scales}>
          {colorScales().map(([scale, tokens]) => (
            <div key={scale}>
              <h3 className={styles.scaleTitle}>{scale}</h3>
              <ol className={styles.ramp}>
                {tokens.map((token) => {
                  const hex = raw(token);
                  return (
                    <li
                      key={token.name}
                      className={styles.step}
                      style={{ background: hex, color: readableOn(hex) }}
                    >
                      <span>{token.path[2]}</span>
                      <span className={styles.hex}>{hex}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}

/* ---------- Typography ---------- */

const SAMPLE = 'How are you feeling today?';

export function TypographyPage() {
  return (
    <Page
      title="Typography"
      intro="A modest, rem-based scale so text grows with the reader's browser font-size setting."
    >
      <Section title="Type scale">
        <ul className={styles.list}>
          {byGroup('font-size').map((token) => (
            <li key={token.name} className={styles.typeRow}>
              <span className={styles.meta}>
                <code>{token.cssVar}</code>
                <span className={styles.muted}>
                  {raw(token)} · {remToPx(raw(token))}
                </span>
              </span>
              <span style={{ fontSize: `var(${token.cssVar})`, lineHeight: 1.25 }}>{SAMPLE}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Font weights">
        <ul className={styles.list}>
          {byGroup('font-weight').map((token) => (
            <li key={token.name} className={styles.typeRow}>
              <span className={styles.meta}>
                <code>{token.cssVar}</code>
                <span className={styles.muted}>{raw(token)}</span>
              </span>
              <span
                style={{ fontWeight: `var(${token.cssVar})`, fontSize: 'var(--mb-font-size-xl)' }}
              >
                {SAMPLE}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Line heights">
        <ul className={styles.list}>
          {byGroup('line-height').map((token) => (
            <li key={token.name} className={styles.typeRow}>
              <span className={styles.meta}>
                <code>{token.cssVar}</code>
                <span className={styles.muted}>{raw(token)}</span>
              </span>
              <p className={styles.paragraph} style={{ lineHeight: `var(${token.cssVar})` }}>
                Small check-ins add up. Noticing how you feel, without judging it, is the first step
                toward understanding your patterns over time.
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}

/* ---------- Spacing ---------- */

export function SpacingPage() {
  return (
    <Page
      title="Spacing"
      intro="A 4px base scale. Token keys are multiples of 4px, so space-4 is 16px."
    >
      <Section title="Space">
        <ul className={styles.list}>
          {byGroup('space').map((token) => (
            <li key={token.name} className={styles.spaceRow}>
              <code className={styles.spaceName}>{token.cssVar}</code>
              <span className={styles.spaceValue}>{raw(token)}</span>
              <span
                aria-hidden="true"
                className={styles.spaceBar}
                style={{ width: `var(${token.cssVar})` }}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Radius">
        <ul className={styles.tiles}>
          {byGroup('radius').map((token) => (
            <li key={token.name} className={styles.tile}>
              <span
                aria-hidden="true"
                className={styles.radiusSample}
                style={{ borderRadius: `var(${token.cssVar})` }}
              />
              <code>{token.path[1]}</code>
              <span className={styles.muted}>{raw(token)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Shadow">
        <ul className={styles.tiles}>
          {byGroup('shadow').map((token) => (
            <li key={token.name} className={styles.tile}>
              <span
                aria-hidden="true"
                className={styles.shadowSample}
                style={{ boxShadow: `var(${token.cssVar})` }}
              />
              <code>{token.path[1]}</code>
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}
