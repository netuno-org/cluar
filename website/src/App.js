import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row, Col } from 'antd';
import { GlobalOutlined, PhoneOutlined, HomeOutlined, MailOutlined } from '@ant-design/icons';
import Burger from '@animated-burgers/burger-slip';
import '@animated-burgers/burger-slip/dist/styles.css';
import classNames from 'classnames';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import Analytics from './common/Analytics';
import Cluar from './common/Cluar';
import Builder from './common/Builder';
import Cookies from './components/Cookies';
import NotFound from './pages/NotFound';

import './styles/App.less';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

export default () => {

  const storageLocale = window.localStorage.getItem('locale');
  if (storageLocale == null) {
    window.localStorage.setItem('locale', Cluar.currentLanguage().locale);
  } else {
    Cluar.changeLanguage(storageLocale);
  }

  const [burgerMenu, setBurgerMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState('main');
  const [locale, setLocale] = useState(Cluar.currentLanguage().locale);

  const handleMenuClick = (selectMenu) => {
    setBurgerMenu(false);
    if (selectMenu) {
      setActiveMenu(selectMenu);
    }
    window.scrollTo(0, 0);
  };

  const menuLanguages = [];
  const menu = [];
  const subMenuKeys = [];
  const routes = [];
  for (const language of Cluar.languages()) {
    if (!Cluar.pages()[language.code]) {
      continue;
    }
    if (language.code !== Cluar.currentLanguage().code) {
      menuLanguages.push(
        <Menu.Item key={language.code} onClick={() => {
          Cluar.changeLanguage(language.locale);
          window.localStorage.setItem('locale', Cluar.currentLanguage().locale);
          window.location.href = `/${language.locale}/`;
        }}>{language.description}</Menu.Item>
      );
    }

    const buildMenu = (page) => {
      if (page.menu && language.code === Cluar.currentLanguage().code) {
        const key = `${page.link}`;
        if (Cluar.pages()[language.code].find((p) => p.menu && p.parent === page.link)) {
          subMenuKeys.push(key);
          return (
            <SubMenu key={key} title={
              <Link to={`/${Cluar.currentLanguage().locale}${page.link}`} onClick={() => handleMenuClick(key)}>
                {page.title}
              </Link>
            }>
              { Cluar.pages()[language.code].filter((p) => p.menu && p.parent === page.link).map((p) => buildMenu(p))}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item key={key}>
              <Link to={`/${Cluar.currentLanguage().locale}${page.link}`} onClick={() => handleMenuClick(key)}>
                {page.title}
              </Link>
            </Menu.Item>
          );
        }
      }
      return null;
    };

    const subroutes = [];
    for (const page of Cluar.pages()[language.code]) {
      if (page.menu && page.parent === "" && language.code === Cluar.currentLanguage().code) {
        menu.push(
          buildMenu(page)
        );
      }
      subroutes.push(
        <Route key={`/${language.locale}${page.link}`} exact path={`/${language.locale}${page.link}`} exact render={(propRouter) => {
          return <Builder page={page} />;
        }} />
      );
    }
    routes.push(
      <Route key={`/${language.locale}/`} path={`/${language.locale}/`}>
        {subroutes}
      </Route>
    );
  }

  useEffect(() => {
  }, []);

  return (
    <Router>
      { Analytics.init() && <Analytics.RouteTracker />}
      <div className="page">
        <Layout>
          <Header className={classNames({ 'header-burger-open': burgerMenu })}>
            <div className="logo">
              <Link to={`/${Cluar.currentLanguage().locale}/`} onClick={() => handleMenuClick('/')}>
                <img alt="logo" src="/images/logo.png" />
              </Link>
            </div>
            <div className={
              classNames({
                'menu': true
              })
            }>
              <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={[activeMenu]}
                selectedKeys={[activeMenu]}>
                {menu}
              </Menu>
            </div>
            <div className={
              classNames({
                'menu': true,
                'menu-burger': true,
                'menu-burger-open': burgerMenu
              })
            }>
              <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={[activeMenu]}
                selectedKeys={[activeMenu]}
                openKeys={subMenuKeys}>
                {menu}
              </Menu>
            </div>
            <div className="menu-burger-button">
              <Burger isOpen={burgerMenu} onClick={() => { setBurgerMenu(!burgerMenu); }} />
            </div>
            <Menu
              theme="light"
              className="menu-languages"
              mode={'horizontal'}
              defaultSelectedKeys={[activeMenu]}
              selectedKeys={[activeMenu]}>
              <SubMenu icon={<GlobalOutlined />} title={Cluar.currentLanguage().code}>
                {menuLanguages}
              </SubMenu>
            </Menu>
          </Header>
          <Content>
            <Switch>
              <Route path="/" exact render={(propRouter) => {
                return <Redirect to={`/${Cluar.currentLanguage().locale}/`} />;
              }} />
              {routes}
              <Route component={NotFound} />
            </Switch>
          </Content>
          <Footer>
            <Row align="middle" gutter={[0, 10]}>
              <Col xs={24} lg={8}>
                <div className="logo" data-sal="slide-up" data-sal-duration="2000" data-sal-easing="ease-out-cubic">
                  <img alt="logo" src="/images/logo.png" />
                </div>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 8, offset: 8 }}>
                <Row>
                  <Col><HomeOutlined /></Col>
                  <Col>
                    <address></address>
                  </Col>
                </Row>
                <Row>
                  <p><PhoneOutlined /></p>
                </Row>
                <Row>
                  <p><MailOutlined /></p>
                </Row>
              </Col>
            </Row>
          </Footer>
          <Cookies />
        </Layout>
      </div>
    </Router>
  );
}
