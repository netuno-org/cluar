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
  ApartmentOutlined 
} from '@ant-design/icons';
import { 
  Col, 
  Layout, 
  Menu, 
  Row, 
  Typography, 
  notification, 
  Dropdown, 
  Skeleton, 
  Button 
} from 'antd';
import Cluar from '../../common/Cluar'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loggedUserInfoAction } from '../../redux/actions';

import _service from '@netuno/service-client';
import _auth from '@netuno/auth-client';

import "./index.less"
import { Link, useNavigate } from 'react-router-dom';

const SideMenu = ({ loggedUserInfo, loggedUserInfoReload, loggedUserInfoAction }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [sideMenuMobileMode, setSideMenuMobileMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarImageURL, setAvatarImageURL] = useState('/images/profile-default.png');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const items = [
    {
      key: '1',
      label: Cluar.plainDictionary('side-menu-options-manage'),
      icon: <SettingOutlined />,
      children: [
        {
          key: 'users',
          label: Cluar.plainDictionary('side-menu-options-users'),
          icon: <UserOutlined />,
          onClick: () => navigate("/reserved-area/users")

        },
        {
          key: 'languages',
          label: Cluar.plainDictionary('side-menu-options-languages'),
          icon: <GlobalOutlined />,
          onClick: () => navigate("/reserved-area/languages")

        },
        {
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
        {
          key: 'organization',
          label: Cluar.plainDictionary('side-menu-options-organizations'),
          icon: <ApartmentOutlined  />,
          onClick: () => navigate("/reserved-area/organization")

        }
      ],
    },
  ];

  function onLogout() {
    _auth.logout();
    navigate('/login');
  }

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/reserved-area/profile">
          <EditOutlined />&nbsp;&nbsp;&nbsp;{Cluar.plainDictionary('user-menu-edit-profile')}
        </Link></Menu.Item>
      <Menu.Item key="2">
        <Button type="link" onClick={onLogout} danger style={{ padding: "0px" }}>
          <LogoutOutlined /> {Cluar.plainDictionary('user-menu-sign-out')}
        </Button>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    setLoading(true);
    _service({
      method: 'GET',
      url: 'people',
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
        _auth.logout();
      }
    });
  }, [loggedUserInfoReload]);

  useEffect(() => {
    if (loggedUserInfo && loggedUserInfo.avatar) {
      setAvatarImageURL(null);
      setTimeout(() => setAvatarImageURL(`${_service.config().prefix}people/avatar?uid=${loggedUserInfo.uid}&${new Date().getTime()}`), 250);
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
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
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
                <Link>
                  <Dropdown placement='bottom' overlay={menu} trigger={['hover']} arrow={{ pointAtCenter: true, }}>
                    {avatarImageURL && <img src={avatarImageURL} alt="logo" />}
                  </Dropdown>
                </Link>
              </Row>
              <Row className='side-menu__user-info__content__user' justify={'center'}>
                <Typography.Text color='#FFF' ellipsis >{loggedUserInfo.name}</Typography.Text>
              </Row>
            </Col>
          </Row>
          <hr className='side-menu__divider' />
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            width={240}
            items={items}
          />
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