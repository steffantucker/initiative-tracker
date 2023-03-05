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
