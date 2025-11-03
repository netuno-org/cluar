

// -----------------------------------------------------------
// 
// ORGANIZATION_PEOPLE
// 
// -----------------------------------------------------------
// 
// CODE GENERATED AUTOMATICALLY
// 

if (_val.global().getBoolean('cluar:setup')) {
  _db.insertIfNotExists(
      "organization_people",
      _val.init()
          .set("uid", "30cfec8a-d792-4d3a-91ea-db3e98584778")
          .set("organization_id", "e27a232e-ba5b-4397-b17c-ff458c42a442")
          .set("people_id", "c8d507dc-e6b9-4850-92ef-14f710745573")
          .set("user_group_id", "9644d669-972d-4102-a718-5901676f09dd")
  );
}