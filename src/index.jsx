import 'preact/debug'

import { useReducer } from 'preact/hooks';
import { TurnsInitialState, TurnsReducer } from './lib/Turns';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { ActorPage } from './pages/ActorPage';

import './style';
import { UserInitialState, UserReducer } from './lib/User';

export default function App() {
	// TODO: move this to ActorPage?
	const [turns, dispatch] = useReducer(TurnsReducer, TurnsInitialState);
	const [user, userDispatch] = useReducer(UserReducer, UserInitialState);
	if (user.room === 'tester' && turns.actors.length === 0) dispatch({type: 'enterroom', value: 'tester'})
	return (
		<>
		{user.room ? 
			<>
				<Header room={user.room} onLogout={() => userDispatch({type: 'leaveroom'})} />
				<ActorPage turns={turns} dispatch={dispatch} isDM={user.isDM} />
			</>
			:
			<>
				<Header />
				<LoginPage state={user} dispatch={userDispatch} />
			</>
		}
		</>
	);
}
