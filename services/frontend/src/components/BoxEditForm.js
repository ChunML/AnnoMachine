import React from 'react';
import PropTypes from 'prop-types';

function BoxEditForm({ coords, onInputChange }) {
  const { x_min, y_min, x_max, y_max } = coords;

  return (
    <div className="row space-around">
      <div className="input-field one-forth">
        <input
          type="text"
          name="x_min"
          value={x_min}
          onChange={onInputChange}
        />
      </div>
      <div className="input-field one-forth">
        <input
          type="text"
          name="y_min"
          value={y_min}
          onChange={onInputChange}
        />
      </div>
      <div className="input-field one-forth">
        <input
          type="text"
          name="x_max"
          value={x_max}
          onChange={onInputChange}
        />
      </div>
      <div className="input-field one-forth">
        <input
          type="text"
          name="y_max"
          value={y_max}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
}

BoxEditForm.propTypes = {
  coords: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default BoxEditForm;
