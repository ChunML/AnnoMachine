import React from 'react';
import NavBar from './components/NavBar';
import Container from './components/Container';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isLoading: false
    };

    this.getImages = this.getImages.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
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
    fetch(
      `${process.env.REACT_APP_API_URL}/api/images/`, {
        method: 'POST',
        body: data,
      }).then(res => this.getImages());
  }

  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Container
          onButtonClick={ this.handleImageUpload }
          images={ this.state.images }
          isLoading={ this.state.isLoading }
        />
      </React.Fragment>
    );
  }
}

export default App;