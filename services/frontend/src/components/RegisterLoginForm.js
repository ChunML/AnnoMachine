import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class RegisterLoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  handleButtonClick(e) {
    e.preventDefault();
    const { onButtonClick, formType } = this.props;

    onButtonClick(this.state, formType);
  }

  render() {
    const { isAuthenticated, formType } = this.props;
    const { username, password } = this.state;
    if (isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <div className="ui container" style={{ margin: '30px auto' }}>
        <div className="ui center aligned grid">
          <div className="eight wide column">
            <div className="ui form">
              <div className="field">
                <input
                  name="username"
                  type="text"
                  placeholder="Enter a username"
                  value={username}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="field">
                <input
                  name="password"
                  type="password"
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={this.handleInputChange}
                />
              </div>
              <button
                type="submit"
                className="ui primary button"
                onClick={this.handleButtonClick}
              >
                {formType === 'register' ? 'Register' : 'Log In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RegisterLoginForm.propTypes = {
  isAuthenticated: PropTypes.bool,
  formType: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

RegisterLoginForm.defaultProps = {
  isAuthenticated: false,
};

export default RegisterLoginForm;
