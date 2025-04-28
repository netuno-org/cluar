const organizationIsDescendant = (params) => {
    const organizationChildren = params.getValues("organizationChildren");
    const organizationParent = params.getValues("organizationParent");

    const isDescendant = _db.queryFirst(`
         WITH RECURSIVE childrens AS (
            SELECT 
                org.name, 
                org.id, 
                org.parent_id,
                org.code,
                org.uid,
                org.active
            FROM 
                organization org
            WHERE 1 = 1 
               AND org.id = ${organizationChildren.getInt("id")}
            UNION
            SELECT 
                org.name, 
                org.id, 
                org.parent_id,
                org.code,
                org.uid,
                org.active
            FROM 
                organization org
            INNER JOIN 
                childrens cs ON org.parent_id = cs.id
        )
        SELECT 1
        FROM childrens
        WHERE 1 = 1
            AND childrens.id = ${organizationParent.getInt("id")}
    `);
    return !!isDescendant;
}