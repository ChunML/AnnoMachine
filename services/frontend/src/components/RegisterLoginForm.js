import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import validator from 'validator';
import { formRules } from './utils/form-rules';

class RegisterLoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      valid: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  validateForm() {
    const { username, password } = this.state;

    formRules[0].valid = !!validator.isLength(username, { min: 5 });
    formRules[1].valid = !!validator.isHalfWidth(username);
    formRules[2].valid = !!validator.isLength(password, { min: 8 });

    this.setState({
      valid: formRules.reduce((res, cur) => ({ valid: res.valid && cur.valid }))
        .valid,
    });
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value,
      },
      () => this.validateForm()
    );
  }

  handleButtonClick(e) {
    e.preventDefault();
    const { onButtonClick, formType } = this.props;

    onButtonClick(this.state, formType);
  }

  render() {
    const { isAuthenticated, formType } = this.props;
    const { username, password, valid } = this.state;
    if (isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <div className="container column" style={{ margin: '30px auto' }}>
        <ul style={{ listStyle: 'none', display: 'block' }}>
          {formRules.map(rule => (
            <li
              key={rule.id}
              style={{ color: rule.valid ? '#11CC11' : '#EE1233' }}
            >
              {rule.valid && '✔'}
              {rule.message}
            </li>
          ))}
        </ul>
        <div className="form">
          <div className="input-field">
            <input
              name="username"
              type="text"
              placeholder="Enter a username"
              value={username}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input-field">
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
            className={`button${valid ? ' primary' : ''}`}
            onClick={this.handleButtonClick}
            disabled={!valid}
          >
            {formType === 'register' ? 'Register' : 'Log In'}
          </button>
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
