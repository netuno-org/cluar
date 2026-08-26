import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const dbActions = _db.query(`
    SELECT 
        action.uid,
        action.title,
        action.content,
        action.indication,
        action.link,
        action.active,
        action.image,
        language.code as language_code,
        language.description as language_description,
        action_parameter.uid as parameter_uid,
        action_parameter.code as parameter_code
    FROM action
    INNER JOIN language ON action.language_id = language.id
    INNER JOIN action_parameter ON action.parameter_id = action_parameter.id
    ORDER BY action.id DESC
`);

const items = _val.list();

for (const dbAction of dbActions) {
  items.add(
    _val.map()
      .set("uid", dbAction.getString("uid"))
      .set("title", dbAction.getString("title"))
      .set("content", dbAction.getString("content"))
      .set("indication", dbAction.getString("indication"))
      .set("link", dbAction.getString("link"))
      .set("active", dbAction.getBoolean("active"))
      .set("image", dbAction.getString("image"))
      .set("language_code", dbAction.getString("language_code"))
      .set("language_description", dbAction.getString("language_description"))
      .set("parameter_uid", dbAction.getString("parameter_uid"))
      .set("parameter_code", dbAction.getString("parameter_code"))
  );
}

cluar.response.successWithData({ status: 200, data: items });
