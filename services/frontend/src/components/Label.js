import React from 'react';
import PropTypes from 'prop-types';

function Label({ label }) {
  return <span className="box-label">{label}</span>;
}

Label.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Label;
