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

import _auth from "@netuno/auth-client";

import "./index.less";

const { Header } = Layout;
const { SubMenu } = Menu;

function BaseHeader() {
  const [burgerMenu, setBurgerMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState("main");

  const handleMenuClick = (selectMenu) => {
    setBurgerMenu(false);
    if (selectMenu) {
      setActiveMenu(selectMenu);
    }
    window.scrollTo(0, 0);
  };

  const menuLanguages = {
    label: Cluar.currentLanguage().code,
    key: "langs",
    icon: <GlobalOutlined />,
    children: [],
  };
  const menu = [];
  const subMenuKeys = [];
  const routes = [];
  for (const language of Cluar.languages()) {
    if (!Cluar.pages()[language.code]) {
      continue;
    }
    if (language.code !== Cluar.currentLanguage().code) {
      menuLanguages.children.push({
        key: language.code,
        label: (
          <div
            onClick={() => {
              Cluar.changeLanguage(language.locale);
              window.localStorage.setItem(
                "locale",
                Cluar.currentLanguage().locale
              );
              window.location.href = `/${language.locale}/`;
            }}
          >
            {language.description}
          </div>
        ),
      });
    }
    const buildChildren = (page) => {
      const children = Cluar.pages()[language.code].filter(
        (p) => p.parent === page.link
      );

      if (children.length === 0) {
        return;
      }

      return children.map((p) => {
        const key = p.link;

        subMenuKeys.push(key);

        if (p.menu) {
          return {
            key,
            label: p.navigable ? (
              p.link.indexOf("//") >= 0 ? (
                <a href={`${p.link}`} target="_blank">
                  {p.title}
                </a>
              ) : (
                <Link
                  to={`/${Cluar.currentLanguage().locale}${p.link}`}
                  onClick={() => handleMenuClick(key)}
                >
                  {p.title}
                </Link>
              )
            ) : (
              <a>{p.title}</a>
            ),
            children: buildChildren(p),
          };
        }
      });
    };
    const buildMenu = (page) => {
      if (page.menu && language.code === Cluar.currentLanguage().code) {
        const key = `${page.link}`;

        subMenuKeys.push(key);

        if (!page.parent && page.menu) {
          return {
            label: page.navigable ? (
              page.link.indexOf("//") >= 0 ? (
                <a href={`${page.link}`} target="_blank">
                  {page.title}
                </a>
              ) : (
                <Link
                  to={`/${Cluar.currentLanguage().locale}${page.link}`}
                  onClick={() => handleMenuClick(key)}
                >
                  {page.title}
                </Link>
              )
            ) : (
              <a>{page.title}</a>
            ),
            key,
            children: buildChildren(page),
          };
        }
      }
      return;
    };

    const subroutes = [];
    for (const page of Cluar.pages()[language.code]) {
      if (
        page.menu &&
        page.parent === "" &&
        language.code === Cluar.currentLanguage().code
      ) {
        menu.push(buildMenu(page, 0));
      }
    }
  }

  return (
    <Header
      className={`${classNames({
        "header-burger-open": burgerMenu,
      })} ${_auth.isLogged() && "ant-layout-header--logged"}`}
    >
      <div className="ant-layout-header__wrapper">
        <div className="logo">
          <Link
            to={`/${Cluar.currentLanguage().locale}/`}
            onClick={() => handleMenuClick("/")}
          >
            <img alt="logo" src="/images/logo.png" />
          </Link>
        </div>
        <div
          className={classNames({
            menu: true,
          })}
        >
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={[activeMenu]}
            selectedKeys={[activeMenu]}
            items={menu}
          />
        </div>
        <div
          className={classNames({
            menu: true,
            "menu-burger": true,
            "menu-burger-open": burgerMenu,
          })}
        >
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[activeMenu]}
            selectedKeys={[activeMenu]}
            openKeys={subMenuKeys}
            items={menu}
          />
        </div>
        <div className="menu-burger-button">
          <Burger
            isOpen={burgerMenu}
            onClick={() => {
              setBurgerMenu(!burgerMenu);
            }}
          />
        </div>
        <Menu
          theme="light"
          className="menu-languages"
          mode={"horizontal"}
          defaultSelectedKeys={[activeMenu]}
          selectedKeys={[activeMenu]}
          items={[menuLanguages]}
        />
      </div>
    </Header>
  );
}

export default BaseHeader;
