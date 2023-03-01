/** @type { import('@storybook/preact').Preview } */
import '../src/style.css'

const preview = {
  parameters: {
    backgrounds: {
      default: "dark",
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  viewport: {
    defaultViewport: "mobile1",
  }
};

export default preview;
