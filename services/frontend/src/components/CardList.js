import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from './Card';
import Loader from './Loader';

function CardList(props) {
  const { selectedTab, currentUser, images, isLoading } = props;
  if (selectedTab === 'yours' && currentUser === '') {
    return (
      <div className="row">
        <div>
          <p>
            In order to see your images, log in first at{' '}
            <Link to="/login">here</Link>.
          </p>
        </div>
      </div>
    );
  }

  let cards;
  if (selectedTab === 'all') {
    cards = images
      .sort((a, b) => b.id - a.id)
      .map(image => (
        <Card
          key={image.id}
          image={image}
          currentUser={props.currentUser}
          onDeleteImage={props.onDeleteImage}
        />
      ));
  } else {
    cards = props.images
      .filter(image => image.user.username === props.currentUser)
      .sort((a, b) => b.id - a.id)
      .map(image => (
        <Card
          key={image.id}
          image={image}
          currentUser={props.currentUser}
          onDeleteImage={props.onDeleteImage}
        />
      ));
  }

  return (
    <React.Fragment>
      {isLoading && (
        <div className="grid-item">
          <Loader />
        </div>
      )}
      {cards}
    </React.Fragment>
  );
}

CardList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  selectedTab: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  onDeleteImage: PropTypes.func.isRequired,
};

export default CardList;
