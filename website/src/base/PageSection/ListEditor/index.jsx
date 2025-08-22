import React, { useState, useEffect } from "react";
import { Form, Select, Row, Col, Input, Divider, Button } from "antd";

import SortableListItem from "./SortableListItem";
import ImageSectionEditor from "../ImageSectionEditor";
import _service from "@netuno/service-client";
import Cluar from "../../../common/Cluar"

const ListEditor = ({ sectionData, form }) => {
  const [itemsOrder, setItemsOrder] = useState([]);
  const [itemsByUid, setItemsByUid] = useState({});

  const [typeOptions, setTypeOptions] = useState([]);
  const [config, setConfig] = useState([]);

  const [showActions, setShowActions] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const actionsData = Cluar.actions() || [];

  useEffect(() => {
    _service({
      url: "/components/listing/list",
      method: "POST",
      data: {
        language: Cluar.currentLanguage().locale
      },
      success: (res) => {
        setTypeOptions(res.json.types);
        setConfig(res.json.config);

        const initialType = form.getFieldValue("type");
        setSelectedType(initialType);

        const typeConfig = res.json.config.find(c => c.name === initialType);
        setShowActions(typeConfig?.action || false);
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }, []);

  const handleChangeItem = (uid, property, value) => {
    const updatedItem = {
      ...itemsByUid[uid],
      [property]: value,
    };

    const newItemsByUid = {
      ...itemsByUid,
      [uid]: updatedItem,
    };

    setItemsByUid(newItemsByUid);
    form.setFieldsValue({
      itemsByUid: newItemsByUid,
    });
  };

  const handleAddItem = () => {
    const uid = new Date().getTime().toString();

    const newItem = {
      uid,
      section: "listing_item",
      title: "",
      content: "",
      link: "",
    };

    const newItemsByUid = {
      ...itemsByUid,
      [uid]: newItem,
    };

    setItemsByUid(newItemsByUid);
    setItemsOrder([...itemsOrder, uid]);

    form.setFieldsValue({
      itemsByUid: newItemsByUid,
    });
  };

  const handleRemoveItem = (uid) => {
    const { [uid]: removedItem, ...newItemsByUid } = itemsByUid;
    const newItemsOrder = itemsOrder.filter((id) => id !== uid);

    setItemsByUid(newItemsByUid);
    setItemsOrder(newItemsOrder);

    form.setFieldsValue({
      itemsByUid: newItemsByUid,
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
    <div className="list-editor">
      <Form.Item label="Tipo" name="type">
        <Select
          options={typeOptions.map((item) => ({
            label: item.info.label,
            value: item.name,
          }))}
          onChange={(value) => {
            setSelectedType(value);

            const typeConfig = config.find(c => c.name === value);
            setShowActions(typeConfig?.action || false);
          }}
        />
      </Form.Item>

      <ImageSectionEditor form={form} sectionData={sectionData} />

      {showActions && (
        <Form.Item label="Actions" name="action_uids">
          <Select
            options={actionsData.map((action) => ({
              label: action.title,
              value: action.uid,
            }))}
            placeholder="Adicionar"
            mode="multiple"
            allowClear
          />
        </Form.Item>
      )}

      <Divider />

      <Form.Item name="items" noStyle>
        <Input type="hidden" />
      </Form.Item>
      <Row gutter={[12, 12]}>
        <SortableListItem
          items={items}
          setItemsOrder={(newOrder) => setItemsOrder(newOrder)}
          onChangeItem={handleChangeItem}
          onRemoveItem={handleRemoveItem}
          form={form}
        />
        <Col span={24}>
          <Button onClick={handleAddItem}>Novo Item</Button>
        </Col>
      </Row>
    </div>
  );
};

export default ListEditor;
