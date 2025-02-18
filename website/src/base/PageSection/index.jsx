import React, { useState } from "react";

import { Button, Drawer, Form, Input, Divider, Popover, Flex } from "antd";
import {
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import SectionEditor from "./SectionEditor";

import "./index.less";

const PageSection = ({
  children,
  sectionData,
  onNewSection,
  onConfirmChanges,
  onRemoveSection,
  editMode,
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
      status: "to_create",
    };

    if (section === "banner") {
      newSectionData.type = "default";
    } else if (section === "content") {
      newSectionData.type = "text";
    } else if (section === "functionality") {
      newSectionData.type = "contact-form";
    }

    if (onNewSection) {
      onNewSection(newSectionData);
    }
  };

  const handleRemoveSection = () => {
    onRemoveSection({
      ...sectionData,
      status: "to_remove",
    });
  };

  const newSection = (
    <Flex vertical gap={8}>
      <Button onClick={() => handleNewSection("banner")}>Banner</Button>
      <Button onClick={() => handleNewSection("listing")}>Lista</Button>
      <Button onClick={() => handleNewSection("content")}>Conteúdo</Button>
      <Button onClick={() => handleNewSection("functionality")}>
        Funcionalidade
      </Button>
    </Flex>
  );

  return (
    <section className={editMode && "page-section"}>
      {children}
      {editMode && (
        <div>
          {sectionData && (
            <div className="page-section__buttons-group">
              <Button onClick={() => setOpenEditor(true)}>
                <EditOutlined />
              </Button>
              <Button onClick={handleRemoveSection}>
                <DeleteOutlined />
              </Button>
            </div>
          )}
          <SectionEditor
            onClose={() => setOpenEditor(false)}
            open={openEditor}
            sectionData={sectionData}
            onConfirmChanges={onConfirmChanges}
          />
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
        </div>
      )}
    </section>
  );
};

export default PageSection;
