
// -----------------------------------------------------------
// 
// PAGE_CONTENT
// 
// -----------------------------------------------------------

if (_val.global().getBoolean('cluar:setup')) {

  _db.insertIfNotExists(
    "page_content",
    _val.init()
      .set("uid", "75f96c5f-1230-4059-bb25-9e91a7dadd75")
      .set("page_id", "5002a742-e092-4c0b-8536-546bd1319c7f")
      .set("content_id", "b0697f9e-3eb0-468f-bb71-13d5a9e211fe")
      .set("sorter", 20)
  );

  _db.insertIfNotExists(
    "page_content",
    _val.init()
      .set("uid", "e9ddc1e1-0f0a-4e6c-b9e5-2b79d3683979")
      .set("page_id", "5002a742-e092-4c0b-8536-546bd1319c7f")
      .set("content_id", "d7564744-f70f-4859-9070-86a3b2a83e91")
      .set("sorter", 30)
  );

  _db.insertIfNotExists(
    "page_content",
    _val.init()
      .set("uid", "eb0ce72d-c497-447e-9647-c9cdf25b7c14")
      .set("page_id", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
      .set("content_id", "f110a9d1-c9cd-40a3-9359-7b472234e0ac")
      .set("sorter", 20)
  );

  _db.insertIfNotExists(
    "page_content",
    _val.init()
      .set("uid", "7728af7c-131d-41a1-9b9e-8b88b15783b6")
      .set("page_id", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
      .set("content_id", "ed312fe0-b839-4367-82c1-1445464b39d0")
      .set("sorter", 30)
  );

}
