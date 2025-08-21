cluar.actions = (section, id) => {
  const dbActions = _db.query(`
        SELECT
            action.title,
            action.content,
            action.indication,
            action.link,
            action.uid
        FROM action
            INNER JOIN page_${section}_action ON page_${section}_action.action_id = action.id
        WHERE
            action.active = true
            AND page_${section}_action.active = TRUE
            AND page_${section}_action.page_${section}_id = ${id}
        ORDER BY page_${section}_action.sorter
        `);
  const actions = _val.list()
  for (const dbAction of dbActions) {
    actions.add(
      _val.map()
        .set("title", dbAction.getString("title"))
        .set("content", dbAction.getString("content"))
        .set("indication", dbAction.getString("indication"))
        .set("link", dbAction.getString("link"))
        .set("sorter", dbAction.getInt("sorter"))
        .set("uid", dbAction.getString("uid"))
    )
  }
  return actions
}
