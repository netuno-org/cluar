

// -----------------------------------------------------------
// 
// PAGE
// 
// -----------------------------------------------------------
// 
// CODE GENERATED AUTOMATICALLY
// 

if (_db.query(`SELECT * FROM page`).size() == 0) {
  _val.global().set('cluar:setup', true);
  _db.insertIfNotExists(
    "page",
    _val.init()
      .set("uid", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("parent_id", null)
      .set("link", "/")
      .set("title", "P\u00E1gina Inicial")
      .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
      .set("description", "")
      .set("social_description", "")
      .set("keywords", "")
      .set("social_image", "")
      .set("navigable", true)
      .set("menu", true)
      .set("menu_title", "")
      .set("sorter", 10)
  );

  _db.insertIfNotExists(
    "page",
    _val.init()
      .set("uid", "5002a742-e092-4c0b-8536-546bd1319c7f")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("parent_id", null)
      .set("link", "/")
      .set("title", "Home")
      .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
      .set("description", "Description")
      .set("social_description", "")
      .set("keywords", "")
      .set("social_image", "")
      .set("navigable", true)
      .set("menu", true)
      .set("menu_title", "")
      .set("sorter", 10)
  );

  _db.insertIfNotExists(
    "page",
    _val.init()
      .set("uid", "0be9036a-a2c4-4eca-9020-2f46bb2fa5dc")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("parent_id", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
      .set("link", "/teste")
      .set("title", "TESTE")
      .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
      .set("description", "")
      .set("social_description", "")
      .set("keywords", "")
      .set("social_image", "")
      .set("navigable", true)
      .set("menu", true)
      .set("menu_title", "")
      .set("sorter", 0)
  );

  _db.insertIfNotExists(
    "page",
    _val.init()
      .set("uid", "4e2312c1-0a9a-438f-ad59-82e1fbea89a6")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("parent_id", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
      .set("link", "/test")
      .set("title", "test")
      .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
      .set("description", "")
      .set("social_description", "")
      .set("keywords", "")
      .set("social_image", "")
      .set("navigable", true)
      .set("menu", true)
      .set("menu_title", "")
      .set("sorter", 0)
  );

  _db.insertIfNotExists(
    "page",
    _val.init()
      .set("uid", "f60cc515-1e27-4c98-a34a-adf327ac9c8d")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("parent_id", "5002a742-e092-4c0b-8536-546bd1319c7f")
      .set("link", "/test123")
      .set("title", "PAGINA TESTE")
      .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
      .set("description", "")
      .set("social_description", "")
      .set("keywords", "")
      .set("social_image", "")
      .set("navigable", true)
      .set("menu", false)
      .set("menu_title", "")
      .set("sorter", 0)
  );

  _db.insertIfNotExists(
    "page",
    _val.init()
      .set("uid", "038dbda2-d275-488f-8042-fb20a6262d7c")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("parent_id", "5002a742-e092-4c0b-8536-546bd1319c7f")
      .set("link", "/testeeeeee")
      .set("title", "pagina teste")
      .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
      .set("description", "")
      .set("social_description", "")
      .set("keywords", "")
      .set("social_image", "")
      .set("navigable", true)
      .set("menu", true)
      .set("menu_title", "")
      .set("sorter", 0)
  );

  _db.insertIfNotExists(
    "page",
    _val.init()
      .set("uid", "187ff9e4-50fa-4824-a46a-3c40420942d3")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("parent_id", "5002a742-e092-4c0b-8536-546bd1319c7f")
      .set("link", "/test")
      .set("title", "TEST")
      .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
      .set("description", "")
      .set("social_description", "")
      .set("keywords", "")
      .set("social_image", "")
      .set("navigable", true)
      .set("menu", true)
      .set("menu_title", "")
      .set("sorter", 0)
  );
}

