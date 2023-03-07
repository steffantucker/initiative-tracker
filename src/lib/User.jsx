import { generateCode } from "./Utils";

export const UserInitialState = {
    name: '',
    room: '',
    isDM: false
}

export const TestState = {
    name: 'testuser',
    room: 'tester',
    isDM: true
}

export function UserReducer(state, action) {
    switch (action.type) {
        case 'login':
            return loadUser()
        case 'logout':
            return saveUser(UserInitialState);
        case 'joinroom':
            console.log(action)
            if (action.value === 'tester')
                return saveUser({...TestState, room: 'tester'}); 
            if (state.loaded)
                return saveUser({...state, room: action.value});
            return saveUser({...loadUser(), room: action.value});
        case 'newroom':
            return saveUser({...loadUser(), room: generateCode(), isDM: true});
        case 'leaveroom':
            return saveUser({...state, room: ''});
        case 'promote':
            return saveUser({...state, isDM: true});
    }
}

function saveUser(user) {
    localStorage.setItem('user', user);
    return user;
}

function loadUser() {
    const existingUser = localStorage.getItem('user');
    if (existingUser)
        return existingUser;
    const newUser = {...UserInitialState, name: generateCode()};
    localStorage.setItem('user', newUser);
    return newUser;
}
