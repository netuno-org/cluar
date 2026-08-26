import { _db, _val, _out } from "@netuno/server-types";

const dbGroups = _db.query(`
    SELECT
      name,
      code,
      uid
    FROM user_group
    WHERE code <> '' AND name <> ''
  `);

_out.json(_val.map().set("groups", dbGroups));

