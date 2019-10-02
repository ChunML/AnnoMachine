import React from 'react';
import Card from './Card';
import Loader from './Loader';
import PropTypes from 'prop-types';

function CardList(props) {
  const cards = props.images.sort((a, b) => b.id - a.id).map(image => (
    <Card key={ image.id } image={ image } />
  ))
  return (
    <React.Fragment>
      { props.isLoading && (
        <div className="column">
          <Loader />
        </div>
      )}
      { cards }
    </React.Fragment>
  );
}

CardList.propTypes = {
  images: PropTypes.array.isRequired
}

export default CardList;