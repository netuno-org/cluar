import { _val, _req, _out, _header, _exec } from "@netuno/server-types";
import { NetunoAI } from "#core/netunoAI.js";

const text = _req.getString("text", null);
const language = _req.getString("language", null);

if (!text) {
  _header.status(400);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", "the 'text' parameter is required")
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

const netunoAI = new NetunoAI();
const result = netunoAI.processTranslation(text, language);

if (result.getBoolean("success")) {
  _out.json(
    _val.map()
      .set("result", true)
      .set("translation", result.getString("translation"))
  );
} else {
  _header.status(500);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", result.getString("error"))
      .set("details", result.get("details"))
  );
}
