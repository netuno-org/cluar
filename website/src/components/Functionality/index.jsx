import React from 'react'

import ContactForm from './ContactForm';
import ContactMap from './ContactMap';

const Functionality = ({ title, content, type }) => {
    let layout = null;

    if (type === 'contact-form') {
        layout = (
            <ContactForm
                title={title}
            />
        );
    } else if (type === 'contact-map') {
        layout = (
            <ContactMap
                title={title}
                content={content}
            />
        );
    }

    return (
        <section className="functionality">{layout}</section>
    );
}

export default Functionality;