import { Actor } from './Actor';

export default {
  title: 'i-t/Actor',
  component: Actor,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/preact/writing-docs/docs-page
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/preact/configure/story-layout
    layout: 'fullscreen',
  },
  argTypes: {},
};

export const CurrentTurn = {
  args: {
    actor: {
      name: "Dev",
      ac: 10,
      initiative: 13,
      hp: {
        max: 40,
        current: 40,
        temp: 4
      },
      active: true,
      visible: true
    },
    currentTurn: true,
    collapsed: false,
  }
};

export const NotCurrentTurn = {
  args: {
    actor: {
      name: "Dev",
      ac: 10,
      initiative: 13,
      hp: {
        max: 40,
        current: 40,
        temp: 4
      },
      active: true,
      visible: true
    }
  }
};

