const uid = _req.getString("uid");

const dbUser = _db.form('people')
.join(
    _db.manyToOne(
        'netuno_user',
        'people_user_id'
    )
)
.where(
    _db.where('uid').equal(uid)
)
.get('people.name', 'people_name')
.get('people.email', 'people_email')
.get('people.uid', 'people_uid')
.get('netuno_user.active', 'user_active')
.get('netuno_user.user', 'username')
.first();

if (!dbUser) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error',`User not found with uid: ${uid}`)
            .set('error_code', 'user-not-found')
    )
    _exec.stop();
}

const user = _val.map()
    .set('name', dbUser.getString('people_name'))
    .set('email', dbUser.getString('people_email'))
    .set('uid', dbUser.getString('people_uid'))
    .set('active', dbUser.getBoolean('user_active'))
    .set('username', dbUser.getString('username'))

_out.json(
    _val.map()
        .set('result', true)
        .set('user', user)
)