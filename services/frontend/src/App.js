import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Container from './components/Container';
import RegisterLoginForm from './components/RegisterLoginForm';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isAuthenticated: false,
      isLoading: false
    };

    this.getImages = this.getImages.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleRegisterLoginUser = this.handleRegisterLoginUser.bind(this);
  }

  componentDidMount() {
    this.getImages();
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
        console.log(res)
        this.getImages()
      })
        .catch(err => this.setState({isLoading: false}));
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
            this.setState({ isAuthenticated: true });
          }
        })
        .catch(err => console.log(err));
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
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;