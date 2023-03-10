import { RoomLogin } from '../components/RoomLogin'

export function LoginPage({ enterRoom, newRoom }) {

    return (
        <>
            <div>Discription of what do</div>
            <RoomLogin newRoom={newRoom} enterRoom={enterRoom} /> 
        </>
    )
}