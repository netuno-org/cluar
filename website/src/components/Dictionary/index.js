import React from 'react';

import Cluar from '../../common/Cluar';

import './index.less';

function Dictionary ({entry, oneLine}) {
  let value = Cluar.dictionary(entry);
  if (oneLine) {
    value = (value).replace(/<\/?p[^>]*>/g, "");
    return (
      <span dangerouslySetInnerHTML={{__html: value}} />
    )
  }
  return (
    <div dangerouslySetInnerHTML={{__html: value}} />
  );
}

export default Dictionary;