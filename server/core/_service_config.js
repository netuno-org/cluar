import { _service, _env, _exec, _header, _auth } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";
import groups from "#core/consts/group.js";

/*
 * Serviços públicos - acessíveis sem login, usados pelo website.
 * "_auth" e "_auth_provider/*" são serviços internos do Netuno (login
 * por username/password e OAuth) - têm de ficar sempre públicos, senão
 * ninguém consegue sequer autenticar-se.
 */
const PUBLIC_PATHS = [
  "contact/post",
  "recovery/post",
  "recovery/put",
  "reserved-area/profile/avatar/get",
  "reserved-area/action/image/get",
];

if (PUBLIC_PATHS.includes(_service.path)) {
  _service.allow();
}
