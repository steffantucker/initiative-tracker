import 'preact/debug'
import { Provider } from 'react-redux';

import { Main } from './pages/Main'
import store from './store/store'
import './style';

export default function App() {
	
	return (
		<Provider store={store}>
			<Main />
		</Provider>
	);
}
