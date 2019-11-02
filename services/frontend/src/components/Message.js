import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ type, text }) => (
  <div className={`${type} message`}>
    <div className="header">{type.toUpperCase()}</div>
    <p>{text}</p>
  </div>
);

Message.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Message;
