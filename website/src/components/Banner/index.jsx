import React from "react";
import Cluar from "../../common/Cluar";

import Default from "./Default";
import Secondary from "./Secondary";
import DefaultSubBanner from "./DefaultSubBanner";

const Banner = (props) => {
    let layout = null;
    const actionsData = Cluar.actions() || [];
    const actions = (props.action_uids || []).map(uid =>
        actionsData.find(item => item.uid === uid)
    ).filter(Boolean);

    if (props.type === 'Default') {
        layout = (
            <Default
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
            />
        );
    } else if (props.type === 'Secondary') {
        layout = (
            <Secondary
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
            />
        );
    } else if (props.type === 'DefaultSubBanner') {
        layout = (
            <DefaultSubBanner
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
            />
        );
    } else {
        layout = (
            <Default
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
            />
        );
    }

    return <section className="banner">{layout}</section>
}

export default Banner;