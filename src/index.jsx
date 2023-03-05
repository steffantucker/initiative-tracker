import 'preact/debug'

import { useReducer } from 'preact/hooks';
import { TurnsInitialState, TestState, TurnsReducer } from './lib/Turns';
import { Header } from './components/Header';

import './style';
import { LoginPage } from './pages/LoginPage';
import { ActorList } from './components/ActorList';

export default function App() {
	const [turns, dispatch] = useReducer(TurnsReducer, TestState);
	console.log(turns.roomCode)
	return (
		<>
			<Header room={turns.roomCode} user='' onLogout={() => dispatch({type: 'leaveroom'})} />
			{turns.roomCode.length === 0 ? 
				<LoginPage state={turns} dispatch={dispatch} />
				:
				<ActorList state={turns} dispatch={dispatch} />
			}
		</>
	);
}
