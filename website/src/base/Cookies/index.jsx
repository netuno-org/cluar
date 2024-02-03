
import React, { useState } from 'react';
import { Button } from 'antd';

import Cluar from '../../common/Cluar';

import * as stylex from '@stylexjs/stylex';

//import './index.less';

import styles from './index.stylex.js';

function BaseCookies() {
  const [acceptedCookies, setAcceptedCookies] = useState(sessionStorage.getItem('cookies-accepted'));
  const onClick = () => {
    sessionStorage.setItem('cookies-accepted', '1');
    setAcceptedCookies('1');
  };
  if (acceptedCookies === '1') {
    return null;
  }
  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.popup)}>
        <div {...stylex.props(styles.content)}>
          <p {...stylex.props(styles.paragraph)}>
            {Cluar.currentLanguage().locale === 'pt' && <>Utilizamos cookies no nosso website para lhe proporcionar a experiência mais relevante, para mais informações consulte a nossa <a href={`/${Cluar.currentLanguage().locale}/politica-privacidade`}>política de cookies e privacidade</a>.</> }
            {Cluar.currentLanguage().locale === 'en' && <>We use cookies to provide you the best experience, check our <a href={`/${Cluar.currentLanguage().locale}/privacy-policy`}>cookies and privacy policy</a>.</> }
          </p>
          <Button type="primary" shape="round" onClick={onClick}>
            {Cluar.currentLanguage().locale === 'pt' && <>Aceitar</>}
            {Cluar.currentLanguage().locale === 'en' && <>Accept</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BaseCookies;
