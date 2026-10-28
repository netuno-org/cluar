import { _val, _req, _out, _header, _exec } from "@netuno/server-types";
import { NetunoAI } from "#core/netunoAI.js";

const prompt = _req.getString("prompt", null);
const language = _req.getString("language", null);

if (!prompt) {
  _header.status(400);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", "the 'prompt' parameter is required")
  );
  _exec.stop();
}

if (!language) {
  _header.status(400);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", "the 'language' parameter is required")
  );
  _exec.stop();
}

const ALLOWED_TYPES = {
  banner: ["Default", "DefaultSubBanner", "Secondary"],
  content: ["Default", "ImageBottom", "ImageContent", "ImageLeft", "ImageRight", "ImageTop", "TextContent"],
  listing: ["Default"],
  functionality: ["ContactForm", "ContactMap", "Default"],
};

const systemPrompt = `
  Tu és um construtor de páginas para um CMS.
  A tua tarefa é transformar a descrição do utilizador numa estrutura de página.
  Retorna APENAS um array JSON válido, sem markdown e sem explicações.
  Cada item do array é uma secção com este formato:
  {
    "section": "<tipo de secção>",
    "type": "<tipo visual da secção>",
    "title": "<título>",
    "content": "<conteúdo>",
    "sorter": 10
  }
  Secções permitidas e respetivos valores de "type":
  - banner: Default, DefaultSubBanner, Secondary
  - content: Default, ImageBottom, ImageContent, ImageLeft, ImageRight, ImageTop, TextContent
  - listing: Default
  - functionality: ContactForm, ContactMap, Default
  Para a secção "listing" podes incluir "items": [ { "title": "...", "content": "...", "link": "...", "sorter": 10 } ].
  Usa no máximo 6 secções e escreve todo o conteúdo em ${language}.
`;

const userPrompt = `
  Descrição da página:
  ${prompt}
`;

const netunoAI = new NetunoAI();
const result = netunoAI.processPrompt(
  userPrompt,
  systemPrompt,
  _val.map().set("temperature", 0.4)
);

if (!result.getBoolean("success")) {
  _header.status(500);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", result.getString("error"))
      .set("details", result.get("details"))
  );
  _exec.stop();
}

let text = result.getString("text").trim();

const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
if (fenceMatch) {
  text = fenceMatch[1].trim();
} else {
  const arrayMatch = text.match(/(\[[\s\S]*\])/);
  if (arrayMatch) {
    text = arrayMatch[1].trim();
  }
}

let parsed = null;
try {
  parsed = JSON.parse(text);
} catch (error) {
  parsed = null;
}

if (!Array.isArray(parsed)) {
  _header.status(500);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", "failed to parse the AI response")
  );
  _exec.stop();
}

const structures = _val.list();
for (const section of parsed) {
  const sectionType = section.section || "";
  if (!ALLOWED_TYPES[sectionType]) {
    continue;
  }

  const rawType = section.type || "";
  const type = ALLOWED_TYPES[sectionType].includes(rawType)
    ? rawType
    : ALLOWED_TYPES[sectionType][0];

  const structure = _val.map()
    .set("section", sectionType)
    .set("type", type)
    .set("title", section.title || "")
    .set("content", section.content || "")
    .set("sorter", section.sorter || 0);

  if (sectionType === "listing" && Array.isArray(section.items)) {
    const items = _val.list();
    for (const item of section.items) {
      items.add(_val.map()
        .set("title", item.title || "")
        .set("content", item.content || "")
        .set("link", item.link || "")
        .set("sorter", item.sorter || 0)
      );
    }
    structure.set("items", items);
  }

  structures.add(structure);
}

_out.json(
  _val.map()
    .set("result", true)
    .set("data", structures)
);
