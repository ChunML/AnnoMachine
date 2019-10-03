import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Container from './components/Container';
import RegisterLoginForm from './components/RegisterLoginForm';
import LogOut from './components/LogOut';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentUser: '',
      isAuthenticated: false,
      isLoading: false,
      selectedTab: 'all',
    };

    this.getImages = this.getImages.bind(this);
    this.getLoginStatus = this.getLoginStatus.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleRegisterLoginUser = this.handleRegisterLoginUser.bind(this);
    this.handleLogoutUser = this.handleLogoutUser.bind(this);
  }

  componentDidMount() {
    this.getLoginStatus();
    this.getImages();
  }

  getLoginStatus() {
    const authToken = window.localStorage.authToken;
    fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/check-status`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      }).then(res => res.json())
        .then(res => {
          if (res.status === 'success') {
            this.setState({
              isAuthenticated: true,
              currentUser: res.username
            });
          } else {
            window.localStorage.removeItem('authToken');
          }
        });
  }

  getImages() {
    fetch(`${process.env.REACT_APP_API_URL}/api/images/`)
      .then(res => res.json())
      .then(res => this.setState({images: res.data, isLoading: false}))
  }

  handleImageUpload({ image_url, image_file }) {
    const data = new FormData();
    data.append('image_file', image_file);
    data.append('image_url', image_url);
    this.setState({isLoading: true});
    const authToken = window.localStorage.authToken;
    fetch(
      `${process.env.REACT_APP_API_URL}/api/images/`, {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      }).then(res => res.json())
        .then(res => {
          this.getImages();
      })
        .catch(err => this.setState({isLoading: false}));
  }

  handleTabChange(selectedTab) {
    this.setState({ selectedTab })
  }

  handleRegisterLoginUser(formData, formType) {
    fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/${formType}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(res => {
          if (res.auth_token !== undefined) {
            window.localStorage.setItem('authToken', res.auth_token);
            this.setState({
              isAuthenticated: true,
              currentUser: res.username
            });
          }
        })
        .catch(err => console.log(err));
  }

  handleLogoutUser() {
    window.localStorage.removeItem('authToken');
    this.setState({
      isAuthenticated: false,
      currentUser: ''
    });
  }

  render() {
    return (
      <React.Fragment>
        <NavBar
          isAuthenticated={ this.state.isAuthenticated }
        />
        <Switch>
          <Route exact path='/' render={() => (
            <Container
              onButtonClick={ this.handleImageUpload }
              images={ this.state.images }
              isLoading={ this.state.isLoading }
              isAuthenticated={ this.state.isAuthenticated }
              selectedTab={ this.state.selectedTab }
              currentUser={ this.state.currentUser }
              onTabChange={ this.handleTabChange }
            />
          )} />
          <Route exact path='/register' render={() => (
            <RegisterLoginForm
              isAuthenticated={this.state.isAuthenticated}
              formType='register'
              onButtonClick={ this.handleRegisterLoginUser }
            />
          )} />
          <Route exact path='/login' render={() => (
            <RegisterLoginForm
              isAuthenticated={this.state.isAuthenticated}
              formType='login'
              onButtonClick={ this.handleRegisterLoginUser }
            />
          )} />
          <Route exact path='/logout' render={() => (
            <LogOut
              onLogoutUser={this.handleLogoutUser}
            />
          )} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;