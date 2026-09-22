import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const languageCode = _req.getString("language_code");
const parameterUid = _req.getString("parameter_uid")
const title = _req.getString("title");
const content = _req.getString("content");
const indication = _req.getString("indication");
const link = _req.getString("link");
const active = _req.getBoolean("active");
const image = _req.getFile("image");

const dbLanguage = _db.queryFirst(`
    SELECT id, code, description FROM language WHERE code = ?
`, languageCode);

if (!dbLanguage) {
  cluar.response.error({ status: 404, error: `language not found with code: ${languageCode}` });
}

const dbActionParameter = _db.get('action_parameter', parameterUid);

if (!dbActionParameter) {
  cluar.response.error({ status: 404, error: 'parameter not found' });
}

const data = _db.form("action")
  .set('title', title)
  .set('content', content)
  .set('indication', indication)
  .set('link', link)
  .set('active', active)
  .set("language_id", dbLanguage.getInt("id"))
  .set("parameter_id", dbActionParameter.getInt("id"));

if (image) {
  data.set("image", image);
} else {
  data.set("image", "")
}

data.insert();

_out.json(
  _val.map()
    .set('result', true)
);
