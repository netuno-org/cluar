import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import Burger from "@animated-burgers/burger-slip";
import "@animated-burgers/burger-slip/dist/styles.css";
import classNames from "classnames";
import { Route, Link } from "react-router";
import Cluar from "../../common/Cluar";
import Builder from "../../common/Builder";
import ThemeSwitch from "../../components/ThemeSwitch";

import _auth from "@netuno/auth-client";

import "./index.less";

const { Header } = Layout;
const { SubMenu } = Menu;

function BaseHeader({ canEdit }) {
  const [burgerMenu, setBurgerMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState("main");

  const handleMenuClick = (selectMenu) => {
    setBurgerMenu(false);
    if (selectMenu) {
      setActiveMenu(selectMenu);
    }
    window.scrollTo(0, 0);
  };

  const languagesMenu = {
    label: Cluar.currentLanguage().code,
    key: "langs",
    icon: <GlobalOutlined />,
    children: [],
  };
  const pagesMenu = [];
  const subpagesMenu = [];
  const routes = [];

  for (const language of Cluar.languages()) {
    if (!Cluar.pages()[language.code]) {
      continue;
    }

    if (language.code !== Cluar.currentLanguage().code) {
      languagesMenu.children.push({
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

    const buildSubpagesMenu = (page) => {
      const subPage = Cluar.pages()[language.code].filter(
        (p) => p.parent === page.link
      );

      if (subPage.length === 0) {
        return;
      }

      return subPage.map((p) => {
        const key = p.link;
        const label = p.menu_title || p.title;

        subpagesMenu.push(key);

        if (p.menu) {
          return {
            key,
            label: p.navigable ? (
              p.link.indexOf("//") >= 0 ? (
                <a href={`${p.link}`} target="_blank">
                  {label}
                </a>
              ) : (
                <Link
                  to={`/${Cluar.currentLanguage().locale}${p.link}`}
                  onClick={() => handleMenuClick(key)}
                >
                  {label}
                </Link>
              )
            ) : (
              <a>{label}</a>
            ),
            children: buildSubpagesMenu(p),
          };
        }
      });
    };

    const buildPagesMenu = (page) => {
      if (page.menu && language.code === Cluar.currentLanguage().code) {
        const key = `${page.link}`;
        const label = page.menu_title || page.title;

        subpagesMenu.push(key);

        if (!page.parent && page.menu) {
          return {
            label: page.navigable ? (
              page.link.indexOf("//") >= 0 ? (
                <a href={`${page.link}`} target="_blank">
                  {label}
                </a>
              ) : (
                <Link
                  to={`/${Cluar.currentLanguage().locale}${page.link}`}
                  onClick={() => handleMenuClick(key)}
                >
                  {label}
                </Link>
              )
            ) : (
              <a>{label}</a>
            ),
            key,
            children: buildSubpagesMenu(page),
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
        pagesMenu.push(buildPagesMenu(page, 0));
      }
    }
  }

  return (
    <Header
      className={`${classNames({
        "header-burger-open": burgerMenu,
      })} ${canEdit && "ant-layout-header--logged"}`}
    >
      <div className="ant-layout-header__wrapper">
        <div className="logo">
          <Link
            to={`/${Cluar.currentLanguage().locale}/`}
            onClick={() => handleMenuClick("/")}
          >
            <img alt="logo" src={Cluar.configuration("logo") !== "logo" ? `${Cluar.configuration("logo")}` : "/images/logo.png"} />
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
            items={pagesMenu}
          />
        </div>
        <div
          className={classNames({
            menu: true,
            "burger-menu": true,
            "burger-menu-open": burgerMenu,
          })}
        >
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[activeMenu]}
            selectedKeys={[activeMenu]}
            items={pagesMenu}
          />
          {["true", "1"].includes(String(Cluar.configuration("theme-switch")).toLowerCase()) && (
            <div className="burger-menu__theme-switch">
              <ThemeSwitch />
            </div>
          )}
        </div>
        <div className='burger-language'>
          <Menu
            theme="light"
            className="languages-menu"
            mode={"horizontal"}
            defaultSelectedKeys={[activeMenu]}
            selectedKeys={[activeMenu]}
            items={[languagesMenu]}
          />
          {["true", "1"].includes(String(Cluar.configuration("theme-switch")).toLowerCase()) && (
            <div className="burger-language__theme-switch">
              <ThemeSwitch />
            </div>
          )}
          <div className="burger-menu-button">
            <Burger
              isOpen={burgerMenu}
              onClick={() => {
                setBurgerMenu(!burgerMenu);
              }}
            />
          </div>
        </div>
      </div>
    </Header>
  );
}

export default BaseHeader;
