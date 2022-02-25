import React from 'react';
import { Layout, Row, Col } from 'antd';
import { PhoneOutlined, HomeOutlined, MailOutlined } from '@ant-design/icons';
import Dictionary from '../../components/Dictionary';

import './index.less';

const { Footer } = Layout;

function BaseFooter() {
  return (
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
              <address><Dictionary entry="footer-address"/></address>
            </Col>
          </Row>
          <Row>
            <Col>
              <p><PhoneOutlined /> <Dictionary entry="footer-phone" oneLine/></p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p><MailOutlined /> <Dictionary entry="footer-email" oneLine/></p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Footer>
  );
}

export default BaseFooter;