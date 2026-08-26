import React from 'react';
import { Row, Col } from "antd";
import Item from './Item';
import config from "./config.json";
import Actions from "../../Actions";
import "./index.less";

const Default = ({ section, type, image, image_title, image_alt, title, content, items, actions, html_content, edit_mode }) => {
  const children = items.map(item => (
    <Item key={item.uid} {...{ type, ...item }} />
  ));

  const imageSrc = image?.indexOf("base64") === -1
    ? `/cluar/images/page_${section}/${image}`
    : image;

  const resolvedContent = edit_mode === 'html'
    ? (html_content || content)
    : content;

  return (
    <Row className={`listing__${type}`} justify="start" gutter={0}>
      <Col span={24}>
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        <img src={imageSrc} alt={image_alt || ''} />
        <div dangerouslySetInnerHTML={{ __html: resolvedContent }} />
      </Col>
      <Col span={24}>{children}</Col>
      {config.action && (
        <Row>
          <Col>
            <Actions {...{ section, type, actions }} />
          </Col>
        </Row>
      )}
    </Row>
  );
};

export default Default;
