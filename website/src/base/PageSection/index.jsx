import React, { useState } from "react";

import { Button, Drawer, Form, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";
import SectionEditor from "./SectionEditor";

import "./index.less";

const PageSection = ({ children, sectionData }) => {
  const [openEditor, setOpenEditor] = useState(false);

  return (
    <section className="page-section">
      <Button
        className="page-section__edit-btn"
        onClick={() => setOpenEditor(true)}
      >
        <EditOutlined />
      </Button>
      <SectionEditor
        onClose={() => setOpenEditor(false)}
        open={openEditor}
        sectionData={sectionData}
      />
      {children}
    </section>
  );
};

export default PageSection;
