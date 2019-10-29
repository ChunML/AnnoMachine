import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ type, text }) => (
  <div
    className={`ui ${type} message`}
    style={{ width: '80%', margin: 'auto' }}
  >
    {text}
  </div>
);

Message.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Message;
