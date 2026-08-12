import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import response from "#core/utils/response.js";

const parameterUid = _req.getString('uid');

const dbActionParameter = _db.get('action_parameter', parameterUid);

if (!dbActionParameter) {
    response.error({ status: 404, error: 'parameter not found' });
}

const parameterId = dbActionParameter.getInt("id");

// Verifica se existe alguma ação usando este parâmetro
const inUse = _db.queryFirst(`
    SELECT count(id) as total FROM action WHERE parameter_id = ?
`, parameterId);

if (inUse && inUse.getInt("total") > 0) {
    // Se estiver em uso, bloqueia a exclusão e avisa o usuário
    response.error({
        status: 409,
        error: 'Não é possível apagar este parâmetro pois ele está sendo usado por uma ou mais ações.'
    });
}

// Se não estiver em uso, apaga normalmente
_db.delete('action_parameter', parameterId);
response.successWithoutData({ status: 200 });