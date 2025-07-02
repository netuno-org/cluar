import './ImageNode.less';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin, createEmptyHistoryState } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGSTART_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

import brokenImage from '../../../images/image-broken.svg';
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import ContentEditable from '../ui/ContentEditable';
import ImageResizer from '../ui/ImageResizer';
import { $isImageNode } from './ImageNode';

const imageCache = new Map();
export const RIGHT_CLICK_IMAGE_COMMAND = createCommand('RIGHT_CLICK_IMAGE_COMMAND');

function useSuspenseImage(src) {
  let cached = imageCache.get(src);
  if (typeof cached === 'boolean') {
    return cached;
  }
  if (!cached) {
    cached = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(false);
      img.onerror = () => resolve(true);
      img.src = src;
    }).then((hasError) => {
      imageCache.set(src, hasError);
      return hasError;
    });
    imageCache.set(src, cached);
    throw cached;
  }
  throw cached;
}

function isSVG(src) {
  return src.toLowerCase().endsWith('.svg');
}

function LazyImage({ altText, className, imageRef, src, width, height, maxWidth, onError }) {
  const [dimensions, setDimensions] = useState(null);
  const isSVGImage = isSVG(src);
  const hasError = useSuspenseImage(src);

  useEffect(() => {
    if (imageRef.current && isSVGImage) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setDimensions({ width: naturalWidth, height: naturalHeight });
    }
  }, [imageRef, isSVGImage]);

  useEffect(() => {
    if (hasError) onError();
  }, [hasError, onError]);

  if (hasError) return <BrokenImage />;

  const calculateDimensions = () => {
    if (!isSVGImage) return { height, maxWidth, width };

    const naturalWidth = dimensions?.width || 200;
    const naturalHeight = dimensions?.height || 200;

    let finalWidth = naturalWidth;
    let finalHeight = naturalHeight;

    if (finalWidth > maxWidth) {
      const scale = maxWidth / finalWidth;
      finalWidth = maxWidth;
      finalHeight = Math.round(naturalHeight * scale);
    }
    const maxHeight = 500;
    if (finalHeight > maxHeight) {
      const scale = maxHeight / finalHeight;
      finalHeight = maxHeight;
      finalWidth = Math.round(finalWidth * scale);
    }

    return { height: finalHeight, maxWidth, width: finalWidth };
  };

  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      style={calculateDimensions()}
      onError={onError}
      draggable="false"
      onLoad={(e) => {
        if (isSVGImage) {
          setDimensions({
            height: e.currentTarget.naturalHeight,
            width: e.currentTarget.naturalWidth,
          });
        }
      }}
    />
  );
}

function BrokenImage() {
  return (
    <img
      src={brokenImage}
      style={{ height: 200, width: 200, opacity: 0.2 }}
      draggable="false"
      alt="Broken image"
    />
  );
}

export default function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
  showCaption,
  caption,
  captionsEnabled,
}) {
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState(null);
  const activeEditorRef = useRef(null);
  const [isLoadError, setIsLoadError] = useState(false);
  const isEditable = useLexicalEditable();
  const { historyState } = createEmptyHistoryState();

  const onEnter = useCallback((event) => {
    const latestSelection = $getSelection();
    if (isSelected && $isNodeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
      const btn = buttonRef.current;
      if (showCaption) {
        $setSelection(null);
        event.preventDefault();
        caption.focus();
        return true;
      }
      if (btn && btn !== document.activeElement) {
        event.preventDefault();
        btn.focus();
        return true;
      }
    }
    return false;
  }, [caption, isSelected, showCaption]);

  const onEscape = useCallback((event) => {
    if (activeEditorRef.current === caption || buttonRef.current === event.target) {
      $setSelection(null);
      editor.update(() => {
        setSelected(true);
        const rootEl = editor.getRootElement();
        if (rootEl) rootEl.focus();
      });
      return true;
    }
    return false;
  }, [caption, editor, setSelected]);

  const onClick = useCallback((event) => {
    if (isResizing) return true;
    if (event.target === imageRef.current) {
      if (event.shiftKey) {
        setSelected(!isSelected);
      } else {
        clearSelection();
        setSelected(true);
        // Força a atualização da seleção para mostrar o resizer imediatamente
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isImageNode(node)) {
            $setSelection(null);
            setTimeout(() => {
              editor.update(() => {
                setSelected(true);
              });
            }, 0);
          }
        });
      }
      return true;
    }
    return false;
  }, [isResizing, isSelected, clearSelection, setSelected, editor, nodeKey]);

  const onRightClick = useCallback((event) => {
    editor.getEditorState().read(() => {
      const latestSel = $getSelection();
      const dom = event.target;
      if (dom.tagName === 'IMG' && $isRangeSelection(latestSel) && latestSel.getNodes().length === 1) {
        editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event);
      }
    });
  }, [editor]);

  useEffect(() => {
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        const sel = editorState.read(() => $getSelection());
        setSelection($isNodeSelection(sel) ? sel : null);
      }),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, (_, ae) => {
        activeEditorRef.current = ae;
        return false;
      }, COMMAND_PRIORITY_LOW),
      editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand(RIGHT_CLICK_IMAGE_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand(DRAGSTART_COMMAND, (e) => {
        if (e.target === imageRef.current) return true;
        return false;
      }, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
    );

    const rootEl = editor.getRootElement();
    rootEl?.addEventListener('contextmenu', onRightClick);
    return () => {
      unregister();
      rootEl?.removeEventListener('contextmenu', onRightClick);
    };
  }, [editor, onClick, onRightClick, onEnter, onEscape]);

  const selectCaptionEditor = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) node.setShowCaption(true);
    });
  };

  const onResizeStart = () => setIsResizing(true);
  const onResizeEnd = (nw, nh) => {
    setTimeout(() => setIsResizing(false), 200);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) node.setWidthAndHeight(nw, nh);
    });
  };

  const draggable = isSelected && $isNodeSelection(selection) && !isResizing;
  const isFocused = (isSelected || isResizing) && isEditable;

  return (
    <Suspense fallback={null}>
      <div 
        className={`image-container ${isSelected ? 'selected' : ''}`}
        draggable={draggable}
      >
        <div className="image-selection-indicator" />
        
        {isLoadError ? (
          <BrokenImage />
        ) : (
          <LazyImage
            className={isFocused ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : null}
            src={src}
            altText={altText}
            imageRef={imageRef}
            width={width}
            height={height}
            maxWidth={maxWidth}
            onError={() => setIsLoadError(true)}
          />
        )}
        
        {resizable && $isNodeSelection(selection) && isFocused && (
          <ImageResizer
            showCaption={showCaption}
            setShowCaption={selectCaptionEditor}
            editor={editor}
            buttonRef={buttonRef}
            imageRef={imageRef}
            maxWidth={maxWidth}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
            captionsEnabled={!isLoadError && captionsEnabled}
          />
        )}
      </div>

      {showCaption && (
        <div className="image-caption-container">
          <LexicalNestedComposer initialEditor={caption}>
            <AutoFocusPlugin />
            <LinkPlugin />
            <HistoryPlugin externalHistoryState={historyState} />
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  placeholder="Enter a caption..."
                  placeholderClassName="ImageNode__placeholder"
                  className="ImageNode__contentEditable"
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </LexicalNestedComposer>
        </div>
      )}
    </Suspense>
  );
}
