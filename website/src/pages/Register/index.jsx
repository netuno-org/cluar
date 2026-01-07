import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useParams, Link } from "react-router";
import { Layout, Typography, Form, Input, Button, notification, Row, Col } from 'antd';
import { PasswordInput } from "antd-password-input-strength";
import _auth from '@netuno/auth-client';
import _service from '@netuno/service-client';

import {
    FaFacebook, FaGoogle, FaDiscord, FaGithub
} from "react-icons/fa";

import Cluar from '../../common/Cluar';

import 'altcha';

import './index.less';

const { Title } = Typography;
const { Content, Sider } = Layout;

export default function Register(props) {
    const servicePrefix = _service.config().prefix;
    const [ready, setReady] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [altchaPayload, setAltchaPayload] = useState(null);
    const altcha = useRef(null);
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
        if (altcha && altcha.current) {
            function altchaVerified(ev) {
                if (ev.detail.state === "verified") {
                    setAltchaPayload(ev.detail.payload);
                }
            }
            altcha.current.addEventListener("statechange", altchaVerified, false);
            return () => {
                if (altcha.current != null) {
                    altcha.current.removeEventListener("statechange", altchaVerified, false);
                }
            }
        }
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
                email,
                altcha: altchaPayload
            },
            success: (response) => {
                if (response.json.result) {
                    notification["success"]({
                        message: Cluar.plainDictionary('register-form-success-message'),
                        description: Cluar.plainDictionary('register-form-success-description'),
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
                            message: Cluar.plainDictionary('register-form-existing-mail-message'),
                            description: Cluar.plainDictionary('register-form-existing-mail-description'),
                        });
                    }
                    if (e.json.error === 'user-already-exists') {
                        return notification["warning"]({
                            message: Cluar.plainDictionary('register-form-existing-username-message'),
                            description: Cluar.plainDictionary('register-form-existing-username-description'),
                        });
                    }
                }
                return notification["error"]({
                    message: Cluar.plainDictionary('register-form-failed-message'),
                    description: Cluar.plainDictionary('register-form-failed-description'),
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
                            <Title>{Cluar.plainDictionary('register-form-subject')}</Title>
                        </div>
                        <div className="content-body">
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
                                        <Button href={`${servicePrefix}_auth_provider/register/facebook`} icon={<FaFacebook />}>{Cluar.plainDictionary('register-form-register-provider').replace('${label}', 'Facebook')}</Button>
                                    </Form.Item>}
                                {Cluar.authProviders().google &&
                                    <Form.Item>
                                        <Button href={`${servicePrefix}_auth_provider/register/google`} icon={<FaGoogle />}>{Cluar.plainDictionary('register-form-register-provider').replace('${label}', 'Google')}</Button>
                                    </Form.Item>}
                                {Cluar.authProviders().github &&
                                    <Form.Item>
                                        <Button href={`${servicePrefix}_auth_provider/register/github`} icon={<FaGithub />}>{Cluar.plainDictionary('register-form-register-provider').replace('${label}', 'GitHub')}</Button>
                                    </Form.Item>}
                                {Cluar.authProviders().discord &&
                                    <Form.Item>
                                        <Button href={`${servicePrefix}_auth_provider/register/discord`} icon={<FaDiscord />}>{Cluar.plainDictionary('register-form-register-provider').replace('${label}', 'Discotd')}</Button>
                                    </Form.Item>}
                                <Form.Item
                                    label={Cluar.plainDictionary('register-form-name')}
                                    name="name"
                                    rules={[
                                        { required: true, message: Cluar.plainDictionary('register-form-validate-message-required') },
                                        { type: 'string', message: Cluar.plainDictionary('register-form-name-valid-message'), pattern: "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$" }
                                    ]}
                                >
                                    <Input disabled={submitting} maxLength={250} />
                                </Form.Item>
                                <Form.Item
                                    label={Cluar.plainDictionary('register-form-username')}
                                    name="username"
                                    rules={[
                                        { required: true, message: Cluar.plainDictionary('register-form-validate-message-required') },
                                        { type: 'string', message: Cluar.plainDictionary('register-form-username-valid-message'), pattern: "^[a-z]+[a-z0-9]{1,24}$" }
                                    ]}
                                >
                                    <Input disabled={submitting} maxLength={25} />
                                </Form.Item>
                                <Form.Item
                                    label={Cluar.plainDictionary('register-form-mail')}
                                    name="email"
                                    rules={[
                                        { type: 'email', message: Cluar.plainDictionary('register-form-mail-valid-message') },
                                        { required: true, message: Cluar.plainDictionary('register-form-validate-message-required') }
                                    ]}
                                >
                                    <Input disabled={submitting} maxLength={250} />
                                </Form.Item>
                                <Form.Item
                                    label={Cluar.plainDictionary('register-form-password')}
                                    name="password"
                                    rules={[
                                        { required: true, message: Cluar.plainDictionary('register-form-validate-message-required') },
                                        { type: 'string', message: Cluar.plainDictionary('register-form-password-valid-message'), min: 8, max: 25 },
                                    ]}
                                >
                                    <PasswordInput disabled={submitting} maxLength={25} />
                                </Form.Item>
                                <Form.Item
                                    label={Cluar.plainDictionary('register-form-confirm-password')}
                                    name="password_confirm"
                                    rules={[
                                        { required: true, message: Cluar.plainDictionary('register-form-validate-message-required') },
                                        { type: 'string', message: Cluar.plainDictionary('register-form-password-valid-message'), min: 8, max: 25 },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(Cluar.plainDictionary('register-form-passwords-not-equals-message'));
                                            },
                                        })
                                    ]}
                                >
                                    <Input.Password disabled={submitting} maxLength={25} />
                                </Form.Item>
                                <Form.Item>
                                    <altcha-widget
                                        ref={altcha}
                                        challengeurl={_service.url('/_altcha')}
                                        delay={1}
                                        hidelogo={true}
                                        hidefooter={true}
                                    ></altcha-widget>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={submitting} className='btn-register'>
                                        {Cluar.plainDictionary('register-form-register')}
                                    </Button>
                                </Form.Item>
                                <hr />
                                <span><p>{Cluar.plainDictionary('register-form-division-title')}</p></span>
                                <Link to="/login">
                                    <Button loading={submitting} type="default" >
                                        {Cluar.plainDictionary('register-form-sign-in')}
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