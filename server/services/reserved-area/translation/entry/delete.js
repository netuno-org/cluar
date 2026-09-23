import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const entryUid = _req.getString("uid");

const dbTranslationEntry = _db.get("translation_entry", entryUid);

if (!dbTranslationEntry) {
  cluar.response.error({ status: 404, error: "entry not found", error_code: "entry-not-found" });
}

const entryId = dbTranslationEntry.getInt("id");

// Verifica se existe algum tradução usando esta entrada
const inUse = _db.queryFirst(`
    SELECT count(id) as total FROM translation WHERE entry_id = ?
`, entryId);

if (inUse && inUse.getInt("total") > 0) {
  // Se estiver em uso, bloqueia a exclusão e avisa o usuário
  cluar.response.error({
    status: 409,
    error_code: "entry-in-use",
    error: "Não é possível apagar esta entrada pois ela está sendo usada em um ou mais traduções."
  });
}

// Se não estiver em uso, apaga normalmente
_db.delete("translation_entry", entryId);
cluar.response.successWithoutData({ status: 200 });
