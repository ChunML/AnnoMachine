import React from 'react';

interface AddImageFormProps {
  onButtonClick(data: AddImageFormStates): void;
}

interface AddImageFormStates {
  image_url: string;
  image_file: null | File;
}

class AddImageForm extends React.Component<AddImageFormProps, AddImageFormStates> {
  fileInput: React.RefObject<HTMLInputElement>;
  constructor(props: AddImageFormProps) {
    super(props);

    this.state = {
      image_url: '',
      image_file: null,
    };

    this.fileInput = React.createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleInputChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({
      image_url: e.currentTarget.value,
    });
  }

  handleFileUpload(e: React.FormEvent<HTMLInputElement>) {
    if (!e.currentTarget.files?.length) return;
    const file = e.currentTarget.files[0];
    this.setState({
      image_file: file,
    });
  }

  handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
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

export default AddImageForm;
