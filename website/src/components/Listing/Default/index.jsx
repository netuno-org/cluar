import React from 'react';
import { Row, Col } from "antd";

import Item from './Item';

const Default = (
    { section,
        type,
        image,
        image_title,
        image_alt,
        title,
        content,
        items }) => {
    const children = [];

    for (const item of items) {
        children.push(<Item kItemey={item.uid} {...{ type, ...item }} />);
    }

    const imageSrc =
        image?.indexOf("base64") === -1
            ? `/cluar/images/page_${section}/${image}`
            : image;

    return (
        <Row className={`listing__${type}`} justify="start">
            <Col span={24}>
                <h1 dangerouslySetInnerHTML={{ __html: title }} />
                <img src={imageSrc} />
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </Col>
            <Col span={24}>{children}</Col>
        </Row>
    );
}

export default Default;