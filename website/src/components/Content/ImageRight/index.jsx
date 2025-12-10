import React from 'react';
import { Row, Col } from 'antd';

import Cluar from '../../../common/Cluar';
import Actions from '../../Actions';
import config from './config.json';

import './index.less';


const ImageRight = ({ section, type, title, content, image_title, image_alt, imageSrc, imageStyle, actions }) => {
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
                {config.action && (
                    <Col>
                        <Actions {... { section, type, actions }} />
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default ImageRight;