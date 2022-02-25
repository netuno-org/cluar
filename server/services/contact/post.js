const name = _req.getString('name')
const email = _req.getString('email')
const subject = _req.getString('subject')
const message = _req.getString('message')

_db.insert(
    'contact',
    _val.map()
        .set('name', name)
        .set('email', email)
        .set('subject', subject)
        .set('message', message)
        .set('moment', _db.timestamp())
)

_out.json(
    _val.map()
        .set('result', true)
)