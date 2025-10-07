const username = _req.getString('username')

const dbUser = _user.firstByUser(username)

if (dbUser.getString('code') == 'blocked') {
  _auth.attemptRejectWithData(_val.map().set('blocked', true))
}