import React from 'react';

import Cluar from '../../common/Cluar';

import './index.less';

export default (props) => {
  let value = Cluar.dictionary(props.entry);
  if (props.oneLine) {
    value = (value).replace(/<\/?p[^>]*>/g, "");
    return (
      <span dangerouslySetInnerHTML={{__html: value}} />
    )
  }
  return (
    <div dangerouslySetInnerHTML={{__html: value}} />
  );
}
