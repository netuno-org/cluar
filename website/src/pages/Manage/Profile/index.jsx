import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography, Form, Input, Button, Divider, notification, Row, Col } from 'antd';
import { PasswordInput } from "antd-password-input-strength";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loggedUserInfoReloadAction } from '../../../redux/actions';
import Cluar from '../../../common/Cluar';

import _service from '@netuno/service-client';

import Avatar from './Avatar';

const { Title } = Typography;

function Profile({ loggedUserInfo, loggedUserInfoReloadAction }) {
  const [submitting, setSubmitting] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [avatarImageURL, setAvatarImageURL] = useState('/images/profile-default.png');
  const profileAvatar = useRef(null);
  const profileForm = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const layout = {
    wrapperCol: { xs: { span: 24 }, sm: { span: 24 }, md: { span: 24 }, lg: { span: 12 } }
  };

  useEffect(() => {
    if (loggedUserInfo) {
      if (profileForm.current) {
        profileForm.current.setFieldsValue({
          name: loggedUserInfo?.name,
          username: loggedUserInfo?.username,
          email: loggedUserInfo?.email
        });
      }
      if (loggedUserInfo.avatar) {
        setAvatarImageURL(`${_service.config().prefix}people/avatar?uid=${loggedUserInfo.uid}`);
      }
    }
  }, [location, loggedUserInfo]);

  function onFinish(values) {
    setSubmitting(true);
    const { name, username, password, email } = values;
    _service({
      method: 'PUT',
      url: 'people',
      data: {
        name,
        username,
        password,
        email,
        avatar: profileAvatar?.current?.getImage()
      },
      success: (response) => {
        if (response.json.result) {
          notification["success"]({
            message: Cluar.plainDictionary('profile-form-success-message'),
            description: Cluar.plainDictionary('profile-form-success-description'),
          });
          setSubmitting(false);
          profileForm.current.setFieldsValue({
            password: "",
            password_confirm: ""
          });
          loggedUserInfoReloadAction();
        } else {
          notification["warning"]({
            message: Cluar.plainDictionary('profile-form-user-exists-message'),
            description: Cluar.plainDictionary('profile-form-user-exists-description'),
          });
          setSubmitting(false);
          profileForm.current.setFieldsValue({
            password: "",
            password_confirm: ""
          });
        }
      },
      fail: () => {
        setSubmitting(false);
        notification["error"]({
          message: Cluar.plainDictionary('profile-form-failed-message'),
          description: Cluar.plainDictionary('profile-form-failed-description'),
        });
      }
    });
  }

  function onValuesChange(changedValues, allValues) {
    if (allValues.password && allValues.password.length > 0) {
      setPasswordRequired(true);
    } else {
      setPasswordRequired(false);
    }
  };

  function onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  return (
    <div>
      <div className="content-title">
        <Button className="go-back-btn" type="link" onClick={() => navigate(-1)}><ArrowLeftOutlined /> {Cluar.plainDictionary('profile-page-previus')}</Button>
      </div>
      <div className="content-title">
        <Title level={2}>{Cluar.plainDictionary('profile-page-title')}</Title>
      </div>
      <div className="content-body">
        <Avatar ref={profileAvatar} currentImage={avatarImageURL} />
        <Divider orientation="left" plain>{Cluar.plainDictionary('profile-page-general-info')}</Divider>
        <Form
          {...layout}
          onValuesChange={onValuesChange}
          ref={profileForm}
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label={Cluar.plainDictionary('profile-form-name')}
            name="name"
            rules={[
              { required: true, message: Cluar.plainDictionary('profile-form-validate-message-required') },
              { type: 'string', message: Cluar.plainDictionary('profile-form-name-validate-message'), pattern: "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$" }
            ]}
          >
            <Input disabled={submitting} maxLength={25} />
          </Form.Item>
          <Form.Item
            label={Cluar.plainDictionary('profile-form-username')}
            name="username"
            rules={[
              { required: true, message: Cluar.plainDictionary('profile-form-validate-message-required') },
              { type: 'string', message: Cluar.plainDictionary('profile-form-name-validate-message'), pattern: "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$" }
            ]}
          >
            <Input disabled={submitting} maxLength={25} />
          </Form.Item>
          <Form.Item
            label={Cluar.plainDictionary('profile-form-mail')}
            name="email"
            rules={[
              { type: 'email', message: Cluar.plainDictionary('profile-form-mail-validate-message') },
              { required: true, message: Cluar.plainDictionary('profile-form-validate-message-required') }
            ]}
          >
            <Input disabled={submitting} maxLength={250} />
          </Form.Item>
          <Form.Item
            label={Cluar.plainDictionary('profile-form-password')}
            name="password"
            rules={[
              { type: 'string', message: Cluar.plainDictionary('profile-form-validate-password-message'), min: 8, max: 25 },
            ]}
          >
            <PasswordInput />
          </Form.Item>
          <Form.Item
            label={Cluar.plainDictionary('profile-form-confirm-password')}
            name="password_confirm"
            rules={[
              { required: passwordRequired, message: Cluar.plainDictionary('profile-form-validate-message-required') },
              { type: 'string', message: Cluar.plainDictionary('profile-form-validate-password-message'), min: 8, max: 25 },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(Cluar.plainDictionary('profile-form-password-not-equals-message'));
                },
              })
            ]}
          >
            <Input.Password maxLength={25} />
          </Form.Item>
          <Row justify={'start'}>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {Cluar.plainDictionary('profile-form-update')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

const mapStateToProps = store => {
  const { loggedUserInfo } = store.loggedUserInfoState;
  return {
    loggedUserInfo
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  loggedUserInfoReloadAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);