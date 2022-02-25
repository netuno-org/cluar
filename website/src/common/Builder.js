import React, { useEffect } from 'react';

import sal from 'sal.js';

import Banner from '../components/Banner';
import Content from '../components/Content';
import Listing from '../components/Listing';
import ContactForm from '../components/functionality/ContactForm';
import ContactMap from '../components/functionality/ContactMap';
import config from '../config/config.json';

function Builder({ page }) {
  useEffect(() => {
    sal();
    document.getElementsByTagName('meta')["keywords"].content = page.keywords;
    document.getElementsByTagName('meta')["description"].content = page.description;
    document.title = page.title + ' | ' + config.website.name;
  }, [page]);

  const components = [];
  for (const item of page.structure) {
    if (item.section === 'banner') {
      components.push(<Banner {...item} />);
    } else if (item.section === 'content') {
      components.push(<Content {...item} />);
    } else if (item.section === 'listing') {
      components.push(<Listing {...item} />);
    } else if (item.section === 'functionality') {
      if (item.type === 'contact-form') {
        components.push(<ContactForm {...item} />);
      } else if (item.type === 'contact-map') {
        components.push(<ContactMap {...item} />);
      }
    }
  }
  return (
    <main>
      {components}
    </main>
  );
}

export default Builder;