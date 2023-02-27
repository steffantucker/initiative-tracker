import PropTypes from 'prop-types';

import { Button } from './Button';
import './header.css';

export const Header = ({ room, user, onLogin, onLogout, onEditAccount }) => (
  <header>
    <div className="wrapper">
      <div>
        <h1>{room ? room.code : "i-t"}</h1>
      </div>
      <div>
        {user ? (
          <>
            <Button primary size="small" onClick={onEditAccount} label={user.name} />
            <Button size="small" onClick={onLogout} label="exit" />
          </>
        ) : (
          <>
            <Button primary size="small" onClick={onLogin} label="enter" />
          </>
        )}
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
