import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Row,
  Col,
  Form,
  Input,
  Collapse,
  Button,
  Flex,
  Modal,
  Card,
  message,
  Space,
  Switch,
  Radio,
  InputNumber,
} from "antd";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { HolderOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import LexicalEditor from "../../../LexicalEditor";
import MonacoEditor from "../../../MonacoEditor";
import Cluar from "../../../../common/Cluar";
import ImageSectionEditor from "../../ImageSectionEditor";

import "./index.less";

const SortableItem = ({
  item,
  itemIndex,
  onChangeItem,
  onRemoveItem,
  form,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const themeMode = useSelector((state) => state.theme?.mode || "light");

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [titleValue, setTitleValue] = useState(item?.title || "");

  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentValue, setContentValue] = useState(item?.content || "");

  // Modo HTML Puro
  const [contentEditMode, setContentEditMode] = useState(
    item?.edit_mode || "visual",
  );
  const [htmlContentValue, setHtmlContentValue] = useState(
    item?.html_content || "",
  );

  const [titleInvert, setTitleInvert] = useState(
    item?.title_invert_background || false,
  );
  const [contentInvert, setContentInvert] = useState(
    item?.content_invert_background || false,
  );

  useEffect(() => {
    setTitleValue(item?.title || "");
    setContentValue(item?.content || "");
    setContentEditMode(item?.edit_mode || "visual");
    setHtmlContentValue(item?.html_content || "");
    setTitleInvert(item?.title_invert_background || false);
    setContentInvert(item?.content_invert_background || false);
  }, [item]);

  const handleContentEditModeChange = (newMode) => {
    setContentEditMode(newMode);
    if (newMode === "html" && !htmlContentValue && contentValue) {
      setHtmlContentValue(contentValue);
    }
  };

  const handleSaveTitleModal = () => {
    form.setFieldsValue({
      itemsByUid: {
        [itemIndex]: { title: titleValue },
      },
    });
    onChangeItem(item.uid, "title", titleValue);
    setIsTitleModalOpen(false);
    message.success(
      Cluar.plainDictionary("sortable-col-item-notification-title-success"),
    );
  };

  const handleSaveContentModal = () => {
    form.setFieldsValue({
      itemsByUid: {
        [itemIndex]: {
          content: contentValue,
          html_content: htmlContentValue,
          edit_mode: contentEditMode,
        },
      },
    });
    onChangeItem(item.uid, "content", contentValue);
    onChangeItem(item.uid, "html_content", htmlContentValue);
    onChangeItem(item.uid, "edit_mode", contentEditMode);
    setIsContentModalOpen(false);
    message.success(
      Cluar.plainDictionary("sortable-col-item-notification-content-success"),
    );
  };

  const activeContentPreview =
    contentEditMode === "html" ? htmlContentValue : contentValue;

  return (
    <>
      <Col span={24} key={item.uid} style={style} className="sortable-col-item">
        <Flex align="center" className="sortable-col-item__wrapper">
          <Collapse
            className="sortable-col-item__wrapper__collapse"
            destroyInactivePanel={false}
            items={[
              {
                key: itemIndex,
                label: Cluar.plainHTML(item?.title),
                extra: (
                  <HolderOutlined
                    ref={setNodeRef}
                    {...attributes}
                    {...listeners}
                    onClick={(e) => e.stopPropagation()}
                    style={{ cursor: "grab" }}
                  />
                ),
                children: (
                  <div>
                    <Form.Item
                      label={Cluar.plainDictionary(
                        "sortable-col-item-field-title",
                      )}
                    >
                      <Card
                        size="small"
                        actions={[
                          <div
                            style={{ textAlign: "left", paddingLeft: "12px" }}
                          >
                            <Button
                              type="primary"
                              icon={<EditOutlined />}
                              onClick={() => setIsTitleModalOpen(true)}
                            >
                              {Cluar.plainDictionary(
                                "sortable-col-item-button-edit-title",
                              )}
                            </Button>
                          </div>,
                        ]}
                      >
                        <div>
                          {Cluar.plainHTML(titleValue).slice(0, 97) + "..."}
                        </div>
                      </Card>
                    </Form.Item>

                    <Form.Item name={["itemsByUid", itemIndex, "title"]} hidden>
                      <Input
                        onChange={(e) =>
                          onChangeItem(item.uid, "title", e.target.value)
                        }
                      />
                    </Form.Item>

                    {/* campos hidden */}
                    <Form.Item
                      name={["itemsByUid", itemIndex, "html_content"]}
                      hidden
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={["itemsByUid", itemIndex, "edit_mode"]}
                      hidden
                    >
                      <Input />
                    </Form.Item>

                    <Row gutter={24}>
                      {[
                        "span",
                        "xs",
                        "sm",
                        "md",
                        "lg",
                        "xl",
                        "xxl",
                        "xxxl",
                      ].map((size) => (
                        <Col span={8} key={size}>
                          <Form.Item
                            label={size}
                            name={["itemsByUid", itemIndex, size]}
                            getValueProps={(value) => ({
                              value: value !== null && value < 0 ? null : value,
                            })}
                          >
                            <InputNumber
                              onChange={(value) =>
                                onChangeItem(
                                  item.uid,
                                  size,
                                  value !== null && value < 0 ? null : value,
                                )
                              }

                              mode="spinner"
                            />
                          </Form.Item>
                        </Col>
                      ))}
                    </Row>

                    <Form.Item
                      label={Cluar.plainDictionary(
                        "sortable-col-item-field-section",
                      )}
                      name={["itemsByUid", itemIndex, "section"]}
                      initialValue={item.section}
                      style={{ display: "none" }}
                    >
                      <Input rows={3} />
                    </Form.Item>
                    <Form.Item
                      label={Cluar.plainDictionary(
                        "sortable-col-item-field-uid",
                      )}
                      name={["itemsByUid", itemIndex, "uid"]}
                      initialValue={item.uid}
                      style={{ display: "none" }}
                    >
                      <Input rows={3} />
                    </Form.Item>
                  </div>
                ),
              },
            ]}
          />
          <Button
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveItem(item.uid);
            }}
          >
            <CloseOutlined />
          </Button>
        </Flex>
      </Col>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 30,
            }}
          >
            <span>
              {Cluar.plainDictionary(
                "sortable-col-item-modal-title-edit-title",
              )}
            </span>
            <Space>
              <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                {Cluar.plainDictionary("sortable-col-item-invert-background")}
              </span>
              <Switch
                checked={titleInvert}
                onChange={(checked) => setTitleInvert(checked)}
                size="small"
              />
            </Space>
          </div>
        }
        open={isTitleModalOpen}
        onOk={handleSaveTitleModal}
        onCancel={() => setIsTitleModalOpen(false)}
        width={1000}
        okText={Cluar.plainDictionary("sortable-col-item-modal-save")}
        cancelText={Cluar.plainDictionary("sortable-col-item-modal-cancel")}
        centered
        destroyOnHidden
        maskClosable={false}
      >
        <div
          style={{
            backgroundColor: titleInvert
              ? themeMode === "dark"
                ? "#ffffff"
                : "#141414"
              : "transparent",
            borderRadius: "4px",
            transition: "all 0.3s",
          }}
        >
          <LexicalEditor
            initialHtml={titleValue}
            onChange={(html) => setTitleValue(html)}
            mode="simple"
            stripRootParagraph
          />
        </div>
      </Modal>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 30,
            }}
          >
            <span>
              {Cluar.plainDictionary(
                "sortable-col-item-modal-title-edit-content",
              )}
            </span>
            <Space>
              <Radio.Group
                className="editor-mode-toggle"
                value={contentEditMode}
                onChange={(e) => handleContentEditModeChange(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="visual">
                  {Cluar.plainDictionary("sortable-col-item-mode-visual")}
                </Radio.Button>
                <Radio.Button value="html">
                  {Cluar.plainDictionary("sortable-col-item-mode-code")}
                </Radio.Button>
              </Radio.Group>
              {contentEditMode === "visual" && (
                <>
                  <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                    {Cluar.plainDictionary(
                      "sortable-col-item-invert-background",
                    )}
                  </span>
                  <Switch
                    checked={contentInvert}
                    onChange={(checked) => setContentInvert(checked)}
                    size="small"
                  />
                </>
              )}
            </Space>
          </div>
        }
        open={isContentModalOpen}
        onOk={handleSaveContentModal}
        onCancel={() => setIsContentModalOpen(false)}
        width={1000}
        okText={Cluar.plainDictionary("sortable-col-item-modal-save")}
        cancelText={Cluar.plainDictionary("sortable-col-item-modal-cancel")}
        centered
        destroyOnHidden
        maskClosable={false}
      >
        <div
          style={{
            backgroundColor: contentInvert
              ? themeMode === "dark"
                ? "#ffffff"
                : "#141414"
              : "transparent",
            borderRadius: "4px",
            transition: "all 0.3s",
            paddingTop: contentEditMode === "html" ? 12 : 0,
          }}
        >
          {contentEditMode === "visual" ? (
            <LexicalEditor
              key="content-visual"
              initialHtml={contentValue}
              onChange={(html) => setContentValue(html)}
            />
          ) : (
            <MonacoEditor
              key="content-html"
              value={htmlContentValue}
              onChange={(value) => setHtmlContentValue(value)}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

const SortableColumn = ({
  items,
  setItemsOrder,
  onChangeItem,
  onRemoveItem,
  form,
}) => {
  return (
    <DndContext
      sensors={useSensors(useSensor(PointerSensor))}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (active.id !== over?.id) {
          const oldIndex = items.findIndex((i) => i.uid === active.id);
          const newIndex = items.findIndex((i) => i.uid === over?.id);
          const newItems = arrayMove(items, oldIndex, newIndex);
          const newOrder = newItems.map((item) => item.uid);
          setItemsOrder(newOrder);
        }
      }}
    >
      <SortableContext
        items={items.map((item) => item.uid)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableItem
            key={item.uid}
            item={item}
            itemIndex={item.uid}
            onChangeItem={onChangeItem}
            onRemoveItem={onRemoveItem}
            form={form}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableColumn;
