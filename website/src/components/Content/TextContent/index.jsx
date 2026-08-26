import React from 'react';

import Cluar from '../../../common/Cluar';
import Actions from '../../Actions';
import config from './config.json';

import './index.less';

const TextContent = ({ section, type, title, content, actions, html_content, edit_mode }) => {

  const resolvedContent = edit_mode === 'html'
    ? (html_content || content)
    : content;

  return (
    <div className="content-text">
      <div className="text">
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        {title ? <div className="text__title-border"></div> : null}
        <div dangerouslySetInnerHTML={{ __html: resolvedContent }} />
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
