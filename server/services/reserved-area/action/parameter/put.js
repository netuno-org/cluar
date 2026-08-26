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

const dbActionParameter = _db.get('action_parameter', uid);

if (!dbActionParameter) {
  cluar.response.error({ status: 404, error: 'parameter not found' });
}

const codeExists = _db.queryFirst(`
    SELECT * FROM action_parameter 
    WHERE code = ? AND uid != ?::uuid
`, code, uid);

if (codeExists) {
  cluar.response.error({ status: 409, error: `parameter code already exists: ${code}` })
}

const parameter = _db.form("action_parameter")
  .where(
    _db.where('id').equal(dbActionParameter.getInt('id'))
  )
  .set('code', code)
  .set('description', description)
  .update();

_out.json(
  _val.map()
    .set('result', true)
);
