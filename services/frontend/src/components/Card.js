import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaClone, FaInfoCircle, FaTrashAlt } from 'react-icons/fa';

function Card({ image, currentUser, onDeleteImage }) {
  const [detectImage, toggleDetectImage] = useState(true);

  return (
    <div className="grid-item" style={{ textAlign: 'left' }}>
      <div className="card">
        <Link
          to={`/images/${image.name.replace('.jpg', '')}`}
          className="image"
        >
          <img
            src={`${process.env.REACT_APP_API_URL}/api/${
              detectImage ? 'detects' : 'uploads'
            }/${image.name}`}
            alt="detect result or original"
          />
        </Link>
        <div className="content">
          <div>
            <FaClone
              color={detectImage ? '#33ff33' : ''}
              onClick={() => toggleDetectImage(!detectImage)}
            />
            <Link
              to={`/images/${image.name.replace('.jpg', '')}`}
              className="ui image"
            >
              <FaInfoCircle color="#33ff33" />
            </Link>
            {currentUser === image.user.username && (
              <FaTrashAlt
                color="red"
                onClick={() => onDeleteImage(image.name.replace('.jpg', ''))}
              />
            )}
          </div>
          <div className="description">
            This image may contain:{' '}
            {image.boxes.length > 0 ? (
              [...new Set(image.boxes.map(box => box.label))].map(
                (label, id) => (
                  <span key={id} className="label">
                    {label}
                  </span>
                )
              )
            ) : (
              <div className="label">nothing</div>
            )}
          </div>
        </div>
        <div className="extra-content">
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
