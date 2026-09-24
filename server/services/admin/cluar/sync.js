import cluar from "#core/cluar/main.js";

cluar.build({ images: true, publishAll: true });

cluar.response.successWithoutData({ status: 200 });
