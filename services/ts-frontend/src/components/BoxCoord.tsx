import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BoxType } from '../App';

function BoxCoord({ coords }: { coords: BoxType }) {
  const [box, setBox] = useState<BoxType>(coords);

  useEffect(() => {
    setBox(coords);
  }, [coords]);

  return (
    <React.Fragment>
      <span className="box-coord">{Math.floor(box.x_min)}</span>
      <span className="box-coord">{Math.floor(box.y_min)}</span>
      <span className="box-coord">{Math.floor(box.x_max)}</span>
      <span className="box-coord">{Math.floor(box.y_max)}</span>
    </React.Fragment>
  );
}

BoxCoord.propTypes = {
  coords: PropTypes.object.isRequired,
};

export default BoxCoord;
