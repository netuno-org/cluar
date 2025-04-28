//_core: utils/organization

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

const codeAlreadyInUse = _db.queryFirst(`
    SELECT 1
    FROM organization
    WHERE 1 = 1
        AND code = ? AND id != ?    
`, code, dbOrganization.getInt("id"));

if (codeAlreadyInUse) {
    _header.status(409);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error_code', 'code-alread-in-use')
            .set('error', `the code ${code} already in use in other organization.`)
    )
    _exec.stop();
}

let dbParent = null;

if (parent_code) {
    dbParent = _db.queryFirst(`SELECT id FROM organization WHERE code = ?`, parent_code);
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

    if (dbParent.getInt("id") == dbOrganization.getInt("id")) {
        _header.status(409);
        _out.json(
            _val.map()
                .set('result', false)
                .set('error_code', 'redundant-organization')
                .set('error', `the organization cannot have itself as parent`)
        )
        _exec.stop();
    }

    const isAuthorized = isUserAuthorizedInOrganization(
        _val.map()
            .set('organization', dbParent)
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

    const isDescendant = organizationIsDescendant(
        _val.map()
            .set('organizationChildren', dbOrganization)
            .set('organizationParent', dbParent)
    )

    if (isDescendant) {
        _header.status(401);
        _out.json(
            _val.map()
                .set('result', false)
                .set('error_code', 'hierarchy-breakdown')
                .set('error', `An organization can not have as parent an organization below your hierarchy`)
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