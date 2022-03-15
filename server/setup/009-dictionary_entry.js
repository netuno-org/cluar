
// -----------------------------------------------------------
// 
// DICTIONARY_ENTRY
// 
// -----------------------------------------------------------

if (_val.global().getBoolean('cluar:setup')) {
  _db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
      .set("uid", "8aa071de-147a-4774-bcba-414ba656a267")
      .set("code", "contact-form-validate-message-required")
      .set("description", "Formul\u00E1rio de Contato - Mensagem Valida\u00E7\u00E3o - Obrigat\u00F3rio")
  );
  
  _db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
      .set("uid", "31e6aeb9-f7a7-4c1c-9330-a294be006f32")
      .set("code", "contact-form-validate-message-email")
      .set("description", "Formul\u00E1rio de Contato - Mensagem Valida\u00E7\u00E3o - E-mail")
  );
  
  _db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
      .set("uid", "c5a81306-6f43-4dd5-9162-d14b9e836a81")
      .set("code", "contact-form-fail")
      .set("description", "Formul\u00E1rio de Contato - Falhou")
  );
  
  _db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
      .set("uid", "50d5d744-83a2-4998-97ba-cac58fc04567")
      .set("code", "contact-form-success")
      .set("description", "Formul\u00E1rio de Contato - Sucesso")
  );
  
  _db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
      .set("uid", "b0184ea5-c404-476e-bb6f-75943474e955")
      .set("code", "contact-form-name")
      .set("description", "Formul\u00E1rio de Contato - Nome")
  );
  
  _db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
      .set("uid", "a6909e12-db4a-4868-ba83-940c640ee43d")
      .set("code", "contact-form-email")
      .set("description", "Formul\u00E1rio de Contato - E-mail")
  );
  
  _db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
      .set("uid", "4bacb148-e1dc-44d0-a9de-5a435275b945")
      .set("code", "contact-form-subject")
      .set("description", "Formul\u00E1rio de Contato - T\u00EDtulo")
  );
  
  _db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
      .set("uid", "98c54df2-e402-49ef-9294-ebfd5741189b")
      .set("code", "contact-form-message")
      .set("description", "Formul\u00E1rio de Contato - Mensagem")
  );
  
  _db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
      .set("uid", "25a5efa8-24c2-441b-8304-ce597fe1604b")
      .set("code", "contact-form-send")
      .set("description", "Formul\u00E1rio de Contato - Enviar")
  );
}