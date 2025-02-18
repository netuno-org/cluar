import React from "react";

import { Drawer, Form, Input, Button } from "antd";
import BannerEditor from "../BannerEditor";
import ListEditor from "../ListEditor";
import FunctionalityEditor from "../FunctionalityEditor";

const SectionEditor = ({ open, onClose, sectionData, onConfirmChanges }) => {
  const [form] = Form.useForm();

  const MoreEditor = () => {
    if (sectionData?.section === "banner") {
      return <BannerEditor sectionData={sectionData} form={form} />;
    } else if (sectionData?.section === "listing") {
      return <ListEditor sectionData={sectionData} form={form} />;
    } else if (sectionData?.section === "functionality") {
      return <FunctionalityEditor sectionData={sectionData} />;
    }
  };

  const handleConfirmChanges = () => {
    if (onConfirmChanges) {
      const confirmData = {
        ...sectionData,
        ...form.getFieldsValue(),
        status: "to_update",
      };

      onConfirmChanges(confirmData);

      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={580}
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
