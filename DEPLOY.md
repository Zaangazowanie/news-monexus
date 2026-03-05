# Deploy news.monexusmedia.uk

## 1) Install and build
cd /root/.openclaw/workspace/news-monexus
npm install
npm run build

## 2) Run app (port 3101)
pm2 start npm --name news-site -- start
pm2 save

## 3) Nginx site
Create /etc/nginx/sites-available/news.monexusmedia.uk with:

server {
  listen 80;
  server_name news.monexusmedia.uk;
  location / {
    proxy_pass http://127.0.0.1:3101;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

Then:
ln -sf /etc/nginx/sites-available/news.monexusmedia.uk /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

## 4) SSL
certbot --nginx -d news.monexusmedia.uk
