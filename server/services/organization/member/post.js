//_core: db/insertAndReturn

const {
    people_uid,
    organization_code,
    group_code,
    active
} = JSON.parse(_req.toJSON());


const dbPeople = _db.queryFirst(`SELECT id, uid, name FROM people WHERE uid = ?::uuid`, people_uid);

if (!dbPeople) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `people not found with uid: ${people_uid}`)
            .set('error_code', `people-not-found`)
    );
    _exec.stop();
}

const dbOrganization = _db.queryFirst(`SELECT id, name, code FROM organization WHERE code = ?::varchar`, organization_code);

if (!dbOrganization) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `organization not found with uid: ${organization_code}`)
            .set('error_code', `organization-not-found`)
    );
    _exec.stop();
}

const dbGroup = _db.queryFirst(`SELECT id, name, code FROM user_group WHERE code = ?::varchar`, group_code);

if (!dbGroup) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `group not found with uid: ${group_code}`)
            .set('error_code', `group-not-found`)
    );
    _exec.stop();
}

const memberAlreadyExists = _db.queryFirst(`
   SELECT 1
   FROM organization_people
   WHERE 1 = 1
    AND people_id = ?::integer
    AND organization_id = ?::integer
    AND user_group_id = ?::integer 
`, dbPeople.getInt("id"), dbOrganization.getInt("id"), dbGroup.getInt("id"));

if (memberAlreadyExists) {
    _header.status(409);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `this person is already a member of this organization`)
            .set('error_code', `person-already-member`)
    );
    _exec.stop();
}

const memberData = _val.map()
    .set("organization_id", dbOrganization.getInt("id"))
    .set("people_id", dbPeople.getInt("id"))
    .set("user_group_id", dbGroup.getInt("id"))
    .set("active", active)

const createdMember = insertAndReturn("organization_people", memberData);

_header.status(201);
_out.json(
    _val.map()
        .set('result', true)
        .set('member', _val.map()
            .set('uid', memberData.getInt("uid"))
            .set('people', _val.map()
                .set('name', dbPeople.getString("name"))
                .set('uid', dbPeople.getString("uid"))
            )
            .set('group', _val.map()
                .set('name', dbGroup.getString("name"))
                .set('code', dbGroup.getString("code"))
            )
            .set('organization', _val.map()
                .set('name', dbOrganization.getString("name"))
                .set('code', dbOrganization.getString("code"))
            )
        )
)