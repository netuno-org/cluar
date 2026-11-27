import { CodeOutlined } from "@ant-design/icons";
import Cluar from "../../../common/Cluar";

// Seletor "Visual | Código" da toolbar.
// isCodeMode: modo código ativo; onChange(true | false) pede a troca de modo.
export default function EditorModeSwitch({ isCodeMode, onChange, codeLabel = "HTML" }) {
  return (
    <div className="toolbar__mode" role="group">
      <button
        type="button"
        className={!isCodeMode ? "active" : ""}
        onClick={() => isCodeMode && onChange(false)}
      >
        {Cluar.plainTranslation("section-editor-mode-visual")}
      </button>
      <button
        type="button"
        className={isCodeMode ? "active" : ""}
        onClick={() => !isCodeMode && onChange(true)}
        title={Cluar.plainTranslation("toolbar-html-mode")}
      >
        <CodeOutlined /> {codeLabel}
      </button>
    </div>
  );
}
