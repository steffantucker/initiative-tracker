import { useReducer } from 'preact/hooks'
import { RoomLogin } from '../components/RoomLogin'

export function LoginPage({ dispatch }) {
    const enterRoom = (code) => {
        dispatch({type: 'enterroom', value: code})
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