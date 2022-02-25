import React from 'react';
import { Col } from 'antd';

import './index.less';

function Item({ section, type, image, image_title, image_alt, title, content, link }) {
  let layout = null;
  if (type === 'YOUR-CUSTOM-TYPE-HERE') {
    layout = (
      <Col className={`listing__item__${type}`} xs={12} lg={6}>
        <a href={link} alt={title}>
          <span>{title}</span>
          <div className="listing__item__bgimage" style={{ backgroundImage: `url('/images/${section}/${image}')` }}></div>
        </a>
      </Col>
    );
  } else if(type === 'OTHER-CUSTOM-TYPE-HERE') {
    layout = (
      <li className={`listing__item__${type}`} style={{ backgroundImage: `url(/images/${section}/${image})` }}>
        <div className={`listing__item__${type}__content`}>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </li>
    );
  } else {
    layout = (
      <li className="listing__item">
        <div className={`listing__item`}>
          <h1>{title}</h1>
          <img src={`/images/${section}/${image}`}  alt={ image_alt } title={ image_title } />
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </li>
    );
  }
  return (
      layout
  );
}

export default Item;