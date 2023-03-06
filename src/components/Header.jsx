import PropTypes from 'prop-types';

import { Button } from './Button';
// TODO: move buttons to only when there is a room code
export const Header = ({ room, onLogout }) => (
  <header>
    <div className="wrapper">
      <div>
        <h1>{room ? room : <span className="logo"><span className="turns">turns</span><span className='fyi'>fyi</span></span>}</h1>
      </div>
      <div>
            <Button size="small" onClick={onLogout} label="exit" />
      </div>
    </div>
  </header>
);

Header.propTypes = {
  room: PropTypes.string,
  onLogout: PropTypes.func,
};

Header.defaultProps = {
  user: null,
};
