import { useState } from 'preact/hooks'
import { Button } from './Button';
import { TurnsReducer } from '../lib/Turns'

export function RoomLogin({ newRoom, enterRoom}) {
    const [code, setCode] = useState('');

    return (
        <div className='roomlogin'>
            <input id='roomcode' type='text' placeholder="room code" value={code} onChange={e => setCode(e.target.value)} />
            {code === '' ?
                <Button label='New Room' onClick={newRoom} primary /> 
                :
                <Button label='Enter room' onClick={() => enterRoom(code)} primary />
            }
        </div>
    )
}