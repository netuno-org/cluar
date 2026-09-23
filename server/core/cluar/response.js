import { _exec, _header, _out, _val } from "@netuno/server-types";

export default {
  error: ({ status, error, error_code }) => {
    _header.status(status);
    _out.json(
      _val.map()
        .set("result", false)
        .set("error", error)
        .set("error_code", error_code)
    );
    _exec.stop();
  },

  successWithData: ({ status, data }) => {
    _header.status(status);
    _out.json(
      _val.map()
        .set("result", true)
        .set("data", data)
    );
  },

  successWithoutData: ({ status }) => {
    _header.status(status);
    _out.json(
      _val.map()
        .set("result", true)
    );
  }
};
