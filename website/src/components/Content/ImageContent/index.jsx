import React from 'react';
import Actions from '../../Actions';
import config from './config.json';

import './index.less';

const ImageContent = ({ section, type, image_title, image_alt, imageSrc, imageStyle, actions }) => {
    return (
        <div className="content-image">
            <div className="image">
                <img
                    src={imageSrc}
                    alt={image_alt}
                    title={image_title}
                    style={imageStyle}
                />
            </div>
            {config.action && (
                <div>
                    <Actions {... { section, type, actions }} />
                </div>
            )}
        </div>
    );
}

export default ImageContent;