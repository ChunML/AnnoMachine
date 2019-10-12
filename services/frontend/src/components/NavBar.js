import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function NavBar({ isAuthenticated }) {
  return (
    <div className="ui inverted menu">
      <div className="active item">
          <Link to='/'>Home</Link>
      </div>
      <div className="right menu">
        { isAuthenticated && (
          <div className="item">
            <Link to='/logout'>Log Out</Link>
          </div>
        )}
        { !isAuthenticated && (
          <React.Fragment>
            <div className="item">
              <Link to='/register'>Register</Link>
            </div>
            <div className="item">
              <Link to='/login'>Log In</Link>
            </div>
          </React.Fragment>
        )}
        <div className="item">
          <div className="ui icon input">
            <input type="text" placeholder="Search tag..." />
            <i className="search icon"></i>
          </div>
        </div>
      </div>
    </div>
  )
}

NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export default NavBar;