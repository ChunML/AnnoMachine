import React, { useState } from "react";
import PropTypes from 'prop-types';

interface AddImageFormProps {
  onButtonClick(data: AddImageFormStates): void;
}

interface AddImageFormStates {
  image_url: string;
  image_file: null | File;
}

function AddImageForm(props: AddImageFormProps) {
  // fileInput: React.RefObject<HTMLInputElement>;
  const fileInput = React.createRef<HTMLInputElement>();
  const [image_url, setImageUrl] = useState("");
  const [image_file, setImageFile] = useState<File | null>(null);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setImageUrl(e.currentTarget.value);
  };

  const handleFileUpload = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files?.length) return;
    const file = e.currentTarget.files[0];
    setImageFile(file);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { onButtonClick } = props;
    const data = { image_url, image_file };
    setImageUrl("");
    setImageFile(null);
    if (fileInput.current) {
      fileInput.current.value = "";
    }
    onButtonClick(data);
  };

  return (
    <form className="form" encType="multipart/form-data">
      <div className="input-field">
        <input
          name="image_file"
          type="file"
          onChange={handleFileUpload}
          ref={fileInput}
        />
      </div>
      <div className="input-field">
        <input
          name="image_url"
          type="text"
          placeholder="Or enter an image URL"
          value={image_url}
          onChange={handleInputChange}
        />
      </div>
      <button
        className="primary button"
        type="submit"
        onClick={handleButtonClick}
      >
        Submit
      </button>
    </form>
  );
}

AddImageForm.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
};


export default AddImageForm;
