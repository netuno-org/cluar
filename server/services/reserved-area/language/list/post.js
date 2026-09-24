import { _db, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const filters = _req.getValues("filters");
const pagination = _req.getValues("pagination");
const page = _db.pagination(1, 10);

if (pagination) {
  page.setPage(pagination.getInt("page"));
  page.setPageSize(pagination.getInt("size"));

  if (page.getPageSize() > 100) {
    page.setPageSize(100);
  }
}

if (filters) {

}

const query = _db.form("language")
  .get("uid")
  .get("active")
  .get("default")
  .get("code")
  .get("description")
  .get("locale");

const dbLaguages = query.page(page);

cluar.response.successWithData({
  status: 200,
  data: dbLaguages
});
