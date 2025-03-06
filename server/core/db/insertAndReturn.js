const insertAndReturn = (tableName, data) => {
    const id = _db.insert(tableName, data);
    return _db.get(tableName, id);
}