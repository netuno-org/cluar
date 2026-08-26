import { _service, _env, _exec, _header, _auth } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";
import groups from "#core/consts/group.js";

/**
 *  When service need public access...
 */
// if (_env.is("dev")) {
//   _service.allow()
//   _exec.stop()
// }

/*
if (_service.path == 'samples/my-service') {
    _service.allow()
}
*/

/*
 * Serviços públicos - acessíveis sem login, usados pelo website.
 * "_auth" e "_auth_provider/*" são serviços internos do Netuno (login
 * por username/password e OAuth) - têm de ficar sempre públicos, senão
 * ninguém consegue sequer autenticar-se.
 */
const PUBLIC_PATHS = [
  'contact/post',
  'recovery/post',
  'recovery/put',
  '_altcha',
  '_auth',
  'reserved-area/people/avatar/get',
  'reserved-area/action/image/get',
];

const PUBLIC_PATH_PREFIXES = [
  '_auth_provider/',
];

/*
 * Gestão de conteúdo (páginas, blocos, dicionário, idiomas, ações,
 * sincronização) - administrator + editor.
 */
const CONTENT_MANAGEMENT_PATHS = [
  'reserved-area/people/get',
];

const CONTENT_MANAGEMENT_PATH_PREFIXES = [
  'reserved-area/page/',
  'reserved-area/editor/',
  'reserved-area/component/',
  'reserved-area/dictionary/',
  'reserved-area/action/',
];

const SITE_ADMIN_PATHS = [
  'reserved-area/people/post',
  'reserved-area/people/put',
  'reserved-area/people/delete',
];

const SITE_ADMIN_PATH_PREFIXES = [
  /*
   * Configuração/estrutura do site (favicon, título, cores, idiomas,
   * sincronização manual) - só administrator, por afetar o site inteiro.
   */
  'reserved-area/configuration/',
  'reserved-area/language/',
  /*
   * Gestão de acessos (organizações, pessoas, utilizadores, contactos
   * recebidos) - só administrator, por serem dados sensíveis/permissões.
   */
  'reserved-area/organization/',
  'reserved-area/user/',
];

const ORGANIZATION_CODE = "default";

if (_header.isOptions()) {
  _service.allow();
} else if (PUBLIC_PATHS.includes(_service.path) || PUBLIC_PATH_PREFIXES.some((prefix) => _service.path.startsWith(prefix))) {
  _service.allow();
} else if (CONTENT_MANAGEMENT_PATHS.includes(_service.path)
  || CONTENT_MANAGEMENT_PATH_PREFIXES.some((prefix) => _service.path.startsWith(prefix))) {
  cluar.permission.isAllowed({
    organization: ORGANIZATION_CODE,
    allowedGroups: [groups["ADMIN"], groups["EDITOR"]]
  }) ? _service.allow() : _service.deny();
} else if (SITE_ADMIN_PATHS.includes(_service.path)
  || SITE_ADMIN_PATH_PREFIXES.some((prefix) => _service.path.startsWith(prefix))) {
  cluar.permission.isAllowed({
    organization: ORGANIZATION_CODE,
    allowedGroups: [groups["ADMIN"]]
  }) ? _service.allow() : _service.deny();
} else if (_service.path.startsWith("admin/") && (_auth.isAdmin() || _auth.isDev())) {
  _service.allow();
} else {
  /*
   * Bloqueio por omissão: qualquer serviço não listado acima fica
   * negado explicitamente, em vez de depender do comportamento por
   * omissão do Netuno quando nem allow() nem deny() são chamados.
   */
  _service.deny();
}
