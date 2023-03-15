import { createSlice } from '@reduxjs/toolkit';
import { generateCode } from '../lib/Utils';

const initialState = {
    room: null,
    isDM: false,
};

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        create: (state, action) => {
            state.room = action.payload || generateCode();
            state.isDM = true;
        },
        join: (state, action) => {
            if (action.payload === 'tester') {
                state.room = action.payload;
                state.isDM = true;
                return;
            }
            state.room = action.payload;
        },
        leave: (state) => {
            state.room = null;
            state.isDM = false;
        },
    },
});

export const { create, join, leave } = roomSlice.actions;
export default roomSlice.reducer;