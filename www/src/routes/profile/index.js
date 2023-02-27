import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import { useAuth } from '../../components/app';
import style from './style.css';

const Profile = () => {
	const {user} = useAuth()
	const [time, setTime] = useState(Date.now());

	useEffect(() => {
		let timer = setInterval(() => setTime(Date.now()), 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div class={style.profile}>
			<h1>Profile: {user}</h1>
			<p>This is the user profile for a user named { user }.</p>

			<div>Local time: {new Date(time).toLocaleString()}</div>
		</div>
	);
}

export default Profile;
