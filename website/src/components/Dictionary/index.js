import React from 'react';

import Cluar from '../../common/Cluar';

import './index.less';

export default (props) => {
  const value = Cluar.dictionary(props.entry);
  if (props.oneLine) {
    value = (value).replace(/<\/?p[^>]*>/g, "")
  }
  return (
    <>
      { value}
    </>
  );
}
