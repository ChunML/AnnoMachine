import React from 'react';
import AddImageForm from './AddImageForm';
import CardList from './CardList';
import PropTypes from 'prop-types';

function Container(props) {
  return (
    <div className="ui center aligned container" style={{margin: '30px auto',}}>
        <div className="ui center aligned three column stackable grid">
          <div className="row">
            { props.isAuthenticated && (
              <AddImageForm
                onButtonClick={ props.onButtonClick }
              />
            )}
          </div>
          <CardList
            images={ props.images }
            isLoading={ props.isLoading }
          />
        </div>
    </div>
  );
}

Container.propTypes = {
  images: PropTypes.array.isRequired,
  onButtonClick: PropTypes.func.isRequired
}

export default Container;