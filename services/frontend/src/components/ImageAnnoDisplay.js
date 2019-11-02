import React, { useState } from 'react';
import PropTypes from 'prop-types';

function ImageAnnoDisplay(props) {
  const {
    svgWidth,
    svgHeight,
    imageWidth,
    imageHeight,
    drawBoxes,
    scale,
    name,
    onImageClick,
    createMessage,
  } = props;

  const [moveable, setMoveable] = useState(false);

  const handleMouseMove = e => {
    if (!moveable) return;
    if (drawBoxes.length > 1) {
      createMessage(
        'error',
        'Only one box can be editted by clicking at a time.'
      );
      return;
    }
    if (drawBoxes.length === 0) {
      return;
    }
    const rect = e.target.getBoundingClientRect();
    const clickX = (e.clientX - rect.x) / scale;
    const clickY = (e.clientY - rect.y) / scale;
    const newBox = { ...drawBoxes[0] };
    if (
      Math.abs(clickX - drawBoxes[0].x_min) >
      Math.abs(clickX - drawBoxes[0].x_max)
    ) {
      newBox.x_max = clickX;
    } else {
      newBox.x_min = clickX;
    }
    if (
      Math.abs(clickY - drawBoxes[0].y_min) >
      Math.abs(clickY - drawBoxes[0].y_max)
    ) {
      newBox.y_max = clickY;
    } else {
      newBox.y_min = clickY;
    }
    onImageClick(newBox);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="image-large"
      width={svgWidth}
      height={svgHeight}
      onClick={() => setMoveable(!moveable)}
    >
      <image
        xlinkHref={`${process.env.REACT_APP_API_URL}/api/uploads/${name}`}
        x="0"
        y="0"
        width={svgWidth}
        height={svgHeight}
        style={
          imageWidth > imageHeight ? { width: '100%' } : { height: '100%' }
        }
        onMouseMove={handleMouseMove}
      />
      {drawBoxes.length > 0 &&
        drawBoxes.map(box => (
          <rect
            key={box.id}
            x={box.x_min * scale}
            y={box.y_min * scale}
            width={(box.x_max - box.x_min) * scale}
            height={(box.y_max - box.y_min) * scale}
            style={{ fill: 'none', stroke: 'lime', strokeWidth: '3' }}
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
  drawBoxes: PropTypes.array.isRequired,
  onImageClick: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
};

export default ImageAnnoDisplay;
