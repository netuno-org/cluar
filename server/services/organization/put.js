const {
    uid,
    name,
    code,
    parent_code,
    active
} = JSON.parse(_req.toJSON());

const dbOrganization = _db.get('organization', uid);

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

let dbParent = null;

if (parent_code) {
    dbParent = _db.get('organization', parent_code);
    if (!dbParent) {
        _header.status(404);
        _out.json(
            _val.map()
                .set('result', false)
                .set('error_code', 'parent-organization-not-found')
                .set('error', `not fund parent organization with code: ${parent_code}`)
        )
        _exec.stop();
    }
}

_db.update(
    'organization',
    dbOrganization.getInt('id'),
    _val.map()
        .set('active', active)
        .set('name', name)
        .set('code', code)
        .set('parent_id', dbParent ? dbParent.getInt('id') : 0)
);

_out.json(
    _val.map()
        .set('result', true)
)