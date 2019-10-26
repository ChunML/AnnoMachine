import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Card({ image, currentUser, onDeleteImage }) {
  const [detectImage, toggleDetectImage] = useState(true);

  return (
    <div className="column" style={{ textAlign: 'left' }}>
      <div className="ui card" style={{ margin: 'auto' }}>
        <Link
          to={`/images/${image.name.replace('.jpg', '')}`}
          className="ui image"
        >
          <img
            src={`${process.env.REACT_APP_API_URL}/api/${
              detectImage ? 'detects' : 'uploads'
            }/${image.name}`}
            alt="detect result or original"
          />
        </Link>
        <div className="content">
          <div style={{ marginBottom: '5px' }}>
            <i
              className="clone icon"
              style={detectImage ? { color: '#33ff33' } : {}}
              onClick={() => toggleDetectImage(!detectImage)}
            ></i>
            <Link
              to={`/images/${image.name.replace('.jpg', '')}`}
              className="ui image"
            >
              <i
                className="hand point up outline icon"
                style={{ color: '#33ff33' }}
              ></i>
            </Link>
            {currentUser === image.user.username && (
              <i
                className="trash alternate outline icon"
                style={{ color: 'red' }}
                onClick={() => onDeleteImage(image.name.replace('.jpg', ''))}
              ></i>
            )}
          </div>
          <div className="description">
            This image may contain:{' '}
            {image.boxes.length > 0 ? (
              [...new Set(image.boxes.map(box => box.label))].map(
                (label, id) => (
                  <div
                    key={id}
                    className="ui label"
                    style={{ background: '#11ee66' }}
                  >
                    {label}
                  </div>
                )
              )
            ) : (
              <div className="ui label">nothing</div>
            )}
          </div>
        </div>
        <div className="extra content">
          <div>
            Uploaded by{' '}
            <span style={{ color: 'red' }}>{image.user.username}</span> at{' '}
            {image.uploaded_at}
          </div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.object.isRequired,
  onDeleteImage: PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default Card;
