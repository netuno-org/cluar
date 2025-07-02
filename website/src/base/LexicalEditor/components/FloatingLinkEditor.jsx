import { useCallback, useEffect, useState, useRef } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    $getSelection,
    $isRangeSelection,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_LOW,
    CLICK_COMMAND
} from "lexical";
import {
    $isAtNodeEnd
} from "@lexical/selection";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister, $findMatchingParent } from '@lexical/utils';

import "./index.less";

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
        editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
        editor.style.left = `${rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
            }px`;
    }
}

export default function FloatingLinkEditor({ editor }) {
    const editorRef = useRef(null);
    const inputRef = useRef(null);
    const [linkUrl, setLinkUrl] = useState("");
    const [isEditMode, setEditMode] = useState(false);
    const [lastSelection, setLastSelection] = useState(null);

    const updateLinkEditor = useCallback((source = 'default', linkNode = null) => {
        const selection = $getSelection();
        let resolvedLinkNode = linkNode;

        if ($isRangeSelection(selection) && !resolvedLinkNode) {
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            resolvedLinkNode = $isLinkNode(parent) ? parent : ($isLinkNode(node) ? node : null);
        }

        if (resolvedLinkNode) {
            setLinkUrl(resolvedLinkNode.getURL());
        } else {
            setLinkUrl("");
        }

        const editorElem = editorRef.current;
        const nativeSelection = window.getSelection();
        const activeElement = document.activeElement;

        if (editorElem === null) return;

        const rootElement = editor.getRootElement();

        if (resolvedLinkNode !== null) {
            const dom = editor.getElementByKey(resolvedLinkNode.getKey());
            if (dom != null) {
                const rect = dom.getBoundingClientRect();
                positionEditorElement(editorElem, rect);
                setLastSelection(selection);
                return true;
            }
        }

        if (selection !== null &&
            !nativeSelection.isCollapsed &&
            rootElement !== null &&
            rootElement.contains(nativeSelection.anchorNode)
        ) {
            const domRange = nativeSelection.getRangeAt(0);
            const rect = domRange.getBoundingClientRect();
            positionEditorElement(editorElem, rect);
            setLastSelection(selection);
            return true;
        } else if (!activeElement || activeElement.className !== "link-input") {
            positionEditorElement(editorElem, null);
            setLastSelection(null);
            setEditMode(false);
            setLinkUrl("");
        }

        return true;
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateLinkEditor();
                });
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateLinkEditor();
                    return true;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                CLICK_COMMAND,
                (payload) => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        const node = getSelectedNode(selection);
                        const linkNode = $findMatchingParent(node, $isLinkNode);
                        if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
                            window.open(linkNode.getURL(), '_blank');
                            return true;
                        } else if (payload.detail === 1) {
                            //console.log("linkNode", linkNode);
                            updateLinkEditor('click', linkNode);
                        }
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            )
        );
    }, [editor, updateLinkEditor]);

    useEffect(() => {
        editor.getEditorState().read(() => {
            updateLinkEditor();
        });
    }, [editor, updateLinkEditor]);

    useEffect(() => {
        if (isEditMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditMode]);

    return (
        <div ref={editorRef} className="link-editor">
            {isEditMode ? (
                <input
                    ref={inputRef}
                    className="link-input"
                    value={linkUrl}
                    onChange={(event) => {
                        setLinkUrl(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            if (lastSelection !== null || clickedLinkNode) {
                                if (linkUrl !== "") {
                                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                                }
                                setEditMode(false);
                            }
                        } else if (event.key === "Escape") {
                            event.preventDefault();
                            setEditMode(false);
                        }
                    }}
                />
            ) : (
                <>
                  <div className="link-input">
                        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                            {linkUrl}
                        </a>
                        <div className="link-actions">
                            <EditOutlined
                                className="link-edit"
                                onClick={() => setEditMode(true)}
                                onMouseDown={(event) => event.preventDefault()}
                            />
                            <DeleteOutlined
                                className="link-delete"
                                onClick={() => {
                                    if (lastSelection !== null) {
                                        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                                    }
                                }}
                                onMouseDown={(event) => event.preventDefault()}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}