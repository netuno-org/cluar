import React from 'react';
import { Col } from 'antd';

import './index.less';

function Item({ section, type, image, image_title, image_alt, title, content, link }) {
  const imageSrc =
    image?.indexOf("base64") === -1
      ? `/cluar/images/page_${section}/${image}`
      : image;

  return (
    <Col className={`listing__item__${type}`} xs={12} lg={12}>
      <a href={link} alt={title}>
        <span dangerouslySetInnerHTML={{ __html: title }} />
        <img src={imageSrc} alt={image_alt} title={image_title} />
        <div
          className="listing__item__bgimage"
          style={{
            backgroundImage: `url('/cluar/images/${section}/${image}')`,
          }}
        ></div>
      </a>
    </Col>
  );
}

export default Item;