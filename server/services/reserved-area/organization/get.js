const uid = _req.getString('uid');

const dbPeople = _db.queryFirst(`
    SELECT id FROM people WHERE people_user_id = ? 
`, _user.id());

const dbOrganization = _db.queryFirst(`
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
        user_orgs.name AS org_name,
        user_orgs.code AS org_code,
        user_orgs.uid AS org_uid,
        user_orgs.active AS org_active,
        parent.uid AS parent_uid,
        parent.code AS parent_code,
        parent.name AS parent_name
    FROM 
        user_orgs
    LEFT JOIN 
        organization parent ON user_orgs.parent_id = parent.id
    WHERE 1 = 1
        AND user_orgs.uid = ?::uuid
`, uid);

if (!dbOrganization) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error_code', 'organization-not-found')
            .set('error', `not fund organization with uid: ${uid}`)
    )
    _exec.stop();
}

const organization = _val.map()
    .set('uid', dbOrganization.getString('org_uid'))
    .set('name', dbOrganization.getString('org_name'))
    .set('code', dbOrganization.getString('org_code'))
    .set('active', dbOrganization.getBoolean('org_active'))

if (dbOrganization.has('parent_uid')) {
    organization.set("parent",
        _val.map()
            .set('uid', dbOrganization.getString('parent_uid'))
            .set('name', dbOrganization.getString('parent_name'))
            .set('code', dbOrganization.getString('parent_code'))
    )
}

_out.json(
    _val.map()
        .set('result', true)
        .set('organization', organization)
)