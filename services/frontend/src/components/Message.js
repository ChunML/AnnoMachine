import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ type, text, onCloseMessage }) => (
  <div
    className={`${type} message`}
  >
    <div className="header">{type.toUpperCase()}</div>
    <i className="close icon" onClick={onCloseMessage}></i>
    <p>{text}</p>
  </div>
);

Message.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onCloseMessage: PropTypes.func.isRequired,
};

export default Message;
