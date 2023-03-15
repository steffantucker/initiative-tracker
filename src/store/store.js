import { configureStore } from '@reduxjs/toolkit';
import turnsReducer from './turns';
import roomReducer from './room';
import { peerMiddleware } from './peerMiddleware';

export default configureStore({
    reducer: {
        turns: turnsReducer,
        room: roomReducer,
    },
    middleware: (getDefaultMiddlware) => getDefaultMiddlware({thrunk: false}).concat(peerMiddleware()),
});
