import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const entryUid = _req.getString('uid');

const dbDictionaryEntry = _db.get('dictionary_entry', entryUid);

if (!dbDictionaryEntry) {
    cluar.response.error({ status: 404, error: 'entry not found' });
}

const entryId = dbDictionaryEntry.getInt("id");

// Verifica se existe algum dicionário usando esta entrada
const inUse = _db.queryFirst(`
    SELECT count(id) as total FROM dictionary WHERE entry_id = ?
`, entryId);

if (inUse && inUse.getInt("total") > 0) {
    // Se estiver em uso, bloqueia a exclusão e avisa o usuário
    cluar.response.error({
        status: 409,
        error: 'Não é possível apagar esta entrada pois ela está sendo usada em um ou mais dicionários.'
    });
}

// Se não estiver em uso, apaga normalmente
_db.delete('dictionary_entry', entryId);
cluar.response.successWithoutData({ status: 200 });