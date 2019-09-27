import React from 'react';
import Card from './Card';

function CardList(props) {
  const cards = props.images.map(image => (
    <Card key={ image.id } image={ image } />
  ))
  return cards;
}

export default CardList;