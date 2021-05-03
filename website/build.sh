#!/bin/sh

if [ -f "build/cluarData.js" ]; then
    mv build/cluarData.js .cluarData.js
fi

cp src/config-prod.json src/config.json

rsync -av build/images/ public/images/

yarn install

yarn build

cp src/config-dev.json src/config.json

if [ -f ".cluarData.js" ]; then
    mv .cluarData.js build/cluarData.js
fi
