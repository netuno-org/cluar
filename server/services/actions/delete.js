import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString('uid');

const dbAction = _db.get('action', uid);

if (!dbAction) {
    cluar.response.error({ status: 404, error: 'action not found' });
}

const actionId = dbAction.getInt("id");

// Verifica se esta ação está vinculada a algum lugar da página
const usageChecks = [
    { table: 'page_banner_action', label: 'banners de página' },
    { table: 'page_content_action', label: 'conteúdos de página' },
    { table: 'page_functionality_action', label: 'funcionalidades de página' },
    { table: 'page_listing_action', label: 'listagens de página' },
    { table: 'page_slider_item_action', label: 'itens de slider de página' },
];

const usedIn = [];

for (const check of usageChecks) {
    const inUse = _db.queryFirst(`
        SELECT count(id) as total FROM ${check.table} WHERE action_id = ?
    `, actionId);

    if (inUse && inUse.getInt("total") > 0) {
        usedIn.push(check.label);
    }
}

if (usedIn.length > 0) {
    cluar.response.error({
        status: 409,
        error: `Não é possível apagar esta ação pois ela está sendo usada em: ${usedIn.join(', ')}.`
    });
}

// Se não estiver em uso em nenhum lugar, apaga normalmente
_db.delete('action', actionId);
cluar.response.successWithoutData({ status: 200 });