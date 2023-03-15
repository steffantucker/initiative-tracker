import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { leave } from '../store/room';

import { Button } from './Button';
// TODO: move buttons to only when there is a room code
export const Header = () => {
  const room = useSelector((state) => state.room.room);
  const dispatch = useDispatch();

  return (
    <header className='wrapper'>
        <div>
          <h1>{room ? room : <span className="logo"><span className="turns">turns</span><span className='fyi'>fyi</span></span>}</h1>
        </div>
        <div>
              {room && <Button size="small" onClick={() => dispatch(leave())} label="exit" />}
        </div>
    </header>
  );
}
