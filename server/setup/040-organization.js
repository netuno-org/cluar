

// -----------------------------------------------------------
// 
// ORGANIZATION
// 
// -----------------------------------------------------------
// 
// CODE GENERATED AUTOMATICALLY
// 

if (_val.global().getBoolean('cluar:setup')) {
    _db.insertIfNotExists(
        "organization",
        _val.init()
            .set("uid", "e27a232e-ba5b-4397-b17c-ff458c42a442")
            .set("name", "Admins")
            .set("code", "admins")
            .set("parent_id", null)
    );
}
