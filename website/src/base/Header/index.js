import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import Burger from '@animated-burgers/burger-slip';
import '@animated-burgers/burger-slip/dist/styles.css';
import classNames from 'classnames';
import {
  Route,
  Link
} from "react-router-dom";
import Cluar from '../../common/Cluar';
import Builder from '../../common/Builder';

import './index.less';

const { Header } = Layout;
const { SubMenu } = Menu;

function BaseHeader() {
  const [burgerMenu, setBurgerMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState('main');

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

    const buildMenu = (page, level) => {
      if (page.menu && language.code === Cluar.currentLanguage().code) {
        const key = `${page.link}`;
        if (Cluar.pages()[language.code].find((p) => p.menu && p.parent === page.link)) {
          subMenuKeys.push(key);
          return (
            <SubMenu key={key} popupClassName={`menu-level-${level + 1}`} title={
              page.navigable ?
                <Link to={`/${Cluar.currentLanguage().locale}${page.link}`} onClick={() => handleMenuClick(key)}>
                  {page.title}
                </Link>
              : <a>{page.title}</a>
            }>
              { Cluar.pages()[language.code].filter((p) => p.menu && p.parent === page.link).map((p) => buildMenu(p, level + 1))}
            </SubMenu>
          );
        } else {
          /**
           * Sample of submenu items customization, only on level 1:
           *
          if (level == 1) {
            return (
              <Menu.Item key={key}>
                { page.navigable ?
                  <Link to={`/${Cluar.currentLanguage().locale}${page.link}`} onClick={() => handleMenuClick(key)}>
                    <h2>{page.title}</h2>
                    <p>{page.description}</p>
                  </Link>
                  : <a>
                      <p className="sub-menu-item-title">{page.title}</p>
                      <p className="sub-menu-item-description">{page.description}</p>
                    </a> }
              </Menu.Item>
            );
          }
          **/
          return (
            <Menu.Item key={key}>
              { page.navigable ? 
                <Link to={`/${Cluar.currentLanguage().locale}${page.link}`} onClick={() => handleMenuClick(key)}>
                  {page.title}
                </Link>
                : <a>{page.title}</a> }
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
          buildMenu(page, 0)
        );
      }
      if (page.navigable == false) {
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
    <Header className={classNames({ 'header-burger-open': burgerMenu })}>
      <div className="ant-layout-header__wrapper">
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
          <SubMenu key="langs" icon={<GlobalOutlined />} title={Cluar.currentLanguage().code}>
            {menuLanguages}
          </SubMenu>
        </Menu>
      </div>
    </Header>
  );
}

export default BaseHeader;
