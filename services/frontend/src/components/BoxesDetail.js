import React from 'react';
import PropTypes from 'prop-types';
import BoxDetail from './BoxDetail';

function BoxesDetail({
  boxes,
  editModes,
  onInputChange,
  onEyeIconClick,
  onCheckIconClick,
  onTrashIconClick,
}) {
  return (
    <div className="ui segments">
      {boxes.map((box, i) => (
        <BoxDetail
          key={box.id}
          box={box}
          editMode={editModes[i]}
          onEyeIconClick={onEyeIconClick}
          onCheckIconClick={onCheckIconClick}
          onTrashIconClick={onTrashIconClick}
          onInputChange={onInputChange}
        />
      ))}
    </div>
  );
}

BoxesDetail.propTypes = {
  boxes: PropTypes.array.isRequired,
  editModes: PropTypes.array.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onEyeIconClick: PropTypes.func.isRequired,
  onTrashIconClick: PropTypes.func.isRequired,
  onCheckIconClick: PropTypes.func.isRequired,
};

export default BoxesDetail;
