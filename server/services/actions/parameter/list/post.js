import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const dbActionParameters = _db.form('action_parameter')
    .all()

const parameters = [];

for (const actionParameter of dbActionParameters) {
    const parameter = {
        active: actionParameter.getBoolean("active"),
        uid: actionParameter.getString("uid"),
        code: actionParameter.getString("code"),
        description: actionParameter.getString("description")
    }

    parameters.push(parameter)
}

cluar.response.successWithData({ status: 200, data: parameters });