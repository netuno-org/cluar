import React from 'react';
import { Row } from 'antd';

import Item from './Item';

import './index.less';

export default ({section, type, image, image_title, image_alt, title, content, items}) => {
    const children = [];
    for (const item of items) {
        children.push(<Item {...{type, ...item}} />);
    }

    let listLayout = (
      <div>
        <h1>{ title }</h1>
        <div className="listing__title-border"></div>
        <div dangerouslySetInnerHTML={{__html: content}}></div>
          <ul className={`listing__${type}`}>
            { children }
        </ul>   
      </div>   
    );

    if(type === 'service-list' || type === 'faq-list' || type === 'home-list') {
      listLayout = (
        <Row className={`listing__${type}`} justify="start">
          { children }
        </Row>
      );
    } else if(type === 'pallets') {
      listLayout = (
          <Row className={`listing__${type}`}>
            { children }
          </Row>
        );
    }

    return (
        <section className="listing">
          { listLayout }
        </section>
    );
}
