import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from "react-router";

import { Typography, Spin, Layout } from 'antd';

import { connect } from 'react-redux';

import _auth from '@netuno/auth-client';

import './index.less';
import SideMenu from '../../components/SideMenu';
import ThemeSwitch from '../../components/ThemeSwitch';

const { Title } = Typography;

function ReservedArea() {
  const navigate = useNavigate();

  useEffect(() => {
    _auth.config({
      onLogout: () => {
        navigate('/login');
      }
    });
  }, []);

  if (_auth.isLogged()) {
    let content = null;
    if (!true) {
      content = <Spin />;
    } else {
      content = (
        <Layout hasSider className='content-main'>
          <SideMenu />
          <Layout className='content-main__layout-content'>
            <Outlet />
          </Layout>
        </Layout>
      );
    }
    return (
      <div className="dashboard-layout-content">
        {content}
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}

export default ReservedArea;

// const mapStateToProps = store => {
//   const { loggedUserInfo } = store.loggedUserInfoState;
//   return {
//     loggedUserInfo
//   };
// };

// export default connect(mapStateToProps, {})(ReservedArea);