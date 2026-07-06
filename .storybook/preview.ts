import type { Preview } from '@storybook/nextjs-vite'
import '../app/globals.css'

const ORDER = [
  'Introduction',
  'Introduction/Welcome',
  'Introduction/Design Principles',
  'Foundations',
  'Foundations/Color',
  'Foundations/Typography',
  'Foundations/Spacing',
  'Components',
  'Components/Button',
  'Components/Badge',
  'Components/Input',
  'Components/Card',
  'Components/Checkbox',
  'Components/Select',
  'Components/Dialog',
  'Components/Tabs',
  'Components/Alert',
  'Components/Progress',
]

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo'
    },

    options: {
      storySort: {
        order: ['Introduction', ['Welcome', 'Design Principles'], 'Foundations', ['Color', 'Typography', 'Spacing'], 'Components'],
      },
    },
  },
};

export default preview;