import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useParams, Link } from "react-router-dom";
import { Layout, Typography, Form, Input, Button, notification, Row, Col } from 'antd';
import { PasswordInput } from "antd-password-input-strength";
import _auth from '@netuno/auth-client';
import _service from '@netuno/service-client';

import {
    FaFacebook, FaGoogle, FaDiscord, FaGithub
} from "react-icons/fa";

import Cluar from '../../common/Cluar';

import './index.less';

const { Title } = Typography;
const { Content, Sider } = Layout;

export default function Register(props) {
    const servicePrefix = _service.config().prefix;
    const [ready, setReady] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const registerForm = useRef(null);
    const { provider } = useParams(null);
    const columnConfig = {
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
        setSubmitting(true);
        const { username, password, email, name } = values;
        _service({
            method: 'POST',
            url: 'people',
            data: {
                name,
                username,
                password,
                email
            },
            success: (response) => {
                if (response.json.result) {
                    notification["success"]({
                        message: 'Conta Criada',
                        description: 'A conta foi criada com sucesso, pode iniciar sessão.',
                    });
                    setSubmitting(false);
                    setReady(true);
                }
            },
            fail: (e) => {
                setSubmitting(false);
                if (e && e.status === 409 && e.json && e.json.error) {
                    if (e.json.error === 'email-already-exists') {
                        return notification["warning"]({
                            message: 'E-mail Existente',
                            description: 'Este e-mail já existe, faça a recuperação do acesso no ecrã de login ou escolha outro.',
                        });
                    }
                    if (e.json.error === 'user-already-exists') {
                        return notification["warning"]({
                            message: 'Utilizador Existente',
                            description: 'Este utilizador já existe, faça a recuperação do acesso no ecrã de login ou escolha outro.',
                        });
                    }
                }
                return notification["error"]({
                    message: 'Erro na Criação de Conta',
                    description: 'Não foi possível criar a conta, contacte-nos através do chat de suporte.',
                });
            }
        });
    }

    function onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    }

    if (_auth.isLogged()) {
        return <Navigate to="/reserved-area" />;
    }
    if (ready) {
        return <Navigate to="/login" />;
    }
    return (
        <Layout>
            <Row justify={'center'} align={'middle'}>
                <Col {...columnConfig}>
                    <Content className="register-container">
                        <div className="content-title">
                            <Title>Criar conta.</Title>
                        </div>
                        <div className="content-body">
                            <p>Crie uma conta para poder aceder à sua área reservada.</p>
                            <Form
                                ref={registerForm}
                                layout="vertical"
                                name="basic"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                            >
                                {Cluar.authProviders().facebook &&
                                    <Form.Item>
                                        <Button href={`${servicePrefix}_auth_provider/register/facebook`} icon={<FaFacebook />}>Registrar com o Facebook</Button>
                                    </Form.Item>}
                                {Cluar.authProviders().google &&
                                    <Form.Item>
                                        <Button href={`${servicePrefix}_auth_provider/register/google`} icon={<FaGoogle />}>Registrar com o Google</Button>
                                    </Form.Item>}
                                {Cluar.authProviders().github &&
                                    <Form.Item>
                                        <Button href={`${servicePrefix}_auth_provider/register/github`} icon={<FaGithub />}>Registrar com o GitHub</Button>
                                    </Form.Item>}
                                {Cluar.authProviders().discord &&
                                    <Form.Item>
                                        <Button href={`${servicePrefix}_auth_provider/register/discord`} icon={<FaDiscord />}>Registrar com o Discord</Button>
                                    </Form.Item>}
                                <Form.Item
                                    label="Nome"
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Insira o seu nome.' },
                                        { type: 'string', message: 'Nome inválido, apenas letras minúsculas e maiúsculas.', pattern: "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$" }
                                    ]}
                                >
                                    <Input disabled={submitting} maxLength={250} />
                                </Form.Item>
                                <Form.Item
                                    label="Utilizador"
                                    name="username"
                                    rules={[
                                        { required: true, message: 'Insira o seu usuário.' },
                                        { type: 'string', message: 'Usuário inválido, apenas letras minúsculas e maiúsculas.', pattern: "^[a-z]+[a-z0-9]{1,24}$" }
                                    ]}
                                >
                                    <Input disabled={submitting} maxLength={25} />
                                </Form.Item>
                                <Form.Item
                                    label="E-mail"
                                    name="email"
                                    rules={[
                                        { type: 'email', message: 'O e-mail inserido não é válido.' },
                                        { required: true, message: 'Insira o e-mail.' }
                                    ]}
                                >
                                    <Input disabled={submitting} maxLength={250} />
                                </Form.Item>
                                <Form.Item
                                    label="Palavra-passe"
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Insira a palavra-passe.' },
                                        { type: 'string', message: 'Palavra-Passe deverá ter entre 8 a 25 caracteres.', min: 8, max: 25 },
                                    ]}
                                >
                                    <PasswordInput disabled={submitting} maxLength={25} />
                                </Form.Item>
                                <Form.Item
                                    label="Confirmar a Palavra-passe"
                                    name="password_confirm"
                                    rules={[
                                        { required: true, message: 'Insira a confirmação da palavra-passe.' },
                                        { type: 'string', message: 'Palavra-Passe deverá ter entre 8 a 25 caracteres.', min: 8, max: 25 },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('As palavras-passes não são iguais.');
                                            },
                                        })
                                    ]}
                                >
                                    <Input.Password disabled={submitting} maxLength={25} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={submitting} className='btn-register'>
                                        Criar Conta
                                    </Button>
                                </Form.Item>
                                <hr />
                                <span><p>ou</p></span>
                                <Link to="/login">
                                    <Button loading={submitting} type="default" >
                                        Iniciar Sessão
                                    </Button>
                                </Link>-
                            </Form>
                        </div>
                    </Content>
                </Col>
            </Row>
        </Layout>
    );
}