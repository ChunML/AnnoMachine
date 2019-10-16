import React from 'react';
import PropTypes from 'prop-types';

function BoxCoord({ coords }) {
  const coordStyle = {
    padding: '5px 10px',
    color: 'maroon',
    letterSpacing: '0.2rem',
    background: 'powderblue',
    borderRadius: '4px',
    margin: '5px',
  };

  return (
    <React.Fragment>
      <span style={ coordStyle }>{ Math.floor(coords.x_min) }</span>
      <span style={ coordStyle }>{ Math.floor(coords.y_min) }</span>
      <span style={ coordStyle }>{ Math.floor(coords.x_max) }</span>
      <span style={ coordStyle }>{ Math.floor(coords.y_max) }</span>
    </React.Fragment>
  );
}

BoxCoord.propTypes = {
  coords: PropTypes.object.isRequired
};

export default BoxCoord;