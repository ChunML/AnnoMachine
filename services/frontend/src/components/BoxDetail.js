import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BoxCoord from './BoxCoord';
import BoxEditForm from './BoxEditForm';
import Label from './Label';
import LabelEditForm from './LabelEditForm';

class BoxDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boxIsDrawn: false,
      editMode: false,
      coords: {
        id: props.box.id,
        label: props.box.label,
        x_min: Math.floor(props.box.x_min),
        y_min: Math.floor(props.box.y_min),
        x_max: Math.floor(props.box.x_max),
        y_max: Math.floor(props.box.y_max),
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleEyeIconClick = this.handleEyeIconClick.bind(this);
    this.handleCheckIconClick = this.handleCheckIconClick.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState(prev => ({
      coords: {
        ...prev.coords,
        [name]: name === 'label' ? value : parseFloat(value) || 0
      }
    }), () => this.props.onCheckIconClick(this.state.coords));
  }

  handleEyeIconClick() {
    const { box, onEyeIconClick } = this.props;
    this.setState(prev => ({
      boxIsDrawn: !prev.boxIsDrawn
    }));

    onEyeIconClick(box);
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
    const { box } = this.props;

    const { editMode, coords } = this.state;

    return (
      <div className="ui segment" key={ box.id }>
        <div className="ui center aligned two column divided grid">
          <div className="row" style={{ alignItems: 'center' }}>
            <div className="column">
              { editMode ? (
                <LabelEditForm
                  label={ box.label }
                  onInputChange={ this.handleInputChange }
                />) : (
                <Label label={ box.label } />
              )}
            </div>
            <div className="column">
              <span>
                <button
                  className={`circular ${this.state.boxIsDrawn ? 'positive' : 'grey'} ui icon button`}
                  onClick={ this.handleEyeIconClick }
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
                    className='circular red ui icon button'
                    onClick={ this.toggleEditMode }
                  >
                    <i className="edit icon"></i>
                  </button>
                )}
              </span>
            </div>
          </div>
          <div className="row" style={{ paddingTop: '0' }}>
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