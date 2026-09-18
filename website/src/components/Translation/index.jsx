import React from 'react';

import Cluar from '../../common/Cluar';

function Translation({ entry, oneLine, noParagraph }) {
  let value = Cluar.translation(entry);
  if (noParagraph) {
    value = Cluar.translationNoParagraph(entry);
  } else if (oneLine) {
    value = Cluar.plainTranslation(entry);
    return (
      <span dangerouslySetInnerHTML={{ __html: value }} />
    )
  }
  return (
    <div dangerouslySetInnerHTML={{ __html: value }} />
  );
}

export default Translation;
