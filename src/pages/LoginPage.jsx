import { RoomLogin } from '../components/RoomLogin'

export function LoginPage({ dispatch }) {
    const enterRoom = (code) => {
        dispatch({type: 'joinroom', value: code})
    }
    const newRoom = () => {
        dispatch({type: 'newroom'})
    }

    return (
        <>
            <div>Discription of what do</div>
            <RoomLogin newRoom={newRoom} enterRoom={enterRoom} /> 
        </>
    )
}