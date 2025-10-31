# คู่มือการ Migration จาก SQLite ไป MySQL

## 📋 สรุปการเปลี่ยนแปลง

### 1. ฐานข้อมูล
- ✅ เปลี่ยนจาก SQLite เป็น MySQL
- ✅ เพิ่มตาราง `verbs` สำหรับระบบคำกริยา
- ✅ เพิ่มตาราง `sessions` สำหรับ authentication
- ✅ อัพเดทตาราง `users` รองรับ email/password

### 2. ระบบ Authentication
- ✅ เพิ่มการลงทะเบียนด้วย email/password
- ✅ เพิ่มการเข้าสู่ระบบด้วย JWT
- ✅ เพิ่ม bcryptjs สำหรับ hash password
- ✅ สร้าง API routes สำหรับ auth

### 3. ระบบ Verbs (ใหม่)
- ✅ สร้างระบบเรียนรู้ verbs
- ✅ รองรับ regular และ irregular verbs
- ✅ ระบบ spaced repetition
- ✅ ติดตามความคืบหน้า

## 🚀 ขั้นตอนการติดตั้ง

### Step 1: ติดตั้ง Dependencies
```bash
npm install
# หรือ
pnpm install
```

Dependencies ที่เพิ่มใหม่:
- `mysql2` - MySQL driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

### Step 2: ตั้งค่า Environment Variables
```bash
# คัดลอกไฟล์ template
cp env-template.txt .env

# แก้ไขค่าใน .env ตามความเหมาะสม
```

ค่าที่ต้องตั้ง:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (ควรใช้ string ยาวอย่างน้อย 32 ตัวอักษร)

### Step 3: สร้างฐานข้อมูล MySQL
```bash
# เข้าสู่ MySQL
mysql -u root -p

# Import ไฟล์ SQL หลัก (70 verbs)
mysql -u root -p < database/lingualearn.sql

# Import verbs เพิ่มเติม (150 verbs) - รวม 220 verbs
mysql -u root -p < database/verbs-extended.sql

# หรือภายใน MySQL shell
source /path/to/database/lingualearn.sql;
source /path/to/database/verbs-extended.sql;
```

**หมายเหตุ**: 
- ไฟล์ `lingualearn.sql` มี 70 verbs เริ่มต้น
- ไฟล์ `verbs-extended.sql` เพิ่ม verbs อีก 150 คำ (รวม 220 คำ)
- ดูรายละเอียดคำ verbs ทั้งหมดใน `database/VERBS-README.md`

### Step 4: รัน Application
```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ http://localhost:3090

## 📁 ไฟล์ที่สร้าง/แก้ไข

### ไฟล์ใหม่
```
database/
  ├── lingualearn.sql          # SQL schema พร้อมข้อมูลเริ่มต้น (70 verbs)
  ├── verbs-extended.sql       # SQL เพิ่ม verbs อีก 150 คำ
  ├── README.md                # คู่มือฐานข้อมูล
  └── VERBS-README.md          # คู่มือ verbs ทั้งหมด 220 คำ

lib/
  ├── auth/
  │   ├── hash.ts              # Password hashing
  │   ├── jwt.ts               # JWT utilities
  │   └── validation.ts        # Zod validation schemas
  └── db/
      └── connection.ts        # MySQL connection

app/api/
  ├── auth/
  │   ├── register/route.ts    # Register API
  │   ├── login/route.ts       # Login API
  │   ├── logout/route.ts      # Logout API
  │   └── me/route.ts          # Get user API
  └── verbs/
      ├── route.ts             # List verbs API
      ├── [id]/route.ts        # Single verb API
      └── practice/route.ts    # Practice API

components/
  ├── auth/
  │   ├── login-form.tsx       # Login form
  │   ├── register-form.tsx    # Register form
  │   └── protected-route.tsx  # Route protection
  └── verbs/
      ├── verb-card.tsx        # Verb display card
      └── verb-practice.tsx    # Practice component

app/
  ├── verbs/page.tsx           # Verbs list page
  └── practice/verbs/page.tsx  # Practice page

