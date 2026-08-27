import React, { useState, useEffect } from 'react';
import {
  SettingOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  EditOutlined,
  LogoutOutlined,
  GlobalOutlined,
  FontSizeOutlined,
  ApartmentOutlined,
  FileOutlined,
  RollbackOutlined,
  LinkOutlined
} from '@ant-design/icons';
import {
  Col,
  Layout,
  Menu,
  Row,
  Typography,
  notification,
  Dropdown,
  Skeleton
} from 'antd';
import Cluar from '../../common/Cluar'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loggedUserInfoAction } from '../../redux/actions';

import _service from '@netuno/service-client';
import _auth from '@netuno/auth-client';

import "./index.less"
import { useNavigate, useLocation } from "react-router";
import ThemeSwitch from '../ThemeSwitch';

/*
 * Fonte única de "quem pode aceder a quê" dentro da área de gestão -
 * usada tanto para filtrar os itens do menu como para o guarda de
 * navegação (protectedRoutes, mais abaixo). Mantém alinhado com
 * CONTENT_MANAGEMENT_PATHS / SITE_ADMIN_PATHS / ACCESS_MANAGEMENT_PATHS
 * em server/core/_service_config.js - se um dia mudares lá quem pode
 * fazer o quê, muda aqui também.
 */

const MENU_PERMISSIONS = {
  pages: ["admin", "editor"],
  users: ["admin"],
  actions: ["admin", "editor"],
  languages: ["admin"],
  configuration: ["admin"],
  dictionary: ["admin", "editor"],
  organization: ["admin"],
};

