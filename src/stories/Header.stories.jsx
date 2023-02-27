import { Header } from './Header';

export default {
  title: 'i-t/Header',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/preact/writing-docs/docs-page
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/preact/configure/story-layout
    layout: 'fullscreen',
    viewport: {
      defaultViewport: "mobile1",
    }
  },
  argTypes: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onEditAccount: { action: 'onEditAccount' },
  },
};

export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
    room: {
      code: "xIdV"
    }
  },
};

export const LoggedOut = {};
