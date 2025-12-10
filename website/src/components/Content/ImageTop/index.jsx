import React from 'react';

import Cluar from '../../../common/Cluar';
import Actions from '../../Actions';
import config from './config.json';

import './index.less';

const ImageTop = ({ section, type, title, content, image_title, image_alt, imageSrc, imageStyle, actions }) => {
    return (
        <div className="content-image-top">
            <div className="image">
                <img
                    src={imageSrc}
                    alt={image_alt}
                    title={image_title}
                    style={imageStyle}
                />
            </div>
            <div className="text">
                <h1 dangerouslySetInnerHTML={{ __html: title }} />
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
            {config.action && (
                <div>
                    <Actions {... { section, type, actions }} />
                </div>
            )}
        </div>
    );
};

export default ImageTop;