import React from 'react';
import _service from "@netuno/service-client";

import './index.less';

function Item({ section, type, title, content, indication, link, uid, image }) {
  return (
    <li>
      <div className="actions__item" onClick={() => window.location = link}>
        {title !== '' ? <h4>{title}</h4> : null}
        {content.replace(/ /g, '') !== '' ? <p dangerouslySetInnerHTML={{ __html: content }} /> : null}
        {indication !== '' ? <a href={link}>{indication}</a> : null}
        {image &&
          <img
            src={`${_service.config().prefix}actions/image?uid=${uid}`}
            alt="Action"
            style={{ width: 50, height: 50, objectFit: 'cover', display: 'block', margin: '0 auto' }}
          />}
      </div>
    </li>
  );
}

export default Item;