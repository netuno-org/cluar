import React from 'react';
import { Row, Col } from 'antd';

import './index.less';


const ImageRight = ({ title, content, image_title, image_alt, imageSrc, imageStyle }) => {
    return (
        <div className="content-image-right">
            <Row>
                <Col md={16}>
                    <div className="text">
                        <h1 dangerouslySetInnerHTML={{ __html: title }} />
                        <div className="text__title-border"></div>
                        <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    </div>
                </Col>
                <Col md={8}>
                    <div className="image">
                        <img
                            src={imageSrc}
                            alt={image_alt}
                            title={image_title}
                            style={imageStyle}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ImageRight;