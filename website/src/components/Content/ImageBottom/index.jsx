import React from 'react';

import './index.less';

const ImageBottom = ({ title, content, image_title, image_alt, imageSrc, imageStyle }) => {
    return (
        <div className="content-image-bottom">
            <div className="text">
                <h1 dangerouslySetInnerHTML={{ __html: title }} />
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
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

export default ImageBottom;