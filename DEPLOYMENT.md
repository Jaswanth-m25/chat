# Deployment Guide

This guide covers deployment options for the Chat Application.

## Table of Contents
1. [Heroku Deployment](#heroku-deployment)
2. [AWS Deployment](#aws-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Environment Configuration](#environment-configuration)

## Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git installed

### Backend Deployment

1. **Create Heroku apps**
```bash
heroku create your-app-name-backend
heroku create your-app-name-frontend
```

2. **Add MongoDB Atlas**
```bash
# In Heroku Dashboard, add MongoDB Atlas connection URL to config vars
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chat_app
```

3. **Set environment variables**
```bash
heroku config:set JWT_SECRET=your_secret_key
heroku config:set CORS_ORIGIN=https://your-app-name-frontend.herokuapp.com
heroku config:set NODE_ENV=production
```

4. **Deploy backend**
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Frontend Deployment

1. **Create production build**
```bash
cd frontend
npm run build
```

2. **Configure for deployment**
```bash
# Update .env for production
REACT_APP_API_URL=https://your-app-name-backend.herokuapp.com/api
REACT_APP_SOCKET_URL=https://your-app-name-backend.herokuapp.com
```

3. **Deploy to Heroku**
```bash
heroku create your-app-name-frontend
git push heroku main
```

## AWS Deployment

### Using EC2

1. **Launch EC2 Instance**
   - OS: Ubuntu 20.04 LTS
   - Type: t2.micro (free tier)
   - Security Group: Allow ports 80, 443, 5000, 3000

2. **Connect and Update System**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
sudo apt-get update && sudo apt-get upgrade -y
```

3. **Install Dependencies**
```bash
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y git

# Install MongoDB
sudo apt-get install -y mongodb-org
sudo service mongod start
```

4. **Clone and Setup**
```bash
git clone your-repo-url chat
cd chat
./setup.sh
```

5. **Use PM2 for Process Management**
```bash
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name "chat-backend"

# Start frontend
cd ../frontend
pm2 start npm --name "chat-frontend" -- start

pm2 save
pm2 startup
```

6. **Setup Nginx as Reverse Proxy**
```bash
sudo apt-get install -y nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/default
```

Nginx config:
```nginx
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo nginx -t
sudo service nginx restart
```

### Using RDS for MongoDB

Replace `MONGODB_URI` with AWS RDS MongoDB connection string.

## Docker Deployment

### Build and Run Locally

1. **Build Images**
```bash
docker build -t chat-backend ./backend
docker build -t chat-frontend ./frontend
```

2. **Run with Docker Compose**
```bash
docker-compose up
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Deploy to Docker Hub

1. **Tag Images**
```bash
docker tag chat-backend your-username/chat-backend:latest
docker tag chat-frontend your-username/chat-frontend:latest
```

2. **Push to Registry**
```bash
docker push your-username/chat-backend:latest
docker push your-username/chat-frontend:latest
```

### Deploy on Kubernetes

1. **Create deployment files**

kubernetes/backend-deployment.yaml:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chat-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: chat-backend
  template:
    metadata:
      labels:
        app: chat-backend
    spec:
      containers:
      - name: backend
        image: your-username/chat-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: uri
```

2. **Apply deployments**
```bash
kubectl apply -f kubernetes/
```

## Environment Configuration

### Production Backend .env
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chat_app
JWT_SECRET=generate_secure_random_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-domain.com
NODE_ENV=production
```

### Production Frontend .env
```
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_SOCKET_URL=https://your-domain.com
```

## SSL/TLS Setup

### Using Let's Encrypt with Nginx

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

### Update Nginx Config
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Rest of config...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring and Logging

### PM2 Monitoring
```bash
pm2 logs
pm2 monit
pm2 info chat-backend
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Performance Tips

1. **Enable GZIP Compression**
```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript;
```

2. **Set Up CDN** - Consider CloudFront or Cloudflare for static assets

3. **Database Optimization**
   - Create indexes on frequently queried fields
   - Archive old messages

4. **Connection Pooling**
   - MongoDB connection pool size: 100-200

5. **Caching**
   - Implement Redis for session management
   - Cache user lists

## Troubleshooting

### Socket.IO Connection Issues
- Check CORS settings
- Verify WebSocket support is enabled
- Check firewall/load balancer settings

### High Memory Usage
- Restart PM2 processes periodically
- Monitor message history size
- Clean up old connections

### Database Connection Drops
- Increase connection pool size
- Enable keepAlive
- Monitor network connectivity

## Backup Strategy

### MongoDB Backups
```bash
# Daily backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/chat_app" --out /backups/$(date +%Y%m%d)

# Upload to S3
aws s3 cp /backups/ s3://your-bucket/backups/ --recursive
```

## Security Checklist

- [ ] Change JWT_SECRET to strong random key
- [ ] Enable HTTPS/SSL
- [ ] Set CORS_ORIGIN to production domain only
- [ ] Enable MongoDB authentication
- [ ] Set NODE_ENV to production
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set secure headers
- [ ] Regular security updates
- [ ] Monitor for suspicious activity

## Rollback Procedure

1. **Keep previous versions tagged in Docker**
```bash
docker tag your-username/chat-backend:v1.0 your-username/chat-backend:latest
```

2. **Use Git for version control**
```bash
git tag v1.0
git push origin v1.0
```

3. **Redeploy previous version if needed**
```bash
git checkout v1.0
npm start
```

## Support and Issues

For deployment issues, check:
- Application logs
- MongoDB connection string
- Environment variables
- Firewall rules
- SSL certificates expiration
