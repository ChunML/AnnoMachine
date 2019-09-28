import React from 'react';

function NavBar(props) {
  return (
    <div className="ui inverted menu">
      <a className="active item" href="/">
        Home
      </a>
      <a className="item">
        Profile
      </a>
      <div className="right menu">
        <a className="item">
          Register
        </a>
        <a className="item">
          Log In
        </a>
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

export default NavBar;