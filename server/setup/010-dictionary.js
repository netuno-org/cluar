
// -----------------------------------------------------------
// 
// DICTIONARY
// 
// -----------------------------------------------------------

if (_val.global().getBoolean('cluar:setup')) {
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "e130993c-b071-4977-966f-3efa77f197b7")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("entry_id", "8aa071de-147a-4774-bcba-414ba656a267")
      .set("value", "<p>${label} \u00E9 de preenchimento obrigat\u00F3rio.<br></p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "3c61988c-1477-49e2-9e40-ee257bef372a")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("entry_id", "31e6aeb9-f7a7-4c1c-9330-a294be006f32")
      .set("value", "<p>${label} n\u00E3o \u00E9 um e-mail v\u00E1lido.<br></p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "6dfa7992-c17c-415d-8aea-c3830eb57df0")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("entry_id", "c5a81306-6f43-4dd5-9162-d14b9e836a81")
      .set("value", "<p>N\u00E3o foi poss\u00EDvel enviar os dados, tente novamente mais tarde.</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "1a3b7585-cdd7-42cc-8a2e-dbcad7de6972")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("entry_id", "50d5d744-83a2-4998-97ba-cac58fc04567")
      .set("value", "<p>Os dados foram enviados com sucesso, obrigado.</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "07a7e579-e7f5-4fae-a964-991995c9048e")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("entry_id", "b0184ea5-c404-476e-bb6f-75943474e955")
      .set("value", "<p>Nome</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "aeb2ea01-ed37-41cd-9526-63c23627f24c")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("entry_id", "a6909e12-db4a-4868-ba83-940c640ee43d")
      .set("value", "<p>E-mail</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "e34bdbbd-a4c8-43af-be57-ce212dadce88")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("entry_id", "4bacb148-e1dc-44d0-a9de-5a435275b945")
      .set("value", "<p>T\u00EDtulo</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "6c267748-62bf-48cc-9e3d-6f65397ad6a4")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("entry_id", "98c54df2-e402-49ef-9294-ebfd5741189b")
      .set("value", "<p>Mensagem</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "4d0e1d26-e443-4cd4-95cc-bae494294fff")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("entry_id", "25a5efa8-24c2-441b-8304-ce597fe1604b")
      .set("value", "<p>Enviar</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "fc1cf2a5-5560-48aa-8683-01766e7f3cf1")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("entry_id", "8aa071de-147a-4774-bcba-414ba656a267")
      .set("value", "<p>${label} is mandatory.<br></p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "5d83858a-fecb-4529-a6cf-78126b811b45")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("entry_id", "31e6aeb9-f7a7-4c1c-9330-a294be006f32")
      .set("value", "<p>${label} is not a valid e-mail.<br></p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "007cf96b-1f7d-4952-ae4c-b114882bcb6c")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("entry_id", "c5a81306-6f43-4dd5-9162-d14b9e836a81")
      .set("value", "<p>Unable to send data, please try again later.<br></p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "2ef5fa06-5ac4-4bcd-a107-4bafae0bb0ab")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("entry_id", "50d5d744-83a2-4998-97ba-cac58fc04567")
      .set("value", "<p>Data has been sent successfully, thank you.<br></p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "e8723ce6-82d0-469f-b7d3-66fa6cb8c0ba")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("entry_id", "b0184ea5-c404-476e-bb6f-75943474e955")
      .set("value", "<p>Name</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "bfeb5f5a-471d-441b-9ab8-ac5d65d50d06")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("entry_id", "a6909e12-db4a-4868-ba83-940c640ee43d")
      .set("value", "<p>E-mail</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "6f12f4b0-362f-48e8-a8a5-6e68277a35d3")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("entry_id", "4bacb148-e1dc-44d0-a9de-5a435275b945")
      .set("value", "<p>Subject</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "e43c4485-6370-486b-8125-5968a9ce992e")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("entry_id", "98c54df2-e402-49ef-9294-ebfd5741189b")
      .set("value", "<p>Message</p>")
  );
  
  _db.insertIfNotExists(
    "dictionary",
    _val.init()
      .set("uid", "76ef9bd4-9244-4f32-afae-295fca3617ce")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("entry_id", "25a5efa8-24c2-441b-8304-ce597fe1604b")
      .set("value", "<p>Send</p>")
  );
}