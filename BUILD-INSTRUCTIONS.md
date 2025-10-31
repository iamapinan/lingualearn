# 🐳 Docker Build Instructions

## ขั้นตอนการ Build

### 1. เตรียม Environment (Optional)
```bash
# สร้างไฟล์ .env (ถ้าต้องการ override ค่า default)
cp env-template.txt .env

# แก้ไข .env
nano .env

# หรือสร้างแบบง่ายๆ
cat > .env << 'EOF'
MYSQL_USER=lingualearn
MYSQL_PASSWORD=lingualearn123
JWT_SECRET=your-secret-key-change-this-in-production-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3010
EOF
```

**หมายเหตุ:** ถ้าไม่สร้าง .env ระบบจะใช้ค่า default ที่กำหนดใน docker-compose.yml

### 2. สร้าง package-lock.json (ถ้ายังไม่มี)
```bash
# ลบ node_modules และ lock files เก่า
rm -rf node_modules pnpm-lock.yaml

# สร้าง package-lock.json ใหม่
npm install
```

### 3. Build Docker Image
```bash
# Build ด้วย docker compose (แนะนำ)
docker-compose build

# หรือ Build แบบเดี่ยว
docker build -t lingualearn:latest .
```

### 4. Run Application
```bash
# Start ทั้งหมด (app + database)
docker-compose up -d

# ดู logs
docker-compose logs -f

# เช็คสถานะ
docker-compose ps
```

### 5. เข้าใช้งาน
```
http://localhost:3010
```

## 🔧 Troubleshooting

### Problem: Build failed at dependencies stage
```bash
# ลบ cache และ rebuild
docker-compose down
docker system prune -f
rm -rf node_modules pnpm-lock.yaml
npm install
docker-compose build --no-cache
```

### Problem: Cannot connect to database
```bash
# รอให้ database พร้อม (ประมาณ 30 วินาที)
docker-compose logs db

# ตรวจสอบว่า database พร้อมหรือยัง
docker-compose exec db mysql -u lingualearn -p lingualearn_db -e "SHOW TABLES;"
```

### Problem: Port already in use
```bash
# เช็ค process ที่ใช้ port 3010
lsof -i :3010

# หยุด process หรือเปลี่ยน port ใน docker-compose.yml
# จาก "3010:3000" เป็น "3011:3000"
```

## 📦 Quick Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# View logs
docker-compose logs -f lingualearn

# Enter container
docker-compose exec lingualearn sh

# Enter database
docker-compose exec db mysql -u lingualearn -p

# Clean everything
docker-compose down -v
docker system prune -af
```

## 🚀 Production Deployment

### 1. Update .env สำหรับ production
```bash
# สร้าง JWT secret ที่ปลอดภัย
openssl rand -base64 32

# อัพเดทใน .env
JWT_SECRET=<generated-secret>
MYSQL_ROOT_PASSWORD=<strong-password>
MYSQL_PASSWORD=<strong-password>
```

### 2. Build production image
```bash
docker-compose -f docker-compose.yml build
```

### 3. Deploy
```bash
docker-compose up -d
```

### 4. Backup database
```bash
docker-compose exec db mysqldump -u lingualearn -p lingualearn_db > backup.sql
```

## 📝 Notes

- ใช้ `npm install --legacy-peer-deps` เพื่อแก้ปัญหา peer dependencies
- Next.js config มี `output: 'standalone'` สำหรับ Docker
- Database จะ initialize อัตโนมัติจาก SQL files
- Data จะเก็บใน Docker volumes (ไม่หายเมื่อ restart)
