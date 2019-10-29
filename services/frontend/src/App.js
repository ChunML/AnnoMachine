import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './components/NavBar';
import Container from './components/Container';
import RegisterLoginForm from './components/RegisterLoginForm';
import LogOut from './components/LogOut';
import Message from './components/Message';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentUser: '',
      isAuthenticated: false,
      isLoading: false,
      selectedTab: 'all',
      message: {
        type: null,
        text: null,
      },
    };

    this.getImages = this.getImages.bind(this);
    this.getLoginStatus = this.getLoginStatus.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleRegisterLoginUser = this.handleRegisterLoginUser.bind(this);
    this.handleLogoutUser = this.handleLogoutUser.bind(this);
  }

  componentDidMount() {
    this.getLoginStatus();
    this.getImages();
  }

  getLoginStatus() {
    const { authToken } = window.localStorage;
    fetch(`${process.env.REACT_APP_API_URL}/api/auth/check-status`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          this.setState({
            isAuthenticated: true,
            currentUser: res.username,
          });
        } else {
          window.localStorage.removeItem('authToken');
        }
      });
  }

  getImages() {
    fetch(`${process.env.REACT_APP_API_URL}/api/images/`)
      .then(res => res.json())
      .then(res => this.setState({ images: res.data, isLoading: false }));
  }

  handleImageUpload({ image_url, image_file }) {
    const data = new FormData();
    data.append('image_file', image_file);
    data.append('image_url', image_url);
    this.setState({ isLoading: true });
    const { authToken } = window.localStorage;
    fetch(`${process.env.REACT_APP_API_URL}/api/images/`, {
      method: 'POST',
      body: data,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        this.getImages();
        if (res.status === 'fail') {
          throw new Error('Upload failed');
        }
        this.createMessage('success', 'Image has been successfully uploaded.');
      })
      .catch(err => {
        this.createMessage('fail', 'Something went wrong with the uploading.');
        this.setState({ isLoading: false });
      });
  }

  handleDeleteImage(imageName) {
    const { authToken } = window.localStorage;
    fetch(`${process.env.REACT_APP_API_URL}/api/images/${imageName}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          this.getImages();
        }
      });
  }

  handleTabChange(selectedTab) {
    this.setState({ selectedTab });
  }

  handleRegisterLoginUser(formData, formType) {
    fetch(`${process.env.REACT_APP_API_URL}/api/auth/${formType}`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.auth_token !== undefined) {
          window.localStorage.setItem('authToken', res.auth_token);
          this.setState({
            isAuthenticated: true,
            currentUser: res.username,
          });
          this.createMessage(
            'success',
            `Successfully ${
              formType === 'register' ? 'registered' : 'logged in'
            }.`
          );
        } else {
          throw new Error('Error with authentication');
        }
      })
      .catch(err => {
        this.createMessage(
          'error',
          `Something went wrong. Could not ${formType}.`
        );
      });
  }

  createMessage(type, text) {
    const { message } = this.state;
    this.setState({
      message: {
        ...message,
        type,
        text,
      },
    });
  }

  handleLogoutUser() {
    window.localStorage.removeItem('authToken');
    this.setState({
      isAuthenticated: false,
      currentUser: '',
    });
  }

  render() {
    const {
      isAuthenticated,
      images,
      isLoading,
      message,
      selectedTab,
      currentUser,
    } = this.state;
    return (
      <React.Fragment>
        <NavBar title="AnnoMachine" isAuthenticated={isAuthenticated} />
        {message.type && message.text && (
          <Message type={message.type} text={message.text} />
        )}
        <Switch>
          <Route
            path="/images"
            render={() => (
              <Container
                onButtonClick={this.handleImageUpload}
                images={images}
                isLoading={isLoading}
                message={message}
                isAuthenticated={isAuthenticated}
                selectedTab={selectedTab}
                currentUser={currentUser}
                onTabChange={this.handleTabChange}
                onDeleteImage={this.handleDeleteImage}
              />
            )}
          />
          <Route
            exact
            path="/register"
            render={() => (
              <RegisterLoginForm
                isAuthenticated={isAuthenticated}
                formType="register"
                onButtonClick={this.handleRegisterLoginUser}
              />
            )}
          />
          <Route
            exact
            path="/login"
            render={() => (
              <RegisterLoginForm
                isAuthenticated={isAuthenticated}
                formType="login"
                onButtonClick={this.handleRegisterLoginUser}
              />
            )}
          />
          <Route
            exact
            path="/logout"
            render={() => <LogOut onLogoutUser={this.handleLogoutUser} />}
          />
          <Route exact path="/" render={() => <Redirect to="/images" />} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
