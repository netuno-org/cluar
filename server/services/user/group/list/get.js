const dbGroups = _db.query(`
    SELECT
      name,
      code
    FROM netuno_group
    WHERE code <> '' AND name <> ''
  `);
  
  _out.json(_val.map().set("groups", dbGroups));
  