import cluar from "#core/cluar/main.js";

const items = cluar.pages({ publishFn: cluar.page.publish });

cluar.response.successWithData({ status: 200, data: items });
