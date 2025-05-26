import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback } from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { $wrapNodes } from "@lexical/selection";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatBold = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }, [editor]);

  const formatItalic = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  }, [editor]);

  const formatUnderline = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  }, [editor]);

  const formatOrderedList = useCallback(() => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
  }, [editor]);

  const formatUnorderedList = useCallback(() => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
  }, [editor]);

  return (
    <div className="toolbar">
      <Space>
        <Tooltip title="Negrito">
          <Button icon={<BoldOutlined />} onClick={formatBold} />
        </Tooltip>
        <Tooltip title="Itálico">
          <Button icon={<ItalicOutlined />} onClick={formatItalic} />
        </Tooltip>
        <Tooltip title="Sublinhado">
          <Button icon={<UnderlineOutlined />} onClick={formatUnderline} />
        </Tooltip>
        <Tooltip title="Lista Ordenada">
          <Button icon={<OrderedListOutlined />} onClick={formatOrderedList} />
        </Tooltip>
        <Tooltip title="Lista Não Ordenada">
          <Button icon={<UnorderedListOutlined />} onClick={formatUnorderedList} />
        </Tooltip>
      </Space>
    </div>
  );
}