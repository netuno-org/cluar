//_core: db/insertAndReturn

const {
    name,
    code,
    parent_uid,
    active
} = JSON.parse(_req.toJSON());

let dbParent = null;

if (parent_uid) {
    dbParent = _db.get('organization', parent_uid);
    if (!dbParent) {
        _header.status(404);
        _out.json(
            _val.map()
                .set('result', false)
                .set('error_code', 'parent-organization-not-found')
                .set('error', `not fund parent organization with uid: ${parent_uid}`)
        )
        _exec.stop();
    }
}

const insertedOrganization = insertAndReturn(
    'organization', 
    _val.map()
        .set('name', name)
        .set('active', active)
        .set('code', code)
        .set('parent_id', dbParent ? dbParent.getInt('id') : 0)
);

const organization = _val.map()
    .set('active', insertedOrganization.getBoolean('active'))
    .set('uid', insertedOrganization.getString('uid'))
    .set('name', insertedOrganization.getString('name'))
    .set('code', insertedOrganization.getString('code'))

if (insertedOrganization.getInt('parent_id') > 0) {
    organization.set('parent', _val.map()
        .set('name', dbParent.getString('name'))
        .set('code', dbParent.getString('code'))
        .set('uid', dbParent.getString('uid'))
    )
}

_out.json(
    _val.map()
        .set('result', true)
        .set('organization', organization)
)

