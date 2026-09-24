import { _db, _val, _req, _user } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const filters = _req.getValues("filters");
const pagination = _req.getValues("pagination");
const page = _db.pagination(1, 10);
const queryParams = _val.init();
let queryWhere = "";

if (pagination) {
  page.size(pagination.getInt("size"));
  page.page(pagination.getInt("page"));

  if (page.size() > 100) {
    page.size(100);
  }
}

if (filters) {
  const organizationName = filters.has("organization_name") && filters.getString("organization_name");

  if (organizationName) {
    queryWhere += `
            AND user_orgs.name = ?
        `;
    queryParams.add(organizationName);
  }

  const profileName = filters.has("profile_name") && filters.getString("profile_name");

  if (profileName) {
    queryWhere += `
            AND profile.name = ?
        `;
    queryParams.add(profileName);
  }

  const profileUID = filters.has("profile_uid") && filters.getString("profile_uid");

  if (profileUID) {
    queryWhere += `
            AND profile.uid = ?::uuid
        `;
    queryParams.add(profileUID);
  }

  const groupCodes = filters.has("group_codes") && filters.getList("group_codes");

  if (groupCodes && groupCodes.size() > 0) {
    queryWhere += `
            AND user_group.code IN (${groupCodes.map(() => "?").join(", ")})
        `;
    queryParams.addAll(groupCodes);
  }

  const active = filters.has("active") && filters.getList("active");

  if (active && active.size() > 0) {
    queryWhere += `
            AND organization_profile.active IN (${active.map(() => "?").join(", ")})
        `;
    queryParams.addAll(active);
  }
}

const dbProfile = _db.queryFirst(`
    SELECT id FROM profile WHERE profile_user_id = ? 
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
            organization_profile op ON org.id = op.organization_id
        WHERE 1 = 1 
            AND op.profile_id = ${dbProfile.getInt("id")}
            AND op.user_group_id = (SELECT id FROM user_group WHERE code = 'administrator')
            AND op.active = true
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
        organization_profile.uid AS organization_profile_uid,
        organization_profile.active AS organization_profile_active, 
        user_orgs.name AS org_name,
        user_orgs.code AS org_code,
        user_orgs.uid AS org_uid,
        profile.uid AS profile_uid,
        profile.name AS profile_name,
        user_group.name AS group_name,
        user_group.code AS group_code,
        user_group.uid AS group_uid
    FROM 
        user_orgs
	INNER JOIN 
        organization_profile ON organization_profile.organization_id = user_orgs.id
	INNER JOIN
		profile ON profile.id = organization_profile.profile_id
	INNER JOIN
		user_group ON user_group.id = organization_profile.user_group_id
    WHERE 1 = 1
        ${queryWhere}
    ORDER BY organization_profile.id DESC
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
            organization_profile op ON org.id = op.organization_id
        WHERE 1 = 1 
            AND op.profile_id = ${dbProfile.getInt("id")}
            AND op.user_group_id = (SELECT id FROM user_group WHERE code = 'administrator')
            AND op.active = true
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
        organization_profile ON organization_profile.organization_id = user_orgs.id
	INNER JOIN
		profile ON profile.id = organization_profile.profile_id
	INNER JOIN
		user_group ON user_group.id = organization_profile.user_group_id
    WHERE 1 = 1
        ${queryWhere}
`, queryParams);

const members = _val.list();

for (const dbMember of dbMembers) {
  members.add(
    _val.map()
      .set("uid", dbMember.getString("organization_profile_uid"))
      .set("active", dbMember.getBoolean("organization_profile_active"))
      .set("organization", _val.map()
        .set("uid", dbMember.getString("org_uid"))
        .set("name", dbMember.getString("org_name"))
        .set("code", dbMember.getString("org_code"))
      )
      .set("user", _val.map()
        .set("uid", dbMember.getString("profile_uid"))
        .set("name", dbMember.getString("profile_name"))
      )
      .set("group", _val.map()
        .set("uid", dbMember.getString("group_uid"))
        .set("name", dbMember.getString("group_name"))
        .set("code", dbMember.getString("group_code"))
      )
  );
}

cluar.response.successWithData({
  status: 200,
  data: _val.map()
    .set("members", members)
    .set("total", dbMembersTotal.getInt("total"))
});
