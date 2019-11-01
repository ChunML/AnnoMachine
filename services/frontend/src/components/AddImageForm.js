import React from 'react';
import PropTypes from 'prop-types';

class AddImageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image_url: '',
      image_file: '',
    };

    this.fileInput = React.createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    this.setState({
      image_file: file,
    });
  }

  handleButtonClick(e) {
    e.preventDefault();
    const { onButtonClick } = this.props;
    const data = { ...this.state };
    if (this.fileInput.current) {
      this.fileInput.current.value = '';
    }
    this.setState({
      image_url: '',
      image_file: null,
    });
    onButtonClick(data);
  }

  render() {
    const { image_url } = this.state;
    return (
      <form className="form" encType="multipart/form-data">
        <div className="input-field">
          <input
            name="image_file"
            type="file"
            onChange={this.handleFileUpload}
            ref={this.fileInput}
          />
        </div>
        <div className="input-field">
          <input
            name="image_url"
            type="text"
            placeholder="Or enter an image URL"
            value={image_url}
            onChange={this.handleInputChange}
          />
        </div>
        <button
          className="primary button"
          type="submit"
          onClick={this.handleButtonClick}
        >
          Submit
        </button>
      </form>
    );
  }
}

AddImageForm.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
};

export default AddImageForm;
