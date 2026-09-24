import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");
const parameterUid = _req.getString("parameter_uid")
const languageCode = _req.getString("language_code");
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
  cluar.response.error({ status: 404, error: `language not found with code: ${languageCode}`, error_code: "language-not-found" });
}

const dbActionParameter = _db.get("action_parameter", parameterUid);

if (!dbActionParameter) {
  cluar.response.error({ status: 404, error: "parameter not found", error_code: "parameter-not-found" });
}

const dbAction = _db.get("action", uid);
if (!dbAction) {
  cluar.response.error({ status: 404, error: `action not found with uid: ${uid}`, error_code: "action-not-found" });
}

const data = _val.map()
  .set("title", title)
  .set("content", content)
  .set("indication", indication)
  .set("link", link)
  .set("active", active)
  .set("language_id", dbLanguage.getInt("id"))
  .set("parameter_id", dbActionParameter.getInt("id"));

if (image != null) {
  data.set("image", image);
} else {
  data.set("image", "");
}

_db.update(
  "action",
  dbAction.getInt("id"),
  data
)


cluar.response.successWithoutData({ status: 200 });
