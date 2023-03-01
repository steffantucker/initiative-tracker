import { ActorList } from '../components/ActorList'

export default {
    title: 'turns.fyi/ActorList',
    component: ActorList,
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
    },
};

export const Empty = {
    args: {}
}

export const Populated = {
    args: {
        initialActors: [
            {
                actor: {
                    id: 1,
                    name: 'Gandalf',
                    armorClass: 18,
                    maxHitPoints: 50,
                    currentHitPoints: 38,
                    initiative: 23
                },
                isCurrent: false,
            },
            {
                actor: {
                    id: 2,
                    name: 'Aragorn',
                    armorClass: 20,
                    maxHitPoints: 80,
                    currentHitPoints: 67,
                    initiative: 19
                },
                isCurrent: false,
            },
            {
                actor: {
                    id: 3,
                    name: 'Legolas',
                    armorClass: 16,
                    maxHitPoints: 45,
                    currentHitPoints: 27,
                    initiative: 25
                },
                isCurrent: false,
            },
            {
                actor: {
                    id: 4,
                    name: 'Gimli',
                    armorClass: 19,
                    maxHitPoints: 60,
                    currentHitPoints: 45,
                    initiative: 16
                },
                isCurrent: false,
            },
        ]
    }
}