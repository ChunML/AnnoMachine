import React from 'react';
import PropTypes from 'prop-types';

function BoxCoord({ coords }) {
  return (
    <React.Fragment>
      <span className="box-coord">{Math.floor(coords.x_min)}</span>
      <span className="box-coord">{Math.floor(coords.y_min)}</span>
      <span className="box-coord">{Math.floor(coords.x_max)}</span>
      <span className="box-coord">{Math.floor(coords.y_max)}</span>
    </React.Fragment>
  );
}

BoxCoord.propTypes = {
  coords: PropTypes.object.isRequired,
};

export default BoxCoord;
