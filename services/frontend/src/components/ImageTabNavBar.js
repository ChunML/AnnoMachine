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
        onClick={() => onTabChange('all')}
      >
        All Images
      </div>
      <div
        className={`${selectedTab === 'yours' ? 'active' : ''} image-nav-link`}
        onClick={() => onTabChange('yours')}
      >
        Yours
      </div>
    </div>
  );
}

ImageTabNavbar.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default ImageTabNavbar;
