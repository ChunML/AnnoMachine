import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import BoxesDetail from './BoxesDetail';
import UploadInfo from './UploadInfo';
import ImageAnnoDisplay from './ImageAnnoDisplay';

function ImageDetail({ image }) {
  const [drawBoxes, setDrawBoxes] = useState([]);
  const [scale, setScale] = useState(1);
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.offsetWidth < image.width) {
      setScale(ref.current.offsetWidth / image.width);
      setSvgWidth(ref.current.offsetWidth);
      setSvgHeight(scale * image.height);
    } else {
      setSvgWidth(image.width);
      setSvgHeight(image.height);
    }
  });

  if (image.length === 0) {
    return <div>Loading...</div>
  }

  image = image[0];

  const onEyeIconClick = (box) => {
    const currentBox = drawBoxes.filter(drawBox => drawBox.id === box.id);
    if (currentBox.length === 0) {
      setDrawBoxes([...drawBoxes, box]);
    } else {
      const otherBoxes = drawBoxes.filter(drawBox => drawBox.id !== box.id);
      setDrawBoxes([...otherBoxes]);
    }
  }

  return (
    <div className="ui center aligned two column stackable grid">
      <div className="row">
        <div className="column" ref={ ref }>
          <ImageAnnoDisplay
            svgWidth={ svgWidth || 0 }
            svgHeight={ svgHeight || 0 }
            imageWidth={ image.width }
            imageHeight={ image.height }
            scale={ scale }
            drawBoxes={ drawBoxes }
            name={ image.name }
          />
          <p></p>
          <a href={`${process.env.REACT_APP_API_URL}/api/annotations/kitti/${image.name.replace('.jpg', '.txt')}`}>
            <button className="ui primary button">Download annotation</button>
          </a>
        </div>
        <div className="column">
          <UploadInfo username={ image.user.username } uploaded_at={ image.uploaded_at } />
          <BoxesDetail image={ image } onEyeIconClick={ onEyeIconClick } />
        </div>
      </div>
    </div>
  );
}

ImageDetail.propTypes = {
  image: PropTypes.array.isRequired
};

export default ImageDetail;