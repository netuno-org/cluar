import { _db } from "@netuno/server-types";

export default {
  insertAndReturn: (tableName, data) => {
    const id = _db.insert(tableName, data);
    return _db.get(tableName, id);
  }
};
