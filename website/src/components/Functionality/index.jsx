import React from 'react'

import ContactForm from './ContactForm';
import ContactMap from './ContactMap';

const Functionality = ({ title, content, type }) => {
    let layout = null;

    if (type === 'ContactForm') {
        layout = (
            <ContactForm
                title={title}
            />
        );
    } else if (type === 'ContactMap') {
        layout = (
            <ContactMap
                title={title}
                content={content}
            />
        );
    } else {
        layout = (
            <ContactForm
                title={title}
            />
        );
    }

    return (
        <section className="functionality">{layout}</section>
    );
}

export default Functionality;