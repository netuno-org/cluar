import React from 'react';

import Cluar from '../../common/Cluar';

function Dictionary({entry, oneLine, noParagraph}) {
  let value = Cluar.dictionary(entry);
  if (noParagraph) {
    value = Cluar.dictionaryNoParagraph(entry);
  } else if (oneLine) {
    value = Cluar.plainDictionary(entry);
    return (
      <span dangerouslySetInnerHTML={{__html: value}} />
    )
  }
  return (
    <div dangerouslySetInnerHTML={{__html: value}} />
  );
}

export default Dictionary;