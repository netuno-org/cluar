const filters = _req.getValues('filters');
let queryWhere = "";
const queryParams = _val.list();
const pagination = _req.getValues('pagination');
const page = _db.pagination(1, 10);

if (pagination) {
    page.page(pagination.getInt('page'));
    page.size(pagination.getInt('size'));

    if (page.size() > 100) {
        page.size(100);
    }
}

if (filters) {
    const name = filters.has('name') && filters.getString('name');

    if (name) {
        queryWhere += `
            AND user_orgs.name like ?
        `
        queryParams.add(`%${name}%`)
    }

    const code = filters.has('code') && filters.getString('code');

    if (code) {
        queryWhere += `
            AND user_orgs.code like ?
        `
        queryParams.add(`%${code}%`)
    }

    const active = filters.has('active') && filters.getList('active');

    if (active.length > 0) {
        queryWhere += `
            AND user_orgs.active IN (${active.join(", ")})
        `
    }

    const parentName = filters.has('parent_name') && filters.getString('parent_name');

    if (parentName) {
        queryWhere += `
            AND parent.name like ?
        `
        queryParams.add(`%${parentName}%`)
    }
}

const dbPeople = _db.queryFirst(`
    SELECT id FROM people WHERE people_user_id = ? 
`, _user.id());

const dbOrganizations = _db.query(`
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
        user_orgs.name AS org_name,
        user_orgs.code AS org_code,
        user_orgs.uid AS org_uid,
        user_orgs.active AS org_active,
        parent.uid AS parent_uid,
        parent.code AS parent_code,
        parent.name AS parent_name
    FROM 
        user_orgs
    LEFT JOIN 
        organization parent ON user_orgs.parent_id = parent.id
    WHERE 1 = 1
        ${queryWhere}
    LIMIT ${page.size()} OFFSET ${page.offset()}     
`, queryParams);

const organizations = _val.list();

for (const dbOrganization of dbOrganizations) {
    const organization = _val.map()
        .set('uid', dbOrganization.getString('org_uid'))
        .set('name', dbOrganization.getString('org_name'))
        .set('code', dbOrganization.getString('org_code'))
        .set('active', dbOrganization.getBoolean('org_active'))

    if (dbOrganization.has('parent_uid')) {
        organization.set("parent",
            _val.map()
                .set('uid', dbOrganization.getString('parent_uid'))
                .set('name', dbOrganization.getString('parent_name'))
                .set('code', dbOrganization.getString('parent_code'))
        )
    }
    organizations.add(organization);
}

const dbOrganizationTotal = _db.queryFirst(`
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
    LEFT JOIN 
        organization parent ON user_orgs.parent_id = parent.id
    WHERE 1 = 1
        ${queryWhere}
`, queryParams);

_header.status(201);
_out.json(
    _val.map()
        .set('organizations', organizations)
        .set('organization_total', dbOrganizationTotal.getInt('total'))
)