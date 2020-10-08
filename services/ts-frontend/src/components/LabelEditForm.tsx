import React from 'react';
import PropTypes from 'prop-types';

interface LabelEditFormProps {
  label: string;
  onInputChange(e: React.FormEvent<HTMLInputElement>): void;
}

function LabelEditForm({ label, onInputChange }: LabelEditFormProps) {
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
