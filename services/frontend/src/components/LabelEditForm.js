import React from 'react';
import PropTypes from 'prop-types';

function LabelEditForm({ label, onInputChange }) {
  return (
    <div className="form">
      <div className="input-field text-center">
        <input
          type="text"
          name="label"
          value={label}
          onChange={onInputChange}
          // style={inputStyle}
        />
      </div>
    </div>
  );
}

LabelEditForm.propTypes = {
  label: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default LabelEditForm;
