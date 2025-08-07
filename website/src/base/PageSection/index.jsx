import React, { useState } from "react";

import { Button, Drawer, Form, Input, Divider, Popover, Flex } from "antd";
import {
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
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
  sortArrowsVisible,
  onSortUp,
  onSortDown,
  disableSortUp = false,
  disableSortDown = false,
}) => {
  const [openEditor, setOpenEditor] = useState(false);
  const [newSectionVisible, setNewSectionVisible] = useState(false);

  const handleNewSection = (section) => {
    const newSectionData = {
      uid: new Date().getTime(),
      section,
      title: `<p><span style="color: rgb(0, 0, 0); background-color: rgba(255, 255, 255, 1); font-size: 40px; font-family: inherit;">${section}</span></p>`,
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
    } else if (section === "listing") {
      newSectionData.type = "default";
    } else if (section === "functionality") {
      newSectionData.type = "contact-form";
    } else if (section === "slider") {
      newSectionData.type = "default";
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
      <Button onClick={() => handleNewSection("slider")}>Slider</Button>
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
            key={sectionData?.sorter}
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
            {sortArrowsVisible && (
              <Button
                onClick={() => onSortDown(sectionData)}
                disabled={disableSortDown}
              >
                <ArrowDownOutlined />
              </Button>
            )}
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
            {sortArrowsVisible && (
              <Button
                onClick={() => onSortUp(sectionData)}
                disabled={disableSortUp}
              >
                <ArrowUpOutlined />
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PageSection;
