import type { StorybookConfig } from '@storybook/react-vite';

const isDtsPlugin = (plugin: unknown): boolean =>
  typeof plugin === 'object' &&
  plugin !== null &&
  'name' in plugin &&
  typeof plugin.name === 'string' &&
  plugin.name.includes('dts');

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  core: { disableTelemetry: true },
  // Storybook reuses vite.config.ts. Drop the library-only parts (lib mode, .d.ts generation).
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: viteConfig.plugins?.flat().filter((plugin) => !isDtsPlugin(plugin)),
    build: { ...viteConfig.build, lib: false },
  }),
};

export default config;
