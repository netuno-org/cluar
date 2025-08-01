import React from 'react';

import './index.less';

const TextContent = ({ title, content }) => {
    return (
        <div className="content-text">
            <div className="text">
                <h1 dangerouslySetInnerHTML={{ __html: title }} />
                {title ? <div className="text__title-border"></div> : null}
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
        </div>
    );
};

export default TextContent;