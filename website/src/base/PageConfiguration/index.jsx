import React from "react";

import { Drawer, Form, Input, Button, Switch } from "antd";

const PageConfiguration = ({ pageData, open, onClose }) => {
  const [form] = Form.useForm();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={520}
      title="Configurações da Página"
      extra={<Button type="primary">Salvar</Button>}
    >
      <Form layout="vertical" initialValues={pageData} form={form}>
        <Form.Item label="Título" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Descrição" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Palavras-chave" name="keywords">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Link" name="link">
          <Input />
        </Form.Item>
        <Form.Item label="Mostrar no Menu" name="menu">
          <Switch />
        </Form.Item>
        <Form.Item label="Título no Menu" name="menu_title">
          <Input />
        </Form.Item>
        <Form.Item label="Navegável" name="navigable">
          <Switch />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PageConfiguration;
