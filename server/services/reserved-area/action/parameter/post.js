import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const code = _req.getString("code");
const description = _req.getString("description");

/* ---------- VALIDAÇÕES DOS DADOS RECEBIDOS ---------- */
if (!code) {
    cluar.response.error({ status: 400, error: 'code is required' });
}

if (!description) {
    cluar.response.error({ status: 400, error: 'description is required' });
}

const codeExists = _db.queryFirst(`
    SELECT * FROM action_parameter 
    WHERE code = ?
`, code);

if (codeExists) {
    cluar.response.error({ status: 409, error: `parameter code already exists: ${code}` })
}

const parameter = _db.form("action_parameter")
    .set('code', code)
    .set('description', description)
    .get("uid")
    .get("code")
    .get("description")
    .insertAndReturn();

_out.json(
    _val.map()
        .set('result', true)
        .set('parameter', parameter)
);
