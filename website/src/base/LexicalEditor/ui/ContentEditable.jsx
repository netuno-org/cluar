import React from 'react';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

import './ContentEditable.less';

export default function LexicalContentEditable({
  className,
  placeholder,
  placeholderClassName,
}) {
  return (
    <ContentEditable
      className={className ?? 'ContentEditable__root'}
      aria-placeholder={placeholder}
      placeholder={
        <div className={placeholderClassName ?? 'ContentEditable__placeholder'}>
          {placeholder}
        </div>
      }
    />
  );
}
