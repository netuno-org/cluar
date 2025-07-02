import { useRef, useState, useCallback, useEffect } from 'react';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, LinkOutlined } from '@ant-design/icons';
import {
    $getSelection,
    $isRangeSelection,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_LOW,
    FORMAT_TEXT_COMMAND
} from "lexical";
import {
    $isAtNodeEnd
} from "@lexical/selection";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import { mergeRegister } from '@lexical/utils';

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
    const [lastSelection, setLastSelection] = useState(null);
    const [formatState, setFormatState] = useState({
        bold: false,
        italic: false,
        underline: false,
        link: false
    });

    const updateFormatState = useCallback((selection) => {
        if ($isRangeSelection(selection)) {
            // Detectar se o nó selecionado ou seu pai é um link
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            const isLink = $isLinkNode(parent) || $isLinkNode(node);
            
            setFormatState({
                bold: selection.hasFormat('bold'),
                italic: selection.hasFormat('italic'),
                underline: selection.hasFormat('underline'),
                link: isLink
            });
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
        } else if (!activeElement || !activeElement.closest('.floating-editor')) {
            positionEditorElement(editorElem, null);
            setLastSelection(null);
        }

        return true;
    }, [editor, updateFormatState]);

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

    return (
        <div ref={editorRef} className="floating-editor">
            <div className="floating-editor-toolbar">
                <button
                    className={`toolbar-button ${formatState.bold ? 'active' : ''}`}
                    onClick={() => handleFormatCommand('bold')}
                    onMouseDown={(event) => event.preventDefault()}
                    title="Negrito (Ctrl+B)"
                >
                    <BoldOutlined />
                </button>

                <button
                    className={`toolbar-button ${formatState.italic ? 'active' : ''}`}
                    onClick={() => handleFormatCommand('italic')}
                    onMouseDown={(event) => event.preventDefault()}
                    title="Itálico (Ctrl+I)"
                >
                    <ItalicOutlined />
                </button>

                <button
                    className={`toolbar-button ${formatState.underline ? 'active' : ''}`}
                    onClick={() => handleFormatCommand('underline')}
                    onMouseDown={(event) => event.preventDefault()}
                    title="Sublinhado (Ctrl+U)"
                >
                    <UnderlineOutlined />
                </button>

                <div className="toolbar-separator"></div>

                <button
                    className={`toolbar-button ${formatState.link ? 'active' : ''}`}
                    onClick={() => handleLinkCommand()}
                    onMouseDown={(event) => event.preventDefault()}
                    title="Adicionar Link (Ctrl+K)"
                >
                    <LinkOutlined />
                </button>
            </div>
        </div>
    );
}