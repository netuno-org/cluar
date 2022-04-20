
# NGINX

Configuração do servidor do NGINX para publicar o website e o backoffice online:

```
server {
    listen 80;
    server_name my-domain.com www.my-domain.com;
    root /srv/netuno/apps/my_cluar/website/build;

    gzip on;
    gzip_types text/plain application/xml application/json application/javascript;

    location / {
        index index.html;
        try_files $uri $uri/ /index.html?$args;
    }

    location /cluarData.js {
        if_modified_since off;
        expires off;
        etag off;
        add_header Last-Modified $date_gmt;
        add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    }

    location /netuno {
        root /srv/netuno/web;
    }

    location /public {
        root /srv/netuno/apps/my_cluar;
    }

    location /admin {
        proxy_pass       http://127.0.0.1:9000;
        proxy_set_header Host my-cluar.local.netu.no;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Accept-Encoding gzip;
        proxy_connect_timeout       300;
        proxy_send_timeout          300;
        proxy_read_timeout          300;
        send_timeout                300;
    }

    location /services {
        proxy_pass       http://127.0.0.1:9000;
        proxy_set_header Host my-cluar.local.netu.no;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Accept-Encoding gzip;
    }
}
```
