import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const code = _req.getString("code");
const description = _req.getString("description");

/* ---------- VALIDAÇÕES DOS DADOS RECEBIDOS ---------- */
if (!code) {
  cluar.response.error({ status: 400, error: "code is required", error_code: "code-required" });
}

if (!description) {
  cluar.response.error({ status: 400, error: "description is required", error_code: "description-required" });
}

const codeExists = _db.queryFirst(`
    SELECT * FROM translation_entry 
    WHERE code = ?
`, code);

if (codeExists) {
  cluar.response.error({ status: 409, error: `entry code already exists: ${code}`, error_code: "entry-code-already-exists" })
}

const entry = _db.form("translation_entry")
  .set("code", code)
  .set("description", description)
  .get("uid")
  .get("code")
  .get("description")
  .insertAndReturn();

cluar.response.successWithData({
  status: 200,
  data: entry
});
