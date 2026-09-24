import { _db, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");

const dbLanguage = _db.queryFirst(`
    SELECT
        uid,
        active, 
        "default",
        description,
        code,
        locale
    FROM
        language
    WHERE 1 = 1
        AND uid = ?::uuid
`, uid);

if (!dbLanguage) {
  cluar.response.error({
    status: 404,
    error: `language not found with uid: ${uid}`,
    error_code: "language-not-found"
  });
}

cluar.response.successWithData({
  status: 200,
  data: dbLanguage
});

