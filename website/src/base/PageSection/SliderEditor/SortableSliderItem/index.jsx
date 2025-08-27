import { Col, Form, Input, Collapse, Button, Flex, Select } from "antd";

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
import ImageSectionEditor from "../../ImageSectionEditor";

import "./index.less";

const SortableItem = ({
  item,
  itemIndex,
  onChangeItem,
  onRemoveItem,
  form,
  actionsData,
  showActions,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Col
      span={24}
      key={item.uid}
      style={style}
      className="sortable-slider-item"
    >
      <Flex align="center" className="sortable-slider-item__wrapper">
        <Collapse
          className="sortable-slider-item__wrapper__collapse"
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
                    <Input.TextArea
                      rows={3}
                      onChange={(e) =>
                        onChangeItem(item.uid, "content", e.target.value)
                      }
                    />
                  </Form.Item>
                  {showActions && (
                    <Form.Item label="Actions" name={["itemsByUid", itemIndex, "action_uids"]}>
                      <Select
                        options={actionsData.map((action) => ({
                          label: action.title,
                          value: action.uid,
                        }))}
                        onChange={(val) =>
                          onChangeItem(item.uid, "action_uids", val)
                        }
                        placeholder="Adicionar"
                        mode="multiple"
                        allowClear
                      />
                    </Form.Item>
                  )}
                  <ImageSectionEditor
                    sectionData={item}
                    form={form}
                    imageName={["itemsByUid", itemIndex, "image"]}
                    imageTitleName={["itemsByUid", itemIndex, "image_title"]}
                    imageAltName={["itemsByUid", itemIndex, "image_alt"]}
                    onChangeImage={(val) =>
                      onChangeItem(item.uid, "image", val)
                    }
                    onChangeImageAlt={(val) =>
                      onChangeItem(item.uid, "image_alt", val)
                    }
                    onChangeImageTitle={(val) =>
                      onChangeItem(item.uid, "image_title", val)
                    }
                  />
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

const SortableSliderItem = ({
  items,
  setItemsOrder,
  onChangeItem,
  onRemoveItem,
  form,
  actionsData,
  showActions,
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
            actionsData={actionsData}
            showActions={showActions}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableSliderItem;
