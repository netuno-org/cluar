import React from 'react';
import Default from './Default';

const Slider = (props) => {
  let layout = null;

  if (props.type == 'default') {
    layout = (
      <Default
        {...props}
      />
    );
  }

  return <section className="slider">{layout}</section>;
}

export default Slider;