import React from 'react';
import { ConfigProvider, Layout } from 'antd';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Analytics from './common/Analytics';
import Cluar from './common/Cluar';
import Builder from './common/Builder';
import BaseCookies from './base/Cookies';
import BaseHeader from './base/Header';
import BaseFooter from './base/Footer';
import NotFound from './pages/NotFound';

import '@animated-burgers/burger-slip/dist/styles.css?inline';
import 'sal.js/dist/sal.css?inline';

import './styles/App.less';

const { Content } = Layout;

function App() {
  let urlLang = null;
  if (urlLang = /^\/([a-z]+)\//ig.exec(window.location.pathname)) {
    Cluar.changeLanguage(urlLang[1]);
  } else {
    const storageLocale = window.localStorage.getItem('locale');
    if (storageLocale == null) {
      Cluar.changeLanguage(Cluar.defaultLanguage().locale);
    } else {
      Cluar.changeLanguage(storageLocale);
    }
  }

  const routes = [];
  for (const language of Cluar.languages()) {
    if (!Cluar.pages()[language.code]) {
      continue;
    }
    const subroutes = [];
    for (const page of Cluar.pages()[language.code]) {
      if (page.navigable == false || page.link.indexOf('//') >= 0) {
        continue;
      }
      subroutes.push(
        <Route key={`/${language.locale}${page.link}`} path={`/${language.locale}${page.link}`} exact element={<Builder page={page} />} />
      );
    }
    routes.push(
      <Route key={`/${language.locale}/`} path={`/${language.locale}/`}>
        {subroutes}
      </Route>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1178FF',
          fontSize: 16,
          borderRadius: 20
        }
      }}
    >
      <BrowserRouter>
        { Cluar.isGAEnabled() && <Route component={Analytics} />}
        <div className="page">
          <Layout>
            <BaseHeader />
            <Content>
              <Routes>
                <Route path="/" exact element={<Navigate to={`/${Cluar.currentLanguage().locale}/`} />} />
                {routes}
                <Route element={<NotFound />} />
              </Routes>
            </Content>
            <BaseFooter />
            <BaseCookies />
          </Layout>
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
