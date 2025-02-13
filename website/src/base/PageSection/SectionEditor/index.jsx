import React from "react";

import { Drawer, Form, Input, Button } from "antd";
import BannerEditor from "../BannerEditor";
import ListEditor from "../ListEditor";

const SectionEditor = ({ open, onClose, sectionData, onConfirmChanges }) => {
  const [form] = Form.useForm();

  const MoreEditor = () => {
    if (sectionData?.section === "banner") {
      return <BannerEditor sectionData={sectionData} form={form} />;
    } else if (sectionData?.section === "list") {
      return <ListEditor sectionData={sectionData} />;
    }
  };

  const handleConfirmChanges = () => {
    if (onConfirmChanges) {
      onConfirmChanges({
        ...sectionData,
        ...form.getFieldsValue(),
        status: "to_update",
      });

      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={520}
      extra={<Button onClick={handleConfirmChanges}>Aplicar</Button>}
    >
      <Form layout="vertical" initialValues={sectionData} form={form}>
        <Form.Item name="title" label="Título">
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Conteúdo">
          <Input.TextArea rows={6} />
        </Form.Item>
        <MoreEditor />
      </Form>
    </Drawer>
  );
};

export default SectionEditor;
