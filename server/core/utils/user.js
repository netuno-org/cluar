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

const getUserOrganizations = () => {
    const dbPeople = _db.queryFirst(`SELECT id FROM people WHERE people_user_id = ?`, _user.id());

    const dbOrganizations = _db.query(`
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
                AND op.people_id = ${dbPeople.getInt("id")}
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
        SELECT 
            user_orgs.name,
            user_orgs.code,
            user_orgs.uid,
            user_orgs.id
        FROM 
            user_orgs
        WHERE 1 = 1   
        `);

    return dbOrganizations;
}

const getUserGroupEachOrganization = () => {

}