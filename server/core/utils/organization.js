const isUserAuthorizedInOrganization = (params) => {
    const people = _db.queryFirst(`SELECT id, name FROM people WHERE people_user_id = ?`, _user.id());
    const organization = params.getValues('organization');

    const dbIsAuthorized = _db.queryFirst(`
        WITH RECURSIVE user_orgs AS (
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
                organization_people op ON org.id = op.organization_id
            WHERE 1 = 1 
                AND op.people_id = ${people.getInt("id")}
                AND op.user_group_id = (SELECT id FROM user_group WHERE code = 'administrator')
                AND op.active = true
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
            INNER JOIN user_orgs uo ON org.parent_id = uo.id
        )
        SELECT 1
        FROM user_orgs
        WHERE user_orgs.id = ? 
    `, organization.getInt('id'));

    return !!dbIsAuthorized;
}

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