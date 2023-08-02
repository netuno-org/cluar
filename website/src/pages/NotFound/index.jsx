import React from 'react';

import Cluar from '../../common/Cluar';

import './index.less';

function NotFound() {
  return (
    <main className="page--notfound">
      <h1>404</h1>
      <h2>
        {Cluar.currentLanguage().locale === 'pt' && <>Página não encontrada</>}
        {Cluar.currentLanguage().locale === 'en' && <>Page not found.</>}
      </h2>
    </main>
  );
};

export default NotFound;