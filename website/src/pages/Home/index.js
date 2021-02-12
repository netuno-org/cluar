import React from 'react';

import Banner from '../../components/Banner';
import Content from '../../components/Content';

import './index.less';

export default () => {
    return (
        <main>
          <Banner type="home"/>
          <Content type="introduction"/>
        </main>
    );
};
