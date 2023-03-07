import { generateCode } from './Utils';

export const TurnsInitialState = {
    actors: [],
    currentTurnIndex: 0,
    currentActorID: 0,
    nextID: 0
}

export const TestState = {
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

function sortActors(actors, isDM) {
    return actors
        .filter((a) => isDM || !a.isHidden)
        .sort((a, b) => b.initiative - a.initiative)
}

export function TurnsReducer(state, action) {
    switch (action.type) {
        case 'addActor':
            let newActor = {...action.value, id: state.nextID}
            return {...state, actors: sortActors([...state.actors, newActor], action.isDM), nextID: state.nextID + 1};
        case 'loadActors':
            return {...state, actors: sortActors([...action.value], action.isDM)};
        case 'removeActor':
            return {...state, actors: state.actors.filter(a => a.id !== action.value)};
        case 'updateActor':
            const newActors = state.actors.filter(a => a.id !== action.value.id);
            newActors.push(action.value);
            sortActors(newActors, action.isDM);
            return {...state, actors: newActors, currentActorID: newActors[state.currentTurnIndex].id}
        case 'nextTurn':
            const nextIndex = (state.currentTurnIndex + 1) % state.actors.length
            return {...state, currentTurnIndex: nextIndex, currentActorID: state.actors[nextIndex].id};
        case 'reset':
            return {...state, currentTurnIndex: 0, currentActorID: state.actors[0].id};
        case 'newroom':
            return {...TurnsInitialState};
        case 'enterroom':
            console.log(action)
            if (action.value === 'tester') 
                return {...TestState}
            return {...TurnsInitialState};
        case 'leaveroom':
            return {...TurnsInitialState};
    }
    throw Error('Undefined action ' + action.type)
}
