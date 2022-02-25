import React from 'react';

import Item from './Item';

import './index.less';

function Actions({ section, type, actions }) {
  const list = [];
  for (const action of actions) {
    list.push(<Item {...{section, type,...action}}/>);
  }
  if (list.length === 0) {
    return null;
  }
  return (
    <ul className={`actions actions--${section}__${type}`} data-sal="fade" data-sal-duration="2000" data-sal-easing="ease-out-cubic">
      {list}
    </ul>
  );
}

export default Actions;