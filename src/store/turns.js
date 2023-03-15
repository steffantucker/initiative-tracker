import { createSlice } from '@reduxjs/toolkit';

// TODO: DRY THIS UP
// TODO: considerably faster push and sort?
// https://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
export const turnsSlice = createSlice({
    name: 'turns',
    initialState: {
        actors: [],
        currentActorID: 0,
        currentTurnIndex: 0,
        nextID: 0,
    },
    reducers: {
        next: (state) => {
            if (state.actors.length === 0) return;
            const newIndex = (state.currentTurnIndex + 1) % state.actors.length; 
            state.currentTurnIndex = newIndex;
            state.currentActorID = state.actors[newIndex].id;
        },
        add: (state, action) => {
            const newActor = action.payload;
            newActor.id = state.nextID;
            state.nextID += 1;
            state.actors.push(newActor);
            state.actors.sort(actorSort);
        },
        update: (state, action) => {
            const updatedActor = action.payload;
            const newActors = state.actors.filter((a) => a.id !== updatedActor.id);
            newActors.push(updatedActor);
            state.actors = newActors.sort(actorSort);
        },
        remove: (state, action) => {
            const id = action.payload;
            state.actors.filter((a) => a.id !== id);
        },
        loadTestState: (state) => {
            return TestState;
        },
        message: (state, action) => {
            const message = action.payload;
            console.log('parsing message', message);
            switch (message.type) {
                case 'next':
                    if (state.actors.length === 0) return;
                    const newIndex = (state.currentTurnIndex + 1) % state.actors.length; 
                    state.currentTurnIndex = newIndex;
                    state.currentActorID = state.actors[newIndex].id;
                    break;
                case 'add':
                    const newActor = action.payload;
                    newActor.id = state.nextID;
                    state.nextID += 1;
                    state.actors.push(newActor);
                    state.actors.sort(actorSort);
                    break;
                case 'update':
                    const updatedActor = action.payload;
                    const newActors = state.actors.filter((a) => a.id !== updatedActor.id);
                    newActors.push(updatedActor);
                    state.actors = newActors.sort(actorSort);
                    break;
                case 'remove':
                    const id = action.payload;
                    state.actors.filter((a) => a.id !== id);
                    break;
            }
        }
    },
    extraReducers: {
        'room/join': (state, action) => {
            if (action.payload === 'tester') return TestState;
        },
        'room/leave': (state, action) => {
            return InitialState;
        }
    }
});

const actorSort = (a, b) => {
    return b.initiative - a.initiative;
}

const TestState = {
    actors: [
        {id : 5, name : "Duv", armorClass : 10, initiative : 21, maxHitPoints : 40, currentHitPoints : 40, isHidden: false},
        {id : 2, name : "Dav", armorClass : 10, initiative : 17, maxHitPoints : 40, currentHitPoints : 40, isHidden: false},
        {id : 0, name : "Dev", armorClass : 10, initiative : 13, maxHitPoints : 40, currentHitPoints : 40, isHidden: false},
        {id : 3, name : "Div", armorClass : 10, initiative : 4, maxHitPoints : 40, currentHitPoints : 40, isHidden: false},
    ], 
    currentActorID: 5, 
    currentTurnIndex: 0,
    nextID: 6
}

const InitialState = {
    actors: [],
    currentActorID: 0,
    currentTurnIndex: 0,
    nextID: 0,
}

export const { next, add, update, remove, loadTestState } = turnsSlice.actions;
export default turnsSlice.reducer;