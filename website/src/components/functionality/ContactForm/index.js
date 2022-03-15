import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, notification } from 'antd';
import _service from '@netuno/service-client';
import Cluar from '../../../common/Cluar';

import './index.less';

const { TextArea } = Input;

function ContactForm({ title }) {
  const validateMessages = {
    required: Cluar.plainDictionary('contact-form-validate-message-required'),
    types: {
      email: Cluar.plainDictionary('contact-form-validate-message-email')
    }
  };
  
  const layout = {
    rowGutter: { gutter: [25, 0] },
    labelCol: {span: 'hide'}
  };

  const [ loading, setLoading ] = useState(false);
  const handleFinish = (values)=> {
    values.contactForm.locale = window.localStorage.getItem('locale');
    setLoading(true);
    const fail = () => {
      setLoading(false);
      notification.error({
        message: title ,
        description: Cluar.plainDictionary('contact-form-fail'),
        top: 100
      });
    };
    _service({
      url: "contact",
      method: 'POST',
      data: values.contactForm,
      success: (response) => {
        if (response.json && response.json.result === true) {
          setLoading(false);
          notification.success({
            message: title ,
            description: Cluar.plainDictionary('contact-form-success'),
            top: 100
          });
        } else {
          fail();
        }
      },
      fail: (e) => {
        console.log("ContactForm failed:", e);
        fail();
      }
    });
  };
  return (
      <section className="contact-form">
        <hr/>
        <Form {...layout} validateMessages={validateMessages} onFinish={handleFinish}>
          <h2>{title}</h2>
          <Row {...layout.rowGutter}>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item {...layout.labelCol} label={Cluar.plainDictionary('contact-form-name')} name={['contactForm', 'name']} rules={[{ required: true }]}>
                <Input placeholder={Cluar.plainDictionary('contact-form-name')} />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item {...layout.labelCol} label={Cluar.plainDictionary('contact-form-email')} name={['contactForm', 'email']} rules={[{ required: true, type: 'email' }]}>
                <Input placeholder={Cluar.plainDictionary('contact-form-email')} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...layout.rowGutter}>
            <Col span={24}>
              <Form.Item {...layout.labelCol} label={Cluar.plainDictionary('contact-form-subject')} name={['contactForm', 'subject']} rules={[{ required: true }]}>
                <Input placeholder={Cluar.plainDictionary('contact-form-subject')} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...layout.rowGutter}>
            <Col span={24}>
              <Form.Item {...layout.labelCol} label={Cluar.plainDictionary('contact-form-message')} name={['contactForm', 'message']} rules={[{ required: true }]} >
                <TextArea autoSize={{ minRows: 3 }} placeholder={Cluar.plainDictionary('contact-form-message')} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...layout.rowGutter}>
            <Col span={24}>
              <Form.Item wrapperCol={24}>
                <Button htmlType="submit" type="primary" block {...{loading}}>{Cluar.plainDictionary('contact-form-send')}</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </section>
  );
}

export default ContactForm;
