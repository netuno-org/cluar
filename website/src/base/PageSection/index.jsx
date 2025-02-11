import React, { useState } from "react";

import { Button, Drawer, Form, Input, Divider, Popover, Flex } from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import SectionEditor from "./SectionEditor";

import "./index.less";

const PageSection = ({
  children,
  sectionData,
  onNewSection,
  onConfirmChanges,
}) => {
  const [openEditor, setOpenEditor] = useState(false);

  const handleNewSection = (type) => {
    const newSectionData = {
      uid: new Date().getTime(),
      section: type,
      title: type,
      image: "",
      actions: [],
      items: [],
      position: {
        x: "",
        y: "",
      },
    };

    if (onNewSection) {
      onNewSection(newSectionData);
    }
  };

  const newSection = (
    <Flex vertical gap={8}>
      <Button onClick={() => handleNewSection("banner")}>Banner</Button>
      <Button onClick={() => handleNewSection("listing")}>List</Button>
      <Button onClick={() => handleNewSection("content")}>Conteúdo</Button>
    </Flex>
  );

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
        onConfirmChanges={onConfirmChanges}
      />
      {children}
      <div className="page-section__new">
        <Popover title="Nova seção" content={newSection}>
          <Button>
            <PlusCircleOutlined />
          </Button>
        </Popover>
      </div>
    </section>
  );
};

export default PageSection;
