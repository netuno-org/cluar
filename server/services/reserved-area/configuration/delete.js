import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString('uid');

const dbConfiguration = _db.get('configuration', uid);

if (!dbConfiguration) {
  cluar.response.error({ status: 404, error: 'configuration not found' });
}

_db.delete('configuration', dbConfiguration.getInt("id"));
cluar.response.successWithoutData({ status: 200 });
