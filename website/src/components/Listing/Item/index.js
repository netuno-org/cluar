import React from 'react';
import { Col } from 'antd';

import './index.less';

export default ({ section, type, image, image_title, image_alt, title, content, link }) => {
  let layout = null;
  if (type === 'containers') {
    layout = (
      <li className="listing_item_containers">
        <div className={`item__containers`}>
          <h1>{title}</h1>
          <img src={`/images/${section}/${image}`}  alt={ image_alt } title={ image_title } />
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </li>
    );
  } else if(type === 'service-list' || type === 'faq-list' || type === 'home-list') {
    layout = (
      <Col xs={12} lg={6}>
        <a href={link} alt={title}><span>{title}</span><div className="filter"></div><div className="bg" style={{ backgroundImage: `url('/images/${section}/${image}')` }} ></div></a>
      </Col>
    );
  } else if (type === 'pallets') {
    layout = (
      <Col xs={24} sm={24} md={24} lg={12}>
        <img src={`/images/${section}/${image}`}  alt={ image_alt } title={ image_title } />
        <div className="listing_item_pallets" dangerouslySetInnerHTML={{ __html: content }}></div>
      </Col>
    );
  } else {
    layout = (
      <li className="listing_item" style={{ backgroundImage: `url(/images/${section}/${image})` }}>
        <div className={`item__${type}`}>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </li>
    );
  }
  return (
      layout
  );
}
