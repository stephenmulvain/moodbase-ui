import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10 4v12M4 10h12" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Log mood', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'View history' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Skip for now' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete entry' },
  parameters: {
    docs: {
      description: { story: 'For destructive actions only. Never used to represent a mood.' },
    },
  },
};

export const WithIcons: Story = {
  args: { startIcon: <PlusIcon />, children: 'Add entry' },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--mb-space-3)' }}>
      <Button {...args} />
      <Button {...args} variant="secondary" startIcon={undefined} endIcon={<ArrowIcon />}>
        Continue
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: 'Save entry' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Save entry' },
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Save entry' },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mb-space-3)' }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mb-space-3)' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};
