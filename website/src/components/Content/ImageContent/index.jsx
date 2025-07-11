import React from 'react';

import './index.less';

const ImageContent = ({ image_title, image_alt, imageSrc, imageStyle }) => {
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
        </div>
    );
}

export default ImageContent;