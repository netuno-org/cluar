import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Input, notification } from 'antd';

import _service from '@netuno/service-client';

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
      },
      success: (response) => {
        if (response.json.result) {
          notification["success"]({
            message: 'Alteração da Palavra-Passe ',
            description: 'Foi enviado um e-mail para a alteração da Palavra-Passe.',
          });
          setSubmitting(false);
          setOpen(false);
        }
      },
      fail: () => {
        setSubmitting(false);
        notification["error"]({
          message: 'Erro na Alteração da Palavra-Passe',
          description: 'Não foi possível alterar a palavra-passe, contacte-nos através do chat de suporte.',
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
      title="Recuperar o Acesso"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="send" type="primary" htmlType="submit" loading={submitting} onClick={onSubmit} >
          Enviar
        </Button>
      ]}
    >
      <Form
        ref={recoverForm}
        name="basic"
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Endereço de Mail"
          name="mail"
          rules={[
            { type: 'email', message: 'O e-mail inserido não é válido.' },
            { required: true, message: 'Insira o e-mail.' }
          ]}
        >
          <Input disabled={submitting} maxLength={250} />
        </Form.Item>
      </Form>

    </Modal>
  );
}