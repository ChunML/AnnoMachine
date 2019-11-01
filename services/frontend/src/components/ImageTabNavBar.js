import React from 'react';
import PropTypes from 'prop-types';

function ImageTabNavbar({ selectedTab, onTabChange }) {
  return (
    <div
      className="image-nav flex-center space-around"
      style={{ width: '100%' }}
    >
      <div
        className={`${selectedTab === 'all' ? 'active' : ''} image-nav-link`}
      >
        <a onClick={() => onTabChange('all')}>All Images</a>
      </div>
      <div
        className={`${selectedTab === 'yours' ? 'active' : ''} image-nav-link`}
      >
        <a onClick={() => onTabChange('yours')}>Yours</a>
      </div>
    </div>
  );
}

ImageTabNavbar.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default ImageTabNavbar;
