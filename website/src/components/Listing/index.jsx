import React, { useState, useEffect, useId } from "react";
import Cluar from "../../common/Cluar";

import "./index.less";
import Default from "./Default";

function Listing(props) {
  const [renderedActions, setRenderedActions] = useState(props.actions);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const styleScopeId = `listing-${useId().replace(/:/g, "")}`;

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

  let listLayout = null;

  if (props.type === "Default") {
    listLayout = <Default {...props} actions={renderedActions} />;
  } else {
    listLayout = <Default {...props} actions={renderedActions} />;
  }

  return (
    <section className="listing" id={styleScopeId}>
      {props.style && (
        <style>{`@scope (#${styleScopeId}) {\n${props.style}\n}`}</style>
      )}
      {listLayout}
    </section>
  );
}

export default Listing;
