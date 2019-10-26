import React from 'react';
import PropTypes from 'prop-types';

function Label({ label }) {
  const labelStyle = {
    color: 'firebrick',
    letterSpacing: '0.25rem',
  };

  return (
    <span className="ui header" style={labelStyle}>
      {label}
    </span>
  );
}

Label.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Label;
