import React, { useState } from 'react';
import { SettingOutlined, UserOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Col, Layout, Menu, Row, Typography, Dropdown } from 'antd';

import "./index.less"
import { Link } from 'react-router-dom';
const items = [
  {
    key: '1',
    label: 'Configurações',
    icon: <SettingOutlined />,
    children: [
      {
        key: 'users',
        label: 'Utilizadores',
        icon: <UserOutlined />

      }
    ],
  },
];
const SideMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sideMenuMobileMode, setSideMenuMobileMode] = useState(false);
  const onClick = (e) => {
    console.log('click ', e);
  };
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
      top: 15,
      left: collapsed && 10
    }}
    theme='light'
    width={240}
    >
      <div className='side-menu'>
        <Row className='side-menu__user-info' justify={'center'}>
          <Col className='side-menu__user-info__content' span={24}>
            <Row className='side-menu__user-info__content__logo' justify={'center'}>
              <Link title='Perfil'>
                <img src="images/logo.png" alt="logo" />
              </Link>
            </Row>
            <Row className='side-menu__user-info__content__user' justify={'center'}>
              <Typography.Text color='#FFF' ellipsis >Jailton de Araujo Santos</Typography.Text>
            </Row>
          </Col>
        </Row>
        <hr className='side-menu__divider' />
        <Menu
          onClick={onClick}

          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          width={240}
          items={items}
        />
      </div>
    </Layout.Sider>
  );
};
export default SideMenu;