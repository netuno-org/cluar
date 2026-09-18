import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString('uid');

const dbTranslation = _db.get('translation', uid);

if (!dbTranslation) {
  cluar.response.error({ status: 404, error: 'translation not found' });
}

_db.delete('translation', dbTranslation.getInt("id"));
cluar.response.successWithoutData({ status: 200 });
