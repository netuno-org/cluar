import React from 'react';

import './index.less';

function Item({ section, type, title, content, indication, link }) {
  return (
    <li>
      <div className="actions__item" onClick={ () => window.location = link}>
        { title !== '' ? <h4>{title}</h4> : null}
        { content.replace(/ /g,'') !== '' ? <p dangerouslySetInnerHTML={{__html: content}} /> : null }
        { indication !== '' ? <a href={link}>{indication}</a> : null}
      </div>
    </li>
  );
}

export default Item;