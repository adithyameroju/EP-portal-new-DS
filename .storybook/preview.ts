import type { Preview } from '@storybook/nextjs-vite'
import '../app/globals.css'

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