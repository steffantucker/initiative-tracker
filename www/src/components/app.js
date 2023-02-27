import { createContext, h } from 'preact';
import { Router } from 'preact-router';
import { useContext, useMemo, useState } from 'preact/hooks';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Profile from '../routes/profile';

export const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

function App() {
	const [user, setUser] = useState('bob')

	const auth = useMemo(() => {
		return {user, setUser}
	}, [user])

	return (
		<AuthContext.Provider value={auth} id="app">
			<Header />
			<Router>
				<Home path="/" />
				<Profile path="/profile/" />
				<Profile path="/profile/:user" />
			</Router>
		</AuthContext.Provider>
	)
}

export default App;
