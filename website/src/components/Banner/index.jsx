import React, { useState, useEffect } from "react";
import Cluar from "../../common/Cluar";

import Default from "./Default";
import Secondary from "./Secondary";
import DefaultSubBanner from "./DefaultSubBanner";

const Banner = (props) => {
    const [renderedActions, setRenderedActions] = useState(props.actions);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const actionsData = Cluar.actions() || [];
    const actions = (props.action_uids || [])
        .map(uid => actionsData.find(item => item.uid === uid))
        .filter(Boolean);

    useEffect(() => {
        if (!isFirstRender) {
            setRenderedActions(actions);
        } else {
            setIsFirstRender(false);
        }
    }, [props.action_uids]);

    let layout = null;

    if (props.type === "Default") {
        layout = <Default {...props} actions={renderedActions} />;
    } else if (props.type === "Secondary") {
        layout = <Secondary {...props} actions={renderedActions} />;
    } else if (props.type === "DefaultSubBanner") {
        layout = <DefaultSubBanner {...props} actions={renderedActions} />;
    } else {
        layout = <Default {...props} actions={renderedActions} />;
    }

    return <section className="banner">{layout}</section>;
};

export default Banner;
