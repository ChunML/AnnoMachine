import React from 'react';
import PropTypes from 'prop-types';

class AddImageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image_url: '',
      image_file: ''
    };

    this.fileInput = React.createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    this.setState({
      image_file: file
    })
  }

  handleButtonClick(e) {
    e.preventDefault();
    const data = { ...this.state };
    this.fileInput.current.value = '';
    this.setState({
      image_url: '',
      image_file: null
    });
    this.props.onButtonClick(data);
  }

  render() {
    return (
      <form
        className="ui form"
        encType="multipart/form-data"
      >
        <div className="field">
          <input
            name="image_file"
            type="file"
            onChange={ this.handleFileUpload }
            ref={ this.fileInput }
          />
        </div>
        <div className="field">
          <input
            name="image_url"
            type="text"
            placeholder="Enter an image URL"
            value={ this.state.image_url }
            onChange={ this.handleInputChange }
          />
        </div>
        <div className="field">
          <div className="ui checkbox">
            <input name="is_private" type="checkbox" />
            <label>Private</label>
          </div>
        </div>
        <button
          className="ui primary button"
          type="submit"
          onClick={ this.handleButtonClick }
        >
          Submit
        </button>
      </form>
    )
  }
}

AddImageForm.propTypes = {
  onButtonClick: PropTypes.func.isRequired
};

export default AddImageForm;