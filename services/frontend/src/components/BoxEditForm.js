import React, { useState } from 'react';
import PropTypes from 'prop-types';

function BoxEditForm({ coords, onInputChange }) {
  const inputStyle = {
    border: 'none',
    outline: 'none',
    borderBottom: '1px solid gray'
  };

  const { x_min, y_min, x_max, y_max } = coords;

  return (
    <div className='ui form'>
      <div className='fields' style={{ justifyContent: 'center' }}>
        <div className='two wide field'>
          <input
            style={inputStyle}
            type='text'
            name='x_min'
            value={ x_min }
            onChange={ onInputChange } />
        </div>
        <div className='two wide field'>
          <input
            style={inputStyle}
            type='text'
            name='y_min'
            value={ y_min }
            onChange={ onInputChange } />
        </div>
        <div className='two wide field'>
          <input
            style={inputStyle}
            type='text'
            name='x_max'
            value={ x_max }
            onChange={ onInputChange } />
        </div>
        <div className='two wide field'>
          <input
            style={inputStyle}
            type='text'
            name='y_max'
            value={ y_max }
            onChange={ onInputChange } />
        </div>
      </div>
    </div>
  );
}

BoxEditForm.propTypes = {
  coords: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired
};

export default BoxEditForm;