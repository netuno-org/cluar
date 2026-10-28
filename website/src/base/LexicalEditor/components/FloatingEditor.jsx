import { useRef, useState, useCallback, useEffect } from "react";
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, LinkOutlined, TranslationOutlined } from "@ant-design/icons";
import { Modal, Select, Input, Button, message } from "antd";
import {
  $createRangeSelection,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND
} from "lexical";
import {
  $isAtNodeEnd
} from "@lexical/selection";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";

import _service from "@netuno/service-client";
import Cluar from "../../../common/Cluar";

import "./FloatingEditor.less";

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

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset - 70}px`;
    editor.style.left = `${rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2}px`;
  }
}

export default function FloatingEditor({ editor }) {
  const editorRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const [lastSelection, setLastSelection] = useState(null);
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    link: false
  });
  const [translateModalOpen, setTranslateModalOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [translating, setTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);

  const updateFormatState = useCallback((selection) => {
    if ($isRangeSelection(selection)) {
      // Detectar se o nó selecionado ou seu pai é um link
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      const isLink = $isLinkNode(parent) || $isLinkNode(node);

      setFormatState({
        bold: selection.hasFormat("bold"),
        italic: selection.hasFormat("italic"),
        underline: selection.hasFormat("underline"),
        link: isLink
      });
      setSelectedText(selection.getTextContent());
    }
  }, []);

  const updateFloatingEditor = useCallback(() => {
    const selection = $getSelection();
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) return;

    const rootElement = editor.getRootElement();

    if (selection !== null &&
      $isRangeSelection(selection) &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();
      positionEditorElement(editorElem, rect);
      setLastSelection(selection);
      updateFormatState(selection);
      return true;
    } else if (!translateModalOpen && (!activeElement || !activeElement.closest(".floating-editor"))) {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
    }

    return true;
  }, [editor, updateFormatState, translateModalOpen]);

  const handleFormatCommand = useCallback((format) => {
    if (lastSelection) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
        }
      });
    }
  }, [editor, lastSelection]);

  const handleLinkCommand = useCallback(() => {
    if (!lastSelection) return;

    if (formatState.link) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    }
  }, [editor, lastSelection]);

  const openTranslateModal = useCallback(() => {
    let text = "";
    let points = null;

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const content = selection.getTextContent();
        if (content) {
          text = content;
          points = {
            anchorKey: selection.anchor.key,
            anchorOffset: selection.anchor.offset,
            anchorType: selection.anchor.type,
            focusKey: selection.focus.key,
            focusOffset: selection.focus.offset,
            focusType: selection.focus.type,
          };
        }
      }
    });

    if (!text || !points) {
      return;
    }

    savedSelectionRef.current = points;
    setSelectedText(text);
    setTargetLanguage(null);
    setTranslationResult(null);
    setTranslateModalOpen(true);
  }, [editor]);

  const closeTranslateModal = useCallback(() => {
    setTranslateModalOpen(false);
    setTargetLanguage(null);
    setTranslationResult(null);
    setTranslating(false);
  }, []);

  const handleTranslate = useCallback(() => {
    if (!targetLanguage || !selectedText) {
      message.warning("Seleciona o idioma de destino.");
      return;
    }

    const targetLanguageName =
      (Cluar.languages() || []).find((language) => language.code === targetLanguage)
        ?.description || targetLanguage;

    setTranslating(true);

    _service({
      url: "reserved-area/editor/translate",
      method: "POST",
      data: {
        text: selectedText,
        language: targetLanguageName,
      },
      success: (response) => {
        setTranslating(false);

        if (response.json.result) {
          setTranslationResult(response.json.translation);
        } else {
          message.error(response.json.error || "Falha ao traduzir o texto.");
        }
      },
      fail: (error) => {
        setTranslating(false);
        message.error(error?.json?.error || "Falha ao traduzir o texto.");
      },
    });
  }, [selectedText, targetLanguage]);

  const handleApproveTranslation = useCallback(() => {
    const saved = savedSelectionRef.current;

    if (!translationResult || !saved) {
      return;
    }

    editor.update(() => {
      const selection = $createRangeSelection();
      selection.anchor.set(saved.anchorKey, saved.anchorOffset, saved.anchorType);
      selection.focus.set(saved.focusKey, saved.focusOffset, saved.focusType);

      $setSelection(selection);
      selection.insertText(translationResult);
    });

    message.success("Texto traduzido.");
    closeTranslateModal();
  }, [editor, translationResult, closeTranslateModal]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateFloatingEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateFloatingEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateFloatingEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateFloatingEditor();
    });
  }, [editor, updateFloatingEditor]);

  const currentLanguageCode = Cluar.currentLanguage()?.code;
  const availableLanguages = (Cluar.languages() || []).filter(
    (language) => language.code !== currentLanguageCode
  );

  return (
    <div ref={editorRef} className="floating-editor">
      <div className="floating-editor-toolbar">
        <button
          className={`toolbar-button ${formatState.bold ? "active" : ""}`}
          onClick={() => handleFormatCommand("bold")}
          onMouseDown={(event) => event.preventDefault()}
          title={`${Cluar.plainTranslation("toolbar-bold")} (Ctrl+B)`}
        >
          <BoldOutlined />
        </button>

        <button
          className={`toolbar-button ${formatState.italic ? "active" : ""}`}
          onClick={() => handleFormatCommand("italic")}
          onMouseDown={(event) => event.preventDefault()}
          title={`${Cluar.plainTranslation("toolbar-italic")} (Ctrl+I)`}
        >
          <ItalicOutlined />
        </button>

        <button
          className={`toolbar-button ${formatState.underline ? "active" : ""}`}
          onClick={() => handleFormatCommand("underline")}
          onMouseDown={(event) => event.preventDefault()}
          title={`${Cluar.plainTranslation("toolbar-underline")} (Ctrl+U)`}
        >
          <UnderlineOutlined />
        </button>

        <div className="toolbar-separator"></div>

        <button
          className={`toolbar-button ${formatState.link ? "active" : ""}`}
          onClick={() => handleLinkCommand()}
          onMouseDown={(event) => event.preventDefault()}
          title={`${Cluar.plainTranslation("toolbar-link")} (Ctrl+K)`}
        >
          <LinkOutlined />
        </button>

        <div className="toolbar-separator"></div>

        <button
          className="toolbar-button"
          onClick={openTranslateModal}
          onMouseDown={(event) => event.preventDefault()}
          title="Traduzir seleção"
        >
          <TranslationOutlined />
        </button>
      </div>

      <Modal
        title="Traduzir seleção"
        open={translateModalOpen}
        onCancel={closeTranslateModal}
        destroyOnHidden
        footer={[
          <Button key="cancel" onClick={closeTranslateModal}>
            Cancelar
          </Button>,
          translationResult !== null ? (
            <Button key="approve" type="primary" onClick={handleApproveTranslation}>
              Aprovar
            </Button>
          ) : (
            <Button key="translate" type="primary" loading={translating} onClick={handleTranslate}>
              Traduzir
            </Button>
          ),
        ]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Seleciona o idioma de destino"
          value={targetLanguage}
          onChange={(value) => {
            setTargetLanguage(value);
            setTranslationResult(null);
          }}
          options={availableLanguages.map((language) => ({
            value: language.code,
            label: language.description || language.code,
          }))}
        />

        {translationResult !== null && (
          <Input.TextArea
            readOnly
            value={translationResult}
            autoSize={{ minRows: 3, maxRows: 8 }}
            style={{ marginTop: 16 }}
          />
        )}
      </Modal>
    </div>
  );
}
