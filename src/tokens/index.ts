/**
 * Token model shared by the CSS build script, the tests and the Storybook Foundations page.
 *
 * Tokens follow the W3C Design Tokens (DTCG) format:
 *   - a token is any object with a `$value`
 *   - `$type` set on a group is inherited by every token inside it
 *   - `{color.slate.50}` is a reference to another token
 *
 * This file must stay free of Node and browser APIs so it runs in both.
 */
import color from './primitives/color.json' with { type: 'json' };
import radius from './primitives/radius.json' with { type: 'json' };
import shadow from './primitives/shadow.json' with { type: 'json' };
import space from './primitives/space.json' with { type: 'json' };
import typography from './primitives/typography.json' with { type: 'json' };
import calmDark from './semantic/calm.dark.json' with { type: 'json' };
import calmLight from './semantic/calm.light.json' with { type: 'json' };
import warmDark from './semantic/warm.dark.json' with { type: 'json' };
import warmLight from './semantic/warm.light.json' with { type: 'json' };

import { brands, themes, type Brand, type Theme } from './themes.ts';

export { brands, themes, type Brand, type Theme };

/** Every CSS custom property is namespaced, e.g. `--mb-color-surface`. */
export const CSS_PREFIX = 'mb';

export type TokenValue = string | number | readonly string[];

export interface Token {
  /** Path segments, e.g. ['color', 'slate', '50']. */
  path: string[];
  /** Dotted name used in references, e.g. 'color.slate.50'. */
  name: string;
  /** CSS custom property, e.g. '--mb-color-slate-50'. */
  cssVar: string;
  type: string | undefined;
  /** Raw value from JSON. May be a `{reference}`. */
  value: TokenValue;
  description: string | undefined;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const toCssVar = (path: readonly string[]): string => `--${CSS_PREFIX}-${path.join('-')}`;

/** Walk a DTCG tree and return every token in document order. */
export function flattenTokens(tree: unknown, path: string[] = [], inheritedType?: string): Token[] {
  if (!isRecord(tree)) return [];
  const groupType = typeof tree.$type === 'string' ? tree.$type : inheritedType;

  return Object.entries(tree).flatMap(([key, node]) => {
    if (key.startsWith('$') || !isRecord(node)) return [];
    const nodePath = [...path, key];

    if ('$value' in node) {
      return [
        {
          path: nodePath,
          name: nodePath.join('.'),
          cssVar: toCssVar(nodePath),
          type: typeof node.$type === 'string' ? node.$type : groupType,
          value: node.$value as TokenValue,
          description: typeof node.$description === 'string' ? node.$description : undefined,
        },
      ];
    }
    return flattenTokens(node, nodePath, groupType);
  });
}

export const primitiveTokens: Token[] = flattenTokens({
  ...color,
  ...space,
  ...radius,
  ...typography,
  ...shadow,
});

const semanticSources: Record<Brand, Record<Theme, unknown>> = {
  calm: { light: calmLight, dark: calmDark },
  warm: { light: warmLight, dark: warmDark },
};

export const getSemanticTokens = (brand: Brand, theme: Theme): Token[] =>
  flattenTokens(semanticSources[brand][theme]);

const REFERENCE = /^\{([^{}]+)\}$/;

/** Returns the referenced token name for `{a.b.c}`, otherwise undefined. */
export const getReference = (value: TokenValue): string | undefined =>
  typeof value === 'string' ? REFERENCE.exec(value)?.[1] : undefined;

const primitivesByName = new Map(primitiveTokens.map((token) => [token.name, token]));

/** Resolve a semantic token all the way down to its raw primitive value (e.g. a hex code). */
export function resolveTokenValue(token: Token): TokenValue {
  const ref = getReference(token.value);
  if (!ref) return token.value;
  const target = primitivesByName.get(ref);
  if (!target) {
    throw new Error(`Token "${token.name}" references unknown primitive "{${ref}}".`);
  }
  return resolveTokenValue(target);
}

/** Map of semantic name (e.g. 'color.surface') to resolved raw value. */
export function resolveTheme(brand: Brand, theme: Theme): Record<string, string> {
  return Object.fromEntries(
    getSemanticTokens(brand, theme).map((token) => [token.name, String(resolveTokenValue(token))]),
  );
}

const quoteFontName = (name: string): string =>
  /^[\w-]+$/.test(name) ? name : `"${name.replace(/"/g, '\\"')}"`;

/** Convert a token's value into a CSS value. References stay live as `var(...)`. */
export function toCssValue(token: Token): string {
  const ref = getReference(token.value);
  if (ref) return `var(${toCssVar(ref.split('.'))})`;
  if (Array.isArray(token.value)) return token.value.map(quoteFontName).join(', ');
  return String(token.value);
}

/**
 * Structural checks: every brand/theme defines exactly the same semantic tokens,
 * and every reference points at a real primitive. Returns a list of problems.
 */
export function validateTokens(): string[] {
  const problems: string[] = [];
  const reference = getSemanticTokens('calm', 'light').map((t) => t.name);

  for (const brand of brands) {
    for (const theme of themes) {
      const tokens = getSemanticTokens(brand, theme);
      const names = tokens.map((t) => t.name);
      for (const name of reference) {
        if (!names.includes(name)) problems.push(`${brand}.${theme} is missing "${name}".`);
      }
      for (const name of names) {
        if (!reference.includes(name))
          problems.push(`${brand}.${theme} has extra token "${name}".`);
      }
      for (const token of tokens) {
        const ref = getReference(token.value);
        if (!ref) problems.push(`${brand}.${theme} "${token.name}" must reference a primitive.`);
        else if (!primitivesByName.has(ref)) {
          problems.push(`${brand}.${theme} "${token.name}" references unknown "{${ref}}".`);
        }
      }
    }
  }
  return problems;
}
