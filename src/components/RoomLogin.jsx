import { useState } from 'preact/hooks'
import { useDispatch } from 'react-redux';

import { Button } from './Button';
import { create, join } from '../store/room';

export function RoomLogin() {
    const [code, setCode] = useState('');
    const dispatch = useDispatch();

    return (
        <div className='roomlogin'>
            <input id='roomcode' type='text' placeholder="room code" value={code} onInput={e => setCode(e.target.value)} />
            {code === '' ?
                <Button label='New Room' onClick={() => dispatch(create())} primary /> 
                :
                <Button label='Enter room' onClick={() => dispatch(join(code))} primary />
            }
        </div>
    )
}