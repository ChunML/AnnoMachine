import React, { useState } from 'react';
import PropTypes from 'prop-types';

function ImageDetail({ image }) {
  const [detectImage, toggleDetectImage] = useState(true);

  if (image.length === 0) {
    return <div>Loading...</div>
  }

  image = image[0];

  const coordStyle = {
    padding: '5px 10px',
    color: 'maroon',
    letterSpacing: '1px',
    background: 'powderblue',
    borderRadius: '4px',
    margin: '5px',
  };

  return (
    <div className="ui two column stackable grid">
      <div className="row">
        <div className="column">
          <div className="ui rounded image">
          <img
            src={`${process.env.REACT_APP_API_URL}/api/${detectImage ? 'detects' : 'uploads'}/${image.name}`}
            alt="Some image here"
            onClick={() => toggleDetectImage(!detectImage)}
          />
          </div>
          <p></p>
          <button className="ui primary button">Download annotation</button>
        </div>
        <div className="column">
          <div className="ui left aligned red segment">
            <div className="ui center aligned header">Image details</div>
            <p>Author: Chun</p>
            <p>Uploaded at: 2019/10/11</p>
          </div>
          <div className="ui segments">
            <div className="ui left aligned blue segment">
              <div className="ui center aligned header">Bounding boxes</div>
            </div>
            <div className="ui segments">
              {image.boxes.map((box, id) => (
                <div className="ui left aligned segment">
                  <div className="ui header">{ box.label }</div>
                  <p>
                    <span style={coordStyle}>{ Math.floor(box.x_min) }</span>
                    <span style={coordStyle}>{ Math.floor(box.y_min) }</span>
                    <span style={coordStyle}>{ Math.floor(box.x_max) }</span>
                    <span style={coordStyle}>{ Math.floor(box.y_max) }</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ImageDetail.propTypes = {
  image: PropTypes.object.isRequired
};

export default ImageDetail;