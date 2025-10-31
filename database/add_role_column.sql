-- เพิ่มคอลัมน์ role ในตาราง users
ALTER TABLE users 
ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' 
AFTER password_hash;

-- อัพเดท user แรกให้เป็น admin (เปลี่ยน email ตามที่ต้องการ)
UPDATE users 
SET role = 'admin' 
WHERE id = 1 
LIMIT 1;

-- หรือใช้ email
-- UPDATE users 
-- SET role = 'admin' 
-- WHERE email = 'your-email@example.com' 
-- LIMIT 1;

