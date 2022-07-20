#!/bin/sh

if [ -f "build/cluarData.js" ]; then
    mv build/cluarData.js .cluarData.js
    mv build/sitemap.xml .sitemap.xml
fi

if [ -d "build/images" ]; then
    rsync -av build/images/ public/images/
fi

npm install --force

npm run build

if [ -f ".cluarData.js" ]; then
    mv .cluarData.js build/cluarData.js
    mv .sitemap.xml build/sitemap.xml
fi
