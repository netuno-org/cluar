import { _db, _val } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const dbGroups = _db.query(`
    SELECT
      name,
      code,
      uid
    FROM user_group
    WHERE code <> '' AND name <> ''
  `);

cluar.response.successWithData({
  status: 200,
  data: dbGroups
});

