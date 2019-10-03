import React from 'react';
import { Link } from 'react-router-dom';

class LogOut extends React.Component {
  componentDidMount() {
    this.props.onLogoutUser();
  }

  render() {
    return (
      <div className="ui center aligned container" style={{margin: '30px auto',}}>
        <p>You are logged out. Click <Link to='/login'>here</Link> to log back in.</p>
      </div>
    );
  }
}

export default LogOut;