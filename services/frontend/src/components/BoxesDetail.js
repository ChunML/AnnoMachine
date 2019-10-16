import React from 'react';
import PropTypes from 'prop-types';
import BoxDetail from './BoxDetail';

function BoxesDetail({ boxes, onEyeIconClick, onCheckIconClick }) {
  return (
    <div className='ui segments'>
      { boxes.map(box => (
        <BoxDetail
          key={ box.id }
          box={ box }
          onEyeIconClick={ onEyeIconClick }
          onCheckIconClick={ onCheckIconClick }
        />
      ))}
    </div>
  );
}

BoxesDetail.propTypes = {
  boxes: PropTypes.array.isRequired,
  onEyeIconClick: PropTypes.func.isRequired,
  onCheckIconClick: PropTypes.func.isRequired
};

export default BoxesDetail;