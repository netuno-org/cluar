import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import response from "#core/utils/response.js";

const uid = _req.getString('uid');

const dbDictionary = _db.get('dictionary', uid);

if (!dbDictionary) {
    response.error({ status: 404, error: 'dictionary not found' });
}

_db.delete('dictionary', dbDictionary.getInt("id"));
response.successWithoutData({ status: 200 });