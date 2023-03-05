import { useReducer } from "preact/hooks";

const CODE_LENGTH = 4;

export const TurnsInitialState = {
    actors: [],
    currentTurnIndex: 0,
    currentActorID: 0,
    roomCode: '',
}

export const TestState = {
    actors: [
        {id : 5, name : "Duv",armorClass : 10,initiative : 21,maxHitPoints : 40,currentHitPoints : 40},
        {id : 2, name : "Dav",armorClass : 10,initiative : 17,maxHitPoints : 40,currentHitPoints : 40},
        {id : 0, name : "Dev",armorClass : 10,initiative : 13,maxHitPoints : 40,currentHitPoints : 40},
        {id : 3, name : "Div",armorClass : 10,initiative : 4,maxHitPoints : 40,currentHitPoints : 40},
    ], 
    currentActorID: 5, 
    currentTurnIndex: 0,
    roomCode: 'dOxl'
}

export function TurnsReducer(state, action) {
    console.log('reducer action:' + action)
    switch (action.type) {
        case 'addActor':
            return {...state, actors: [...state.actors, action.value].sort((a, b) => b.initiative - a.initiative)};
        case 'addActors':
            return {...state, actors: [...state.actors, ...action.value].sort((a, b) => b.initiative - a.initiative)};
        case 'removeActor':
            return {...state, actors: state.actors.filter(a => a.id !== action.value)};
        case 'updateActor':
            return {...state, actors: state.actors.filter(a => a.id !== action.value.id).push(action.value).sort((a, b) => b.initiative - a.initiative)}
        case 'nextTurn':
            const nextIndex = (state.currentTurnIndex + 1) % state.actors.length
            return {...state, currentTurnIndex: nextIndex, currentActorID: state.actors[nextIndex].id};
        case 'reset':
            return {...state, currentTurnIndex: 0, currentActorID: state.actors[0].id};
        case 'newroom':
            const code = generateCode();
            return {...TurnsInitialState, roomCode: code};
        case 'enterroom':
            return {...TurnsInitialState, roomCode: action.value};
        case 'leaveroom':
            return {TurnsInitialState};
    }
    throw Error('Undefined action ' + action.type)
}

function generateCode() {
    const key = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
        code += key[Math.floor(Math.random() * key.length)];
    }
    return code;
}
