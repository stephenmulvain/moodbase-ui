import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    tone: 'info',
    title: 'Reminders are paused',
    children: 'You can turn them back on any time in Settings.',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--mb-space-3)' }}>
      <Alert tone="info" title="Reminders are paused">
        You can turn them back on any time in Settings.
      </Alert>
      <Alert tone="success" title="Entry saved">
        Nice work taking a moment for yourself.
      </Alert>
      <Alert tone="warning" title="You're offline">
        Your entries are saved on this device and will sync when you reconnect.
      </Alert>
      <Alert tone="danger" title="We couldn't save your entry">
        Check your connection and try again. Nothing you wrote has been lost.
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Tones tint gently rather than shout. Even the danger tone uses the dusty rose and reassuring copy.',
      },
    },
  },
};

export const WithoutTitle: Story = {
  args: { tone: 'success', title: undefined, children: 'Your entry was saved.' },
};

export const Dismissible: Story = {
  args: { onDismiss: fn(), dismissLabel: 'Dismiss reminder notice' },
};

function AnnounceDemo() {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 'var(--mb-space-4)', justifyItems: 'start' }}>
      <Button
        onClick={() => {
          setSaved(true);
        }}
      >
        Save entry
      </Button>
      {saved && (
        <Alert
          tone="success"
          announce
          onDismiss={() => {
            setSaved(false);
          }}
        >
          Entry saved.
        </Alert>
      )}
    </div>
  );
}

export const Announced: Story = {
  render: () => <AnnounceDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Use `announce` for alerts that appear after an action, so screen readers hear them. Success, info and warning wait politely (`role="status"`); danger interrupts (`role="alert"`).',
      },
    },
  },
};
