import React, { useEffect, useRef } from 'react';
import { Modal, Button, Upload, Input, Form, Divider, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { INSERT_IMAGE_COMMAND } from '../utils/commands';

export default function InsertImageModal({ visible, onClose, activeEditor }) {
  const [form] = Form.useForm();
  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, []);

  const onInsert = (payload) => {
    const result = activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    //console.log('onInsert result', result);
    onClose();
    form.resetFields();
  };

  const handleSubmit = async () => {

    try {
      const values = await form.validateFields();

      if (values.file && values.file.file) {
        const file = values.file.file.originFileObj;
        const reader = new FileReader();
        reader.onload = () => {
          onInsert({ altText: file.name, src: reader.result });
        };
        reader.readAsDataURL(file);
      } else if (values.url) {
        onInsert({ altText: 'Image from URL', src: values.url });
      } else {
        message.warning('Por favor, forneça uma imagem (upload ou URL).');
      }
    } catch (err) {
      // Validation errors
    }
  };

  return (
    <Modal
      title="Inserir Imagem"
      open={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      footer={[
        <Button key="cancel" onClick={() => {
          onClose();
          form.resetFields();
        }}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Adicionar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="file" label="Upload de Imagem">
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Clique para fazer upload</Button>
          </Upload>
        </Form.Item>

        <Divider>ou</Divider>

        <Form.Item
          name="url"
          label="URL da Imagem"
          rules={[
            {
              validator: (_, value) => {
                const fileField = form.getFieldValue('file');
                if (!value && !fileField) {
                  return Promise.reject(new Error('Insira um arquivo ou uma URL.'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="https://exemplo.com/imagem.jpg" />
        </Form.Item>
      </Form>
    </Modal>
  );
}