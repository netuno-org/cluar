cluar.actions = (section, id) => {
  const dbActions = _db.query(`
        SELECT
            action.title,
            action.content,
            action.indication,
            action.link
        FROM action
            INNER JOIN ${section}_action ON ${section}_action.action_id = action.id
        WHERE
            action.active = true
            AND ${section}_action.active = TRUE
            AND ${section}_action.${section}_id = ${id}
        ORDER BY ${section}_action.sorter
        `)
  const actions = _val.list()
  for (const dbAction of dbActions) {
    actions.add(
      _val.map()
        .set("title", dbAction.getString("title"))
        .set("content", dbAction.getString("content"))
        .set("indication", dbAction.getString("indication"))
        .set("link", dbAction.getString("link"))
        .set("sorter", dbAction.getInt("sorter"))
    )
  }
  return actions
}
