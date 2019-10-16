import React from 'react';
import PropTypes from 'prop-types';

function BoxEditForm({ box }) {
  const inputStyle = {
    border: 'none',
    outline: 'none',
    borderBottom: '1px solid gray'
  }
  return (
    <div className='ui form'>
      <div className='fields' style={{ justifyContent: 'center' }}>
        <div className='two wide field'>
          <input style={inputStyle} type='text' name='x_min' value={ box.x_min } />
        </div>
        <div className='two wide field'>
          <input style={inputStyle} type='text' name='y_min' value={ box.y_min } />
        </div>
        <div className='two wide field'>
          <input style={inputStyle} type='text' name='x_max' value={ box.x_max } />
        </div>
        <div className='two wide field'>
          <input style={inputStyle} type='text' name='y_max' value={ box.y_max } />
        </div>
      </div>
    </div>
  );
}

BoxEditForm.propTypes = {
  box: PropTypes.object.isRequired
};

export default BoxEditForm;