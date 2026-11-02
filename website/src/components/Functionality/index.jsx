import React, { useState, useEffect, useId } from "react";
import Cluar from "../../common/Cluar";

import ContactForm from "./ContactForm";
import ContactMap from "./ContactMap";

const Functionality = (props) => {
  const [renderedActions, setRenderedActions] = useState(props.actions);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const styleScopeId = `functionality-${useId().replace(/:/g, "")}`;

  const actionsData = Cluar.actions() || [];
  const actions = (props.action_uids || [])
    .map((uid) => actionsData.find((item) => item.uid === uid))
    .filter(Boolean);

  useEffect(() => {
    if (!isFirstRender) {
      setRenderedActions(actions);
    } else {
      setIsFirstRender(false);
    }
  }, [props.action_uids]);

  let layout = null;

  if (props.type === "ContactForm") {
    layout = <ContactForm {...props} actions={renderedActions} />;
  } else if (props.type === "ContactMap") {
    layout = <ContactMap {...props} actions={renderedActions} />;
  } else {
    layout = <ContactForm {...props} actions={renderedActions} />;
  }

  return (
    <section className="functionality" id={styleScopeId}>
      {props.style && (
        <style>{`@scope (#${styleScopeId}) {\n${props.style}\n}`}</style>
      )}
      {layout}
    </section>
  );
};

export default Functionality;
