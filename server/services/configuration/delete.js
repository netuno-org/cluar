import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import response from "#core/utils/response.js";

const uid = _req.getString('uid');

const dbConfiguration = _db.get('configuration', uid);

if (!dbConfiguration) {
    response.error({ status: 404, error: 'configuration not found' });
}

_db.delete('configuration', dbConfiguration.getInt("id"));
response.successWithoutData({ status: 200 });