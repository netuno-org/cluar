const uid = _req.getString("uid");


const dbPeople = _db.queryFirst(`
    SELECT id FROM people WHERE people_user_id = ? 
`, _user.id());

const dbMember = _db.queryFirst(`
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
    SELECT DISTINCT ON (user_orgs.uid, people.uid)
        organization_people.uid AS organization_people_uid,
        organization_people.active AS organization_people_active, 
        user_orgs.id AS user_orgs_id,
        user_orgs.name AS org_name,
        user_orgs.code AS org_code,
        user_orgs.uid AS org_uid,
        people.id AS people_id,
        people.uid AS people_uid,
        people.name AS people_name
    FROM 
        user_orgs
	INNER JOIN 
        organization_people ON organization_people.organization_id = user_orgs.id
	INNER JOIN
		people ON people.id = organization_people.people_id
    INNER JOIN 
        user_group ON user_group.id = organization_people.user_group_id
    WHERE 1 = 1
        AND organization_people.uid = ?::uuid
`, uid);

if (!dbMember) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `member not found with uid: ${uid}`)
            .set('error_code', `member-not-found`)
    );
    _exec.stop();
}

const dbGroups = _db.form('user_group')
.link(
    'organization_people',
    _db.where()
        .and('people_id').equals(dbMember.getInt("people_id"))
        .and('organization_id').equals(dbMember.getInt("user_orgs_id"))
)
.get("user_group.name")
.get("user_group.code")
.all()

_out.json(
    _val.map()
        .set('result', true)
        .set('member',
            _val.map()
                .set('uid', dbMember.getString("organization_people_uid"))
                .set('active', dbMember.getBoolean('organization_people_active'))
                .set('organization', _val.map()
                    .set('uid', dbMember.getString("org_uid"))
                    .set('name', dbMember.getString("org_name"))
                    .set('code', dbMember.getString("org_code"))
                )
                .set('user', _val.map()
                    .set('uid', dbMember.getString("people_uid"))
                    .set('name', dbMember.getString("people_name"))
                )
                .set('groups', dbGroups)
        )
)