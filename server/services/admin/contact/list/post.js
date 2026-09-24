import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const filter = _req.getValues("filter");
const pagination = _req.getValues("pagination");
const sorter = _req.getValues("sorter");

const pageSize = 10;

let page = { start: 0, size: pageSize }

if (pagination != null) {
  page.size = pagination.getInt("pageSize", pageSize);
  page.start = (pagination.getInt("current", 1) - 1) * page.size;
}
if (page.size > 100) {
  page.size = 100;
}

const queryFilter = _val.list();
let queryWhere = "";


if (filter != null) {
  if (filter.getString("name") != "") {
    queryWhere += " AND name LIKE ?";
    queryFilter.add(`%${filter.getString("name")}%`);
  }
  if (filter.getString("email") != "") {
    queryWhere += " AND email LIKE ?";
    queryFilter.add(`%${filter.getString("email")}%`);
  }
  if (filter.getString("subject") != "") {
    queryWhere += " AND subject LIKE ?";
    queryFilter.add(`%${filter.getString("subject")}%`);
  }
  if (filter.getString("moment") != "") {
    queryWhere += " AND moment LIKE ?";
    queryFilter.add(`%${filter.getString("moment")}%`);
  }
}


let querySorter = "moment DESC";
if (sorter != null) {
  const order = sorter.getString("order") == "descend" ? "DESC" : "ASC";
  if (sorter.getString("field") == "name") {
    querySorter = " name " + order;
  } else if (sorter.getString("field") == "email") {
    querySorter = " email " + order;
  } else if (sorter.getString("field") == "subject") {
    querySorter = " subject " + order;
  } else if (sorter.getString("field") == "moment") {
    querySorter = " moment " + order;
  }
}

const dbResults = _db.query(`
    SELECT
        name,
        email,
        subject,
        moment
    FROM contact
    WHERE 1 = 1
    ${queryWhere}
    ORDER BY ${querySorter}
    LIMIT ${page.size} OFFSET ${page.start}
`, queryFilter);

const items = _val.list();

for (const dbResult of dbResults) {
  items.add(
    _val.map()
      .set("name", dbResult.getString("name"))
      .set("email", dbResult.getString("email"))
      .set("subject", dbResult.getString("subject"))
      .set("moment", dbResult.getSQLTimestamp("moment"))
  );
}

cluar.response.successWithData({
  status: 200,
  data: _val.map()
    .set(
      "total",
      _db.queryFirst(`
                SELECT COUNT(1) "total"
                FROM contact
                WHERE 1 = 1
                ${queryWhere}
            `, queryFilter).getInt("total")
    ).set("items", items)
});
