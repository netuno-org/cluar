import React from 'react'
import Cluar from "../../common/Cluar";

import ContactForm from './ContactForm';
import ContactMap from './ContactMap';

const Functionality = (props) => {
    let layout = null;
    const actionsData = Cluar.actions() || [];
    console.log("propsFunctionality", props)

    const actions = (props.action_uids || []).map(uid =>
        actionsData.find(item => item.uid === uid)
    ).filter(Boolean);

    if (props.type === 'ContactForm') {
        layout = (
            <ContactForm
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
            />
        );
    } else if (props.type === 'ContactMap') {
        layout = (
            <ContactMap
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
            />
        );
    } else {
        layout = (
            <ContactForm
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
            />
        );
    }

    return (
        <section className="functionality">{layout}</section>
    );
}

export default Functionality;