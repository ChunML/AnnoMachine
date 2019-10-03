import React from 'react';
import PropTypes from 'prop-types';

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detectImage: true
    };

    this.handleImageTypeChange = this.handleImageTypeChange.bind(this);
  }

  handleImageTypeChange() {
    this.setState(prevState => ({
      detectImage: !prevState.detectImage
    }));
  }

  render() {
    const { image } = this.props;
    return (
      <div className="column" style={{textAlign: 'left'}}>
        <div className="ui card" style={{margin: 'auto'}}>
          <div className="image">
            <img
              src={`${process.env.REACT_APP_API_URL}/api/${this.state.detectImage ? 'detects': 'uploads'}/${image.name}`}
              alt="Some image here"
            />
          </div>
          <div className="content">
            <div style={{marginBottom: '5px'}}>
              <i
                className="clone icon"
                style={this.state.detectImage ? {color: '#33ff33'} : {}}
                onClick={this.handleImageTypeChange}>
              </i>
              <i className="edit outline icon"></i>
            </div>
            <div className="description">This image may contain: {image.boxes.length > 0 ?
              [...new Set(image.boxes.map(box => box.label))].map((label, id) => (
                <div key={ id } className='ui label' style={{background: '#11ee66'}}>{ label }</div>
              )) :
              <div className='ui label'>nothing</div>}
            </div>
          </div>
          <div className="extra content">
            <div>Uploaded by <span style={{color: 'red'}}>{ image.user.username }</span> at: { image.uploaded_at }</div>
          </div>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  image: PropTypes.object.isRequired
}

export default Card;