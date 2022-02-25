import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, notification } from 'antd';
import _service from '@netuno/service-client';
import Cluar from '../../../common/Cluar';

import './index.less';

const { TextArea } = Input;

const validateMessages = {
  required: '${label} é de preenchimento obrigatório!',
  types: {
    email: '${label} não é um email válido!'
  }
};

const layout = {
  rowGutter: { gutter: [25, 0] },
  labelCol: {span: 'hide'}
};

function ContactForm({ title }) {
  const [ loading, setLoading ] = useState(false);
  const handleFinish = (values)=> {
    values.contactForm.locale = window.localStorage.getItem('locale');
    setLoading(true);
    const fail = () => {
      setLoading(false);
      notification.error({
        message: title ,
        description: Cluar.dictionary('contact-fail'),
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
            description: Cluar.dictionary('contact-success'),
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
              <Form.Item {...layout.labelCol} label={Cluar.plainDictionary('contact-name')} name={['contactForm', 'name']} rules={[{ required: true }]}>
                <Input placeholder={Cluar.plainDictionary('contact-name')} />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item {...layout.labelCol} label="E-mail" name={['contactForm', 'email']} rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="E-mail" />
              </Form.Item>
            </Col>
          </Row>
          <Row {...layout.rowGutter}>
            <Col span={24}>
              <Form.Item {...layout.labelCol} label={Cluar.plainDictionary('contact-subject')} name={['contactForm', 'subject']} rules={[{ required: true }]}>
                <Input placeholder={Cluar.plainDictionary('contact-subject')} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...layout.rowGutter}>
            <Col span={24}>
              <Form.Item {...layout.labelCol} label={Cluar.plainDictionary('contact-message')} name={['contactForm', 'message']} rules={[{ required: true }]} >
                <TextArea autoSize={{ minRows: 3 }} placeholder={Cluar.plainDictionary('contact-message')} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...layout.rowGutter}>
            <Col span={24}>
              <Form.Item wrapperCol={24}>
                <Button htmlType="submit" type="primary" block {...{loading}}>{Cluar.plainDictionary('contact-send')}</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </section>
  );
}

export default ContactForm;
