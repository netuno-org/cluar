export const FONT_FAMILY_OPTIONS = [
  ["inherit", "Default"],
  ["Arial", "Arial"],
  ["Courier New", "Courier New"],
  ["Georgia", "Georgia"],
  ["Times New Roman", "Times New Roman"],
  ["Verdana", "Verdana"],
];

export const FONT_SIZE_OPTIONS = [
  ["10px", "10"],
  ["12px", "12"],
  ["14px", "14"],
  ["16px", "16"],
  ["18px", "18"],
  ["24px", "24"],
  ["32px", "32"],
  ["48px", "48"],
];

export function dropDownActiveClass(condition) {
  return condition ? "active" : "";
}

// ─── Paletas da toolbar (cores da marca do projeto) ───

// Presets do seletor de cor do texto
export const TEXT_COLOR_PRESETS = ["#141414", "#444444", "#FFFFFF", "#FF6E1A", "#C2410C", "#D1D1D1", "#16A34A", "#DC2626"];

// Presets do seletor de cor de fundo
export const BG_COLOR_PRESETS = ["#FFFFFF", "#F5F5F5", "#FFF1E8", "#D1D1D1", "#141414", "#FF6E1A"];

// Gradientes predefinidos do texto (2 ou 3 cores). Os últimos são para fundos escuros.
export const GRADIENT_PRESETS = [
  ["#FF6E1A", "#FFA05C"],
  ["#C2410C", "#FF6E1A", "#FFB37A"],
  ["#FF6E1A", "#E5383B"],
  ["#444444", "#FF6E1A"],
  ["#141414", "#FF6E1A"],
  ["#FFB37A", "#FF6E1A", "#FFD166"],
  ["#F5F5F5", "#FF6E1A"],
];
