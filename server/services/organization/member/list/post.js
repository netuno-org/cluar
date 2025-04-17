const filters = _req.getValues("filters");
const pagination = _req.getValues("pagination")
const page = _db.pagination(1, 10);
const queryParams = _val.init();
let queryWhere = "";

if (pagination) {
    page.size(pagination.getInt("size"))
    page.page(pagination.getInt("page"))

    if (page.size() > 100) {
        page.size(100);
    }
}

if (filters) {
    const organizationName = filters.has("organization_name") && filters.getString("organization_name");

    if (organizationName) {
        queryWhere += `
            AND user_orgs.name like ?
        `
        queryParams.add(`%${organizationName}%`);
    }

    const peopleName = filters.has("people_name") && filters.getString("people_name");

    if (peopleName) {
        queryWhere += `
            AND people.name like ?
        `
        queryParams.add(`%${peopleName}%`)
    }

    const groupName = filters.has("group_name") && filters.getString("group_name");

    if (groupName) {
        queryWhere += `
            AND user_group.name like ?
        `
        queryParams.add(`%${groupName}%`)
    }
}

const dbPeople = _db.queryFirst(`
    SELECT id FROM people WHERE people_user_id = ? 
`, _user.id());

const dbMembers = _db.query(`
    WITH RECURSIVE user_orgs AS (
        SELECT 
            org.name, 
            org.id, 
            org.parent_id,
            org.code,
            org.uid,
            org.active
        FROM 
            organization org
        INNER JOIN 
            organization_people op ON org.id = op.organization_id
        WHERE 1 = 1 
            AND op.people_id = ${dbPeople.getInt("id")}
            AND op.user_group_id = (SELECT id FROM user_group WHERE code = 'administrator')
        UNION
        SELECT 
            org.name, 
            org.id, 
            org.parent_id,
            org.code,
            org.uid,
            org.active
        FROM 
            organization org
        INNER JOIN user_orgs uo ON org.parent_id = uo.id
    )
    SELECT
        organization_people.uid AS organization_people_uid,
        organization_people.active AS organization_people_active, 
        user_orgs.name AS org_name,
        user_orgs.code AS org_code,
        user_orgs.uid AS org_uid,
        people.uid AS people_uid,
        people.name AS people_name,
        user_group.name AS group_name,
        user_group.code AS group_code,
        user_group.uid AS group_uid
    FROM 
        user_orgs
	INNER JOIN 
        organization_people ON organization_people.organization_id = user_orgs.id
	INNER JOIN
		people ON people.id = organization_people.people_id
	INNER JOIN
		user_group ON user_group.id = organization_people.user_group_id
    WHERE 1 = 1
        ${queryWhere}
    LIMIT ${page.size()} OFFSET ${page.offset()}  
`, queryParams);

const dbMembersTotal = _db.queryFirst(`
    WITH RECURSIVE user_orgs AS (
        SELECT 
            org.name, 
            org.id, 
            org.parent_id,
            org.code,
            org.uid,
            org.active
        FROM 
            organization org
        INNER JOIN 
            organization_people op ON org.id = op.organization_id
        WHERE 1 = 1 
            AND op.people_id = ${dbPeople.getInt("id")}
            AND op.user_group_id = (SELECT id FROM user_group WHERE code = 'administrator')
        UNION
        SELECT 
            org.name, 
            org.id, 
            org.parent_id,
            org.code,
            org.uid,
            org.active
        FROM 
            organization org
        INNER JOIN user_orgs uo ON org.parent_id = uo.id
    )
    SELECT
        COUNT(1) AS "total"
    FROM 
        user_orgs
	INNER JOIN 
        organization_people ON organization_people.organization_id = user_orgs.id
	INNER JOIN
		people ON people.id = organization_people.people_id
	INNER JOIN
		user_group ON user_group.id = organization_people.user_group_id
    WHERE 1 = 1
        ${queryWhere}
`, queryParams);

const members = _val.list();

for (const dbMember of dbMembers) {
    members.add(
        _val.map()
            .set('uid', dbMember.getString("organization_people_uid"))
            .set('active', dbMember.getBoolean('organization_people_active'))
            .set('organization', _val.map()
                .set('uid', dbMember.getString("org_uid"))
                .set('name', dbMember.getString("org_name"))
                .set('code', dbMember.getString("org_code"))
            )
            .set('user', _val.map()
                .set('uid', dbMember.getString("people_uid"))
                .set('name', dbMember.getString("people_name"))
            )
            .set('group', _val.map()
                .set('uid', dbMember.getString("group_uid"))
                .set('name', dbMember.getString("group_name"))
                .set('code', dbMember.getString("group_code"))
            )
    )
}

_out.json(
    _val.map()
        .set('members', members)
        .set('total', dbMembersTotal.getInt("total"))
)