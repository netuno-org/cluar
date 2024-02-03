
// -----------------------------------------------------------
// 
// PAGE_BANNER
// 
// -----------------------------------------------------------

if (_val.global().getBoolean('cluar:setup')) {

  _db.insertIfNotExists(
    "page_banner",
    _val.init()
      .set("uid", "69e084ae-8812-48b9-b7a7-53bf61c4fd3a")
      .set("page_id", "5002a742-e092-4c0b-8536-546bd1319c7f")
      .set("banner_id", "9302bc90-d687-494d-bfc0-b4aeff4df09e")
      .set("sorter", 10)
  );

  _db.insertIfNotExists(
    "page_banner",
    _val.init()
      .set("uid", "6edd1a05-7d5b-4223-ab31-cc021dc7e83e")
      .set("page_id", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
      .set("banner_id", "5126f3bb-51d1-489e-89dc-08087ed38e5e")
      .set("sorter", 10)
  );

}