const SideMenu = ({ loggedUserInfo, loggedUserInfoReload, loggedUserInfoAction }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [sideMenuMobileMode, setSideMenuMobileMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarImageURL, setAvatarImageURL] = useState('/images/profile-default.png');
  const navigate = useNavigate();
  const location = useLocation();

  const normalizeGroupCode = (group) => {
    if (!group) {
      return "";
    }

    const code =
      typeof group === "string"
        ? group
        : group.code || group.value || group.name || "";

    return String(code).trim().toLowerCase();
  };

  const groupAliases = {
    admin: ["administrator", "admin"],
    editor: ["editor"],
  };

  const hasPermissions = (groupsAllowed) => {
    if (!groupsAllowed.length) {
      return true;
    }

    const normalizedGroups = loggedUserInfo?.groups
      ?.map(normalizeGroupCode)
      .filter(Boolean);

    if (!normalizedGroups?.length) {
      return false;
    }

    return groupsAllowed.some((requestedGroup) => {
      const normalizedRequested = String(requestedGroup).trim().toLowerCase();
      const allowedAliases = groupAliases[normalizedRequested] || [
        normalizedRequested,
      ];

      return allowedAliases.some((alias) => normalizedGroups.includes(alias));
    });
  };

  const buildMenuItems = (menuItemsData) =>
    menuItemsData?.filter(Boolean).map((item) => ({
      ...item,
      children: item.children ? item.children.filter(Boolean) : undefined,
    }));


  const items = buildMenuItems([
    {
      key: 'profile',
      label: Cluar.plainDictionary('user-menu-edit-profile'),
      icon: <UserOutlined />,
      onClick: () => navigate("/reserved-area/profile"),
    },
    {
      key: 'return',
      label: Cluar.plainDictionary('user-menu-return-site'),
      icon: <RollbackOutlined />,
      onClick: () => navigate(`/${Cluar.currentLanguage().locale}/`),
    },
    {
      key: 'language',
      label: Cluar.plainDictionary('side-menu-options-language'),
      icon: <GlobalOutlined />,
      children: Cluar.languages()
        .filter((language) => language.code !== Cluar.currentLanguage().code)
        .map((language) => ({
          key: `language-${language.code}`,
          label: language.description,
          onClick: () => {
            Cluar.changeLanguage(language.locale);
            window.location.reload();
          },
        })),
    },
    hasPermissions([
      "admin",
      "editor"
    ]) && {
      key: '1',
      label: Cluar.plainDictionary('side-menu-options-manage'),
      type: 'group',
      children: [
        {
          key: 'pages',
          label: Cluar.plainDictionary('side-menu-options-pages'),
          icon: <FileOutlined />,
          onClick: () => navigate("/reserved-area/pages")
        },
        hasPermissions(MENU_PERMISSIONS.users) && {
          key: 'users',
          label: Cluar.plainDictionary('side-menu-options-users'),
          icon: <UserOutlined />,
          onClick: () => navigate("/reserved-area/users")
        },
        {
          key: 'actions',
          label: Cluar.plainDictionary('side-menu-options-actions'),
          icon: <LinkOutlined />,
          onClick: () => navigate("/reserved-area/actions")
        },
        hasPermissions(MENU_PERMISSIONS.languages) && {
          key: 'languages',
          label: Cluar.plainDictionary('side-menu-options-languages'),
          icon: <GlobalOutlined />,
          onClick: () => navigate("/reserved-area/languages")
        },
        hasPermissions(MENU_PERMISSIONS.configuration) && {
          key: 'configuration',
          label: Cluar.plainDictionary('side-menu-options-configurations'),
          icon: <SettingOutlined />,
          onClick: () => navigate("/reserved-area/configuration")

        },
        {
          key: 'dictionary',
          label: Cluar.plainDictionary('side-menu-options-dictionaries'),
          icon: <FontSizeOutlined />,
          onClick: () => navigate("/reserved-area/dictionary")

        },
        hasPermissions(MENU_PERMISSIONS.organization) && {
          key: 'organization',
          label: Cluar.plainDictionary('side-menu-options-organizations'),
          icon: <ApartmentOutlined />,
          onClick: () => navigate("/reserved-area/organization"),
        }
      ],
    },
    {
      key: 'logout',
      label: Cluar.plainDictionary('user-menu-sign-out'),
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => onLogout(),
    },
  ])

  const protectedRoutes = [
    {
      prefix: "/reserved-area/pages",
      groupsAllowed: MENU_PERMISSIONS.pages,
    },
    { prefix: "/reserved-area/users", groupsAllowed: MENU_PERMISSIONS.users },
    {
      prefix: "/reserved-area/actions",
      groupsAllowed: MENU_PERMISSIONS.actions,
    },
    {
      prefix: "/reserved-area/languages",
      groupsAllowed: MENU_PERMISSIONS.languages,
    },
    {
      prefix: "/reserved-area/configuration",
      groupsAllowed: MENU_PERMISSIONS.configuration,
    },
    {
      prefix: "/reserved-area/dictionary",
      groupsAllowed: MENU_PERMISSIONS.dictionary,
    },
    { prefix: "/reserved-area/organization", groupsAllowed: MENU_PERMISSIONS.organization },
  ];

  const getFirstAllowedRoute = () => {
    const route = protectedRoutes.find((routeData) =>
      hasPermissions(routeData.groupsAllowed),
    );

    return route?.prefix || "/reserved-area/profile";
  };

  useEffect(() => {
    if (loggedUserInfo?.groups && !loading) {
      const route = protectedRoutes.find((routeData) =>
        location.pathname.startsWith(routeData.prefix),
      );

      if (route && !hasPermissions(route.groupsAllowed)) {
        navigate(getFirstAllowedRoute());
      }
    }
  }, [location.pathname, loggedUserInfo, loading, navigate]);

  const selectedKey = (() => {
    if (location.pathname.startsWith("/reserved-area/pages")) {
      return "pages";
    }
    if (location.pathname.startsWith("/reserved-area/users")) {
      return "users";
    }
    if (location.pathname.startsWith("/reserved-area/actions")) {
      return "actions";
    }
    if (location.pathname.startsWith("/reserved-area/languages")) {
      return "languages";
    }
    if (location.pathname.startsWith("/reserved-area/configuration")) {
      return "configuration";
    }
    if (location.pathname.startsWith("/reserved-area/dictionary")) {
      return "dictionary";
    }
    if (location.pathname.startsWith("/reserved-area/organization")) {
      return "organization";
    }
    if (location.pathname.startsWith("/reserved-area/profile")) {
      return "profile";
    }
    return '1';
  })();

  function onLogout() {
    window.sessionStorage.setItem("builder-edit-mode", "0");
    _auth.logout();
    navigate('/login');
  }

  const userMenuItems = [
    // {
    //   key: 'profile',
    //   icon: <EditOutlined />,
    //   label: Cluar.plainDictionary('user-menu-edit-profile'),
    //   onClick: () => navigate("/reserved-area/profile"),
    // },
    // {
    //   key: 'logout',
    //   icon: <LogoutOutlined />,
    //   danger: true,
    //   label: Cluar.plainDictionary('user-menu-sign-out'),
    //   onClick: () => onLogout(),
    // }
  ];

  useEffect(() => {
    setLoading(true);
    _service({
      method: 'GET',
      url: 'reserved-area/people',
      success: (response) => {
        setLoading(false);
        if (response.json.result) {
          loggedUserInfoAction(response.json.data);
        } else {
          notification["warning"]({
            message: 'Dados do Utilizador',
            description: response.json.error,
          });
          setLoading(false);
        }
      },
      fail: (e) => {
        console.error('Dados do Utilizador', e);
        setLoading(false);
        notification["error"]({
          message: Cluar.plainDictionary('side-menu-load-user-info-failed-message'),
          description: Cluar.plainDictionary('side-menu-load-user-info-failed-description'),
        });
        window.sessionStorage.setItem("builder-edit-mode", "0");
        _auth.logout();
      }
    });
  }, [loggedUserInfoReload]);

  useEffect(() => {
    if (loggedUserInfo && loggedUserInfo.avatar) {
      setAvatarImageURL(null);
      setTimeout(() => setAvatarImageURL(`${_service.config().prefix}reserved-area/people/avatar?uid=${loggedUserInfo.uid}&${new Date().getTime()}`), 250);
    }
  }, [loggedUserInfo]);

  if (loading) {
    return (
      <Layout.Sider
        onBreakpoint={(mobile) => {
          setSideMenuMobileMode(mobile);
        }}
        collapsedWidth={sideMenuMobileMode ? "0" : "80"}
        breakpoint={"md"}
        trigger={collapsed ? <MenuOutlined /> : <CloseOutlined />}
        collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
        zeroWidthTriggerStyle={{
          top: 7,
          left: collapsed && 7
        }}
        theme='light'
        width={240}
      >
        <div className='side-menu'>
          <Row className='side-menu__user-info' justify={'center'}>
            <Col className='side-menu__user-info__content' span={24}>
              <Row className='side-menu__user-info__content__logo' justify={'center'} align={'middle'}>
                <Skeleton active paragraph={false} title={{ style: { height: 60, width: 60, borderRadius: 100, margin: "0 auto", marginTop: 10 } }} />
              </Row>
              <Row className='side-menu__user-info__content__user' justify={'center'} align={'middle'}>
                <Skeleton active paragraph={false} title={{ style: { height: 20, width: 200, margin: "0 auto" } }} />
              </Row>
            </Col>
          </Row>
          <hr className='side-menu__divider' />
          <Menu
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['1']}
            mode="inline"
            width={240}
            items={items}
          />
        </div>
      </Layout.Sider>
    );
  }

  if (loggedUserInfo && !loading) {
    return (
      <Layout.Sider
        onBreakpoint={(mobile) => {
          setSideMenuMobileMode(mobile);
        }}
        collapsedWidth={sideMenuMobileMode ? "0" : "80"}
        breakpoint={"md"}
        trigger={collapsed ? <MenuOutlined /> : <CloseOutlined />}
        collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
        zeroWidthTriggerStyle={{
          top: 7,
          left: collapsed && 7
        }}
        theme='light'
        width={240}
      >
        <div className='side-menu'>
          <Row className='side-menu__user-info' justify={'center'}>
            <Col className='side-menu__user-info__content' span={24}>
              <Row className='side-menu__user-info__content__logo' justify={'center'}>
                <Dropdown
                  placement='bottom'
                  menu={{ items: userMenuItems }}
                  trigger={['hover']}
                  arrow={{ pointAtCenter: true }}
                >
                  <span style={{ display: 'inline-block', cursor: 'pointer' }}>
                    {avatarImageURL ? <img src={avatarImageURL} alt="logo" /> : null}
                  </span>
                </Dropdown>
              </Row>
              <Row className='side-menu__user-info__content__user' justify={'center'}>
                <Typography.Text type='secondary' ellipsis >{loggedUserInfo.name}</Typography.Text>
              </Row>
            </Col>
          </Row>
          <hr className='side-menu__divider' />
          <Menu
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['1']}
            mode="inline"
            width={240}
            items={items}
          />
        </div>
        <div className='theme-switch-wrapper'>
          <ThemeSwitch />
        </div>
      </Layout.Sider>
    );
  }
};
const mapStateToProps = store => {
  const { loggedUserInfo, loggedUserInfoReload } = store.loggedUserInfoState;
  return {
    loggedUserInfo, loggedUserInfoReload
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  loggedUserInfoAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
