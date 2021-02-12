import React from 'react';

import Actions from '../Actions';

import Cluar from '../../Cluar';

import { Row, Col } from 'antd';

import './index.less';

export default ({ section, type, image, title, content, position, actions }) => {
  let backgroundPositionX = position.x != "" ? position.x : "50%";
  let backgroundPositionY = position.y != "" ? position.y : "50%";

  return (
    <section className="banner">
      <div className={`banner__${type}`} style={{
        backgroundImage: `url(/images/${section}/${image})`,
        backgroundPositionX: backgroundPositionX,
        backgroundPositionY: backgroundPositionY
      }}>
        <Row>
          < Col lg={18} sm={(type === 'default-sub-banner') ? (24) : (18)}  xs={(type === 'default-sub-banner') ? (24) : (18)}>
            <div>
              <h1 data-sal="slide-down" data-sal-duration="2000" data-sal-easing="ease-out-cubic">{title}</h1>
              <div data-sal="fade" data-sal-duration="2000" data-sal-easing="ease-out-cubic" dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
          </Col>
          <Col lg={6} sm={(type === 'default-sub-banner') ? (24) : (6)}  xs={(type === 'default-sub-banner') ? (24) : (6)}>
            <Actions {... { section, type, actions }} />
          </Col>
        </Row>
        <div className="banner__sub-banner">
          {Cluar.plainDictionary('text-sub-banner')}
        </div>
        <div className="banner__darken-bg"></div>
      </div>
    </section >
  );
}
