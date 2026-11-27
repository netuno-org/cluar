import { useSelector } from "react-redux";
import MonacoEditor from "../../MonacoEditor";
import EditorModeSwitch from "./EditorModeSwitch";

// Modo "Código" dos editores de conteúdo (html_content).
// Mesma aparência do modo HTML do LexicalEditor: toolbar só com o seletor e o Monaco abaixo.
export default function CodeModePanel({ value, onChange, onVisualRequest, codeLabel }) {
  const themeMode = useSelector((state) => state.theme?.mode || "light");

  return (
    <div className={`editor-container editor-container--${themeMode === "dark" ? "dark" : "light"}`}>
      <div className="toolbar">
        <EditorModeSwitch isCodeMode onChange={(code) => !code && onVisualRequest()} codeLabel={codeLabel} />
      </div>
      <div className="editor-inner">
        <MonacoEditor value={value} onChange={onChange} />
      </div>
    </div>
  );
}
