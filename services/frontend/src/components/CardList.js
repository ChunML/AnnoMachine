import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Loader from './Loader';
import PropTypes from 'prop-types';

function CardList(props) {
  if (props.selectedTab === 'yours' && props.currentUser === '') {
    return (
      <div class="row">
        <div>
          <p>In order to see your images, log in first at <Link to='/login'>here</Link>.</p>
        </div>
      </div>
    );
  }

  let cards;
  if (props.selectedTab === 'all') {
    cards = props.images.sort((a, b) => b.id - a.id)
      .map(image => (
        <Card key={ image.id } image={ image } />
      ));
  } else {
    cards = props.images.filter(image => image.user.username === props.currentUser)
      .sort((a, b) => b.id - a.id)
      .map(image => (
        <Card key={ image.id } image={ image } />
      ));
  }

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