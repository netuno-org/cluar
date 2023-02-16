import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

import Cluar from '../../common/Cluar';

import './index.less';

import ContactFix from '../../components/functionality/ContactFix';

export default () => {
  const [acceptedCookies, setAcceptedCookies] = useState(sessionStorage.getItem('cookies-accepted'));

  const onClick = () => {
    sessionStorage.setItem('cookies-accepted', '1');
    setAcceptedCookies('1');
  }

  return (
    <>
      {acceptedCookies !== '1' && (
        <div className="cookies">
          <div className="cookies--popup">
            <div className="cookies--popup__content container">
              <p>
                {Cluar.currentLanguage().locale === 'pt' && <>Utilizamos cookies no nosso website para lhe proporcionar a experiência mais relevante, para mais informações consulte a nossa <a href={`/${Cluar.currentLanguage().locale}/privacidade`}>política de cookies e privacidade</a>.</>}
                {Cluar.currentLanguage().locale === 'en' && <>We use cookies to provide you the best experience, check our <a href={`/${Cluar.currentLanguage().locale}/privacy`}>cookies and privacy policy</a>.</>}
              </p>
              <Button type="primary" shape="round" onClick={onClick}>
                {Cluar.currentLanguage().locale === 'pt' ? <>Aceitar</> : <>Accept</>}
              </Button>
            </div>
          </div>
        </div>
      )}
      {acceptedCookies === '1' && <ContactFix />}
    </>
  )

}
