import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const code = _req.getString("code");
const description = _req.getString("description");
const typeCode = _req.getString("type_code");

/* ---------- VALIDAÇÕES DOS DADOS RECEBIDOS ---------- */
if (!code) {
    cluar.response.error({ status: 400, error: 'code is required' });
}

if (!description) {
    cluar.response.error({ status: 400, error: 'description is required' });
}

if (!typeCode) {
    cluar.response.error({ status: 400, error: 'type_code is required' });
}

const codeExists = _db.queryFirst(`
    SELECT * FROM configuration_parameter 
    WHERE code = ?
`, code);

if (codeExists) {
    cluar.response.error({ status: 409, error: `parameter code already exists: ${code}` })
}

const dbParameterType = _db.form('configuration_parameter_type')
    .where(
        _db.where('code').equals(typeCode)
    )
    .first()

const parameter = _db.form("configuration_parameter")
    .set('code', code)
    .set('description', description)
    .set('configuration_parameter_type_id', dbParameterType.getInt("id"))
    .get("uid")
    .get("code")
    .get("description")
    .insertAndReturn();

parameter.set("type_code", typeCode);

_out.json(
    _val.map()
        .set('result', true)
        .set('parameter', parameter)
);
