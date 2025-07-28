import React from 'react';
import { Row, Col } from 'antd';

import './index.less';


const ImageLeft = ({ title, content, image_title, image_alt, imageSrc, imageStyle }) => {
    return (
        <div className="content-image-left">
            <Row>
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
                <Col md={16}>
                    <div className="text">
                        <h1 dangerouslySetInnerHTML={{ __html: title }} />
                        <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ImageLeft;