env-template.txt                # Environment template
```

### ไฟล์ที่แก้ไข
- `package.json` - เพิ่ม dependencies
- `drizzle.config.ts` - เปลี่ยนเป็น MySQL config
- `lib/db/schema.ts` - เปลี่ยนเป็น MySQL schema
- `lib/database-types.ts` - เพิ่ม Verb และ Session types
- `components/auth-provider.tsx` - รองรับ JWT
- `app/auth/page.tsx` - เพิ่ม tabs สำหรับ login/register

## 🎯 คุณสมบัติใหม่

### 1. ระบบ Authentication
- **ลงทะเบียน**: ใช้ name, email, password
- **เข้าสู่ระบบ**: ใช้ email, password
- **JWT Token**: เก็บใน localStorage
- **Protected Routes**: ป้องกันหน้าที่ต้อง login

### 2. ระบบ Verbs
- **70 Verbs เริ่มต้น**: 50 irregular + 20 regular
- **แบ่งระดับ**: Easy (1), Medium (2), Hard (3)
- **Spaced Repetition**: ระบบทบทวนอัตโนมัติ
- **ติดตามสถิติ**: correct/incorrect count
- **Filter**: ตาม category, difficulty

### 3. หน้าใหม่
- `/verbs` - ดูรายการ verbs ทั้งหมด
- `/practice/verbs` - ฝึกฝน verbs

## 🔧 การใช้งาน API

### Authentication
```javascript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'User Name',
    email: 'user@example.com',
    password: 'password123'
  })
})

// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})

// Get Current User
const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Verbs
```javascript
// Get All Verbs
const response = await fetch('/api/verbs', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// Practice Verb
const response = await fetch('/api/verbs/practice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    verbId: 1,
    correct: true
  })
})
```

## ⚠️ หมายเหตุสำคัญ

### 1. ข้อมูลเดิมจาก SQLite
- ข้อมูลเก่าจาก SQLite จะไม่ถูก migrate อัตโนมัติ
- ต้อง export และ import เองถ้าต้องการข้อมูลเก่า

### 2. Password Security
- อย่าใช้ `password123` ใน production
- ควรใช้ password ที่แข็งแกร่ง
- JWT_SECRET ต้องเป็นค่าที่ปลอดภัย

### 3. Production Deployment
- ตั้งค่า environment variables ที่ปลอดภัย
- ใช้ HTTPS
- ตั้งค่า CORS อย่างเหมาะสม
- Backup ฐานข้อมูลเป็นประจำ

## 📚 ข้อมูลเพิ่มเติม

- [database/README.md](database/README.md) - คู่มือฐานข้อมูลโดยละเอียด
- [API Documentation](database/README.md#api-endpoints) - รายละเอียด API endpoints

## 🐛 Troubleshooting

### Cannot connect to MySQL
```bash
# ตรวจสอบว่า MySQL กำลังทำงาน
mysql -u root -p

# ตรวจสอบ .env
cat .env
```

### Import SQL failed
```bash
# ใช้ absolute path
mysql -u root -p < /full/path/to/database/lingualearn.sql
```

### Token expired
- Token มีอายุ 7 วัน (ตั้งค่าได้ที่ JWT_EXPIRES_IN)
- ต้อง login ใหม่เมื่อ token หมดอายุ

## ✅ Checklist

- [ ] ติดตั้ง MySQL
- [ ] Import ไฟล์ lingualearn.sql (70 verbs)
- [ ] Import ไฟล์ verbs-extended.sql (150 verbs เพิ่มเติม)
- [ ] สร้างไฟล์ .env จาก env-template.txt
- [ ] ตั้งค่า DB credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
- [ ] ตั้งค่า JWT_SECRET (อย่างน้อย 32 ตัวอักษร)
- [ ] รัน `npm install`
- [ ] รัน `npm run dev`
- [ ] ทดสอบ register/login
- [ ] ทดสอบระบบ verbs (ควรมี 220 คำ)
- [ ] ตรวจสอบหน้า `/verbs` และ `/practice/verbs`

## 🎉 เสร็จสิ้น!

ระบบพร้อมใช้งานแล้ว สามารถเริ่มเรียนรู้และฝึกฝนได้เลย!

