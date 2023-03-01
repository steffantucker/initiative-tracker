import { ActorCard } from '../components/ActorCard';

export default {
  title: 'turns.fyi/ActorCard',
  component: ActorCard,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/preact/writing-docs/docs-page
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/preact/configure/story-layout
    layout: 'fullscreen',
    viewport: {
      defaultViewport: "mobile1",
    },
    actions: {
      handles: ['click .btn'],
    },
    args: {
      isCurrent: false,
      onEdit: (a) => console.log(a),
    }
  },
};

export const CurrentTurn = {
  args: {
    actor: {
      id: 0,
      name: "Dev",
      armorClass: 10,
      initiative: 13,
      maxHitPoints: 40,
      currentHitPoints: 40,
    },
    isCurrent: true,
    onEdit: (a) => console.log(a),
  },
}

export const NotCurrentTurn = {
  args: {
    actor: {
      id: 0,
      name: "Dev",
      armorClass: 10,
      initiative: 13,
      maxHitPoints: 40,
      currentHitPoints: 40,
    },
    onEdit: (a) => console.log(a),
  }
}
