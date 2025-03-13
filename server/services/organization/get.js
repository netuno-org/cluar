const uid = _req.getString('uid');

const dbOrganization = _db.queryFirst(`
    SELECT
        org.active AS org_active,
        org.uid AS org_uid, 
        org.code AS org_code,
        org.name AS org_name,
        parent.uid AS parent_uid,
        parent.code AS parent_code,
        parent.name AS parent_name
    FROM 
        organization org
    LEFT JOIN 
        organization parent on org.parent_id = parent.id
    WHERE 1 = 1
        AND org.uid = ?::uuid
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