import React, { useId } from "react";

import Default from "./Default";

const Slider = (props) => {
  const styleScopeId = `slider-${useId().replace(/:/g, "")}`;
  let layout = null;

  if (props.type == "Default") {
    layout = <Default {...props} />;
  } else {
    layout = <Default {...props} />;
  }

  return (
    <section className="slider" id={styleScopeId}>
      {props.style && (
        <style>{`@scope (#${styleScopeId}) {\n${props.style}\n}`}</style>
      )}
      {layout}
    </section>
  );
};

export default Slider;
