import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");
const code = _req.getString("code");
const description = _req.getString("description");

/* ---------- VALIDAÇÕES DOS DADOS RECEBIDOS ---------- */
if (!uid) {
    cluar.response.error({ status: 400, error: 'uid is required' });
}

if (!code) {
    cluar.response.error({ status: 400, error: 'code is required' });
}

if (!description) {
    cluar.response.error({ status: 400, error: 'description is required' });
}

const dbDictionaryEntry = _db.get('dictionary_entry', uid);

if (!dbDictionaryEntry) {
    cluar.response.error({ status: 404, error: 'entry not found' });
}

const codeExists = _db.queryFirst(`
    SELECT * FROM dictionary_entry 
    WHERE code = ? AND uid != ?::uuid
`, code, uid);

if (codeExists) {
    cluar.response.error({ status: 409, error: `entry code already exists: ${code}` })
}

const entry = _db.form("dictionary_entry")
    .where(
        _db.where('id').equal(dbDictionaryEntry.getInt('id'))
    )
    .set('code', code)
    .set('description', description)
    .update();

_out.json(
    _val.map()
        .set('result', true)
);
