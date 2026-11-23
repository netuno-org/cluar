import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

cluar.theme.requireCurrentUserOrganizationAuthorization();

const filters = _req.getValues("filters");
const pagination = _req.getValues("pagination");
const page = _db.pagination(1, 10);
const where = _db.where();

if (pagination) {
  page.setPage(pagination.getInt("page"));
  page.setPageSize(pagination.getInt("size"));

  if (page.getPageSize() > 100) {
    page.setPageSize(100);
  }
}

if (filters) {
  const title = filters.has("title") && filters.getString("title");

  if (title) {
    where.and("title").contains(title);
  }

  const applied = filters.has("applied") && filters.getList("applied");

  if (applied && applied.size() > 0) {
    where.and("applied").in(applied);
  }
}

const dbPage = _db.form("theme")
  .where(where)
  .get("uid")
  .get("title")
  .get("content")
  .get("style")
  .get("applied")
  .order("id", "desc")
  .page(page);

const items = _val.list();

for (const dbItem of dbPage.getList("items")) {
  items.add(cluar.theme.serialize(dbItem));
}

dbPage.set("items", items);

cluar.response.successWithData({
  status: 200,
  data: dbPage,
});
