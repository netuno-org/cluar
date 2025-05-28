import React from 'react';
import { ConfigProvider, Layout } from 'antd';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { Provider } from 'react-redux';
import { Store } from './redux/store';

//import Analytics from './common/Analytics';
import Cluar from './common/Cluar';
import Builder from './common/Builder';
import BaseCookies from './base/Cookies';
import BaseHeader from './base/Header';
import BaseFooter from './base/Footer';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ReservedArea from './pages/ReservedArea';
import Profile from './pages/Manage/Profile';
import Pages from './pages/Manage/Pages';
import Users from './pages/Manage/Users';
import Languages from './pages/Manage/Languages';
import Configuration from './pages/Manage/Configuration';
import Dictionary from './pages/Manage/Dictionary';
import Recovery from './pages/Recovery';
import Organization from './pages/Manage/Organization';

import '@animated-burgers/burger-slip/dist/styles.css?inline';
import 'sal.js/dist/sal.css?inline';

import _auth from "@netuno/auth-client";

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
        <Route
          key={`/${language.locale}${page.link}`}
          path={`/${language.locale}${page.link}`}
          exact
          element={<Builder page={page} />}
        />
      );
    }
    routes.push(
      <Route key={`/${language.locale}/`} path={`/${language.locale}/`}>
        {subroutes}
      </Route>
    );
    console.log("Cluar.pages()", Cluar.pages());
  }

  console.log("routes", routes);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1178FF",
          fontSize: 16,
          borderRadius: 2,
        },
      }}
    >
      <Provider store={Store}>
        <BrowserRouter>
          
          <div className="page">
            <Layout className={_auth.isLogged() && "ant-layout--logged"}>
              <BaseHeader />
              <Content>
                <Routes>
                  <Route
                    path="/"
                    exact
                    element={
                      <Navigate to={`/${Cluar.currentLanguage().locale}/`} />
                    }
                  />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/recovery" element={<Recovery />} />
                  <Route path="/reserved-area" element={<ReservedArea />}> 
                      <Route path="profile" element={<Profile/>}/>
                      <Route path="pages" element={<Pages/>}/>
                      <Route path="users" element={<Users/>}/>
                      <Route path="languages" element={<Languages/>}/>
                      <Route path="configuration" element={<Configuration/>}/>
                      <Route path="dictionary" element={<Dictionary/>}/>
                      <Route path="organization" element={<Organization/>}/>
                  </Route>
                  {routes}
                  <Route element={<NotFound />} />
                </Routes>
              </Content>
              <BaseFooter />
              <BaseCookies />
            </Layout>
          </div>
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
