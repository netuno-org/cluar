// _core : Cluar

if (_val.global().getBoolean('cluar:setup')) {
    Cluar.build({ images: true });
    _val.global().set('cluar:setup', false)
}
