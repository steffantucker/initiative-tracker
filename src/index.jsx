import 'preact/debug'

import { useReducer } from 'preact/hooks';
import { TurnsInitialState, TestState, TurnsReducer } from './lib/Turns';
import { Header } from './components/Header';

import './style';
import { LoginPage } from './pages/LoginPage';
import { ActorList } from './components/ActorList';

export default function App() {
	const [turns, dispatch] = useReducer(TurnsReducer, TestState);
	return (
		<>
		{turns.roomCode ? 
			<>
				<Header room={turns.roomCode} onLogout={() => dispatch({type: 'leaveroom'})} />
				<ActorList state={turns} dispatch={dispatch} />
			</>
			:
			<>
				<Header />
				<LoginPage state={turns} dispatch={dispatch} />
			</>
		}
		</>
	);
}
