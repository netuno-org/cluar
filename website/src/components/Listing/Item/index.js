import React from 'react';
import { Col } from 'antd';

import './index.less';

export default ({ section, type, image, image_title, image_alt, title, content, link }) => {
  let layout = null;
  if (type === 'YOUR-CUSTOM-TYPE-HERE') {
    layout = (
      <li className="listing__item__YOUR-CUSTOM-TYPE-HERE">
        <div className={`listing__item__YOUR-CUSTOM-TYPE-HERE__content`}>
          <h1>{title}</h1>
          <img src={`/images/${section}/${image}`}  alt={ image_alt } title={ image_title } />
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </li>
    );
  } else if(type === 'OTHER-CUSTOM-TYPE-HERE') {
    layout = (
      <Col xs={12} lg={6}>
        <a href={link} alt={title}><span>{title}</span><div className="filter"></div><div className="bg" style={{ backgroundImage: `url('/images/${section}/${image}')` }} ></div></a>
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
