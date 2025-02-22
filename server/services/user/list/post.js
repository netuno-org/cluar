const filters = _req.getValues("filters");
const pagination = _req.getValues("pagination");
let page = _db.pagination(1, 10);
const peopleWhere = _db.where();
const groupWhere = _db.where();

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
        peopleWhere.and('name').contains(name);
    }

    
    const groupCodes = filters.contains("group_codes") && filters.getList("group_codes");
    if (groupCodes) {
        groupWhere.and('code').in(groupCodes);
    }
}

const query = _db.form("people")
.join(
    _db.manyToOne(
        "netuno_user",
        "people_user_id"
    ).join(
       _db.manyToOne(
            "netuno_group",
            "group_id",
            groupWhere
       )
    )
)
.where(peopleWhere)
.get("people.name")
.get("people.uid")
.get("people.email")
.get("netuno_user.user")
.get("netuno_user.active")
.get("netuno_group.name", "group_name")
.get("netuno_group.code", "group_code")
.order("people.id", "desc")
.group("people.id, people.name, people.email, netuno_user.user, netuno_user.active, netuno_group.name, netuno_group.code")

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
            .set('group', 
                _val.map()
                    .set('name', dbItem.getString("group_name"))
                    .set('code', dbItem.getString("group_code"))
            )
    );
}

pageUsers.set("items", users)
_out.json(
    _val.map()
        .set('page', pageUsers)
)