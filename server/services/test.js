import { _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";
import { OpenAI } from "#core/openAI.js";

const currentHtml = _req.getString("html", "");
const userPrompt = _req.getString("prompt", null);

if (!userPrompt) {
  cluar.response.error({
    status: 400,
    error_code: "prompt-required",
    error: "the 'prompt' parameter is required"
  });
}

const openai = new OpenAI();

const result = openai.processHtml(currentHtml, userPrompt);

if (result.getBoolean("success")) {
  _out.json(
    _val.map()
      .set("result", true)
      .set("html", result.getString("html"))
  );
} else {
  cluar.response.error({
    status: 500,
    error_code: "openai-service-failed",
    error: result.getString("error"),
    details: result.get("details")
  });
}
