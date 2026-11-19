// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist', 'storybook-static', 'coverage']),

  js.configs.recommended,

  // Type-aware TypeScript rules: catches real bugs (floating promises, unsafe any...).
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  { files: ['**/*.js'], extends: [tseslint.configs.disableTypeChecked] },

  // React + accessibility rules for UI code.
  {
    files: ['src/**/*.{ts,tsx}', '.storybook/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, jsxA11y.flatConfigs.strict],
    languageOptions: { globals: globals.browser },
    rules: {
      // The strict preset forbids interactive roles on these elements, but W3C
      // "ARIA in HTML" permits these pairs, and our components rely on them:
      //   fieldset → radiogroup  (RadioGroup, MoodPicker: aria-invalid/required on the group)
      //   table → grid, td → gridcell  (Calendar: the WAI-ARIA date picker grid pattern)
      // Every other combination stays forbidden.
      'jsx-a11y/no-noninteractive-element-to-interactive-role': [
        'error',
        { fieldset: ['radiogroup'], table: ['grid'], td: ['gridcell'] },
      ],
    },
  },

  // Storybook best practices for *.stories.tsx files.
  storybook.configs['flat/recommended'],

  // Node scripts and config files.
  {
    files: ['scripts/**/*.ts', '*.{js,ts}'],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },

  // Must be last: turns off rules that would fight with Prettier's formatting.
  prettier,
);
