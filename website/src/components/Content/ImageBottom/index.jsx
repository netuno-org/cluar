import React from 'react';
import Cluar from '../../../common/Cluar';
import Actions from '../../Actions';
import config from './config.json';

import './index.less';

const ImageBottom = ({ section, type, title, content, image_title, image_alt, imageSrc, imageStyle, actions, html_content, edit_mode }) => {

  const resolvedContent = edit_mode === 'html'
    ? (html_content || content)
    : content;

  return (
    <div className="content-image-bottom">
      <div className="text">
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        <div dangerouslySetInnerHTML={{ __html: resolvedContent }} />
      </div>
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

export default ImageBottom;
