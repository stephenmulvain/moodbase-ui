import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import '../src/styles/base.css';
import { brands, themes, type Brand, type Theme } from '../src/tokens/themes';
import './preview.css';

const isBrand = (value: unknown): value is Brand => brands.includes(value as Brand);
const isTheme = (value: unknown): value is Theme => themes.includes(value as Theme);

/**
 * Applies the toolbar choices the same way an app would: data attributes on <html>.
 * Every --mb-color-* variable then resolves to the selected brand and theme.
 */
const withBrandAndTheme: Decorator = (Story, context) => {
  const brand = isBrand(context.globals.brand) ? context.globals.brand : 'calm';
  const theme = isTheme(context.globals.theme) ? context.globals.theme : 'light';
  document.documentElement.dataset.brand = brand;
  document.documentElement.dataset.theme = theme;
  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Brand theme',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'calm', title: 'Calm' },
          { value: 'warm', title: 'Warm' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Light or dark mode',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { brand: 'calm', theme: 'light' },
  decorators: [withBrandAndTheme],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: { storySort: { order: ['Foundations', ['Colors', 'Typography', 'Spacing'], '*'] } },
  },
};

export default preview;
