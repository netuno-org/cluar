import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Input, notification } from 'antd';

import _service from '@netuno/service-client';
import Cluar from '../../../common/Cluar';

export default function RecoverModal(props) {

  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(true);
  const recoverForm = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  function onFinish(values) {
    setSubmitting(true);
    const { mail } = values;
    _service({
      method: 'POST',
      url: 'recovery',
      data: {
        mail,
        current_language:Cluar.currentLanguage().code
      },
      success: (response) => {
        if (response.json.result) {
          notification["success"]({
            message: Cluar.plainDictionary('recovery-modal-success-message'),
            description: Cluar.plainDictionary('recovery-modal-success-description'),
          });
          setSubmitting(false);
          setOpen(false);
        }
      },
      fail: () => {
        setSubmitting(false);
        notification["error"]({
          message: Cluar.plainDictionary('recovery-modal-failed-message'),
          description: Cluar.plainDictionary('recovery-modal-failed-description'),
        });
      }
    });
  }

  function onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  function onSubmit() {
    recoverForm.current.validateFields()
      .then(values => {
        recoverForm.current.resetFields();
        onFinish(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  function onCancel() {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  return (
    <Modal
      className={'modal-recover'}
      title={Cluar.plainDictionary('recovery-modal-title')}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          {Cluar.plainDictionary('recovery-modal-cancel')}
        </Button>,
        <Button key="send" type="primary" htmlType="submit" loading={submitting} onClick={onSubmit} >
           {Cluar.plainDictionary('recovery-modal-send')}
        </Button>
      ]}
    >
      <Form
        ref={recoverForm}
        name="basic"
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label= {Cluar.plainDictionary('recovery-modal-mail')}
          name="mail"
          rules={[
            { type: 'email', message: Cluar.plainDictionary('recovery-modal-mail-valid-message')},
            { required: true, message: Cluar.plainDictionary('recovery-modal-validate-message-required')}
          ]}
        >
          <Input disabled={submitting} maxLength={250} />
        </Form.Item>
      </Form>

    </Modal>
  );
}