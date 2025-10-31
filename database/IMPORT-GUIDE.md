# คู่มือ Import ข้อมูลจาก SQLite ไปยัง MySQL

## ไฟล์ SQL ที่มี

### 1. `lingualearn.sql`
ไฟล์หลักที่มี schema และข้อมูลเริ่มต้นสำหรับระบบ
- สร้างตารางทั้งหมด (users, languages, lessons, achievements, verbs, ฯลฯ)
- มีข้อมูล verbs 70 คำ
- **Import ไฟล์นี้ก่อนเสมอ**

### 2. `verbs-extended.sql`
ไฟล์เพิ่มเติมสำหรับคำกริยา
- เพิ่มคำกริยาอีก 150 คำ (รวมทั้งหมด 220 คำ)
- Import หลังจาก `lingualearn.sql`

### 3. `mysql_data_import.sql` (ไฟล์ใหม่ที่สร้างจาก SQLite)
ไฟล์ที่ export จาก `data/db.sqlite` เดิม
- มีข้อมูลจริงจากการใช้งาน: languages, lessons, achievements, badges, challenges, missions, questions, vocabulary
- **เฉพาะข้อมูล (INSERT) ไม่มี schema**
- Import หลังจากสร้างตารางแล้ว

---

## วิธี Import แบบเริ่มต้นใหม่

### ขั้นตอนที่ 1: เตรียมฐานข้อมูล

```bash
# เชื่อมต่อ MySQL
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422

# ลบฐานข้อมูลเก่า (ถ้ามี)
DROP DATABASE IF EXISTS lingualearn_db;

# สร้างฐานข้อมูลใหม่
CREATE DATABASE lingualearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# ออกจาก MySQL
EXIT;
```

### ขั้นตอนที่ 2: Import Schema และข้อมูลหลัก

```bash
# Import ไฟล์หลัก (schema + ข้อมูล verbs 70 คำ)
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 lingualearn_db < database/lingualearn.sql
```

### ขั้นตอนที่ 3 (ตัวเลือก): เลือก Import ข้อมูลที่ต้องการ

#### ตัวเลือก A: ใช้ข้อมูลจาก SQLite เดิม

```bash
# Import ข้อมูลจาก SQLite (languages, lessons, questions, vocabulary, ฯลฯ)
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 lingualearn_db < database/mysql_data_import.sql
```

**คำเตือน**: การ import นี้จะเขียนทับข้อมูลเดิมในตาราง languages, lessons, achievements, badges, challenges, missions, questions, vocabulary

#### ตัวเลือก B: เพิ่มคำกริยาเพิ่มเติม

```bash
# เพิ่มคำกริยาอีก 150 คำ (รวมเป็น 220 คำ)
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 lingualearn_db < database/verbs-extended.sql
```

---

## วิธี Import แบบ One-Command

### ตัวเลือก 1: Schema + Verbs Extended (แนะนำสำหรับเริ่มต้นใหม่)

```bash
cd /Users/apinan/Developments/lingualearn

# Drop และสร้างใหม่
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 -e "DROP DATABASE IF EXISTS lingualearn_db; CREATE DATABASE lingualearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import schema + verbs
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 lingualearn_db < database/lingualearn.sql
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 lingualearn_db < database/verbs-extended.sql

echo "✓ Import เสร็จสมบูรณ์ (Schema + 220 Verbs)"
```

### ตัวเลือก 2: Schema + SQLite Data + Verbs (ใช้ข้อมูลเก่า)

```bash
cd /Users/apinan/Developments/lingualearn

# Drop และสร้างใหม่
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 -e "DROP DATABASE IF EXISTS lingualearn_db; CREATE DATABASE lingualearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import ทั้งหมด
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 lingualearn_db < database/lingualearn.sql
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 lingualearn_db < database/mysql_data_import.sql
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 lingualearn_db < database/verbs-extended.sql

echo "✓ Import เสร็จสมบูรณ์ (Schema + SQLite Data + 220 Verbs)"
```

---

## ตรวจสอบข้อมูลหลัง Import

```bash
# ตรวจสอบจำนวนข้อมูลในแต่ละตาราง
mysql -h 199.21.172.224 -P 3309 -u gracer -pbDagkH767s22e422 lingualearn_db << EOF
SELECT 'languages' as table_name, COUNT(*) as count FROM languages
UNION ALL
SELECT 'lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'badges', COUNT(*) FROM badges
UNION ALL
SELECT 'challenges', COUNT(*) FROM challenges
UNION ALL
SELECT 'missions', COUNT(*) FROM missions
UNION ALL
SELECT 'questions', COUNT(*) FROM questions
UNION ALL
SELECT 'vocabulary', COUNT(*) FROM vocabulary
UNION ALL
SELECT 'verbs', COUNT(*) FROM verbs;
EOF
```

ผลลัพธ์ที่คาดหวัง:
```
+-------------+-------+
| table_name  | count |
+-------------+-------+
| languages   |     6 |
| lessons     |    60 |
| achievements|    36 |
| badges      |    10 |
| challenges  |     4 |
| missions    |    10 |
| questions   |   300 |
| vocabulary  |   134 |
| verbs       |   220 | (ถ้า import verbs-extended)
+-------------+-------+
```

---

## ข้อมูลไฟล์

| ไฟล์ | ขนาด | รายละเอียด |
|------|------|-----------|
| `lingualearn.sql` | ~40 KB | Schema + 70 verbs + users ตัวอย่าง |
| `verbs-extended.sql` | ~15 KB | +150 verbs (รวม 220) |
| `mysql_data_import.sql` | ~175 KB | ข้อมูลจริงจาก SQLite (560 records) |

---

## หมายเหตุ

1. **ไฟล์ `.env`**: ตรวจสอบว่ามีการตั้งค่าถูกต้อง
   ```env
   DB_HOST=199.21.172.224
   DB_PORT=3309
   DB_USER=gracer
   DB_PASSWORD=bDagkH767s22e422
   DB_NAME=lingualearn_db
   ```

2. **การ Export ใหม่จาก SQLite**:
   ```bash
   python3 scripts/export_sqlite_data.py
   ```
   จะสร้างไฟล์ `mysql_data_import.sql` ใหม่

3. **ข้อมูล Users**: ไฟล์ที่ export จาก SQLite **ไม่มีข้อมูล users** เพราะ schema ใหม่มีการเปลี่ยนแปลง (เพิ่ม email, passwordHash, etc.)

