import { Col, Form, Input, Collapse, Button, Flex } from "antd";

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

import { HolderOutlined, CloseOutlined } from "@ant-design/icons";

import "./index.less";

const SortableItem = ({ item, itemIndex, onChangeItem, onRemoveItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Col span={24} key={item.uid} style={style} className="sortable-list-item">
      <Flex align="center" className="sortable-list-item__wrapper">
        <Collapse
          className="sortable-list-item__wrapper__collapse"
          destroyInactivePanel={false}
          items={[
            {
              key: itemIndex,
              label: item?.title,
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
                    label="Título"
                    name={["itemsByUid", itemIndex, "title"]}
                  >
                    <Input
                      onChange={(e) =>
                        onChangeItem(item.uid, "title", e.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Conteúdo"
                    name={["itemsByUid", itemIndex, "content"]}
                  >
                    <Input.TextArea rows={3} />
                  </Form.Item>
                  <Form.Item
                    label="Link"
                    name={["itemsByUid", itemIndex, "link"]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Section"
                    name={["itemsByUid", itemIndex, "section"]}
                    initialValue={item.section}
                    style={{ display: "none" }}
                  >
                    <Input rows={3} />
                  </Form.Item>
                  <Form.Item
                    label="UID"
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
  );
};

const SortableListItem = ({
  items,
  setItemsOrder,
  onChangeItem,
  onRemoveItem,
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
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableListItem;
