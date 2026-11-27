import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { Popover, ColorPicker, Select, Switch, Button } from "antd";
import Cluar from "../../../common/Cluar";
import useSavedSelection from "./useSavedSelection";
import { GRADIENT_PRESETS } from "../plugins/constants";

import "./GradientPicker.less";

const ANGLE_OPTIONS = [90, 135, 180, 45].map((angle) => ({ value: angle, label: `${angle}°` }));

const buildGradient = (colors, angle = 90) => {
  const stops = colors
    .map((color, index) => `${color} ${Math.round((index / (colors.length - 1)) * 100)}%`)
    .join(", ");
  return `linear-gradient(${angle}deg, ${stops})`;
};

// Aplica o gradiente como cor do texto (background recortado pelo texto)
const GRADIENT_STYLE = (gradient) => ({
  "background": gradient,
  "-webkit-background-clip": "text",
  "background-clip": "text",
  "-webkit-text-fill-color": "transparent",
});

const REMOVE_GRADIENT_STYLE = {
  "background": null,
  "background-image": null,
  "-webkit-background-clip": null,
  "background-clip": null,
  "-webkit-text-fill-color": null,
};

const toHex = (color) => (typeof color === "string" ? color : color.toHexString());

export default function GradientPicker() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [hasGradient, setHasGradient] = useState(false);
  // Cores iniciais do personalizado: primeiro preset de 3 cores do projeto
  const defaultColors = GRADIENT_PRESETS.find((colors) => colors.length === 3) || GRADIENT_PRESETS[0];
  const [startColor, setStartColor] = useState(defaultColors[0]);
  const [middleColor, setMiddleColor] = useState(defaultColors[1]);
  const [endColor, setEndColor] = useState(defaultColors[defaultColors.length - 1]);
  const [useMiddle, setUseMiddle] = useState(false);
  const [angle, setAngle] = useState(90);
  const selection = useSavedSelection();

  const customColors = useMiddle ? [startColor, middleColor, endColor] : [startColor, endColor];

  const patchSelection = (style) => {
    // Os campos do popover (cores, ângulo) tiram a seleção do editor: restaura antes de aplicar
    selection.restore();
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, style);
      }
    });
  };

  const applyGradient = (colors) => {
    patchSelection(GRADIENT_STYLE(buildGradient(colors, angle)));
    setOpen(false);
  };

  const removeGradient = () => {
    patchSelection(REMOVE_GRADIENT_STYLE);
    setOpen(false);
  };

  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      selection.save();
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const fill = $getSelectionStyleValueForProperty(selection, "-webkit-text-fill-color", "");
          setHasGradient(fill === "transparent");
        }
      });
    }
    setOpen(isOpen);
  };

  const content = (
    <div className="gradient-picker">

      {/* Predefinidos */}
      <span className="gradient-picker__label">{Cluar.plainTranslation("toolbar-gradient-presets")}</span>
      <div className="gradient-picker__presets">
        {GRADIENT_PRESETS.map((colors) => (
          <button
            key={colors.join("-")}
            type="button"
            className="gradient-picker__preset"
            style={{ background: buildGradient(colors, angle) }}
            title={colors.join(" → ")}
            onClick={() => applyGradient(colors)}
          />
        ))}
      </div>

      {/* Personalizado */}
      <span className="gradient-picker__label">{Cluar.plainTranslation("toolbar-gradient-custom")}</span>
      <div className="gradient-picker__preview" style={{ background: buildGradient(customColors, angle) }} />

      <div className="gradient-picker__colors">
        <ColorPicker size="small" value={startColor} onChange={(c) => setStartColor(toHex(c))} />
        {useMiddle && (
          <ColorPicker size="small" value={middleColor} onChange={(c) => setMiddleColor(toHex(c))} />
        )}
        <ColorPicker size="small" value={endColor} onChange={(c) => setEndColor(toHex(c))} />
        <Select
          size="small"
          value={angle}
          onChange={setAngle}
          options={ANGLE_OPTIONS}
          style={{ width: 72 }}
          title={Cluar.plainTranslation("toolbar-gradient-angle")}
        />
      </div>

      <label className="gradient-picker__middle">
        <Switch size="small" checked={useMiddle} onChange={setUseMiddle} />
        {Cluar.plainTranslation("toolbar-gradient-middle-color")}
      </label>

      <div className="gradient-picker__actions">
        {hasGradient && (
          <Button size="small" onClick={removeGradient}>
            {Cluar.plainTranslation("toolbar-gradient-remove")}
          </Button>
        )}
        <Button size="small" type="primary" onClick={() => applyGradient(customColors)}>
          {Cluar.plainTranslation("toolbar-gradient-apply")}
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomLeft"
      open={open}
      onOpenChange={handleOpenChange}
      destroyOnHidden
    >
      <button
        type="button"
        className="toolbar-item gradient-picker__trigger"
        title={Cluar.plainTranslation("toolbar-gradient")}
      >
        <span className="gradient-picker__trigger-swatch" />
      </button>
    </Popover>
  );
}
