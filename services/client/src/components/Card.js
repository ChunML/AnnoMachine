import React from 'react';

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detectImage: true
    };
  }

  render() {
    const { image } = this.props;
    console.log(image)
    return (
      <div className="column">
        <div className="ui card" style={{margin: 'auto'}}>
          <div className="image" onClick={() => this.setState(prevState => ({detectImage: !prevState.detectImage}))}>
            <img src={`http://localhost:5000/${this.state.detectImage ? 'detects': 'uploads'}/${image.name}`} alt="Some image here" />
          </div>
          <div className="content">
            <div className="header">Author: { image.user.username }</div>
            <div className="meta">Uploaded at: { image.uploaded_at }</div>
            <div className="description">May contain: {image.boxes.length > 0 ?
              [...new Set(image.boxes.map(box => box.label))].map((label, id) => (
                <div key={ id } className='ui label' style={{background: '#11ee66'}}>{ label }</div>
              )) :
              <div className='ui label'>nothing</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;