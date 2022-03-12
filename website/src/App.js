import React from 'react';
import { Layout } from 'antd';
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

import './styles/App.less';

const { Content } = Layout;

function App() {
  const storageLocale = window.localStorage.getItem('locale');
  if (storageLocale == null) {
    window.localStorage.setItem('locale', Cluar.currentLanguage().locale);
  } else {
    Cluar.changeLanguage(storageLocale);
  }

  const routes = [];
  for (const language of Cluar.languages()) {
    if (!Cluar.pages()[language.code]) {
      continue;
    }
    const subroutes = [];
    for (const page of Cluar.pages()[language.code]) {
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
  );
}

export default App;