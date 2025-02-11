import React from 'react';
import { Navigate } from "react-router-dom";

import { Typography, Spin, Layout } from 'antd';

import { connect } from 'react-redux';

import _auth from '@netuno/auth-client';

import './index.less';
import SideMenu from '../../components/SideMenu';

const { Title } = Typography;

function ReservedArea() {
  if (_auth.isLogged()) {
    let content = null;
    if (!true) {
      content = <Spin />;
    } else {
      content = (
        <Layout hasSider className='content-main'>
          <SideMenu/>
          <Layout>
            {/* <Title level={2}>Olá {loggedUserInfo.name}!</Title> */}
            <Title level={2}>Olá jailton!</Title>
            <Title level={3} style={{ marginTop: 0 }}>Bem-vindo(a) à sua Área Reservada!</Title>
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