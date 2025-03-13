const filters = _req.getValues("filters");
const pagination = _req.getValues("pagination");
let page = _db.pagination(1, 10);
const where = _val.map()
    .set('people', _db.where())
    .set('group', _db.where())
    .set('user', _db.where())

if (pagination) {
    page = _db.pagination(
        pagination.getInt("page"),
        pagination.getInt("size")
    )
    if (page.getPageSize() > 100) {
        page.setPageSize(100);
    }
}

if (filters) {
    const name = filters.has("name") && filters.getString("name")
    if (name) {
        where.get('people').and('name').contains(name);
    }

    const email = filters.has("email") && filters.getString("email")
    if (email) {
        where.get('people').and('email').contains(email);
    }

    const active = filters.has('active') && filters.getList('active');

    if (active.length > 0) {
        where.get('user').and('active').in(active);
    }

    const username = filters.has('username') && filters.getString('username');
    if (username) {
        where.get('user').and('user').contains(username);
    }
}

const query = _db.form("people")
.join(
    _db.manyToOne(
        "netuno_user",
        "people_user_id",
        where.get('user')
    )
)
.where(where.get('people'))
.get("people.name")
.get("people.uid")
.get("people.email")
.get("netuno_user.id", "netuno_user_id")
.get("netuno_user.user")
.get("netuno_user.active")
.group(
    'people.id',
    'netuno_user.id'
)
.order("people.id", "desc")

const pageUsers = query.page(page);
const dbItems = pageUsers.getList("items") 

const users = _val.list();

for (const dbItem of dbItems) {
    users.add(
        _val.map()
            .set('name', dbItem.getString("name"))
            .set('uid', dbItem.getString("uid"))
            .set('email', dbItem.getString("email"))
            .set('username', dbItem.getString("user"))
            .set('active', dbItem.getBoolean("active"))
    );
}

pageUsers.set("items", users)
_out.json(
    _val.map()
        .set('page', pageUsers)
)