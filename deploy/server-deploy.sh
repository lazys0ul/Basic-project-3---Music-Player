#!/bin/bash
# server-deploy.sh - Production deployment script

echo "🚀 Setting up Resona Music Platform on Ubuntu..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB 6.0
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update && sudo apt install -y mongodb-org

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx certbot python3-certbot-nginx

# Clone your repository
git clone https://github.com/lazys0ul/Basic-project-3---Music-Player.git
cd Basic-project-3---Music-Player

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Build frontend
cd frontend && npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'resona-api',
      script: './backend/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        MONGO_URL: 'mongodb://localhost:27017/resona',
        JWT_SECRET: 'your_production_secret_key_64_characters_minimum'
      }
    }
  ]
};
EOF

# Start services
sudo systemctl start mongod
sudo systemctl enable mongod
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
sudo tee /etc/nginx/sites-available/resona << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /var/www/resona/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads/ {
        alias /var/www/resona/backend/uploads/;
        expires 1y;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/resona /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# Setup SSL (replace your-domain.com with actual domain)
# sudo certbot --nginx -d your-domain.com -d www.your-domain.com

echo "✅ Deployment complete! Your Resona platform is live!"
echo "🌐 Access: http://your-server-ip"
echo "📊 PM2 Status: pm2 status"
echo "📝 Logs: pm2 logs resona-api"
