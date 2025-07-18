import React from 'react';

import "./index.less";
import Default from './Default';

function Listing(props) {

  let listLayout = null;

  if (props.type === "Default") {
    listLayout = (
      <Default
        {...props}
      />
    );
  }

  return <section className="listing">{listLayout}</section>;
}

export default Listing;