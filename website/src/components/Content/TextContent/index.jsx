import React from 'react';

import Cluar from '../../../common/Cluar';
import Actions from '../../Actions';
import config from './config.json';

import './index.less';

const TextContent = ({ section, type, title, content, actions }) => {
    return (
        <div className="content-text">
            <div className="text">
                <h1 dangerouslySetInnerHTML={{ __html: title }} />
                {title ? <div className="text__title-border"></div> : null}
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

export default TextContent;