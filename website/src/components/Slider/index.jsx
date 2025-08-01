import React from 'react';
import Default from './Default';

const Slider = (props) => {
  let layout = null;

  if (props.type == 'Default') {
    layout = (
      <Default
        {...props}
      />
    );
  } else {
    layout = (
      <Default
        {...props}
      />
    );
  }

  return <section className="slider">{layout}</section>;
}

export default Slider;