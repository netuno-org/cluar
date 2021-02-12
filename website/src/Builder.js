import React, { useEffect } from 'react';

import sal from 'sal.js';

import Banner from './components/Banner';
import Content from './components/Content';
import Listing from './components/Listing';
import ContactForm from './components/functionality/ContactForm';
import Map from './components/functionality/Map';

export default ({ page }) => {

    useEffect(() => {
        sal();
    });

    const components = [];
    for (const item of page.structure) {
        if (item.section === 'banner') {
            components.push(<Banner {...item} />);
        } else if (item.section === 'content') {
            components.push(<Content {...item} />);
        } else if (item.section === 'listing') {
            components.push(<Listing {...item} />);
        } else if (item.section === 'functionality') {
            if (item.type === 'map') {
                components.push(<Map {...item} />);
            } else if (item.type === 'contact-form') {
                components.push(<ContactForm {...item} />);
            }
        }
    }
    return <main>
        {components}
    </main>;
}
