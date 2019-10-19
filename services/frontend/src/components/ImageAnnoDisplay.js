import React from 'react';
import PropTypes from 'prop-types';

function ImageAnnoDisplay(props) {
  const { svgWidth, svgHeight, imageWidth, imageHeight, drawBoxes, scale, name } = props;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      width={ svgWidth }
      height={ svgHeight }
      style={{ marginLeft: '-14px' }}
    >
      <image
        xlinkHref={`${process.env.REACT_APP_API_URL}/api/uploads/${name}`}
        x="0" y="0" width={ svgWidth } height={ svgHeight }
        style={ imageWidth > imageHeight ? {width: "100%"} : {height: "100%"} } />
      { drawBoxes.length > 0 && drawBoxes.map(box => (
        <rect
          key={ box.id }
          x={ box.x_min * scale }
          y={ box.y_min * scale }
          width={ (box.x_max - box.x_min) * scale }
          height={ (box.y_max - box.y_min) * scale }
          style={{fill: "none", stroke: "lime", strokeWidth: "3"}}
        />
      ))}
    </svg>
  );
}

ImageAnnoDisplay.propTypes = {
  svgWidth: PropTypes.number.isRequired,
  svgHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  drawBoxes: PropTypes.array.isRequired
};

export default ImageAnnoDisplay;