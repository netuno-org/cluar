
/**
 *  When service need public access...
 */
if (_env.is("dev")) {
    _service.allow()
}

/*
if (_service.path == 'samples/my-service') {
    _service.allow()
}
*/

if (_service.path == 'contact/post' || _service.path == 'actions/image/get') {
    _service.allow()
}
