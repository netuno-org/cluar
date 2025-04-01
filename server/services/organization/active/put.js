const {
    uid,
    active
} = JSON.parse(_req.toJSON());

const dbOrganization = _db.queryFirst('SELECT * FROM organization WHERE uid = ?::uuid', uid);

if (!dbOrganization) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error_code', "not-found")
            .set('error', `organization not found with uid: ${uid}`)
    );
    _exec.stop();
}

_db.update(
    'organization',
    dbOrganization.getInt("id"),
    _val.map()
        .set('active', active)
);

_out.json({result: true});
