import { List, Flex, Tag } from "antd";

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

import { PlusOutlined, HolderOutlined } from "@ant-design/icons";

import Cluar from "../../../common/Cluar";

const SortableItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <List.Item
      key={item.uid}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="structure-config__item"
    >
      <Flex>
        <HolderOutlined style={{ marginRight: 8 }} />{" "}
        <Flex gap={12}>
          {Cluar.plainHTML(item.title)} <Tag color="orange">{item.section}</Tag>
        </Flex>
      </Flex>
    </List.Item>
  );
};

const SortableStructure = ({ structure, setStructure }) => {
  return (
    <DndContext
      sensors={useSensors(useSensor(PointerSensor))}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (active.id !== over?.id) {
          const oldIndex = structure.findIndex((i) => i.uid === active.id);
          const newIndex = structure.findIndex((i) => i.uid === over?.id);
          setStructure((items) => arrayMove(items, oldIndex, newIndex));
        }
      }}
    >
      <SortableContext
        items={structure.map((item) => item.uid)}
        strategy={verticalListSortingStrategy}
      >
        <List
          dataSource={structure}
          size="small"
          className="structure-config"
          renderItem={(item) => <SortableItem item={item} />}
        />
      </SortableContext>
    </DndContext>
  );
};

export default SortableStructure;
