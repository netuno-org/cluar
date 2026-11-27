import { ColorPicker } from "antd";
import useSavedSelection from "./useSavedSelection";

// Seletor de cor da toolbar (texto ou fundo).
// O campo hex e o painel do ColorPicker tiram a seleção do editor:
// ela é guardada ao abrir e restaurada antes de cada aplicação.
export default function ColorControl({ icon, title, value, onChange, presets }) {
  const selection = useSavedSelection();

  return (
    <span className="toolbar-color" title={title}>
      {icon}
      <ColorPicker
        value={value || undefined}
        size="small"
        placement="bottomLeft"
        onOpenChange={(open) => {
          if (open) selection.save();
        }}
        onChange={(color) => {
          selection.restore();
          onChange(color);
        }}
        presets={presets}
      />
    </span>
  );
}
