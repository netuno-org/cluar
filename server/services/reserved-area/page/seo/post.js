import { _val, _req, _out, _header, _exec } from "@netuno/server-types";
import { NetunoAI } from "#core/netunoAI.js";

const title = _req.getString("title", null);
const content = _req.getString("content", "");
const language = _req.getString("language", null);

if (!title) {
  _header.status(400);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", "the 'title' parameter is required")
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

const systemPrompt = `
  Tu és um especialista em SEO para websites.
  A tua tarefa é gerar metadados otimizados para a página.
  Retorna APENAS um objeto JSON válido, sem markdown e sem explicações, no seguinte formato:
  {
    "title": "título otimizado (máximo 60 caracteres)",
    "description": "meta description (máximo 160 caracteres)",
    "keywords": "5 a 8 palavras-chave separadas por vírgula"
  }
  Escreve todo o conteúdo em ${language}.
`;

const userPrompt = `
  Título atual da página:
  ${title}

  Conteúdo da página:
  ${content || ""}
`;

const netunoAI = new NetunoAI();
const result = netunoAI.processPrompt(
  userPrompt,
  systemPrompt,
  _val.map().set("temperature", 0.3)
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
  const objectMatch = text.match(/(\{[\s\S]*\})/);
  if (objectMatch) {
    text = objectMatch[1].trim();
  }
}

let seo = null;
try {
  seo = JSON.parse(text);
} catch (error) {
  seo = null;
}

if (!seo || typeof seo !== "object") {
  _header.status(500);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", "failed to parse the AI response")
  );
  _exec.stop();
}

_out.json(
  _val.map()
    .set("result", true)
    .set("data", _val.map()
      .set("title", seo.title || title)
      .set("description", seo.description || "")
      .set("keywords", seo.keywords || "")
    )
);
