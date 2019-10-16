import React from 'react';
import PropTypes from 'prop-types';
import BoxDetail from './BoxDetail';

function BoxesDetail({ image, onEyeIconClick }) {
  return (
    <div className='ui segments'>
      { image.boxes.map(box => (
        <BoxDetail
          key={ box.id }
          box={ box }
          onEyeIconClick={ onEyeIconClick }
        />
      ))}
    </div>
  );
}

BoxesDetail.propTypes = {
  image: PropTypes.object.isRequired,
  onEyeIconClick: PropTypes.func.isRequired
};

export default BoxesDetail;