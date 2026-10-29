import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Row,
  Col,
  Input,
  Divider,
  Button,
  InputNumber,
  Collapse,
} from "antd";

import SortableColumn from "./SortableColumn";
import ImageSectionEditor from "../ImageSectionEditor";
import _service from "@netuno/service-client";
import Cluar from "../../../common/Cluar";
import MetadataEditor from "../../../base/MetadataEditor";

const COLUMN_BREAKPOINTS = [
  "span",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "xxl",
  "xxxl",
];
const COLUMN_BREAKPOINT_LABELS = {
  span: "Todos os tamanhos",
  xs: "Extra pequeno (xs)",
  sm: "Pequeno (sm)",
  md: "Médio (md)",
  lg: "Grande (lg)",
  xl: "Extra grande (xl)",
  xxl: "Muito grande (xxl)",
  xxxl: "Ultra grande (xxxl)",
};
const ANT_GRID_COLUMNS = 24;

const RowEditor = ({ sectionData, form }) => {
  const [itemsOrder, setItemsOrder] = useState([]);
  const [itemsByUid, setItemsByUid] = useState({});
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [bulkColumnSizes, setBulkColumnSizes] = useState(
    Object.fromEntries(
      COLUMN_BREAKPOINTS.map((breakpoint) => [breakpoint, null]),
    ),
  );

  const [typeOptions, setTypeOptions] = useState([]);
  const [config, setConfig] = useState([]);

  const [showActions, setShowActions] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [showMetadata, setShowMetadata] = useState(false);

  const currentLangCode = Cluar.currentLanguage()?.code;
  const allActions = Cluar.actions() || [];
  const actionsData = allActions.filter(
    (action) => action.language_code === currentLangCode,
  );

  useEffect(() => {
    _service({
      url: "/reserved-area/component/row/list",
      method: "POST",
      data: {
        language: Cluar.currentLanguage().locale,
      },
      success: (res) => {
        setTypeOptions(res.json.data.types);
        setConfig(res.json.data.config);

        const initialType = form.getFieldValue("type");
        setSelectedType(initialType);

        const typeConfig = res.json.data.config.find(
          (c) => c.name === initialType,
        );
        setShowActions(typeConfig?.action || false);
        setShowMetadata(typeConfig?.metadata || false);
      },
      fail: (error) => {
        console.error(error);
      },
    });
  }, []);

  const handleChangeItem = (uid, property, value) => {
    setItemsByUid((prev) => {
      const updatedItem = {
        ...prev[uid],
        [property]: value,
      };

      const newItemsByUid = {
        ...prev,
        [uid]: updatedItem,
      };

      form.setFieldsValue({
        itemsByUid: newItemsByUid,
      });

      return newItemsByUid;
    });
  };

  const createItem = (width) => ({
    uid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    section: "col",
    title: "",
    content: "",
    html_content: "",
    edit_mode: "visual",
    link: "",
    ...(width
      ? Object.fromEntries(
          COLUMN_BREAKPOINTS.map((breakpoint) => [breakpoint, width]),
        )
      : {}),
  });

  const handleAddItem = () => {
    const newItem = createItem();

    const newItemsByUid = {
      ...itemsByUid,
      [newItem.uid]: newItem,
    };

    setItemsByUid(newItemsByUid);
    setItemsOrder([...itemsOrder, newItem.uid]);

    form.setFieldsValue({
      itemsByUid: newItemsByUid,
    });
  };

  const handleAddPreset = (columnCount) => {
    const width = 24 / columnCount;
    const newItems = Array.from({ length: columnCount }, () =>
      createItem(width),
    );
    const newItemsByUid = {
      ...itemsByUid,
      ...Object.fromEntries(newItems.map((item) => [item.uid, item])),
    };

    setItemsByUid(newItemsByUid);
    setItemsOrder([...itemsOrder, ...newItems.map((item) => item.uid)]);

    form.setFieldsValue({
      itemsByUid: newItemsByUid,
    });
  };

  const handleRemoveItem = (uid) => {
    const { [uid]: removedItem, ...newItemsByUid } = itemsByUid;
    const newItemsOrder = itemsOrder.filter((id) => id !== uid);

    setSelectedColumns((previous) => previous.filter((id) => id !== uid));
    setItemsByUid(newItemsByUid);
    setItemsOrder(newItemsOrder);

    form.setFieldsValue({
      itemsByUid: newItemsByUid,
    });
  };

  const handleApplyColumnSizes = () => {
    const sizesToApply = Object.fromEntries(
      COLUMN_BREAKPOINTS.filter(
        (breakpoint) => bulkColumnSizes[breakpoint] !== null,
      ).map((breakpoint) => [
        breakpoint,
        Math.round(
          (Number(bulkColumnSizes[breakpoint]) / 100) * ANT_GRID_COLUMNS,
        ),
      ]),
    );

    if (!selectedColumns.length || !Object.keys(sizesToApply).length) {
      return;
    }

    const updatedItemsByUid = { ...itemsByUid };
    selectedColumns.forEach((uid) => {
      updatedItemsByUid[uid] = {
        ...updatedItemsByUid[uid],
        ...sizesToApply,
      };
    });

    setItemsByUid(updatedItemsByUid);
    form.setFieldsValue({
      itemsByUid: updatedItemsByUid,
    });
  };

  useEffect(() => {
    if (sectionData && sectionData.items && !itemsOrder.length) {
      const map = {};
      const order = [];

      sectionData.items.forEach((item) => {
        map[item.uid] = item;
        order.push(item.uid);
      });

      setItemsByUid(map);
      setItemsOrder(order);

      form.setFieldsValue({
        itemsByUid: map,
      });
    }
  }, [sectionData]);

  useEffect(() => {
    const orderedItems = itemsOrder.map((uid) => itemsByUid[uid]);
    form.setFieldValue("items", orderedItems);
  }, [itemsOrder, itemsByUid]);

  const items = itemsOrder.map((uid) => itemsByUid[uid]);

  return (
    <div className="row-editor">
      <Form.Item
        label={Cluar.plainTranslation("row-editor-field-type")}
        name="type"
      >
        <Select
          options={typeOptions.map((item) => ({
            label: item.info.label,
            value: item.name,
          }))}
          onChange={(value) => {
            setSelectedType(value);

            const typeConfig = config.find((c) => c.name === value);
            setShowActions(typeConfig?.action || false);
            setShowMetadata(typeConfig?.metadata || false);
          }}
        />
      </Form.Item>

      {showActions && (
        <Form.Item
          label={Cluar.plainTranslation("row-editor-field-actions")}
          name="action_uids"
        >
          <Select
            options={actionsData.map((action) => ({
              label: action.title,
              value: action.uid,
            }))}
            placeholder={Cluar.plainTranslation("row-editor-placeholder-add")}
            mode="multiple"
            allowClear
          />
        </Form.Item>
      )}

      {showMetadata && (
        <Form.Item label="Metadata" name="metadata">
          <MetadataEditor />
        </Form.Item>
      )}

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Form.Item label="Gap Horizontal (px)" name="horizontal_gap">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Gap Vertical (px)" name="vertical_gap">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      <Form.Item name="items" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            {[2, 3, 4].map((columnCount) => (
              <Col xs={24} md={8} key={columnCount}>
                <Button
                  block
                  style={{ height: "auto", padding: 12 }}
                  onClick={() => handleAddPreset(columnCount)}
                >
                  <div style={{ width: "100%" }}>
                    <Row gutter={8} style={{ height: 40 }}>
                      {Array.from({ length: columnCount }, (_, index) => (
                        <Col key={index} span={24 / columnCount}>
                          <div
                            style={{
                              height: "100%",
                              border: "1px solid #d9d9d9",
                              borderRadius: 4,
                              background: "#f0f0f0",
                            }}
                          />
                        </Col>
                      ))}
                    </Row>
                    <div style={{ marginTop: 8 }}>{columnCount} colunas</div>
                  </div>
                </Button>
              </Col>
            ))}
          </Row>
        </Col>

        <Col span={24}>
          <Collapse
            items={[
              {
                key: "bulk-column-sizes",
                label: "Editar várias colunas",
                children: (
                  <>
                    <Form.Item label="Colunas">
                      <Select
                        mode="multiple"
                        value={selectedColumns}
                        onChange={setSelectedColumns}
                        placeholder="Selecione as colunas"
                        options={items.map((item, index) => ({
                          label: item.title
                            ? Cluar.plainHTML(item.title)
                            : `Coluna ${index + 1}`,
                          value: item.uid,
                        }))}
                      />
                    </Form.Item>
                    <Row gutter={[12, 12]}>
                      {COLUMN_BREAKPOINTS.map((breakpoint) => (
                        <Col xs={8} key={breakpoint}>
                          <Form.Item
                            label={COLUMN_BREAKPOINT_LABELS[breakpoint]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              min={0}
                              max={100}
                              precision={2}
                              step={0.01}
                              addonAfter="%"
                              mode="spinner"
                              value={bulkColumnSizes[breakpoint]}
                              onChange={(value) =>
                                setBulkColumnSizes((previous) => ({
                                  ...previous,
                                  [breakpoint]: value,
                                }))
                              }
                            />
                          </Form.Item>
                        </Col>
                      ))}
                    </Row>
                    <Button
                      type="primary"
                      disabled={
                        !selectedColumns.length ||
                        !COLUMN_BREAKPOINTS.some(
                          (breakpoint) => bulkColumnSizes[breakpoint] !== null,
                        )
                      }
                      onClick={handleApplyColumnSizes}
                    >
                      Aplicar
                    </Button>
                  </>
                ),
              },
            ]}
          />
        </Col>

        <SortableColumn
          items={items}
          setItemsOrder={(newOrder) => setItemsOrder(newOrder)}
          onChangeItem={handleChangeItem}
          onRemoveItem={handleRemoveItem}
          form={form}
        />

        <Col span={24}>
          <Button onClick={handleAddItem}>
            {Cluar.plainTranslation("row-editor-button-new-item")}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default RowEditor;
