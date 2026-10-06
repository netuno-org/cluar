import { _val } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

/*
 * `cluar.pages()` is shared with the public website and is cached in the
 * application config, so it cannot be filtered in place. Only the pages the
 * logged user may edit are returned here, so administrators and editors both
 * see the content of the organizations they belong to (and of their
 * descendants).
 */
const authorizedPageUids = new Set();

for (const dbAuthorizedPage of cluar.permission.getEditablePages()) {
  authorizedPageUids.add(dbAuthorizedPage.getString("uid"));
}

const allPages = cluar.pages({ publishFn: null });

const items = _val.map();

for (const language of allPages.keys()) {
  const pagesOfLanguage = _val.list();

  for (const dbPage of allPages.getValues(language)) {
    if (authorizedPageUids.has(dbPage.getString("uid"))) {
      pagesOfLanguage.add(dbPage);
    }
  }

  if (pagesOfLanguage.size() > 0) {
    items.set(language, pagesOfLanguage);
  }
}

cluar.response.successWithData({ status: 200, data: items });
