-- เพิ่มคอลัมน์ avatar ในตาราง users
ALTER TABLE users 
ADD COLUMN avatar VARCHAR(255) NULL 
AFTER role;

-- หมายเหตุ: คอลัมน์ avatar จะเป็น NULL สำหรับผู้ใช้ที่ยังไม่ได้เลือกรูปโปรไฟล์

