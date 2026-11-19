import type { Meta, StoryObj } from '@storybook/react-vite';
import { brands, themes, type Brand, type Theme } from '../tokens/themes';
import { ColorsPage, SpacingPage, TypographyPage } from './foundations';

const meta = {
  title: 'Foundations',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const readGlobals = (globals: Record<string, unknown>): { brand: Brand; theme: Theme } => ({
  brand: brands.find((b) => b === globals.brand) ?? 'calm',
  theme: themes.find((t) => t === globals.theme) ?? 'light',
});

export const Colors: Story = {
  render: (_args, { globals }) => <ColorsPage {...readGlobals(globals)} />,
};

export const Typography: Story = {
  render: () => <TypographyPage />,
};

export const Spacing: Story = {
  render: () => <SpacingPage />,
};
