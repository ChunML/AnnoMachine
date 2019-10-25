import React from 'react';
import PropTypes from 'prop-types';

function ImageTabNavbar({ selectedTab, onTabChange }) {
  return (
    <div className="ui tabular menu" style={{ width: '100%' }}>
      <a
        className={`${selectedTab === 'all' ? 'active' : ''} item`}
        onClick={() => onTabChange('all')}
      >
        All Images
      </a>
      <a
        className={`${selectedTab === 'yours' ? 'active' : ''} item`}
        onClick={() => onTabChange('yours')}
      >
        Yours
      </a>
    </div>
  );
}

ImageTabNavbar.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default ImageTabNavbar;
