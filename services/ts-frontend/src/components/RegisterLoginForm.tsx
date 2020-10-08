import React from 'react';
import { Redirect } from 'react-router-dom';
import validator from 'validator';
import { formRules } from './utils/form-rules';

interface RegisterLoginFormProps {
  isAuthenticated: boolean;
  formType: string;
  onButtonClick(formData: RegisterLoginFormStates, formType: string): void;
}

interface RegisterLoginFormStates {
  username: string;
  password: string;
  valid: boolean;
}

class RegisterLoginForm extends React.Component<RegisterLoginFormProps, RegisterLoginFormStates> {
  constructor(props: RegisterLoginFormProps) {
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

    const valids = formRules.map(rule => rule.valid);

    this.setState({
      valid: valids.reduce((res, cur) => res && cur),
    });
  }

  handleInputChange(e: React.FormEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    this.setState(prevState => ({
        ...prevState,
        [name]: value,
      }),
      () => this.validateForm()
    );
  }

  handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
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

export default RegisterLoginForm;
