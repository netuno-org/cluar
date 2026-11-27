import { useState } from "react";
import { Input } from "antd";
import Cluar from "../../../common/Cluar";
import useSavedSelection from "./useSavedSelection";

// Controle de tamanho de fonte (- / campo / +).
// O valor digitado fica num rascunho e só é aplicado com Enter ou ao sair do campo,
// assim dá para apagar e digitar outro número sem o editor reaplicar a cada tecla.
export default function FontSizeControl({ value, onApply }) {
  const [draft, setDraft] = useState(null);
  const selection = useSavedSelection();

  const current = parseInt(value) || 16;

  const commit = () => {
    if (draft === null) return;
    const size = parseInt(draft);
    if (size >= 1 && size !== current) {
      // Ao clicar no campo o editor perde a seleção: restaura antes de aplicar
      selection.restore();
      onApply(String(size));
    }
    setDraft(null);
  };

  // fromInput: setas ↑/↓ dentro do campo (a seleção do editor precisa ser restaurada)
  const step = (delta, fromInput = false) => {
    setDraft(null);
    if (fromInput) selection.restore();
    onApply(String(Math.max(1, current + delta)));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDraft(null);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      step(1, true);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      step(-1, true);
    }
  };

  return (
    <div className="font-size-container" style={{ display: "flex", alignItems: "center" }}>
      <button
        className="toolbar-item"
        title={Cluar.plainTranslation("toolbar-font-size-decrease")}
        type="button"
        onClick={() => step(-1)}
        style={{ padding: "0 8px" }}
      >
        -
      </button>
      <Input
        type="text"
        inputMode="numeric"
        className="font-size-input"
        value={draft ?? String(current)}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 3))}
        onMouseDown={selection.save}
        onFocus={(e) => e.target.select()}
        onKeyDown={handleKeyDown}
        onBlur={commit}
      />
      <button
        className="toolbar-item"
        title={Cluar.plainTranslation("toolbar-font-size-increase")}
        type="button"
        onClick={() => step(1)}
        style={{ padding: "0 8px" }}
      >
        +
      </button>
    </div>
  );
}
