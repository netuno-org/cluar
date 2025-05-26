import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import "./styles.less";

function Placeholder() {
  return <div className="editor-placeholder">Escreva seu conteúdo aqui...</div>;
}

const FormLexicalEditor = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(null);

  useEffect(() => {
    if (value && !editorState) {
      try {
        setEditorState(value);
      } catch (error) {
        console.error("Erro ao definir o estado inicial do editor:", error);
      }
    }
  }, [value, editorState]);

  const handleEditorChange = (editorState) => {
    editorState.read(() => {
      const htmlString = editorState.toJSON();
      if (onChange) {
        onChange(htmlString);
      }
    });
  };

  const initialConfig = {
    namespace: "MyEditor",
    theme: {
      root: "editor-container",
      link: "editor-link",
      text: {
        bold: "editor-text-bold",
        italic: "editor-text-italic",
        underline: "editor-text-underline",
      },
    },
    onError(error) {
      console.error("Erro no editor Lexical:", error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    editorState: editorState,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default FormLexicalEditor;