import { useRef } from "react";
import Editor from "@monaco-editor/react";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import Cluar from "../../common/Cluar";

const MonacoEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.addAction({
      id: "format-html",
      label: Cluar.plainDictionary("monaco-editor-action-format-html"),
      keybindings: [
        monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      ],
      run: () => {
        try {
          const current = editor.getValue();
          if (typeof current === "string" && current.trim()) {
            const formatted = prettier.format(current, {
              parser: "html",
              plugins: [parserHtml],
            });
            editor.setValue(formatted);
            editor.setPosition({ lineNumber: 1, column: 1 });
          }
        } catch (err) {
          console.error("Erro ao formatar HTML:", err);
        }
      },
    });
  };

  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="monaco-editor-container">
      <div className="monaco-editor-header">
        <span className="monaco-editor-header__title">
          <span className="monaco-editor-header__dot" />
          HTML
        </span>
        <span className="monaco-editor-header__shortcut">
          {Cluar.plainDictionary("monaco-editor-shortcut-format")}
        </span>
      </div>
      <div className="monaco-editor-wrapper">
        <Editor
          height="400px"
          defaultLanguage="html"
          value={value || ""}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            formatOnPaste: false,
            autoIndent: "none",
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            lineNumbers: "on",
            renderLineHighlight: "gutter",
            fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
            fontSize: 13,
            fontLigatures: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
