import React from 'react';
import Card from './Card';
import PropTypes from 'prop-types';

function CardList(props) {
  const cards = props.images.map(image => (
    <Card key={ image.id } image={ image } />
  ))
  return cards;
}

CardList.propTypes = {
  images: PropTypes.array.isRequired
}

export default CardList;