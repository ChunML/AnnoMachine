import React from 'react';
import PropTypes from 'prop-types';
import { MessageType } from '../App';

const Message = ({ type, text }: MessageType) => (
  <>
  {type ? (<div className={`${type} message`}>
    <div className="header">{type.toUpperCase()}</div>
    <p>{text}</p>
  </div>) : ''}
  </>
);

Message.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Message;
