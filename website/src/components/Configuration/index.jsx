import React from 'react';

import Cluar from '../../common/Cluar';

function Configuration({parameter, number, multilines}) {
  let value = Cluar.configuration(parameter);
  if (multilines) {
    value = Cluar.configurationMultilines(parameter);
  }
  if (number) {
    value = Cluar.configurationNumber(parameter);
  }
  return (
    <span dangerouslySetInnerHTML={{__html: value}} />
  );
}

export default Configuration;