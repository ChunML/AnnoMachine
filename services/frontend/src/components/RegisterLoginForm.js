import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class RegisterLoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleInputChange(e) {
    const {name, value} = e.target;
    this.setState({
      [name]: value
    });
  }

  handleButtonClick(e) {
    e.preventDefault();

    this.props.onButtonClick(this.state, this.props.formType);
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to = '/' />;
    }

    return (
      <div className='ui container' style={{margin: '30px auto',}}>
        <div className="ui center aligned grid">
          <div className='eight wide column'>
            <div className='ui form'>
              <div className='field'>
                <input
                  name='username'
                  type='text'
                  placeholder='Enter a username'
                  value={this.state.username}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className='field'>
                <input
                  name='password'
                  type='password'
                  placeholder='Enter a secure password'
                  value={this.state.password}
                  onChange={this.handleInputChange}
                />
              </div>
              <button
                className='ui primary button'
                onClick={this.handleButtonClick}
              >
                { this.props.formType === 'register' ? 'Register' : 'Log In' }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RegisterLoginForm.propTypes = {
  formType: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired
};

export default RegisterLoginForm;