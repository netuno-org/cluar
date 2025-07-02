import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";

const MonacoEditor = ({ value, onChange }) => {
    const monacoEditorRef = useRef(null);

    const handleEditorDidMount = (editor) => {
        monacoEditorRef.current = editor;
    };

    const handleEditorChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    };

    
    useEffect(() => {
        if (monacoEditorRef.current && value) {
            try {
                if (typeof value === 'string') {
                    const formatted = prettier.format(value, {
                        parser: "html",
                        plugins: [parserHtml],
                    });
                    monacoEditorRef.current.setValue(formatted);
                } else {
                    console.error("Valor inválido para formatação HTML:", value);
                }
            } catch (err) {
                console.error("Erro ao formatar HTML:", err);
            }
        }
    }, [value]);

    return (
        <div className="monaco-editor-container">
            <Editor
                height="300px"
                defaultLanguage="html"
                value={value || "<!-- Escreva seu código HTML aqui -->"}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
            />
        </div>
    );
}

export default MonacoEditor;