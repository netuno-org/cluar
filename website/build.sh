#!/bin/sh

if [ -f "dist/cluarData.js" ]; then
    mv dist/cluarData.js .cluarData.js
    mv dist/sitemap.xml .sitemap.xml
fi

if [ -d "dist/images" ]; then
    rsync -av dist/images/ public/images/
fi

pnpm install

pnpm run build

if [ -f ".cluarData.js" ]; then
    mv .cluarData.js dist/cluarData.js
    mv .sitemap.xml dist/sitemap.xml
fi
