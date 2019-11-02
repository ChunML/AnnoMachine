import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import AddImageForm from './AddImageForm';
import CardList from './CardList';
import ImageTabNavBar from './ImageTabNavBar';
import ImageDetail from './ImageDetail';

function Container(props) {
  return (
    <div className="container" style={{ margin: '30px auto' }}>
      <Route
        path="/images/:imageName"
        render={({ match }) => (
          <ImageDetail
            image={props.images.find(
              image => image.name === `${match.params.imageName}.jpg`
            )}
            createMessage={props.createMessage}
          />
        )}
      />
      <Route
        exact
        path="/images"
        render={() => (
          <div className="grid space-around">
            <div className="grid-row">
              {props.isAuthenticated && (
                <AddImageForm onButtonClick={props.onButtonClick} />
              )}
            </div>
            <div className="grid-row">
              <ImageTabNavBar
                selectedTab={props.selectedTab}
                onTabChange={props.onTabChange}
              />
            </div>
            <CardList
              images={props.images}
              isLoading={props.isLoading}
              currentUser={props.currentUser}
              selectedTab={props.selectedTab}
              onDeleteImage={props.onDeleteImage}
            />
          </div>
        )}
      />
    </div>
  );
}

Container.propTypes = {
  images: PropTypes.array.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentUser: PropTypes.string.isRequired,
  selectedTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onDeleteImage: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
};

export default Container;
