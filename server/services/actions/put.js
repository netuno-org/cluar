import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import response from "#core/utils/response.js";

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
    response.error({ status: 404, error: `language not found with code: ${languageCode}` });
}

const dbActionParameter = _db.get('action_parameter', parameterUid);

if (!dbActionParameter) {
    response.error({ status: 404, error: 'parameter not found' });
}

const dbAction = _db.get('action', uid);
if (!dbAction) {
    response.error({ status: 404, error: `action not found with uid: ${uid}` });
}

const data = _val.map()
    .set('title', title)
    .set('content', content)
    .set('indication', indication)
    .set('link', link)
    .set('active', active)
    .set("language_id", dbLanguage.getInt("id"))
    .set("parameter_id", dbActionParameter.getInt("id"));

if (image != null) {
    data.set("image", image);
} else {
    data.set("image", "");
}

_db.update(
    'action',
    dbAction.getInt("id"),
    data
)


_out.json(
    _val.map()
        .set('result', true)
);
