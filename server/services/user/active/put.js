const uid = _req.getString("uid");
const active = _req.getBoolean("active");

const dbPeople = _db.queryFirst(`
    SELECT id, people_user_id FROM people WHERE uid = ?::uuid
`, uid);

if (!dbPeople) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `user not found with uid: ${uid}`)
            .set('error_code', 'user-not-found')
    )
    _exec.stop();
}

_user.update(
    dbPeople.getInt("people_user_id"),
    _val.map()
        .set('active', active),
    false
);

_db.update(
    'people',
    dbPeople.getInt("id"),
    _val.map()
        .set('active', active)
);

_out.json(
    _val.map()
        .set('result', true)
)