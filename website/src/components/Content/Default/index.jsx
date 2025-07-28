import React from 'react';
import Cluar from '../../../common/Cluar';

import './index.less';

const Default = ({ title, content, image_title, image_alt, imageSrc, imageStyle }) => {
    return (
        <div className={`content-default`}>
            <div className="image">
                <img
                    src={imageSrc}
                    alt={image_alt}
                    title={image_title}
                    style={imageStyle}
                />
            </div>
            <div className="text">
                <h1 dangerouslySetInnerHTML={{ __html: Cluar.plainTitle(title) }} />
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
        </div>
    );
}

export default Default;