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
        order: [
          'Introduction',
          ['Welcome', 'Getting Started', 'Design Principles', 'Working with Compass',
            ['Overview', 'Choosing a Component', 'Common Tasks', 'The Figma → Code Loop', 'Working with AI'],
            'Changelog'],
          'Foundations',
          ['Color', 'Typography', 'Spacing', 'Radius', 'Elevation', 'Motion'],
          'Atoms',
          'Molecules',
          'Organisms',
          'Templates',
          'Patterns',
          'Components',
        ],
      },
    },
  },
};

export default preview;