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

const getUserOrganizationHierarchy = () => {
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
    SELECT DISTINCT ON (user_orgs.id)
        user_orgs.name org_name,
        user_orgs.code org_code,
        user_orgs.uid AS org_uid,
        user_orgs.id AS org_id,
        people.name AS people_name,
        people.uid AS people_uid,
        people.id AS people_id,
        user_group.name AS group_name,
        user_group.code AS group_code,
        organization_people.active AS member_active
    FROM
        user_orgs 
    INNER JOIN 
        organization_people ON organization_people.organization_id = user_orgs.id
    INNER JOIN 
        people ON people.id = organization_people.people_id
    INNER JOIN
        user_group ON user_group.id = organization_people.user_group_id
     WHERE 1 = 1
        AND people.id = ${dbPeople.getInt("id")} 
    `);

    const hierarchy = _val.map();

    for (const dbOrganization of dbOrganizations) {
        hierarchy.set(
            dbOrganization.getString('org_code'),
            _val.map()
                .set('active', dbOrganization.getBoolean('member_active'))
                .set('organization',
                    _val.map()
                        .set('name', dbOrganization.getString('org_name'))
                        .set('code', dbOrganization.getString('org_code'))
                        .set('uid', dbOrganization.getString("org_uid"))
                )
                .set('group',
                    _val.map()
                        .set('name', dbOrganization.getString('group_name'))
                        .set('code', dbOrganization.getString('group_code'))
                )
        )
        const dbDescendants = _db.query(`
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
                  AND org.id = ${dbOrganization.getInt("org_id")}
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
           SELECT 
                childrens.name AS childrens_name,
                childrens.code AS childrens_code,
                childrens.uid AS childrens_uid,
                childrens.id AS childrens_id
           FROM 
                childrens
       `);

        for (const dbDescendant of dbDescendants) {
            hierarchy.set(
                dbDescendant.getString('childrens_code'),
                _val.map()
                    .set('active', dbOrganization.getBoolean('member_active'))
                    .set('organization',
                        _val.map()
                            .set('name', dbDescendant.getString('childrens_name'))
                            .set('code', dbDescendant.getString('childrens_code'))
                            .set('uid', dbDescendant.getString("childrens_uid"))
                    )
                    .set('group',
                        _val.map()
                            .set('name', dbOrganization.getString('group_name'))
                            .set('code', dbOrganization.getString('group_code'))
                    )
            )

            const specificMember = _db.queryFirst(`
            SELECT 
                user_group.name,
                user_group.code,
                organization_people.active AS member_active
            FROM user_group
            INNER JOIN
                organization_people ON organization_people.user_group_id = user_group.id
            WHERE 1 = 1
                AND organization_people.organization_id = ?
                AND organization_people.people_id = ?
        `, dbDescendant.getInt("childrens_id"), dbOrganization.getInt("people_id"));

            if (specificMember) {
                hierarchy.set(
                    dbDescendant.getString('childrens_code'),
                    _val.map()
                        .set('active', specificMember.getBoolean('member_active'))
                        .set('organization',
                            _val.map()
                                .set('name', dbDescendant.getString('childrens_name'))
                                .set('code', dbDescendant.getString('childrens_code'))
                                .set('uid', dbDescendant.getString("childrens_uid"))
                        )
                        .set('group',
                            _val.map()
                                .set('name', specificMember.getString('name'))
                                .set('code', specificMember.getString('code'))
                        )
                )
            }
        }
    }
    return hierarchy;
}