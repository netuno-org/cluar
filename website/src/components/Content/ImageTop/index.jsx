import React from 'react';

import './index.less';

const ImageTop = ({ title, content, image_title, image_alt, imageSrc, imageStyle }) => {
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
                <h1>{title}</h1>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
        </div>
    );
};

export default ImageTop;