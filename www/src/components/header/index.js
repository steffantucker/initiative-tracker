import { h } from 'preact';
import { Link } from 'preact-router/match';
import { AuthContext, useAuth } from '../app'
import style from './style.css';

export default function Header() {
	const { user, setUser } = useAuth()

	return (
		<header class={style.header}>
			<Link activeClassName={style.active} href="/">
				<h1>initi.at</h1>
			</Link>
			{user &&
			<nav>
				<Link activeClassName={style.active} href="/profile">{user}</Link>
				<Link activeClassName={style.active} onClick={() => setUser(null)}>leave</Link>
			</nav>}
		</header>)
}
