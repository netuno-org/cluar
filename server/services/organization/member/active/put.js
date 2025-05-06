const {
    uid,
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

_db.update(
    'organization_people',
    dbMember.getInt("id"),
    _val.map()
        .set('active', active)
);

_out.json(
    _val.map()
        .set('result', true)
)