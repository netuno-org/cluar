import { useRef } from "react";
import Editor from "@monaco-editor/react";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";

const MonacoEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Formatação sob demanda: Shift+Alt+F ou botão de contexto
        editor.addAction({
            id: "format-html",
            label: "Formatar HTML",
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
                        // Reposiciona o cursor no início
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
            <Editor
                height="300px"
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
                }}
            />
        </div>
    );
};

export default MonacoEditor;