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
  const [newSectionVisible, setNewSectionVisible] = useState(false);

  const handleNewSection = (section) => {
    const newSectionData = {
      uid: new Date().getTime(),
      section,
      title: section,
      image: "",
      actions: [],
      items: [],
      position: {
        x: "",
        y: "",
      },
    };

    if (section === "banner") {
      newSectionData.type = "default";
    } else if (section === "content") {
      newSectionData.type = "text";
    }

    if (onNewSection) {
      onNewSection(newSectionData);
    }
  };

  const newSection = (
    <Flex vertical gap={8}>
      <Button onClick={() => handleNewSection("banner")}>Banner</Button>
      <Button onClick={() => handleNewSection("listing")}>Lista</Button>
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
      <div
        className={`page-section__new ${
          newSectionVisible && "page-section__new--visible"
        }`}
      >
        <Popover
          title="Nova seção"
          trigger="click"
          content={newSection}
          onVisibleChange={setNewSectionVisible}
        >
          <Button>
            <PlusCircleOutlined />
          </Button>
        </Popover>
      </div>
    </section>
  );
};

export default PageSection;
