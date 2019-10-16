import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BoxCoord from './BoxCoord';
import BoxEditForm from './BoxEditForm';

function BoxDetail({ box, onEyeIconClick }) {
  const [editMode, toggleEditMode] = useState(false);
  const labelStyle = {
    color: 'firebrick',
    letterSpacing: '0.25rem'
  };

  return (
    <div className="ui segment" key={ box.id }>
      <div className="ui center aligned two column divided grid">
        <div className="row">
          <div className="column">
            <span
              className="ui header"
              style={labelStyle}
            >
              { box.label }
            </span>
          </div>
          <div className="column">
            <span>
              <button
                className='circular positive ui icon button'
                onClick={ () => onEyeIconClick(box) }
              >
                <i
                  className="eye icon"
                ></i>
              </button>
              <button
                className='circular positive ui icon button'
                onClick={ () => toggleEditMode(!editMode) }
              >
                <i className="edit icon"></i>
              </button>
            </span>
          </div>
        </div>
        <div className="row">
          { editMode ? <BoxEditForm box={ box } /> : <BoxCoord box={ box } /> }
        </div>
      </div>
    </div>
  );
}

BoxDetail.propTypes = {
  box: PropTypes.object.isRequired,
  onEyeIconClick: PropTypes.func.isRequired
};

export default BoxDetail;