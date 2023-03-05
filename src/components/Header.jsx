import PropTypes from 'prop-types';

import { Button } from './Button';
// TODO: move buttons to only when there is a room code
export const Header = ({ room, user, onLogout, onEditAccount }) => (
  <header>
    <div className="wrapper">
      <div>
        <h1>{room ? room : <span className="logo"><span className="turns">turns</span><span className='fyi'>fyi</span></span>}</h1>
      </div>
      <div>
            <Button primary size="small" onClick={onEditAccount} label='name' />
            <Button size="small" onClick={onLogout} label="exit" />
      </div>
    </div>
  </header>
);

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onEditAccount: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};
