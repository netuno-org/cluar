import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState, useRef } from "react";
import { Dropdown } from "antd";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode
} from "lexical";
import { mergeRegister } from '@lexical/utils';
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createListNode, $createListItemNode, INSERT_CHECK_LIST_COMMAND } from "@lexical/list";

import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS, dropDownActiveClass } from "./constants";

export default function ToolbarPlugin({ onToggleHtmlMode, isHtmlMode }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [stylesDropdownVisible, setStylesDropdownVisible] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("paragraph");

  const formatLabels = {
    'paragraph': 'Normal',
    'h1': 'Heading 1',
    'h2': 'Heading 2',
    'h3': 'Heading 3',
    'bullet': 'Bullet List',
    'number': 'Number List',
    'check': 'Check List',
    'quote': 'Quote'
  };

  const getFormatLabel = useCallback((key) => {
    return formatLabels[key] || key;
  }, [formatLabels]);


  // Função para formatar parágrafo (Normal)
  const formatParagraph = useCallback(() => {
    //console.log("formatParagraph");

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
    setStylesDropdownVisible(false);
    setSelectedFormat('paragraph');
  }, [editor]);

  const formatHeading = useCallback((tag) => {
    //console.log("formatHeading", tag);

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
    setStylesDropdownVisible(false);
    setSelectedFormat(tag);
  }, [editor]);

  const formatList = useCallback((type) => {
    //console.log("formatList", type);

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => {
          const list = $createListNode(type);
          //const listItem = $createListItemNode();
          //list.append(listItem);
          return list;
        });
        setSelectedFormat(type);
      }
    });
    setStylesDropdownVisible(false);
  }, [editor]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    //console.log("selection: ", selection);

    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getParent();

      if (element) {
        const elementType = element.getType();
        //console.log("elementType: ", elementType);

        if (elementType === 'heading') {
          const tag = element.getTag();
          if (tag === 'h1') {
            setSelectedFormat('H1');
          } else if (tag === 'h2') {
            setSelectedFormat('H2');
          } else if (tag === 'h3') {
            setSelectedFormat('H3');
          }
        } else if (elementType === 'paragraph') {
          setSelectedFormat('Normal');
        } else if (elementType === 'listitem') {
          const parentList = element.getParent();
          if (parentList && parentList.getType() === 'list') {
            const listType = parentList.getListType();
            if (listType === 'bullet') {
              setSelectedFormat('Bullet List');
            }
          }
        } else if (elementType === 'quote') {
          setSelectedFormat('quote');
        }
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          updateToolbar();
          return false;
        },
        1
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        1,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        1,
      )
    );
  }, [editor, updateToolbar]);

  const formatQuote = useCallback(() => {
    console.log("formatQuote");

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
    setStylesDropdownVisible(false);
    //setSelectedFormat('quote');
  }, [editor]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND);
        }}
        title="Desfazer"
        type="button"
        className="toolbar-item"
      >
        <i className="format undo"></i>
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND);
        }}
        title="Refazer"
        type="button"
        className="toolbar-item"
      >
        <i className="format redo"></i>
      </button>
      <div className="divider" />

      <div className="dropdown-container">
        <Dropdown
          open={stylesDropdownVisible}
          onOpenChange={setStylesDropdownVisible}
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'paragraph',
                label: (
                  <div className="icon-text-container">
                    <i className="icon paragraph"></i>
                    <span className="text">{formatLabels['paragraph']}</span>
                  </div>
                ),
                onClick: () => formatParagraph()
              },
              {
                key: 'h1',
                label: (
                  <div className="icon-text-container">
                    <i className="icon h1"></i>
                    <span className="text">{formatLabels['h1']}</span>
                  </div>
                ),
                onClick: () => formatHeading("h1")
              },
              {
                key: 'h2',
                label: (
                  <div className="icon-text-container">
                    <i className="icon h2"></i>
                    <span className="text">{formatLabels['h2']}</span>
                  </div>
                ),
                onClick: () => formatHeading("h2")
              },
              {
                key: 'h3',
                label: (
                  <div className="icon-text-container">
                    <i className="icon h3"></i>
                    <span className="text">{formatLabels['h3']}</span>
                  </div>
                ),
                onClick: () => formatHeading("h3")
              },
              {
                key: 'bullet',
                label: (
                  <div className="icon-text-container">
                    <i className="icon bullet-list"></i>
                    <span className="text">{formatLabels['bullet']}</span>
                  </div>
                ),
                onClick: () => formatList("bullet")
              },
              {
                key: 'number',
                label: (
                  <div className="icon-text-container">
                    <i className="icon bullet-list"></i>
                    <span className="text">{formatLabels['number']}</span>
                  </div>
                ),
                onClick: () => formatList("number")
              },
              {
                key: 'check',
                label: (
                  <div className="icon-text-container">
                    <i className="icon bullet-list"></i>
                    <span className="text">{formatLabels['check']}</span>
                  </div>
                ),
                onClick: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
              },
              {
                key: 'quote',
                label: (
                  <div className="icon-text-container">
                    <i className="icon bullet-list"></i>
                    <span className="text">Quote</span>
                  </div>
                ),
                onClick: () => formatQuote(editor, selectedFormat)
              }
            ]
          }}
        >
          <button
            className="toolbar-item dropdown-button"
            title="Estilos"
            type="button"
          >
            <span>{getFormatLabel(selectedFormat)}</span>
          </button>
        </Dropdown>
      </div>

      <div className="divider" />
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`toolbar-item ${isBold ? "active" : ""}`}
        title="Negrito"
        type="button"
      >
        <i>B</i>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`toolbar-item ${isItalic ? "active" : ""}`}
        title="Itálico"
        type="button"
      >
        <i>I</i>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={`toolbar-item ${isUnderline ? "active" : ""}`}
        title="Sublinhado"
        type="button"
      >
        <i>U</i>
      </button>
      <div className="divider" />
      <button
        onClick={onToggleHtmlMode}
        className={`toolbar-item ${isHtmlMode ? "active" : ""}`}
        title="Modo HTML"
        type="button"
      >
        <i>HTML</i>
      </button>
    </div>
  );
}