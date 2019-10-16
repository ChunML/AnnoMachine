import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BoxCoord from './BoxCoord';
import BoxEditForm from './BoxEditForm';

class BoxDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      coords: {
        id: props.box.id,
        label: props.box.label,
        x_min: props.box.x_min,
        y_min: props.box.y_min,
        x_max: props.box.x_max,
        y_max: props.box.y_max,
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckIconClick = this.handleCheckIconClick.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState(prev => ({
      coords: {
        ...prev.coords,
        [name]: parseInt(value)
      }
    }));
  }

  handleCheckIconClick() {
    this.toggleEditMode();
    this.props.onCheckIconClick(this.state.coords);
  }

  toggleEditMode() {
    this.setState(prev => ({
      editMode: !prev.editMode
    }));
  }

  render() {
    const { box, onEyeIconClick } = this.props;

    const { editMode, coords } = this.state;

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
                { editMode ? (
                  <button
                    className='circular positive ui icon button'
                    onClick={ this.handleCheckIconClick }
                  >
                    <i className="check icon"></i>
                  </button> ) : (
                  <button
                    className='circular positive ui icon button'
                    onClick={ this.toggleEditMode }
                  >
                    <i className="edit icon"></i>
                  </button>
                )}
              </span>
            </div>
          </div>
          <div className="row">
            { editMode ? (
              <BoxEditForm
                coords={ coords }
                onInputChange={ this.handleInputChange } />
              ) : <BoxCoord coords={ coords } /> }
          </div>
        </div>
      </div>
    );
  }
}

BoxDetail.propTypes = {
  box: PropTypes.object.isRequired,
  onEyeIconClick: PropTypes.func.isRequired
};

export default BoxDetail;