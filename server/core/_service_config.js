import { _service, _env, _exec } from "@netuno/server-types";
import permission from "#core/utils/permission.js";
import groups from "#core/consts/group.js";

/**
 *  When service need public access...
 */
if (_env.is("dev")) {
    _service.allow()
    _exec.stop()
}

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
    'actions/image/get',
    'recovery/post',
    'recovery/put',
    'people/avatar/get',
    '_altcha',
    '_auth',
]

const PUBLIC_PATH_PREFIXES = [
    '_auth_provider/',
]

/*
 * Gestão de conteúdo (páginas, blocos, dicionário, idiomas, ações,
 * sincronização) - administrator + editor.
 */
const CONTENT_MANAGEMENT_PATHS = [
    'page/post',
    'page/put',
    'page/clone/post',
    'page/publish/post',
    'page/template/list/post',
    'editor/page-version/delete',
    'editor/page-version/get',
    'editor/page-version/list/post',
    'editor/page-version/save/post',
    'editor/page-version/save/publish.post',
    'components/banner/list/post',
    'components/content/list/post',
    'components/functionality/list/post',
    'components/listing/list/post',
    'components/slider/list/post',
    'dictionary/post',
    'dictionary/put',
    'dictionary/list/post',
    'dictionary/entry/list.post',
    'actions/post',
    'actions/put',
    'actions/active/put',
    'actions/list/post',
    'actions/parameter/post',
    'actions/parameter/put',
    'actions/parameter/delete',
    'actions/parameter/list/post',
]

/*
 * Configuração/estrutura do site (favicon, título, cores, idiomas,
 * sincronização manual) - só administrator, por afetar o site inteiro.
 */
const SITE_ADMIN_PATHS = [
    'configuration/post',
    'configuration/put',
    'configuration/list/post',
    'language/post',
    'language/put',
    'language/active/put',
    'language/list/post',
    'admin/cluar/sync',
]

/*
 * Gestão de acessos (organizações, pessoas, utilizadores, contactos
 * recebidos) - só administrator, por ser dados sensíveis/permissões.
 */
const ACCESS_MANAGEMENT_PATHS = [
    'organization/post',
    'organization/put',
    'organization/active/put',
    'organization/list/post',
    'organization/member/post',
    'organization/member/put',
    'organization/member/active/put',
    'organization/member/list/post',
    'people/post',
    'people/put',
    'people/delete',
    'people/get',
    'user/post',
    'user/put',
    'user/active/put',
    'user/get',
    'user/list/post',
    'user/group/list/get',
    'admin/contact/list/post',
]

const ORGANIZATION_CODE = "admins";

if (PUBLIC_PATHS.includes(_service.path) || PUBLIC_PATH_PREFIXES.some((prefix) => _service.path.startsWith(prefix))) {
    _service.allow()

} else if (CONTENT_MANAGEMENT_PATHS.includes(_service.path)) {
    permission.validPermissions({
        organization: ORGANIZATION_CODE,
        allowedGroups: [groups["ADMIN"], groups["EDITOR"]]
    }) ? _service.allow() : _service.deny();

} else if (SITE_ADMIN_PATHS.includes(_service.path) || ACCESS_MANAGEMENT_PATHS.includes(_service.path)) {
    permission.validPermissions({
        organization: ORGANIZATION_CODE,
        allowedGroups: [groups["ADMIN"]]
    }) ? _service.allow() : _service.deny();

} else {
    /*
     * Bloqueio por omissão: qualquer serviço não listado acima fica
     * negado explicitamente, em vez de depender do comportamento por
     * omissão do Netuno quando nem allow() nem deny() são chamados.
     */
    _service.deny()
}