import React, { useState, useRef, useEffect } from 'react';
import { parse } from 'json2csv';
import PropTypes from 'prop-types';
import BoxesDetail from './BoxesDetail';
import UploadInfo from './UploadInfo';
import ImageAnnoDisplay from './ImageAnnoDisplay';
import { convertIdStrToInt } from './utils/helpers';

function ImageDetail({ image, createMessage }) {
  const [drawBoxes, setDrawBoxes] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [editModes, setEditModes] = useState([]);
  const [addBoxMode, setAddBoxMode] = useState(false);
  const [scale, setScale] = useState(1);
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof image === 'undefined') return;
    if (ref.current && ref.current.offsetWidth < image.width) {
      setScale(ref.current.offsetWidth / image.width);
      setSvgWidth(ref.current.offsetWidth);
      setSvgHeight(scale * image.height);
    } else {
      setSvgWidth(image.width);
      setSvgHeight(image.height);
    }
    if (image.boxes) {
      setBoxes(image.boxes.sort((a, b) => a.id - b.id));
      setEditModes(Array(image.boxes.length).fill(false));
    }
  }, [image, scale]);

  if (typeof image === 'undefined') {
    return <div>Loading...</div>;
  }

  const onEyeIconClick = box => {
    const currentBox = drawBoxes.filter(drawBox => drawBox.id === box.id);
    if (currentBox.length === 0) {
      setDrawBoxes([...drawBoxes, box]);
    } else {
      const otherBoxes = drawBoxes.filter(drawBox => drawBox.id !== box.id);
      setDrawBoxes([...otherBoxes]);
    }
  };

  const updateBoxes = box => {
    const otherBoxes = boxes.filter(originalBox => originalBox.id !== box.id);
    const newBoxes = [...otherBoxes, box];
    setBoxes(
      newBoxes.sort((a, b) => convertIdStrToInt(a.id) - convertIdStrToInt(b.id))
    );
    setDrawBoxes(
      drawBoxes.map(drawBox => {
        if (drawBox.id === box.id) {
          return box;
        }
        return drawBox;
      })
    );
  };

  const onInputChange = box => {
    updateBoxes(box);
  };

  const onCheckIconClick = currentBox => {
    const currentId = convertIdStrToInt(currentBox.id);
    if (
      currentId === Math.max(...boxes.map(box => convertIdStrToInt(box.id)))
    ) {
      setAddBoxMode(false);
    }
    updateBoxes(currentBox);
    setEditModes([...editModes.slice(0, editModes.length - 1), false]);
  };

  const onTrashIconClick = id => {
    setAddBoxMode(false);
    const otherBoxes = boxes.filter(box => box.id !== id);
    setBoxes(otherBoxes);
    const otherDrawBoxes = drawBoxes.filter(box => box.id !== id);
    setDrawBoxes(otherDrawBoxes);
  };

  const onAddBoxButtonClick = () => {
    setAddBoxMode(true);
    const newBox = {
      id: Math.max(...boxes.map(box => convertIdStrToInt(box.id))) + 1,
      label: '',
      x_min: 0,
      y_min: 0,
      x_max: 10,
      y_max: 10,
    };
    setBoxes([...boxes, newBox]);
    setDrawBoxes([...drawBoxes, newBox]);
    setEditModes([...editModes, true]);
  };

  const onUndoBoxAddingButtonClick = () => {
    setAddBoxMode(false);
    const oldBoxes = boxes.slice(0, boxes.length - 1);
    setBoxes([...oldBoxes]);
    const oldDrawBoxes = drawBoxes.slice(0, drawBoxes.length - 1);
    setDrawBoxes([...oldDrawBoxes]);
    setEditModes(Array(oldBoxes.length).fill(false));
  };

  const onImageClick = newBox => {
    const otherBoxes = boxes.filter(box => box.id !== newBox.id);
    const otherDrawBoxes = drawBoxes.filter(box => box.id !== newBox.id);
    newBox.id = `${newBox.id}_${new Date().getTime()}`;
    const newBoxes = [newBox, ...otherBoxes];
    setBoxes(
      newBoxes.sort((a, b) => convertIdStrToInt(a.id) - convertIdStrToInt(b.id))
    );
    const newDrawBoxes = [newBox, ...otherDrawBoxes];
    setDrawBoxes(newDrawBoxes);
  };

  const downloadBoxesAsCSV = () => {
    const fields = ['label', 'x_min', 'y_min', 'x_max', 'y_max'];

    const csv = `data:text/csv;charset=utf-8,${parse(boxes, { fields })}`;

    const hiddenElement = document.createElement('a');
    hiddenElement.setAttribute('href', encodeURI(csv));
    hiddenElement.setAttribute('target', '_blank');
    hiddenElement.setAttribute('download', image.name.replace('jpg', 'csv'));
    hiddenElement.click();
  };

  return (
    <div className="row space-around">
      <div className="half-width-item text-center" ref={ref}>
        <ImageAnnoDisplay
          svgWidth={svgWidth || 0}
          svgHeight={svgHeight || 0}
          imageWidth={image.width}
          imageHeight={image.height}
          scale={scale}
          drawBoxes={drawBoxes}
          name={image.name}
          onImageClick={onImageClick}
          createMessage={createMessage}
        />
        <p></p>

        <button className="primary button" onClick={downloadBoxesAsCSV}>
          Download annotation
        </button>
      </div>
      <div className="half-width-item text-center">
        <UploadInfo
          username={image.user.username}
          uploaded_at={image.uploaded_at}
        />
        <BoxesDetail
          boxes={boxes || []}
          drawList={drawBoxes.map(box => box.id)}
          editModes={editModes || []}
          onEyeIconClick={onEyeIconClick}
          onCheckIconClick={onCheckIconClick}
          onTrashIconClick={onTrashIconClick}
          onInputChange={onInputChange}
        />
        {addBoxMode ? (
          <button
            className="circular red button"
            onClick={onUndoBoxAddingButtonClick}
          >
            Undo
          </button>
        ) : (
          <button
            className="circular primary button"
            onClick={onAddBoxButtonClick}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}

ImageDetail.propTypes = {
  image: PropTypes.object,
  createMessage: PropTypes.func.isRequired,
};

export default ImageDetail;
