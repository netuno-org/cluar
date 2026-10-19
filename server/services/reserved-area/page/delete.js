import { _db, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const pageUid = _req.getString("uid");

const dbPage = _db.get("page", pageUid);

if (!dbPage) {
  cluar.response.error({
    status: 404,
    error: "page not found",
    error_code: "page-not-found"
  });
}

const pageId = dbPage.getInt("id");

cluar.permission.requireUserAuthorizedToManagePage(dbPage.getInt("id"));

const pageAndChildrenTotal = _db.queryFirst(`
    WITH RECURSIVE page_and_children AS (
        SELECT id
        FROM page 
        WHERE id = ${_db.param("int")} 

        UNION

        SELECT page.id
        FROM page
        INNER JOIN page_and_children pac
        ON page.parent_id = pac.id
    )
    SELECT COUNT(1) AS "total"
    FROM page_and_children;
  `, pageId
).getInt("total");

if (pageAndChildrenTotal > 1) {
  cluar.response.error({
    status: 409,
    error_code: "page-has-children",
    error: "this page has children, cannot remove it"
  });
}

const dbPageVersions = _db.query(`
    SELECT * FROM page_version
    WHERE page_id = ?::int
    `, pageId
);

for (const dbPageVersion of dbPageVersions) {
  cluar.db.cascadeDeletePageVersion(dbPageVersion.getInt("id"));
}

_db.execute(`DELETE FROM page_organization WHERE page_id = ${_db.param("int")}`, pageId);

_db.delete("page", pageId);

cluar.response.successWithoutData({ status: 200 });
