import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Dropdown, Input, ColorPicker, Menu } from "antd";
import {
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
  DownOutlined,
  FileImageOutlined,
  FontColorsOutlined,
  LinkOutlined,
  MenuOutlined,
  PlusOutlined,
  RedoOutlined,
  UndoOutlined
} from '@ant-design/icons';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_EDITOR,
  FORMAT_ELEMENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from "lexical";
import { mergeRegister } from '@lexical/utils';
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType, $getSelectionStyleValueForProperty, $patchStyleText, $isAtNodeEnd } from "@lexical/selection";
import { $isLinkNode, TOGGLE_LINK_COMMAND, $createLinkNode } from "@lexical/link";
import { $createListNode, INSERT_CHECK_LIST_COMMAND } from "@lexical/list";

import FloatingEditor from "../components/FloatingEditor";
import FloatingLinkEditor from "../components/FloatingLinkEditor";
import InsertImageModal from "../components/ImageModal";
import InsertColumnsModal from "../components/ColumnsModal";

import { FONT_FAMILY_OPTIONS } from "./constants";

export default function ToolbarPluginSimple({ onToggleHtmlMode, isHtmlMode }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [isSelected, setIsSelected] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontFamilyDropdownVisible, setFontFamilyDropdownVisible] = useState(false);
  const [currentFontFamily, setCurrentFontFamily] = useState(FONT_FAMILY_OPTIONS[0][0]);
  const [currentFontSize, setCurrentFontSize] = useState("40");
  const [currentFontColor, setCurrentFontColor] = useState('#000000');
  const [currentBgColor, setCurrentBgColor] = useState('#ffffff');
  const [isLink, setIsLink] = useState(false);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);

  const getSelectedNode = (selection) => {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
      return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
      return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
      return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
  }

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    console.log("selection: ", selection);

    if (!$isRangeSelection(selection)) {
      setIsSelected(false);
      return;
    }

    const hasSelection = !selection.isCollapsed();
    setIsSelected(hasSelection);

    setIsBold(selection.hasFormat("bold"));
    setIsItalic(selection.hasFormat("italic"));
    setIsUnderline(selection.hasFormat("underline"));

    const getStyleValue = (property, fallback = "") => $getSelectionStyleValueForProperty(selection, property, fallback);

    // Font Family
    const fontFamily = getStyleValue('font-family');
    if (fontFamily) setCurrentFontFamily(fontFamily);

    // Font Size (sem 'px')
    const fontSize = getStyleValue('font-size');
    setCurrentFontSize(fontSize ? fontSize.replace('px', '') : "40");

    // Font Color
    const fontColor = getStyleValue('color');
    setCurrentFontColor(fontColor || "#000000");

    // Background Color
    const bgColor = getStyleValue('background-color');
    if (bgColor) setCurrentBgColor(bgColor);

    // Verifica se o nó ou seu pai é link
    const node = getSelectedNode(selection);
    const parent = node.getParent();
    setIsLink($isLinkNode(parent) || $isLinkNode(node));
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
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        TOGGLE_LINK_COMMAND,
        (url) => {
          let handled = false;
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              handled = false;
              return;
            }

            if (!url) {
              const nodes = selection.getNodes();
              nodes.forEach(node => {
                if ($isLinkNode(node)) {
                  node.unwrap();
                }
              });
            } else {
              const linkNode = $createLinkNode(url);
              selection.insertNodes([linkNode]);
            }
            handled = true;
          });

          return handled;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, updateToolbar]);

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

  const applyFontFamily = useCallback((fontFamily) => {
    //console.log("applyFontFamily", fontFamily);

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node.setStyle) {
            $patchStyleText(selection, { "font-family": fontFamily || FONT_FAMILY_OPTIONS[0] });
            editor.focus();
          }
        });
      }
    });

    setFontFamilyDropdownVisible(false);
    setCurrentFontFamily(fontFamily);
  }, [editor]);

  const applyFontSize = useCallback((fontSize) => {
    console.log("applyFontSize", fontSize);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const fontSizeWithUnit = fontSize.toString().includes('px') ? fontSize : `${fontSize}px`;
        $patchStyleText(selection, { "font-size": fontSizeWithUnit });

        //console.log('Applied font size:', fontSizeWithUnit);
      }
    });
    setCurrentFontSize(fontSize);
  }, [editor]);

  const applyFontColor = (color) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "color": color.toHexString() });
      }
    });
    setCurrentFontColor(color.toHexString());
  };

  const applyBgColor = (color) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "background-color": color.toHexString() });
      }
    });
    setCurrentBgColor(color.toHexString());
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

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

  const increaseFontSize = useCallback(() => {
    const newSize = parseInt(currentFontSize) + 1;
    setCurrentFontSize(newSize.toString());
    applyFontSize(newSize.toString());
  }, [currentFontSize, applyFontSize]);

  const decreaseFontSize = useCallback(() => {
    const newSize = Math.max(1, parseInt(currentFontSize) - 1);
    setCurrentFontSize(newSize.toString());
    applyFontSize(newSize.toString());
  }, [currentFontSize, applyFontSize]);

  const handleFontSizeChange = useCallback((e) => {
    const value = e.target.value;
    if (value && !isNaN(value)) {
      setCurrentFontSize(value);
      applyFontSize(value);
    }
  }, [applyFontSize]);


  const handleInsertMenuClick = ({ key }) => {
    switch (key) {
      case '1':
        setIsImageModalOpen(true);
        break;
      case '2':
        setIsColumnsModalOpen(true);
        break;
      default:
        break;
    }
  };

  const insertMenu = (
    <Menu onClick={handleInsertMenuClick}>
      <Menu.Item key="1" icon={<FileImageOutlined />}>Imagem</Menu.Item>
      <Menu.Item key="2" icon={<AppstoreOutlined />}>Colunas</Menu.Item>
    </Menu>
  );

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title="Desfazer"
        type="button"
        className="toolbar-item"
      >
        <UndoOutlined style={{ transform: 'rotate(90deg)', fontSize: 15 }} />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title="Refazer"
        type="button"
        className="toolbar-item"
      >
        <RedoOutlined style={{ transform: 'rotate(-90deg)', fontSize: 15 }} />
      </button>


      <div className="divider" />

      <div className="dropdown-container">
        <Dropdown
          open={fontFamilyDropdownVisible}
          onOpenChange={setFontFamilyDropdownVisible}
          trigger={['click']}
          menu={{
            items: FONT_FAMILY_OPTIONS.map(([font, label]) => ({
              key: font,
              label: (
                <div className="icon-text-container">
                  <span className="text" style={{ fontFamily: font }}>{label}</span>
                </div>
              ),
              onClick: () => applyFontFamily(font)
            }))
          }}
        >
          <button
            className="toolbar-item dropdown-button"
            title="Fonte"
            type="button"
          >
            <span style={{ fontFamily: currentFontFamily }}>{currentFontFamily}</span>
          </button>
        </Dropdown>
      </div>

      <div className="divider" />

      <div className="font-size-container" style={{ display: 'flex', alignItems: 'center' }}>
        <button
          className="toolbar-item"
          title="Diminuir tamanho da fonte"
          type="button"
          onClick={decreaseFontSize}
          style={{ padding: '0 8px' }}
        >
          -
        </button>
        <Input
          type="number"
          className="font-size-input"
          value={currentFontSize}
          onChange={handleFontSizeChange}
          min="1"
        />
        <button
          className="toolbar-item"
          title="Aumentar tamanho da fonte"
          type="button"
          onClick={increaseFontSize}
          style={{ padding: '0 8px' }}
        >
          +
        </button>
      </div>
      <div className="divider" />
      <div className="font-color-container" style={{ display: 'flex', alignItems: 'center' }}>
        <FontColorsOutlined style={{ width: 18, height: 18, marginRight: 4, verticalAlign: 'middle' }} />
        <ColorPicker
          value={currentFontColor}
          onChange={applyFontColor}
          placement="bottomLeft"
          size="small"
          onOpenChange={(open) => {
            if (open) {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  selection.save();
                }
              });
            }
          }}
          presets={[
            {
              label: 'Presets',
              colors: ['#000000', '#ff4d4f', '#52c41a', '#1677ff', '#faad14', '#eb2f96']
            }
          ]}
        />
      </div>

      <div className="bg-color-container" style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
        <BgColorsOutlined style={{ width: 18, height: 18, marginRight: 4, verticalAlign: 'middle' }} />
        <ColorPicker
          value={currentBgColor}
          onChange={applyBgColor}
          placement="bottomLeft"
          size="small"
          onOpenChange={(open) => {
            if (open) {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  selection.save();
                }
              });
            }
          }}
          presets={[
            {
              label: 'Presets',
              colors: ['#fffff', '#000000', '#ff4d4f', '#52c41a', '#1677ff', '#faad14', '#eb2f96']
            }
          ]}
        />
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

      <button
        onClick={() => insertLink()}
        title="Inserir Link"
        type="button"
        className={isLink ? 'btn-active' : 'btn-inactive'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 6,
          width: 32,
          height: 32,
        }}
      >
        <LinkOutlined style={{ fontSize: 14 }} />
      </button>
      {isLink &&
        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
      {isSelected &&
        createPortal(<FloatingEditor editor={editor} />, document.body)}
      <div className="divider" />

      <button
        onClick={onToggleHtmlMode}
        className={`toolbar-item ${isHtmlMode ? "active" : ""}`}
        title="Modo HTML"
        type="button"
        style={{
          minWidth: '50px',
          padding: '6px 8px',
          fontSize: '12px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        HTML
      </button>

      <InsertImageModal
        visible={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        activeEditor={editor}
      />
      <InsertColumnsModal
        visible={isColumnsModalOpen}
        onClose={() => setIsColumnsModalOpen(false)}
        activeEditor={editor}
      />
    </div>
  );
}