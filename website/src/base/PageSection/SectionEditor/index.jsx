import React from "react";

import { Drawer, Form, Input } from "antd";
import BannerEditor from "../BannerEditor";

const SectionEditor = ({ open, onClose, sectionData }) => {
  const MoreEditor = () => {
    if (sectionData?.section === "banner") {
      return <BannerEditor sectionData={sectionData} />;
    }
  };

  return (
    <Drawer open={open} onClose={onClose} width={520}>
      <Form layout="vertical" initialValues={sectionData}>
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
