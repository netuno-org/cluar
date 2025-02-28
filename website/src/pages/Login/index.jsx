import React, { useState, useEffect } from 'react';
import { Navigate, Link } from "react-router-dom";
import { Layout, Typography, Form, Input, Button, Checkbox, notification, Row, Col } from 'antd';
import _auth from '@netuno/auth-client';
import _service from '@netuno/service-client';
import Cluar from '../../common/Cluar';
import RecoverModal from './RecoverModal';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loggedUserInfoAction } from '../../redux/actions';

import {
  FaFacebook, FaGoogle, FaDiscord, FaGithub
} from "react-icons/fa";

import './index.less';

const { Title } = Typography;
const { Content, Sider } = Layout;

function Login({loggedUserInfoAction}) {
  const servicePrefix = _service.config().prefix;
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const columnConfig={
    xs: {
        span: 24
    },
    sm: {
        span: 24
    },
    md: {
        span: 16
    },
    lg: {
        span: 16
    },
    xl: {
      span: 12
    },
    xxl: {
      span: 10
    }
}


  useEffect(() => {
    if (_auth.isLogged()) {
      window.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, []);

  function onFinish(values) {
    console.log(values)
    setSubmitting(true);
    const { username, password, remember } = values;
    if (remember) {
      localStorage.setItem("login", JSON.stringify(values));
    } else {
      localStorage.removeItem("login");
    }
    _auth.login({
      username,
      password,
      data: (data) => {
        // data.myparameter = 'myvalue';
        return data;
      },
      success: (data) => {
        console.log(data)
        loggedUserInfoAction(data.json.extra);
        setSubmitting(false);
      },
      fail: (data) => {
        setSubmitting(false);
        if (data.isJSON) {
          if (data.json.blocked) {
            notification["error"]({
              message: Cluar.plainDictionary('login-form-user-blocked-message'),
              description:Cluar.plainDictionary('login-form-user-blocked-description'),
            });
            return;
          }
        }
        notification["error"]({
          message: Cluar.plainDictionary('login-form-wrong-credentials-message'),
          description:Cluar.plainDictionary('login-form-wrong-credentials-description'),
        });
      }
    });
  }

  function onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  let initialValues = { remember: true };
  if (localStorage.getItem("login") != null) {
    initialValues = JSON.parse(localStorage.getItem("login"));
  }

  if (_auth.isLogged()) {
    return <Navigate to="/reserved-area/users" />;
  } else {
    return (
      <Layout>
        <Row justify={'center'} align={'middle'}>
          <Col {...columnConfig}>
            <Content className="login-container">
              <div className="content-title">
                <Title>{Cluar.plainDictionary('login-form-subject')}</Title>
              </div>
              <div className="content-body">
                <p>{Cluar.plainDictionary('login-form-prividers-title')}</p>
                <Form
                  layout="vertical"
                  name="basic"
                  initialValues={initialValues}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  {Cluar.authProviders().facebook &&
                    <Form.Item>
                      <Button href={`${servicePrefix}_auth_provider/login/facebook`} name='facebook' icon={<FaFacebook />}>{Cluar.plainDictionary('login-form-login-provider').replace('${label}', 'Facebook')}</Button>
                    </Form.Item>}
                  {Cluar.authProviders().google &&
                    <Form.Item>
                      <Button href={`${servicePrefix}_auth_provider/login/google`} icon={<FaGoogle />}>{Cluar.plainDictionary('login-form-login-provider').replace('${label}', 'Google')}</Button>
                    </Form.Item>}
                  {Cluar.authProviders().github &&
                    <Form.Item>
                      <Button href={`${servicePrefix}_auth_provider/login/github`} icon={<FaGithub />}>{Cluar.plainDictionary('login-form-login-provider').replace('${label}', 'GitHub')}</Button>
                    </Form.Item>}
                  {Cluar.authProviders().discord &&
                    <Form.Item>
                      <Button href={`${servicePrefix}_auth_provider/login/discord`} icon={<FaDiscord />}>{Cluar.plainDictionary('login-form-login-provider').replace('${label}', 'Discord')}</Button>
                    </Form.Item>}

                  <Form.Item
                    label={Cluar.plainDictionary('login-form-username')}
                    name="username"
                    rules={[
                      { required: true, message:Cluar.plainDictionary('login-form-validate-message-required')},
                      { type: 'string', message: Cluar.plainDictionary('login-form-invalid-username-message'), pattern: "^[a-z]+[a-z0-9]{1,24}$" }
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label={Cluar.plainDictionary('login-form-password')}
                    name="password"
                    rules={[{ required: true, message:Cluar.plainDictionary('login-form-validate-message-required')}]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>{Cluar.plainDictionary('login-form-remember')}</Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button loading={submitting} type="primary" className="login-btn" htmlType="submit">
                      {Cluar.plainDictionary('login-form-sign-in')}
                    </Button>
                  </Form.Item>

                  <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={() => setVisible(!visible)} >{Cluar.plainDictionary('login-form-forgot-password')}</Button>
                    {visible && <RecoverModal onClose={() => { setVisible(false) }} />}
                  </Form.Item>

                  <hr />
                  <span><p>{Cluar.plainDictionary('login-form-division-title')}</p></span>
                  <Link to="/register">
                    <Button loading={submitting} type="default" className={"register-btn"}>
                      {Cluar.plainDictionary('login-form-register')}
                    </Button>
                  </Link>
                </Form>
              </div>
            </Content>
          </Col>
        </Row>
      </Layout>
    );
  }
}

const mapStateToProps = store => {
  return { };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  loggedUserInfoAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);