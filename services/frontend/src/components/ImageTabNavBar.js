import React from 'react';

function ImageTabNavbar({ selectedTab, onTabChange }) {
  return (
    <div className="ui tabular menu" style={{width: '100%'}}>
      <a
        className={`${selectedTab === 'all' ? 'active' : ''} item`}
        onClick={ () => onTabChange('all') }
      >
        All Images
      </a>
      <a
        className={`${selectedTab === 'yours' ? 'active' : ''} item`}
        onClick={ () => onTabChange('yours') }
      >
        Yours
      </a>
    </div>
  );
}

export default ImageTabNavbar;