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
            AND org.name like ?
        `
        queryParams.add(`%${name}%`)
    }

    if (filters.has('active')) {
        queryWhere += `
            AND org.active = ?
        `
        queryParams.add(filters.getBoolean('active'));
    }

    const parentCode = filters.has('parent_code') && filters.getString('parent_code');

    if (parentCode) {
        queryWhere += `
            AND parent.code = ?
        `
        queryParams.add(parentCode)
    }
}

const dbOrganizations = _db.query(`
    SELECT
        org.active AS org_active,
        org.uid AS org_uid, 
        org.code AS org_code,
        org.name AS org_name,
        parent.uid AS parent_uid,
        parent.code AS parent_code,
        parent.name AS parent_name
    FROM 
        organization org
    LEFT JOIN 
        organization parent on org.parent_id = parent.id
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
     SELECT
        COUNT(1) as total
    FROM 
        organization org
    LEFT JOIN 
        organization parent on org.parent_id = parent.id
    WHERE 1 = 1
        ${queryWhere}  
`, queryParams);

_header.status(201);
_out.json(
    _val.map()
        .set('organizations', organizations)
        .set('organization_total', dbOrganizationTotal.getInt('total'))
)