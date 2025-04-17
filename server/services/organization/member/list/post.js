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

    const groupCodes = filters.has("group_codes") && filters.getList("group_codes");

    if (groupCodes.length > 0) {
        queryWhere += `
            AND user_group.code IN (${groupCodes.map(() => '?').join(", ")})
        `
        queryParams.addAll(groupCodes)
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
    SELECT DISTINCT ON (user_orgs.uid, people.uid)
        organization_people.uid AS organization_people_uid,
        organization_people.active AS organization_people_active, 
        user_orgs.id AS user_orgs_id,
        user_orgs.name AS org_name,
        user_orgs.code AS org_code,
        user_orgs.uid AS org_uid,
        people.id AS people_id,
        people.uid AS people_uid,
        people.name AS people_name
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
        COUNT(DISTINCT (user_orgs.uid, people.uid)) AS "total"
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
    const dbGroups = _db.form('user_group')
        .link(
            'organization_people',
            _db.where()
                .and('people_id').equals(dbMember.getInt("people_id"))
                .and('organization_id').equals(dbMember.getInt("user_orgs_id"))
        )
        .get("user_group.name")
        .get("user_group.code")
        .all()

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
            .set('groups', dbGroups)
    )
}

_out.json(
    _val.map()
        .set('members', members)
        .set('total', dbMembersTotal.getInt("total"))
)