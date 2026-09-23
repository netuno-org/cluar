import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");
const code = _req.getString("code");
const description = _req.getString("description");
const typeCode = _req.getString("type_code");

/* ---------- VALIDAÇÕES DOS DADOS RECEBIDOS ---------- */
if (!uid) {
  cluar.response.error({ status: 400, error: 'uid is required', error_code: 'uid-required' });
}

if (!code) {
  cluar.response.error({ status: 400, error: 'code is required', error_code: 'code-required' });
}

if (!description) {
  cluar.response.error({ status: 400, error: 'description is required', error_code: 'description-required' });
}

if (!typeCode) {
  cluar.response.error({ status: 400, error: 'type_code is required', error_code: 'type-code-required' });
}

const dbConfigurationParameter = _db.get('configuration_parameter', uid);

if (!dbConfigurationParameter) {
  cluar.response.error({ status: 404, error: 'parameter not found', error_code: 'parameter-not-found' });
}

const codeExists = _db.queryFirst(`
    SELECT * FROM configuration_parameter 
    WHERE code = ? AND uid != ?::uuid
`, code, uid);

if (codeExists) {
  cluar.response.error({ status: 409, error: `parameter code already exists: ${code}`, error_code: 'parameter-code-already-exists' })
}

const dbParameterType = _db.form('configuration_parameter_type')
  .where(
    _db.where('code').equals(typeCode)
  )
  .first()

if (!dbParameterType) {
  cluar.response.error({ status: 404, error: `parameter type not found: ${typeCode}`, error_code: 'parameter-type-not-found' })
}

const parameter = _db.form("configuration_parameter")
  .where(
    _db.where('id').equal(dbConfigurationParameter.getInt('id'))
  )
  .set('code', code)
  .set('description', description)
  .set('configuration_parameter_type_id', dbParameterType.getInt("id"))
  .update();

_out.json(
  _val.map()
    .set('result', true)
);
