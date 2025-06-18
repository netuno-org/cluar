import React, { useState, useEffect } from "react";

import {
  Form,
  Select,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Collapse,
  Input,
} from "antd";

const ListEditor = ({ sectionData, form }) => {
  const [items, setItems] = useState([]);

  const handleChangeItem = (uid, property, value) => {
    const itemIndex = items.findIndex((item) => item.uid === uid);

    if (itemIndex !== -1) {
      const newItems = [...items];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        [property]: value,
      };
      setItems([...newItems]);

      form.setFieldsValue({ items: newItems });
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        uid: new Date().getTime(),
        section: "listing_item",
      },
    ]);
  };

  useEffect(() => {
    if (sectionData && !items.length) {
      setItems([...sectionData.items]);
    }
  }, [sectionData]);

  return (
    <div className="list-editor">
      <Form.Item label="Tipo" name="type">
        <Select options={[{ value: "default", label: "Padrão" }]} />
      </Form.Item>
      <Divider />
      <Row gutter={[12, 12]}>
        {items?.map((item, itemIndex) => {
          return (
            <Col span={24}>
              <Collapse
                defaultActiveKey={item.uid}
                destroyInactivePanel={false}
                items={[
                  {
                    key: item.uid,
                    label: item?.title,
                    children: (
                      <div>
                        <Form.Item
                          label="Título"
                          name={["items", itemIndex, "title"]}
                        >
                          <Input
                            onChange={(e) =>
                              handleChangeItem(
                                item.uid,
                                "title",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          label="Conteúdo"
                          name={["items", itemIndex, "content"]}
                        >
                          <Input.TextArea rows={3} />
                        </Form.Item>
                        <Form.Item
                          label="Section"
                          name={["items", itemIndex, "section"]}
                          initialValue={item.section}
                          style={{ display: "none" }}
                        >
                          <Input rows={3} />
                        </Form.Item>
                        <Form.Item
                          label="UID"
                          name={["items", itemIndex, "uid"]}
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
            </Col>
          );
        })}
        <Col span={24}>
          <Button onClick={handleAddItem}>Novo Item</Button>
        </Col>
      </Row>
    </div>
  );
};

export default ListEditor;
