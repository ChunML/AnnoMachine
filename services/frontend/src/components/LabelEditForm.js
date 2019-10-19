import React from 'react';
import PropTypes from 'prop-types';

function LabelEditForm({ label, onInputChange }) {
  const inputStyle = {
    border: 'none',
    outline: 'none',
    borderBottom: '1px solid #38ACEC',
    borderRadius: '0',
    color: '#38ACEC',
    textAlign: 'center',
    fontSize: '1.2rem'
  };

  return (
    <div className='ui form'>
      <div className='field'>
        <input
          type='text'
          name='label'
          value={ label }
          onChange={ onInputChange }
          style={ inputStyle }
        />
      </div>
    </div>
  )
};

LabelEditForm.propTypes = {
  label: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired
};

export default LabelEditForm;