import { _db, _val, _req, _out, _user } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");


const dbProfile = _db.queryFirst(`
    SELECT id FROM profile WHERE profile_user_id = ? 
`, _user.id());

const dbMember = _db.queryFirst(`
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
        AND organization_profile.uid = ?::uuid
`, uid);

if (!dbMember) {
  cluar.response.error({
    status: 404,
    error: `member not found with uid: ${uid}`,
    error_code: "member-not-found"
  });
}

_out.json(
  _val.map()
    .set("result", true)
    .set("member",
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
    )
);
