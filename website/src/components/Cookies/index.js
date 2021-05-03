
import React, { useState } from 'react';
import { Button } from 'antd';

import Cluar from '../../common/Cluar';

import './index.less';

export default () => {
  const [acceptedCookies, setAcceptedCookies] = useState(sessionStorage.getItem('cookies-accepted'));
  const onClick = () => {
    sessionStorage.setItem('cookies-accepted', '1');
    setAcceptedCookies('1');
  }
  if (acceptedCookies === '1') {
    return null;
  }
  return (
    <div className="cookies">
      <div className="cookies--popup">
        <div className="cookies--popup__content">
          <p>Utilizamos cookies no nosso website para lhe proporcionar a experiência mais relevante, para mais informações consulte a nossa <a href={`/${Cluar.currentLanguage().locale}/politica-privacidade`}>política de cookies e privacidade</a>.</p>
          <Button type="primary" shape="round" onClick={onClick}>
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  )
}
