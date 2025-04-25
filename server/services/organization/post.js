//_core: db/insertAndReturn
//_core: utils/organization

const {
    name,
    code,
    parent_code,
    active
} = JSON.parse(_req.toJSON());

let dbParent = null;

if (parent_code) {
    dbParent = _db.queryFirst(`SELECT * FROM organization WHERE code = ?`, parent_code);
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
}

const codeAlreadyInUse = _db.queryFirst(`
    SELECT 1
    FROM organization
    WHERE 1 = 1
        AND code = ?   
`, code);

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

