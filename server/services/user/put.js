const uid = _req.getString("uid");
const name = _req.getString("name");
const username = _req.getString("username");
let email = _req.getString("email");
const password = _req.getString("password");
const groupCode = _req.getString("group_code");

const userEmailExists = _user.firstByMail(email);
const usernameExists = _user.firstByUser(username);

const dbPeople = _db.get("people", uid);

if (!dbPeople) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `user not found with uid: ${uid}`)
            .set('error-code', 'user-not-found')
    )
    _exec.stop();
}

const dbGroup = _group.firstByCode(groupCode);

if (!dbGroup) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `group not found with code: ${groupCode}`)
            .set('error-code', 'group-not-found')
    )
    _exec.stop();
}

const peopleEmailExists = _db.queryFirst(`
    SELECT 
        CASE WHEN COUNT(1) > 0 THEN TRUE ELSE FALSE END AS result
    FROM people
    WHERE 1 = 1
        AND people.email = ?
        AND people.id != ? 
`, email, dbPeople.getInt("id")).getBoolean("result");

const userExists = _db.queryFirst(`
    SELECT
        CASE WHEN COUNT(1) > 0 THEN TRUE ELSE FALSE END AS result
    FROM netuno_user
    WHERE 1 = 1
        AND (netuno_user.user = ? OR netuno_user.mail = ?)
        AND netuno_user.id != ?
`, username, email, dbPeople.getInt("people_user_id")).getBoolean("result");

if (peopleEmailExists || userExists) {
    _header.status(409);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `email or username already exists`)
            .set('error-code', 'user-exists')
    )
    _exec.stop();
}

const userData = _val.map()
    .set("name", name)
    .set("user", username)
    .set("mail", email)
    .set("pass", password)
    .set("group_id", dbGroup.getInt("id"))

let shouldUpdatePass = false;

if (password.length > 1) {
    shouldUpdatePass = true;
}

const peopleData = _val.map()
  .set("name", name)
  .set("email", email)

if (_req.has("active")) {
    userData.set("active", _req.getBoolean("active"));
    peopleData.set("active", _req.getBoolean("active"));
}

_user.update(
    dbPeople.getInt("people_user_id"),
    userData,
    shouldUpdatePass
)

_db.update(
    'people',
    dbPeople.getInt("id"),
    peopleData
);

