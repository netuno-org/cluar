import React from 'react';
import { Row, Col } from "antd";

import Item from "./Item";

import "./index.less";

function Listing({
  section,
  type,
  image,
  image_title,
  image_alt,
  title,
  content,
  items,
}) {
  const children = [];
  const imageSrc =
    image.indexOf("base64") === -1
      ? `/cluar/images/page_${section}/${image}`
      : image;

  for (const item of items) {
    children.push(<Item key={item.uid} {...{ type, ...item }} />);
  }

  let listLayout = (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
      <ul className={`listing__${type}`}>{children}</ul>
    </div>
  );

  if (type === "default") {
    listLayout = (
      <Row className={`listing__${type}`} justify="start">
        <Col span={24}>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </Col>
        <Col span={24}>{children}</Col>
      </Row>
    );
  }

  return <section className="listing">{listLayout}</section>;
}

export default Listing;