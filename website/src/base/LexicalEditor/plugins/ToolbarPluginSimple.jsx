import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Dropdown, Menu } from "antd";
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
} from "@ant-design/icons";
import {
  $createTextNode,
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
import { mergeRegister } from "@lexical/utils";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType, $getSelectionStyleValueForProperty, $patchStyleText, $isAtNodeEnd } from "@lexical/selection";
import { $isLinkNode, TOGGLE_LINK_COMMAND, $createLinkNode, $toggleLink } from "@lexical/link";
import { $createListNode, INSERT_CHECK_LIST_COMMAND } from "@lexical/list";

import Cluar from "../../../common/Cluar";

import FloatingEditor from "../components/FloatingEditor";
import FontSizeControl from "../components/FontSizeControl";
import ColorControl from "../components/ColorControl";
import useSavedSelection from "../components/useSavedSelection";
import GradientPicker from "../components/GradientPicker";
import FloatingLinkEditor from "../components/FloatingLinkEditor";
import InsertImageModal from "../components/ImageModal";
import InsertColumnsModal from "../components/ColumnsModal";

import { FONT_FAMILY_OPTIONS, TEXT_COLOR_PRESETS, BG_COLOR_PRESETS } from "./constants";

export default function ToolbarPluginSimple({ onToggleHtmlMode, isHtmlMode }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  // Seleção guardada ao abrir os dropdowns (o menu abre fora do editor e tira a seleção)
  const dropdownSelection = useSavedSelection();
  const [isSelected, setIsSelected] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontFamilyDropdownVisible, setFontFamilyDropdownVisible] = useState(false);
  const [currentFontFamily, setCurrentFontFamily] = useState(FONT_FAMILY_OPTIONS[0][0]);
  const [currentFontSize, setCurrentFontSize] = useState("40");

  const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
  const [currentFontColor, setCurrentFontColor] = useState(isDarkMode ? "#ffffff" : "#000000");
  const [currentBgColor, setCurrentBgColor] = useState("");
  const [isLink, setIsLink] = useState(false);
  const [currentTextAlign, setCurrentTextAlign] = useState("left");

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
    const fontFamily = getStyleValue("font-family");
    if (fontFamily) setCurrentFontFamily(fontFamily);

    // Font Size (sem 'px')
    const fontSize = getStyleValue("font-size");
    setCurrentFontSize(fontSize ? fontSize.replace("px", "") : "40");

    // Font Color
    const fontColor = getStyleValue("color");
    if (fontColor) {
      setCurrentFontColor(fontColor);
    }
    // Background Color
    const bgColor = getStyleValue("background-color");
    if (bgColor) setCurrentBgColor(bgColor);

    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getParent();

    if (element) {
      // O alinhamento fica no "format" do bloco (não no style)
      const textAlign = element.getFormatType?.();
      setCurrentTextAlign(textAlign && textAlign !== "start" ? textAlign : "left");
    }

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
              // Remove o link mantendo o texto
              $toggleLink(null);
            } else if (selection.isCollapsed()) {
              // Sem texto selecionado: insere o link com a própria URL como texto
              const linkNode = $createLinkNode(url);
              linkNode.append($createTextNode(url));
              selection.insertNodes([linkNode]);
            } else {
              // Envolve o texto selecionado no link (antes o texto era substituído por um link vazio)
              $toggleLink(url);
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
    "paragraph": "Normal",
    "h1": "Heading 1",
    "h2": "Heading 2",
    "h3": "Heading 3",
    "bullet": "Bullet List",
    "number": "Number List",
    "check": "Check List",
    "quote": "Quote"
  };

  const getFormatLabel = useCallback((key) => {
    return formatLabels[key] || key;
  }, [formatLabels]);

  const applyFontFamily = useCallback((fontFamily) => {
    dropdownSelection.restore();

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
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const fontSizeWithUnit = fontSize.toString().includes("px") ? fontSize : `${fontSize}px`;
        $patchStyleText(selection, { "font-size": fontSizeWithUnit });

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





  const handleInsertMenuClick = ({ key }) => {
    switch (key) {
      case "1":
        setIsImageModalOpen(true);
        break;
      case "2":
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
      <div className="toolbar__group">
        <button
          disabled={!canUndo}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          title={Cluar.plainTranslation("toolbar-undo")}
          type="button"
          className="toolbar-item"
        >
          <UndoOutlined />
        </button>
        <button
          disabled={!canRedo}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          title={Cluar.plainTranslation("toolbar-redo")}
          type="button"
          className="toolbar-item"
        >
          <RedoOutlined />
        </button>
      </div>

      {/* Fonte: família e tamanho */}
      <div className="toolbar__group">
        <Dropdown
          open={fontFamilyDropdownVisible}
          onOpenChange={(open) => {
            if (open) dropdownSelection.save();
            setFontFamilyDropdownVisible(open);
          }}
          trigger={["click"]}
          menu={{
            items: FONT_FAMILY_OPTIONS.map(([font, label]) => ({
              key: font,
              label: (
                <div className="icon-text-container">
                  <span className="text" style={{ fontFamily: font }}>
                    {label}
                  </span>
                </div>
              ),
              onClick: () => applyFontFamily(font),
            })),
          }}
        >
          <button className="toolbar-item dropdown-button" title={Cluar.plainTranslation("toolbar-font")} type="button">
            <span style={{ fontFamily: currentFontFamily }}>
              {FONT_FAMILY_OPTIONS.find((i) => i[0] === currentFontFamily)
                ? FONT_FAMILY_OPTIONS.find((i) => i[0] === currentFontFamily)[1]
                : currentFontFamily}
            </span>
            <DownOutlined style={{ fontSize: 10 }} />
          </button>
        </Dropdown>
        <FontSizeControl value={currentFontSize} onApply={applyFontSize} />
      </div>

      {/* Cores: texto, fundo e gradiente */}
      <div className="toolbar__group">
        <ColorControl
          icon={<FontColorsOutlined />}
          title={Cluar.plainTranslation("toolbar-font-color")}
          value={currentFontColor}
          onChange={applyFontColor}
          presets={[
            {
              label: "Presets",
              colors: TEXT_COLOR_PRESETS,
            },
          ]}
        />
        <ColorControl
          icon={<BgColorsOutlined />}
          title={Cluar.plainTranslation("toolbar-bg-color")}
          value={currentBgColor}
          onChange={applyBgColor}
          presets={[{ label: "Presets", colors: BG_COLOR_PRESETS }]}
        />
        <GradientPicker />
      </div>

      {/* Formato: negrito, itálico, sublinhado e link */}
      <div className="toolbar__group">
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          className={`toolbar-item toolbar-format-bold ${isBold ? "active" : ""}`}
          title={Cluar.plainTranslation("toolbar-bold")}
          type="button"
        >
          <i>B</i>
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
          className={`toolbar-item toolbar-format-italic ${isItalic ? "active" : ""}`}
          title={Cluar.plainTranslation("toolbar-italic")}
          type="button"
        >
          <i>I</i>
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
          className={`toolbar-item toolbar-format-underline ${isUnderline ? "active" : ""}`}
          title={Cluar.plainTranslation("toolbar-underline")}
          type="button"
        >
          <i>U</i>
        </button>
        <button
          onClick={() => insertLink()}
          className={`toolbar-item ${isLink ? "active" : ""}`}
          title={Cluar.plainTranslation("toolbar-link")}
          type="button"
        >
          <LinkOutlined />
        </button>
      </div>

      {/* Alinhamento */}
      <div className="toolbar__group">
        {[
          ["left", <AlignLeftOutlined />, "toolbar-align-left"],
          ["center", <AlignCenterOutlined />, "toolbar-align-center"],
          ["right", <AlignRightOutlined />, "toolbar-align-right"],
        ].map(([align, alignIcon, label]) => (
          <button
            key={align}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align)}
            className={`toolbar-item ${currentTextAlign === align ? "active" : ""}`}
            title={Cluar.plainTranslation(label)}
            aria-label={Cluar.plainTranslation(label)}
            type="button"
          >
            {alignIcon}
          </button>
        ))}
      </div>

      {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
      {isSelected && createPortal(<FloatingEditor editor={editor} />, document.body)}
      <InsertImageModal visible={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} activeEditor={editor} />
      <InsertColumnsModal
        visible={isColumnsModalOpen}
        onClose={() => setIsColumnsModalOpen(false)}
        activeEditor={editor}
      />
    </div>
  );
}
