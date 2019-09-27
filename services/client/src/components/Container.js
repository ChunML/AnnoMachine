import React from 'react';
import AddImageForm from './AddImageForm';
import CardList from './CardList';

function Container(props) {
  console.log(props)
  return (
    <div className="ui center aligned container" style={{margin: '30px auto',}}>
        <div className="ui center aligned three column stackable grid">
          <div className="row">
            <AddImageForm
              onButtonClick={ props.onButtonClick }
            />
          </div>
          <CardList
            images={ props.images }
          />
        </div>
    </div>
  );
}

export default Container;