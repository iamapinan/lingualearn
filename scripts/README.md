# Scripts สำหรับจัดการฐานข้อมูล

โฟลเดอร์นี้มี Python scripts สำหรับจัดการการ migration และ export ข้อมูลระหว่าง SQLite และ MySQL

---

## ไฟล์ Scripts

### 1. `export_sqlite_data.py`

Export ข้อมูลจาก SQLite database (`data/db.sqlite`) เป็นไฟล์ SQL สำหรับ import เข้า MySQL

**ตารางที่ export:**
- `languages` - ภาษาทั้งหมดในระบบ
- `lessons` - บทเรียนทั้งหมด
- `achievements` - ความสำเร็จ
- `badges` - เหรียญรางวัล
- `challenges` - ความท้าทาย
- `missions` - ภารกิจ
- `questions` - คำถามสำหรับแบบทดสอบ
- `vocabulary` - คำศัพท์

**ไม่ export:**
- `users` - เพราะ schema เปลี่ยนแปลง (MySQL ใช้ email/password แทน name)
- `user_*` tables - ข้อมูลเฉพาะผู้ใช้
- SQLite internal tables

**วิธีใช้:**

```bash
cd /Users/apinan/Developments/lingualearn
python3 scripts/export_sqlite_data.py
```

**Output:** `database/mysql_data_import.sql`

---

### 2. `convert_sqlite_to_mysql.py`

แปลงไฟล์ SQLite dump ทั้งหมดเป็น MySQL format (รวม schema และข้อมูล)

**การแปลง:**
- `INTEGER PRIMARY KEY AUTOINCREMENT` → `INT AUTO_INCREMENT PRIMARY KEY`
- `TEXT` → `VARCHAR(255)`
- `REAL` → `DOUBLE`
- `DATETIME` → `TIMESTAMP`
- Boolean values (`'t'`, `'f'`) → (1, 0)
- Remove SQLite specific commands (PRAGMA, etc.)

**วิธีใช้:**

```bash
# Step 1: Export จาก SQLite
cd /Users/apinan/Developments/lingualearn
sqlite3 data/db.sqlite ".dump" > database/sqlite_dump.sql

# Step 2: แปลงเป็น MySQL format
python3 scripts/convert_sqlite_to_mysql.py
```

**Output:** `database/mysql_import_from_sqlite.sql`

**หมายเหตุ:** Script นี้จะแปลงทุกอย่างรวมถึง SQLite internal tables ซึ่งอาจไม่จำเป็น แนะนำให้ใช้ `export_sqlite_data.py` แทน

---

## สรุปการใช้งาน

### สถานการณ์ที่ 1: ต้องการ Export เฉพาะข้อมูลหลัก (แนะนำ)

```bash
python3 scripts/export_sqlite_data.py
# Output: database/mysql_data_import.sql (เฉพาะข้อมูล)
```

จากนั้น import ด้วย:
```bash
mysql -h HOST -P PORT -u USER -pPASSWORD lingualearn_db < database/lingualearn.sql
mysql -h HOST -P PORT -u USER -pPASSWORD lingualearn_db < database/mysql_data_import.sql
```

### สถานการณ์ที่ 2: ต้องการ Export ทั้ง Schema และข้อมูล

```bash
sqlite3 data/db.sqlite ".dump" > database/sqlite_dump.sql
python3 scripts/convert_sqlite_to_mysql.py
# Output: database/mysql_import_from_sqlite.sql (schema + ข้อมูล)
```

**คำเตือน:** ไฟล์นี้จะมี schema เก่าจาก SQLite ซึ่งอาจไม่ตรงกับ schema ใหม่ใน MySQL

---

## ความต้องการของระบบ

- Python 3.6+
- SQLite3 (มาพร้อมกับ Python)
- MySQL Client (สำหรับ import)

---

## การแก้ไขปัญหา

### ปัญหา: ไม่พบไฟล์ `data/db.sqlite`

```bash
# ตรวจสอบว่ามีไฟล์อยู่หรือไม่
ls -la data/db.sqlite

# ถ้าไม่มี ให้สร้าง SQLite database ใหม่
mkdir -p data
touch data/db.sqlite
```

### ปัญหา: Script ไม่ทำงาน

```bash
# ตรวจสอบ Python version
python3 --version  # ควรเป็น 3.6 หรือสูงกว่า

# ทดสอบ SQLite connection
sqlite3 data/db.sqlite "SELECT sqlite_version();"
```

### ปัญหา: Import ไม่สำเร็จใน MySQL

```bash
# ตรวจสอบว่า MySQL ทำงานอยู่
mysql -h HOST -P PORT -u USER -pPASSWORD -e "SELECT VERSION();"

# ลองสร้างฐานข้อมูลใหม่
mysql -h HOST -P PORT -u USER -pPASSWORD -e "DROP DATABASE IF EXISTS lingualearn_db; CREATE DATABASE lingualearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import ใหม่
mysql -h HOST -P PORT -u USER -pPASSWORD lingualearn_db < database/mysql_data_import.sql
```

---

## ตัวอย่างผลลัพธ์

### `export_sqlite_data.py`

```
Exporting data from data/db.sqlite...
  • languages... ✓ (6 rows)
  • lessons... ✓ (60 rows)
  • achievements... ✓ (36 rows)
  • badges... ✓ (10 rows)
  • challenges... ✓ (4 rows)
  • missions... ✓ (10 rows)
  • questions... ✓ (300 rows)
  • vocabulary... ✓ (134 rows)

✓ Export completed successfully!
  Output: database/mysql_data_import.sql
  Size: 175,454 characters
```

### `convert_sqlite_to_mysql.py`

```
✓ Converted database/sqlite_dump.sql to database/mysql_import_from_sqlite.sql
  File size: 116906 characters

✓ Conversion completed successfully!
```

