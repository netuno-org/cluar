import _auth from "@netuno/auth-client";
import _service from "@netuno/service-client";

_service.config({
  prefix: global.api.services.prefix
});

_auth.config({
  serviceClient: _service,
  storage: global.api.auth.storage,
  onLogin: () => { },
  onLogout: () => { }
});

const request = (method, options) => new Promise((resolve, reject) => method({
  ...options,
  success: resolve,
  fail: reject
}));

const asyncServiceAs = async (config, name) => {
  await request(_auth.login, {
    username: name,
    password: "12345678"
  });
  return request(_service, config);
};

const asyncServiceAsAlice = async (config) => asyncServiceAs(config, "alice");

export { asyncServiceAsAlice };

export default async (config) => {
  await request(_auth.login, global.api.auth.login);
  return request(_service, config);
}
