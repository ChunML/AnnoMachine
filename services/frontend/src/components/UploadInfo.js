import React from 'react';
import PropTypes from 'prop-types';

function UploadInfo({ username, uploaded_at }) {
  return (
    <div className="segment">
      <p>
        Author:{' '}
        <span style={{ color: 'tomato', fontSize: '1.6rem' }}>{username}</span>
      </p>
      <p>
        Uploaded at:{' '}
        <span style={{ color: 'chocolate', fontStyle: 'italic' }}>
          {uploaded_at}
        </span>
      </p>
    </div>
  );
}

UploadInfo.propTypes = {
  username: PropTypes.string.isRequired,
  uploaded_at: PropTypes.string.isRequired,
};

export default UploadInfo;
