import React from 'react';
import { Link } from 'react-router-dom';

interface LogOutProps {
  onLogoutUser(): void;
}

class LogOut extends React.Component<LogOutProps> {
  componentDidMount() {
    const { onLogoutUser } = this.props;
    onLogoutUser();
  }

  render() {
    return (
      <div
        className="ui center aligned container"
        style={{ margin: '30px auto' }}
      >
        <p>
          You are logged out. Click <Link to="/login">here</Link> to log back
          in.
        </p>
      </div>
    );
  }
}

export default LogOut;
