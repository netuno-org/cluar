import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString('uid');

const dbDictionary = _db.get('dictionary', uid);

if (!dbDictionary) {
    cluar.response.error({ status: 404, error: 'dictionary not found' });
}

_db.delete('dictionary', dbDictionary.getInt("id"));
cluar.response.successWithoutData({ status: 200 });