// _core : cluar/main

if (_val.global().getBoolean('cluar:setup')) {
    cluar.build({ images: true });
    _val.global().set('cluar:setup', false)
}
