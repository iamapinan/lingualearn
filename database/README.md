# การติดตั้งและใช้งานฐานข้อมูล LinguaLearn

## การเตรียมความพร้อม

### 1. ติดตั้ง MySQL
ตรวจสอบว่ามี MySQL Server ติดตั้งอยู่แล้ว หรือติดตั้งใหม่:
- **macOS**: `brew install mysql`
- **Ubuntu**: `sudo apt install mysql-server`
- **Windows**: ดาวน์โหลดจาก https://dev.mysql.com/downloads/

### 2. เริ่มต้น MySQL Service
```bash
# macOS
brew services start mysql

# Ubuntu/Linux
sudo systemctl start mysql

# Windows
# เริ่มจาก Services หรือ MySQL Workbench
```

## การสร้างฐานข้อมูล

### 1. เข้าสู่ MySQL
```bash
mysql -u root -p
```

### 2. Import ไฟล์ SQL
```bash
# Import ฐานข้อมูลหลักพร้อม verbs 70 คำ
mysql -u root -p < database/lingualearn.sql

# เพิ่ม verbs อีก 150 คำ (รวม 220 คำ)
mysql -u root -p < database/verbs-extended.sql
```

หรือภายใน MySQL shell:
```sql
source /path/to/lingualearn/database/lingualearn.sql;
source /path/to/lingualearn/database/verbs-extended.sql;
```

**หมายเหตุ**: ไฟล์ `verbs-extended.sql` เป็นไฟล์เสริมที่เพิ่ม verbs เพิ่มเติม 150 คำ ดูรายละเอียดใน `VERBS-README.md`

### 3. สร้าง User สำหรับ Application (แนะนำ)
```sql
CREATE USER 'lingualearn_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON lingualearn_db.* TO 'lingualearn_user'@'localhost';
FLUSH PRIVILEGES;
```

## การตั้งค่า Environment Variables

### 1. คัดลอกไฟล์ template
```bash
cp env-template.txt .env
```

### 2. แก้ไขค่าใน .env
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=lingualearn_user
DB_PASSWORD=your_password
DB_NAME=lingualearn_db

JWT_SECRET=your_jwt_secret_key_min_32_characters
```

## การติดตั้ง Dependencies

```bash
npm install
# หรือ
pnpm install
# หรือ
yarn install
```

## การรัน Application

```bash
npm run dev
# หรือ
pnpm dev
```

เปิดเบราว์เซอร์ที่ http://localhost:3090

## โครงสร้างฐานข้อมูล

### ตารางหลัก
- **users** - ข้อมูลผู้ใช้ (รองรับ email/password authentication)
- **sessions** - session tokens
- **languages** - ภาษาที่รองรับ
- **lessons** - บทเรียน
- **questions** - คำถามในบทเรียน
- **vocabulary** - คำศัพท์
- **verbs** - คำกริยา (ใหม่)
- **achievements** - ความสำเร็จ
- **missions** - ภารกิจ
- **badges** - เหรียญตรา

### ข้อมูลเริ่มต้น
ฐานข้อมูลมีข้อมูลเริ่มต้นดังนี้:
- 6 ภาษา (English, Thai, Chinese, Italian, Japanese, Korean)
- 10 บทเรียน
- 10 achievements
- **220 verbs** (130 irregular + 90 regular) - ดูรายละเอียดใน `VERBS-README.md`
  - Difficulty 1 (Easy): 80 verbs
  - Difficulty 2 (Medium): 100 verbs
  - Difficulty 3 (Hard): 40 verbs
- 20 vocabulary คำ

## การ Backup และ Restore

### Backup
```bash
mysqldump -u lingualearn_user -p lingualearn_db > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
mysql -u lingualearn_user -p lingualearn_db < backup_20241031.sql
```

## Troubleshooting

### ปัญหา: Cannot connect to MySQL
- ตรวจสอบว่า MySQL service กำลังทำงาน
- ตรวจสอบ username และ password ใน .env
- ตรวจสอบว่า user มีสิทธิ์เข้าถึงฐานข้อมูล

### ปัญหา: Import SQL failed
- ตรวจสอบว่ามี MySQL client ติดตั้งอยู่
- ตรวจสอบ path ของไฟล์ SQL
- ลองใช้ MySQL Workbench หรือ phpMyAdmin แทน

### ปัญหา: Authentication error
- ตรวจสอบว่าไฟล์ .env ถูกสร้างแล้ว
- ตรวจสอบว่า JWT_SECRET ถูกตั้งค่า
- Restart development server

## API Endpoints

### Authentication
- `POST /api/auth/register` - ลงทะเบียน
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/me` - ดึงข้อมูลผู้ใช้
- `POST /api/auth/logout` - ออกจากระบบ

### Verbs
- `GET /api/verbs` - ดึงรายการ verbs
- `GET /api/verbs/[id]` - ดึงข้อมูล verb เฉพาะ
- `PUT /api/verbs/[id]` - อัพเดท verb
- `POST /api/verbs/practice` - บันทึกผลการฝึก

## คุณสมบัติใหม่

### 1. ระบบ Authentication
- ลงทะเบียนด้วย email/password
- เข้าสู่ระบบด้วย JWT
- ป้องกันหน้าด้วย middleware

### 2. ระบบ Verbs
- เรียนรู้ verbs (regular และ irregular)
- ฝึกฝน verbs แบบ spaced repetition
- ติดตามความคืบหน้าในการเรียน verbs
- กรองตาม category และ difficulty

