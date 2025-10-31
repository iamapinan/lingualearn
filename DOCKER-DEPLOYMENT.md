# Docker Deployment Guide

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

### 1. การตั้งค่า Environment Variables

สำเนาไฟล์ `.env.docker.example` เป็น `.env`:

```bash
cp .env.docker.example .env
```

แก้ไขค่าใน `.env` ตามต้องการ (สำคัญมาก! เปลี่ยน JWT_SECRET ในการใช้งานจริง)

### 2. Build และ Run ด้วย Docker Compose

```bash
# Build และ start services
docker-compose up -d

# ดู logs
docker-compose logs -f

# หยุด services
docker-compose down

# หยุดและลบ volumes (ข้อมูลจะหายทั้งหมด!)
docker-compose down -v
```

### 3. เข้าใช้งาน

เปิดเบราว์เซอร์และไปที่: `http://localhost:3010`

## 🔧 การ Build แยกส่วน

### Build Image เท่านั้น

```bash
docker build -t lingualearn:latest .
```

### Run Container (ไม่ใช้ docker-compose)

```bash
docker run -d \
  --name lingualearn-app \
  -p 3010:3000 \
  -e DATABASE_URL="mysql://user:password@host:3306/lingualearn_db" \
  -e JWT_SECRET="your-secret-key" \
  lingualearn:latest
```

## 📊 Database Management

### เข้าถึง MySQL Container

```bash
# เข้า MySQL shell
docker-compose exec db mysql -u lingualearn -p

# Import SQL file
docker-compose exec -T db mysql -u lingualearn -p lingualearn_db < database/your-file.sql

# Export database
docker-compose exec db mysqldump -u lingualearn -p lingualearn_db > backup.sql
```

### Database Initialization

Database จะถูก initialize อัตโนมัติด้วยไฟล์:
- `database/lingualearn.sql` - Schema หลัก
- `database/verbs-extended.sql` - ข้อมูล Verbs

## 🔍 Troubleshooting

### ดู logs ของ container

```bash
# Logs ทั้งหมด
docker-compose logs

# Logs เฉพาะ app
docker-compose logs lingualearn

# Logs เฉพาะ database
docker-compose logs db

# Follow logs แบบ real-time
docker-compose logs -f lingualearn
```

### Restart services

```bash
# Restart ทั้งหมด
docker-compose restart

# Restart เฉพาะ app
docker-compose restart lingualearn

# Restart เฉพาะ database
docker-compose restart db
```

### ลบและ rebuild

```bash
# หยุดและลบ containers
docker-compose down

# ลบ images
docker rmi lingualearn:latest

# Build ใหม่
docker-compose up -d --build
```

## 🌐 Production Deployment

### 1. อัพเดท next.config.mjs

เพิ่ม config สำหรับ standalone output:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... config อื่นๆ
}

export default nextConfig
```

### 2. Security Checklist

- ✅ เปลี่ยน `JWT_SECRET` เป็นค่าที่ปลอดภัย
- ✅ เปลี่ยน `MYSQL_ROOT_PASSWORD` และ `MYSQL_PASSWORD`
- ✅ ใช้ HTTPS (Reverse Proxy เช่น Nginx, Traefik)
- ✅ ตั้งค่า Firewall
- ✅ Backup database เป็นประจำ

### 3. Reverse Proxy (Nginx)

ตัวอย่าง Nginx config:

```nginx
server {
    listen 80;
    server_name lingualearn.yourdomain.com;

    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Reverse Proxy (Traefik)

แก้ไข `docker-compose.yml` เพิ่ม labels:

```yaml
services:
  lingualearn:
    # ... existing config
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.lingualearn.rule=Host(`lingualearn.yourdomain.com`)"
      - "traefik.http.routers.lingualearn.entrypoints=websecure"
      - "traefik.http.routers.lingualearn.tls.certresolver=letsencrypt"
      - "traefik.http.services.lingualearn.loadbalancer.server.port=3000"
```

## 📦 Volume Management

### Backup volumes

```bash
# Backup MySQL data
docker run --rm \
  -v lingualearn_mysql-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mysql-backup.tar.gz -C /data .

# Backup application data
docker run --rm \
  -v lingualearn_app-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/app-backup.tar.gz -C /data .
```

### Restore volumes

```bash
# Restore MySQL data
docker run --rm \
  -v lingualearn_mysql-data:/data \
  -v $(pwd):/backup \
  alpine sh -c "cd /data && tar xzf /backup/mysql-backup.tar.gz"
```

## 🔄 Updates

### Update application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Clean up old images
docker image prune -f
```

## 📊 Monitoring

### Resource usage

```bash
# ดู resource usage
docker stats

# ดู disk usage
docker system df

# ดู container processes
docker-compose top
```

## ⚙️ Advanced Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://lingualearn:lingualearn123@db:3306/lingualearn_db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-change-this-in-production` |
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Application port | `3000` |

### Scaling

```bash
# Scale app to 3 instances
docker-compose up -d --scale lingualearn=3
```

### Health Checks

เพิ่ม health check ใน `docker-compose.yml`:

```yaml
services:
  lingualearn:
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 🆘 Support

หากพบปัญหา กรุณาตรวจสอบ:
1. Logs ของ container
2. Port ไม่ซ้ำกับ services อื่น
3. Environment variables ถูกต้อง
4. Database connection string ถูกต้อง

