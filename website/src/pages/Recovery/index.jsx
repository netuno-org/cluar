import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { Layout, Typography, Form, Input, Button, notification, Row, Col } from 'antd';
import { PasswordInput } from "antd-password-input-strength";
import _service from '@netuno/service-client';
import Cluar from '../../common/Cluar';

import './index.less';

const { Title } = Typography;
const { Content, Sider } = Layout;

export default function Recovery(props) {
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

    const [ready, setReady] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [hash, setHash] = useState(false);
    const recoveryForm = useRef(null);

    const location = useLocation();

    useEffect(() => {
        setHash(location.hash.substring(1));
    }, [location]);

    function onFinish(values) {
        setSubmitting(true);
        const { password } = values;
        _service({
            method: 'PUT',
            url: 'recovery',
            data: {
                password,
                key: hash
            },
            success: (response) => {
                if (response.json.result) {
                    notification["success"]({
                        message: Cluar.plainDictionary('recovery-form-success-message'),
                        description: Cluar.plainDictionary('recovery-form-success-description'),
                    });
                    setSubmitting(false);
                    setReady(true);
                }
            },
            fail: () => {
                setSubmitting(false);
                notification["error"]({
                    message: Cluar.plainDictionary('recovery-form-failed-message'),
                    description: Cluar.plainDictionary('recovery-form-failed-description'),
                });
            }
        });
    }

    function onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    }

    if (ready) {
        return <Navigate to="/login" />;
    } else if (window.location.hash && window.location.hash !== "") {
        return (
            <Layout>
                <Content className="recovery-container">
                    <Row justify={'center'}>
                        <Col {...columnConfig}>
                            <div className="content-title">
                                <Title>{Cluar.plainDictionary('recovery-form-title')}</Title>
                            </div>
                            <div className="content-body">
                                <Form
                                    ref={recoveryForm}
                                    layout="vertical"
                                    name="basic"
                                    initialValues={{}}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                >
                                    <Form.Item
                                        label={Cluar.plainDictionary('recovery-form-password')}
                                        name="password"
                                        rules={[
                                            { required: true, message: Cluar.plainDictionary('recovery-form-validate-message-required') },
                                            { type: 'string', message: Cluar.plainDictionary('recovery-form-password-valid-message'), min: 8, max: 25 },
                                        ]}
                                    >
                                        <PasswordInput disabled={submitting} maxLength={25} />
                                    </Form.Item>
                                    <Form.Item
                                        label={Cluar.plainDictionary('recovery-form-confirm-password')}
                                        name="password_confirm"
                                        rules={[
                                            { required: true, message: Cluar.plainDictionary('recovery-form-validate-message-required') },
                                            { type: 'string', message: Cluar.plainDictionary('recovery-form-password-valid-message'), min: 8, max: 25 },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(Cluar.plainDictionary('recovery-form-passwords-not-equals-message'));
                                                },
                                            })
                                        ]}
                                    >
                                        <Input.Password disabled={submitting} maxLength={25} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={submitting}>
                                            {Cluar.plainDictionary('recovery-form-confirm-password')}
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
    /* else {
        return <NotFoundPage />;
    } */

}