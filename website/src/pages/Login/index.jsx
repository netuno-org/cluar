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
              message: 'Login Bloqueado',
              description:
              'O login foi bloqueado, realize o processo de desbloqueamento ou contate o suporte.',
            });
            return;
          }
        }
        notification["error"]({
          message: 'Login Inválido',
          description:
          'Por favor verifique as credenciais inseridas.',
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
    return <Navigate to="/reserved-area" />;
  } else {
    return (
      <Layout>
        <Row justify={'center'} align={'middle'}>
          <Col {...columnConfig}>
            <Content className="login-container">
              <div className="content-title">
                <Title>Iniciar sessão.</Title>
              </div>
              <div className="content-body">
                <p>Inicie sessão com os seus dados.</p>
                <Form
                  layout="vertical"
                  name="basic"
                  initialValues={initialValues}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  {Cluar.authProviders().facebook &&
                    <Form.Item>
                      <Button href={`${servicePrefix}/_auth_provider/login/facebook`} icon={<FaFacebook />}>Entrar com o Facebook</Button>
                    </Form.Item>}
                  {Cluar.authProviders().google &&
                    <Form.Item>
                      <Button href={`${servicePrefix}/_auth_provider/login/google`} icon={<FaGoogle />}>Entrar com o Google</Button>
                    </Form.Item>}
                  {Cluar.authProviders().github &&
                    <Form.Item>
                      <Button href={`${servicePrefix}/_auth_provider/login/github`} icon={<FaGithub />}>Entrar com o GitHub</Button>
                    </Form.Item>}
                  {Cluar.authProviders().discord &&
                    <Form.Item>
                      <Button href={`${servicePrefix}/_auth_provider/login/discord`} icon={<FaDiscord />}>Entrar com o Discord</Button>
                    </Form.Item>}

                  <Form.Item
                    label="Utilizador"
                    name="username"
                    rules={[
                      { required: true, message: 'Insira o seu usuário.' },
                      { type: 'string', message: 'Usuário inválido, apenas letras minúsculas e maiúsculas.', pattern: "^[a-z]+[a-z0-9]{1,24}$" }
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Palavra-passe"
                    name="password"
                    rules={[{ required: true, message: 'Insira a palavra-passe.' }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Relembrar</Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button loading={submitting} type="primary" className="login-btn" htmlType="submit">
                      Iniciar Sessão
                    </Button>
                  </Form.Item>

                  <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={() => setVisible(!visible)} >Esqueceu-se da palavra passe?</Button>
                    {visible && <RecoverModal onClose={() => { setVisible(false) }} />}
                  </Form.Item>

                  <hr />
                  <span><p>ou</p></span>
                  <Link to="/register">
                    <Button loading={submitting} type="default" className={"register-btn"}>
                      Criar Conta
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