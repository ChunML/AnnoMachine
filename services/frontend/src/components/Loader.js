import React from 'react';

function Loader() {
  return (
    <div className="ui segment">
      <div className="ui active loader"></div>
      <p>Uploading. Please wait...</p>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Loader;
