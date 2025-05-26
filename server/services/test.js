// _core: openAI

const currentHtml = _req.getString("html", "");
const userPrompt = _req.getString("prompt", null);

if (!userPrompt) {
    _header.status(400);
    _out.json(
        _val.map()
            .set("result", false)
            .set("error", "O parâmetro 'prompt' é obrigatório")
    );
    _exec.stop();
}

_log.debug("TEST AI STARTED");

const openai = new OpenAI();

const result = openai.processHtml(currentHtml, userPrompt);

_log.debug("result", result);


if (result.getBoolean("success")) {
    _out.json(
        _val.map()
            .set("result", true)
            .set("html", result.getString("html"))
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