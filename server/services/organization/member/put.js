//_core: utils/organization

const {
    uid,
    people_uid,
    organization_code,
    group_code,
    active
} = JSON.parse(_req.toJSON());

const dbMember = _db.queryFirst(`SELECT id FROM organization_people WHERE uid = ?::uuid`, uid);

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

const isAuthorized = isUserAuthorizedInOrganization(
    _val.map()
        .set('organization', dbOrganization)
);

if (!isAuthorized) {
    _header.status(401);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error_code', 'user-unauthorized')
            .set('error', `user not authorized in the organization`)
    )
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
     AND id != ?::integer 
 `, _val.init()
    .add(dbPeople.getInt("id"))
    .add(dbOrganization.getInt("id"))
    .add(dbMember.getInt("id"))
);

if (memberAlreadyExists) {
    _header.status(409);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `this person is already a member of this organization, but you can manager your group`)
            .set('error_code', `person-already-member`)
    );
    _exec.stop();
}

const memberData = _val.map()
    .set("organization_id", dbOrganization.getInt("id"))
    .set("people_id", dbPeople.getInt("id"))
    .set("user_group_id", dbGroup.getInt("id"))
    .set("active", active)

_db.update(
    'organization_people',
    dbMember.getInt("id"),
    memberData
);

_out.json(
    _val.map()
        .set('result', true)
)